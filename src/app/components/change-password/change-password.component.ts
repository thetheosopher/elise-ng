import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../schematrix/services/api.service';
import { LoginDTO } from '../../schematrix/classes/login-dto';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

    errorMessage: string = null;
    successMessage: string = null;
    processing: boolean = false;
    loginDTO: LoginDTO = new LoginDTO();
    newPasswordConfirm: string = null;

    constructor(private apiService: ApiService) {
    }

    ngOnInit() {
    }

    onSubmit() {
        this.processing = true;
        this.apiService.changePassword(this.loginDTO).subscribe({
            next: (registerResult) => {
                this.processing = false;
                this.errorMessage = null;
                this.successMessage = 'Password successfully changed.';
            },
            error: (err) => {
                this.processing = false;
                this.errorMessage = err;
                this.successMessage = null;
            }
        });
    }

}
