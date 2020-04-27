import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../schematrix/services/api.service';
import { UserRegistrationDTO } from '../../schematrix/classes/user-registration-dto';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-confirm-registration',
  templateUrl: './confirm-registration.component.html',
  styleUrls: ['./confirm-registration.component.scss']
})
export class ConfirmRegistrationComponent implements OnInit {
    processing: boolean = false;
    userRegistrationDTO: UserRegistrationDTO = new UserRegistrationDTO();
    confirmationComplete: boolean = false;

    constructor(
        private apiService: ApiService,
        private toasterService: ToastrService) {
    }

    ngOnInit() {
    }

    onSubmit() {
        this.processing = true;
        this.apiService.confirmRegistration(this.userRegistrationDTO).subscribe({
            next: (confirmationResult) => {
                this.processing = false;
                this.toasterService.success('You may now log in', 'Registration Confirmed');
                this.confirmationComplete = true;
            },
            error: (err) => {
                this.processing = false;
                this.toasterService.error(err, 'Registration Confirmation Failed');
            }
        });
    }
}
