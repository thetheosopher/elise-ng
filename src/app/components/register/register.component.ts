import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../schematrix/services/api.service';
import { UserRegistrationDTO } from '../../schematrix/classes/user-registration-dto';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

    errorMessage: string = null;
    successMessage: string = null;
    processing: boolean = false;
    registrationSubmitted: boolean = false;
    userRegistrationDTO: UserRegistrationDTO = new UserRegistrationDTO();
    passwordConfirm: string = null;
    nameInUse: boolean = false;
    nameInUseMessage: string = null;
    emailInUse: boolean = false;
    emailInUseMessage: string = null;
    confirmationComplete: boolean = false;

    constructor(private apiService: ApiService) {
    }

    ngOnInit() {
    }

    onSubmit() {
        this.processing = true;
        this.apiService.register(this.userRegistrationDTO).subscribe({
            next: (registerResult) => {
                this.processing = false;
                this.errorMessage = null;
                this.registrationSubmitted = true;
                this.successMessage = 'Registration submitted successfully.\nPlease check email for registration code.';
            },
            error: (err) => {
                this.registrationSubmitted = false;
                this.processing = false;
                this.errorMessage = err;
                this.successMessage = null;
            }
        });
    }

    onSubmitConfirmation() {
        this.processing = true;
        this.apiService.confirmRegistration(this.userRegistrationDTO).subscribe({
            next: (confirmationResult) => {
                this.processing = false;
                this.errorMessage = null;
                this.successMessage = 'Registration confirmed.\nYou may now log in.';
                this.confirmationComplete = true;
            },
            error: (err) => {
                this.processing = false;
                this.errorMessage = err;
                this.successMessage = null;
            }
        });
    }

    clearNameInUse() {
        this.nameInUse = false;
        this.nameInUseMessage = null;
        this.errorMessage = null;
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
        this.errorMessage = null;
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
