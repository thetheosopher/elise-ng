import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { ApiService } from '../../schematrix/services/api.service';
import { LoginDTO } from '../../schematrix/classes/login-dto';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    imports: [CommonModule, FormsModule, RouterModule],
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

    private readonly destroyRef = inject(DestroyRef);

    processing = false;
    loginDTO: LoginDTO = new LoginDTO();
    newPasswordConfirm: string = null;

    constructor(
        private apiService: ApiService,
        private toasterService: ToastrService) {
    }

    ngOnInit() {
    }

    onSubmit() {
        this.processing = true;
        this.apiService.changePassword(this.loginDTO).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: (registerResult) => {
                this.processing = false;
                this.toasterService.success('Password successfully changed.');
            },
            error: (err) => {
                this.processing = false;
                this.toasterService.error(err, 'Error Changing Password');
            }
        });
    }

}
