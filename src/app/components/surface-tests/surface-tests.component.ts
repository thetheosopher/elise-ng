import { Component, OnInit } from '@angular/core';
import { SurfaceSample } from '../../interfaces/surface-sample';
import { SurfaceTestService } from '../../services/surface-test.service';

@Component({
    selector: 'app-surface-tests',
    templateUrl: './surface-tests.component.html',
    styleUrls: [ './surface-tests.component.scss' ]
})
export class SurfaceTestsComponent implements OnInit {
    tests: SurfaceSample[];
    errorMessage: string;

    constructor(private surfaceTestService: SurfaceTestService) {}

    getTests() {
        this.surfaceTestService.tests().subscribe({
            next: (testArray) => {
                this.tests = testArray;
                this.errorMessage = undefined;
            },
            error: (er) => {
                console.log(er);
                this.errorMessage = 'Unable to load surface test list.';
                this.tests = [];
            }
        });
    }

    ngOnInit() {
        this.getTests();
    }
}
