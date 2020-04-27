import { Component, OnInit } from '@angular/core';
import { SurfaceSample } from '../../interfaces/surface-sample';
import { SurfaceTestService } from '../../services/surface-test.service';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-surface-tests',
    templateUrl: './surface-tests.component.html',
    styleUrls: [ './surface-tests.component.scss' ]
})
export class SurfaceTestsComponent implements OnInit {
    tests: SurfaceSample[];

    constructor(
        private surfaceTestService: SurfaceTestService,
        private toasterService: ToastrService) {}

    getTests() {
        this.surfaceTestService.tests().subscribe({
            next: (testArray) => {
                this.tests = testArray;
            },
            error: (err) => {
                console.log(err);
                this.toasterService.error('Unable to load surface test list.');
                this.tests = [];
            }
        });
    }

    ngOnInit() {
        this.getTests();
    }
}
