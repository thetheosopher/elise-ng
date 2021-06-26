import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../schematrix/services/api.service';
import { ToastrService } from 'ngx-toastr';
import { UserRegistrationDTO } from '../../schematrix/classes/user-registration-dto';

@Component({
  selector: 'app-resend-registration-code',
  templateUrl: './resend-registration-code.component.html',
  styleUrls: ['./resend-registration-code.component.scss']
})
export class ResendRegistrationCodeComponent implements OnInit {
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
        this.apiService.resendRegistrationCode(this.userRegistrationDTO).subscribe({
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
        this.apiService.confirmRegistration(this.userRegistrationDTO).subscribe({
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
