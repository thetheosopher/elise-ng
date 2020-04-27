import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../schematrix/services/api.service';
import { ToastrService } from 'ngx-toastr';
import { LoginDTO } from '../../schematrix/classes/login-dto';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    processing: boolean = false;
    isLoggedIn: boolean = false;
    loginDTO: LoginDTO = new LoginDTO();

    constructor(
        private apiService: ApiService,
        private toasterService: ToastrService) {
        this.isLoggedIn = apiService.isLoggedIn;
        this.loginDTO = apiService.login;
     }

    ngOnInit() {
        this.apiService.loginEvent.subscribe({
            next: (login) => {
                this.processing = false;
                this.isLoggedIn = true;
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
                this.toasterService.error(error, 'Login Error');
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
