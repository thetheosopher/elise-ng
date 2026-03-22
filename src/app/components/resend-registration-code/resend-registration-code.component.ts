import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { ApiService } from '../../schematrix/services/api.service';
import { ToastrService } from 'ngx-toastr';
import { UserRegistrationDTO } from '../../schematrix/classes/user-registration-dto';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    imports: [CommonModule, FormsModule, RouterModule],
  selector: 'app-resend-registration-code',
  templateUrl: './resend-registration-code.component.html',
  styleUrls: ['./resend-registration-code.component.scss']
})
export class ResendRegistrationCodeComponent implements OnInit {
    private readonly destroyRef = inject(DestroyRef);

    processing = false;
    formSubmitted = false;
    userRegistrationDTO: UserRegistrationDTO = new UserRegistrationDTO();
    confirmationComplete = false;

    constructor(
        private apiService: ApiService,
        private toasterService: ToastrService) {
    }

    ngOnInit() {
    }

    onSubmit() {
        this.processing = true;
        this.apiService.resendRegistrationCode(this.userRegistrationDTO).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: (confirmationResult) => {
                this.processing = false;
                this.toasterService.success('Please check email for registration code.', 'Registration Code Resent');
                this.formSubmitted = true;
            },
            error: (err) => {
                this.processing = false;
                this.toasterService.error(err, 'Submission Failed');
                this.formSubmitted = false;
            }
        });
    }

    onSubmitConfirmation() {
        this.processing = true;
        this.apiService.confirmRegistration(this.userRegistrationDTO).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: (confirmationResult) => {
                this.processing = false;
                this.toasterService.success('You may now log in.', 'Registration Confirmed');
                this.confirmationComplete = true;
            },
            error: (err) => {
                this.processing = false;
                this.toasterService.error(err, 'Confirmation Failed');
            }
        });
    }
}
