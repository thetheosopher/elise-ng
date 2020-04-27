import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../schematrix/services/api.service';
import { LoginDTO } from '../../schematrix/classes/login-dto';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

    processing: boolean = false;
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
        this.apiService.changePassword(this.loginDTO).subscribe({
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
