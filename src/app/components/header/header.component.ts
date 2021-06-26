import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../schematrix/services/api.service';
import { LoginDTO } from '../../schematrix/classes/login-dto';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

    isLoggedIn = false;
    loginDTO: LoginDTO = null;

    constructor(private apiService: ApiService) {
        this.isLoggedIn = apiService.isLoggedIn;
    }

    ngOnInit() {
        this.apiService.loginEvent.subscribe({
            next: (login) => {
                this.isLoggedIn = true;
                this.loginDTO = login;
            }
        });
        this.apiService.logoutEvent.subscribe({
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
