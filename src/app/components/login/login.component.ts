import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../schematrix/services/api.service';
import { LoginDTO } from '../../schematrix/classes/login-dto';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    errorMessage: string = null;
    processing: boolean = false;
    isLoggedIn: boolean = false;
    loginDTO: LoginDTO = new LoginDTO();

    constructor(private apiService: ApiService) {
        this.isLoggedIn = apiService.isLoggedIn;
        this.loginDTO = apiService.login;
     }

    ngOnInit() {
        this.apiService.loginEvent.subscribe({
            next: (login) => {
                this.processing = false;
                this.isLoggedIn = true;
                this.errorMessage = null;
                this.loginDTO = login;
            }
        });
        this.apiService.logoutEvent.subscribe({
            next: () => {
                this.processing = false;
                this.isLoggedIn = false;
                this.loginDTO = new LoginDTO();
            }
        });
        this.apiService.errorEvent.subscribe({
            next: (error) => {
                this.processing = false;
                this.errorMessage = error;
            }
        });
        this.processing = true;
        this.apiService.checkToken();
    }

    onSubmit() {
        this.processing = true;
        this.apiService.authenticate(this.loginDTO.Name, this.loginDTO.Password);
    }

    onLogout() {
        this.processing = false;
        this.apiService.logout();
    }
}
