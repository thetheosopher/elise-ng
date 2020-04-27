import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../schematrix/services/api.service';
import { ToastrService } from 'ngx-toastr';
import { UserRegistrationDTO } from '../../schematrix/classes/user-registration-dto';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

    processing: boolean = false;
    registrationSubmitted: boolean = false;
    userRegistrationDTO: UserRegistrationDTO = new UserRegistrationDTO();
    passwordConfirm: string = null;
    nameInUse: boolean = false;
    nameInUseMessage: string = null;
    emailInUse: boolean = false;
    emailInUseMessage: string = null;
    confirmationComplete: boolean = false;

    constructor(
        private apiService: ApiService,
        private toasterService: ToastrService) {
    }

    ngOnInit() {
    }

    onSubmit() {
        this.processing = true;
        this.apiService.register(this.userRegistrationDTO).subscribe({
            next: (registerResult) => {
                this.processing = false;
                this.registrationSubmitted = true;
                this.toasterService.success('Please check email for registration code.', 'Registration Submitted');
            },
            error: (err) => {
                this.registrationSubmitted = false;
                this.processing = false;
                this.toasterService.error(err, 'Registration Submission Failed');
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

    clearNameInUse() {
        this.nameInUse = false;
        this.nameInUseMessage = null;
    }

    checkNameInUse(name: string) {
        if(name && name.trim().length > 0) {
            this.apiService.checkNameInUse(name).subscribe({
                next: (registrationInfoDTO) => {
                    if(registrationInfoDTO.LoginCount > 0) {
                        this.nameInUse = true;
                        this.nameInUseMessage = 'User name already in use by registered user.';
                    }
                    else if(registrationInfoDTO.RegistrationCount > 0) {
                        this.nameInUse = true;
                        this.nameInUseMessage = 'User name already in use by pending user.';
                    }
                    else {
                        this.nameInUse = false;
                        this.nameInUseMessage = null;
                    }
                },
                error: (er) => {
                    this.nameInUse = true;
                    this.nameInUseMessage = 'Error checking if name is in use.';
                }
            });
        }
        else {
            this.nameInUse = false;
            this.nameInUseMessage = null;
        }
    }

    clearEmailInUse() {
        this.emailInUse = false;
        this.emailInUseMessage = null;
    }

    checkEmailInUse(email: string) {
        if(email && email.trim().length > 0) {
            this.apiService.checkEmailInUse(email).subscribe({
                next: (registrationInfoDTO) => {
                    if(registrationInfoDTO.LoginCount > 0) {
                        this.emailInUse = true;
                        this.emailInUseMessage = 'Email already in use by registered user.';
                    }
                    else if(registrationInfoDTO.RegistrationCount > 0) {
                        this.emailInUse = true;
                        this.emailInUseMessage = 'Email already in use by pending user.';
                    }
                    else {
                        this.emailInUse = false;
                        this.emailInUseMessage = null;
                    }
                },
                error: (er) => {
                    this.emailInUse = true;
                    this.emailInUseMessage = 'Error checking if email is in use.';
                }
            });
        }
        else {
            this.emailInUse = false;
            this.emailInUseMessage = null;
        }
    }
}
