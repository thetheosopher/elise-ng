import { Component, OnInit } from '@angular/core';
import { DesignSample } from '../../interfaces/design-sample';
import { DesignTestService } from '../../services/design-test.service';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-design-tests',
    templateUrl: './design-tests.component.html',
    styleUrls: ['./design-tests.component.scss']
})
export class DesignTestsComponent implements OnInit {
    tests: DesignSample[];

    constructor(
        private _designTestService: DesignTestService,
        private toasterService: ToastrService) { }

    getTests() {
        this._designTestService.tests().subscribe({
            next: (testArray) => {
                this.tests = testArray;
            },
            error: (err) => {
                console.log(err);
                this.toasterService.error(err, 'Data Load Error');
                this.tests = [];
            }
        });
    }

    ngOnInit() {
        this.getTests();
    }

}
