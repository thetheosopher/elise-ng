import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { ApiService } from '../../schematrix/services/api.service';
import { ToastrService } from 'ngx-toastr';
import { UserRegistrationDTO } from '../../schematrix/classes/user-registration-dto';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject, of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs/operators';

@Component({
    imports: [CommonModule, FormsModule, RouterModule],
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

    private readonly destroyRef = inject(DestroyRef);

    processing = false;
    registrationSubmitted = false;
    userRegistrationDTO: UserRegistrationDTO = new UserRegistrationDTO();
    passwordConfirm: string = null;
    nameInUse = false;
    nameInUseMessage: string = null;
    emailInUse = false;
    emailInUseMessage: string = null;
    confirmationComplete = false;

    private readonly nameCheckRequests = new Subject<string>();
    private readonly emailCheckRequests = new Subject<string>();

    constructor(
        private apiService: ApiService,
        private toasterService: ToastrService) {
    }

    ngOnInit() {
        this.nameCheckRequests.pipe(
            debounceTime(300),
            distinctUntilChanged(),
            switchMap((name) => {
                const normalized = (name ?? '').trim();
                if (!normalized) {
                    return of({ state: 'clear' as const });
                }
                return this.apiService.checkNameInUse(normalized).pipe(
                    map((registrationInfoDTO) => ({ state: 'data' as const, registrationInfoDTO })),
                    catchError(() => of({ state: 'error' as const }))
                );
            }),
            takeUntilDestroyed(this.destroyRef)
        ).subscribe((result) => {
            if (result.state === 'clear') {
                this.nameInUse = false;
                this.nameInUseMessage = null;
                return;
            }

            if (result.state === 'error') {
                this.nameInUse = true;
                this.nameInUseMessage = 'Error checking if name is in use.';
                return;
            }

            if (result.registrationInfoDTO.LoginCount > 0) {
                this.nameInUse = true;
                this.nameInUseMessage = 'User name already in use by registered user.';
            }
            else if (result.registrationInfoDTO.RegistrationCount > 0) {
                this.nameInUse = true;
                this.nameInUseMessage = 'User name already in use by pending user.';
            }
            else {
                this.nameInUse = false;
                this.nameInUseMessage = null;
            }
        });

        this.emailCheckRequests.pipe(
            debounceTime(300),
            distinctUntilChanged(),
            switchMap((email) => {
                const normalized = (email ?? '').trim();
                if (!normalized) {
                    return of({ state: 'clear' as const });
                }
                return this.apiService.checkEmailInUse(normalized).pipe(
                    map((registrationInfoDTO) => ({ state: 'data' as const, registrationInfoDTO })),
                    catchError(() => of({ state: 'error' as const }))
                );
            }),
            takeUntilDestroyed(this.destroyRef)
        ).subscribe((result) => {
            if (result.state === 'clear') {
                this.emailInUse = false;
                this.emailInUseMessage = null;
                return;
            }

            if (result.state === 'error') {
                this.emailInUse = true;
                this.emailInUseMessage = 'Error checking if email is in use.';
                return;
            }

            if (result.registrationInfoDTO.LoginCount > 0) {
                this.emailInUse = true;
                this.emailInUseMessage = 'Email already in use by registered user.';
            }
            else if (result.registrationInfoDTO.RegistrationCount > 0) {
                this.emailInUse = true;
                this.emailInUseMessage = 'Email already in use by pending user.';
            }
            else {
                this.emailInUse = false;
                this.emailInUseMessage = null;
            }
        });
    }

    onSubmit() {
        this.processing = true;
        this.apiService.register(this.userRegistrationDTO).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
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

    clearNameInUse() {
        this.nameInUse = false;
        this.nameInUseMessage = null;
    }

    checkNameInUse(name: string) {
        this.nameCheckRequests.next(name ?? '');
    }

    clearEmailInUse() {
        this.emailInUse = false;
        this.emailInUseMessage = null;
    }

    checkEmailInUse(email: string) {
        this.emailCheckRequests.next(email ?? '');
    }
}
