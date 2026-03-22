import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { ApiService } from '../../schematrix/services/api.service';
import { ToastrService } from 'ngx-toastr';
import { LoginDTO } from '../../schematrix/classes/login-dto';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    imports: [CommonModule, FormsModule, RouterModule],
    selector: 'app-send-password-reset-code',
    templateUrl: './send-password-reset-code.component.html',
    styleUrls: ['./send-password-reset-code.component.scss']
})
export class SendPasswordResetCodeComponent implements OnInit {
    private readonly destroyRef = inject(DestroyRef);

    processing = false;
    formSubmitted = false;
    loginDTO: LoginDTO = new LoginDTO();
    passwordConfirm: string = null;
    resetComplete = false;

    constructor(
        private apiService: ApiService,
        private toasterService: ToastrService) {
    }

    ngOnInit() {
    }

    onSubmit() {
        this.processing = true;
        this.apiService.sendPasswordResetCode(this.loginDTO).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: (confirmationResult) => {
                this.processing = false;
                this.toasterService.success('Please check email for password reset code.', 'Password Reset Code Sent');
                this.formSubmitted = true;
            },
            error: (err) => {
                this.processing = false;
                this.toasterService.error(err, 'Submission Failed');
                this.formSubmitted = false;
            }
        });
    }

    onSubmitReset() {
        this.processing = true;
        this.apiService.resetPassword(this.loginDTO).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: (confirmationResult) => {
                this.processing = false;
                this.toasterService.success('You may now log in with your new password.', 'Password Reset Complete');
                this.resetComplete = true;
            },
            error: (err) => {
                this.processing = false;
                this.toasterService.error(err, 'Password Reset Failed');
            }
        });
    }
}
