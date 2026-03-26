import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { ApiService } from '../../schematrix/services/api.service';
import { LoginDTO } from '../../schematrix/classes/login-dto';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ThemeService } from '../../services/theme.service';

@Component({
    imports: [CommonModule, RouterModule, NgbModule],
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

    private readonly destroyRef = inject(DestroyRef);

    isLoggedIn = false;
    loginDTO: LoginDTO = null;

    constructor(
        private apiService: ApiService,
        public themeService: ThemeService
    ) {
        this.isLoggedIn = apiService.isLoggedIn;
    }

    ngOnInit() {
        this.apiService.loginEvent.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: (login) => {
                this.isLoggedIn = true;
                this.loginDTO = login;
            }
        });
        this.apiService.logoutEvent.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: () => {
                this.isLoggedIn = false;
                this.loginDTO = null;
            }
        });
        this.apiService.checkToken();
    }

    logout() {
        this.apiService.logout();
    }
}
