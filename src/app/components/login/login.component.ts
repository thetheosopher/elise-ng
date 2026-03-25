import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { ApiService } from '../../schematrix/services/api.service';
import { ToastrService } from 'ngx-toastr';
import { LoginDTO } from '../../schematrix/classes/login-dto';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    imports: [CommonModule, FormsModule, RouterModule],
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    private readonly destroyRef = inject(DestroyRef);

    processing = false;
    isLoggedIn = false;
    loginDTO: LoginDTO = new LoginDTO();
    returnUrl: string | null = null;

    constructor(
        private apiService: ApiService,
        private toasterService: ToastrService,
        private route: ActivatedRoute,
        private router: Router) {
        this.isLoggedIn = apiService.isLoggedIn;
        if(apiService.login) {
            this.loginDTO = apiService.login;
        }
     }

    ngOnInit() {
        this.returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
        this.apiService.loginEvent.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: (login) => {
                this.processing = false;
                this.isLoggedIn = true;
                this.loginDTO = login;

                if (this.returnUrl && this.isSafeReturnUrl(this.returnUrl)) {
                    this.router.navigateByUrl(this.returnUrl);
                }
            }
        });
        this.apiService.logoutEvent.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: () => {
                this.processing = false;
                this.isLoggedIn = false;
                this.loginDTO = new LoginDTO();
            }
        });
        this.apiService.errorEvent.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: (error) => {
                this.processing = false;
                this.toasterService.error(error, 'Login Error', {
                    enableHtml: true
                });
            }
        });
        // this.processing = true;
        // this.apiService.checkToken();
    }

    onSubmit() {
        this.processing = true;
        this.apiService.authenticate(this.loginDTO.Name, this.loginDTO.Password);
    }

    onLogout() {
        this.processing = false;
        this.apiService.logout();
    }

    private isSafeReturnUrl(url: string): boolean {
        return url.startsWith('/') && !url.startsWith('//') && url !== '/login';
    }
}
