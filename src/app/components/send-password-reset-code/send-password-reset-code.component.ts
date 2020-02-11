import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../schematrix/services/api.service';
import { LoginDTO } from '../../schematrix/classes/login-dto';

@Component({
    selector: 'app-send-password-reset-code',
    templateUrl: './send-password-reset-code.component.html',
    styleUrls: ['./send-password-reset-code.component.scss']
})
export class SendPasswordResetCodeComponent implements OnInit {
    errorMessage: string = null;
    successMessage: string = null;
    processing: boolean = false;
    formSubmitted: boolean = false;
    loginDTO: LoginDTO = new LoginDTO();
    passwordConfirm: string = null;
    resetComplete: boolean = false;

    constructor(private apiService: ApiService) {
    }

    ngOnInit() {
    }

    onSubmit() {
        this.processing = true;
        this.apiService.sendPasswordResetCode(this.loginDTO).subscribe({
            next: (confirmationResult) => {
                this.processing = false;
                this.errorMessage = null;
                this.successMessage = 'Password reset code sent.\nPlease check email for password reset code.';
                this.formSubmitted = true;
            },
            error: (err) => {
                this.processing = false;
                this.errorMessage = err;
                this.successMessage = null;
                this.formSubmitted = false;
            }
        });
    }

    onSubmitReset() {
        this.processing = true;
        this.apiService.resetPassword(this.loginDTO).subscribe({
            next: (confirmationResult) => {
                this.processing = false;
                this.errorMessage = null;
                this.successMessage = 'Password reset successfully.\nYou may now log in with your new password.';
                this.resetComplete = true;
            },
            error: (err) => {
                this.processing = false;
                this.errorMessage = err;
                this.successMessage = null;
            }
        });
    }
}
