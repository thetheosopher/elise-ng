import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../schematrix/services/api.service';
import { UserRegistrationDTO } from '../../schematrix/classes/user-registration-dto';

@Component({
  selector: 'app-confirm-registration',
  templateUrl: './confirm-registration.component.html',
  styleUrls: ['./confirm-registration.component.scss']
})
export class ConfirmRegistrationComponent implements OnInit {
    errorMessage: string = null;
    successMessage: string = null;
    processing: boolean = false;
    userRegistrationDTO: UserRegistrationDTO = new UserRegistrationDTO();
    confirmationComplete: boolean = false;

    constructor(private apiService: ApiService) {
    }

    ngOnInit() {
    }

    onSubmit() {
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
}
