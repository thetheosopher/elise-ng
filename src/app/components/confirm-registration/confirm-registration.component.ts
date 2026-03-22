import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { ApiService } from '../../schematrix/services/api.service';
import { UserRegistrationDTO } from '../../schematrix/classes/user-registration-dto';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    imports: [CommonModule, FormsModule, RouterModule],
  selector: 'app-confirm-registration',
  templateUrl: './confirm-registration.component.html',
  styleUrls: ['./confirm-registration.component.scss']
})
export class ConfirmRegistrationComponent implements OnInit {
    private readonly destroyRef = inject(DestroyRef);

    processing = false;
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
        this.apiService.confirmRegistration(this.userRegistrationDTO).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
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
