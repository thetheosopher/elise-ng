import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { SurfaceSample } from '../../interfaces/surface-sample';
import { SurfaceTestService } from '../../services/surface-test.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    imports: [CommonModule, RouterModule],
    selector: 'app-surface-tests',
    templateUrl: './surface-tests.component.html',
    styleUrls: [ './surface-tests.component.scss' ]
})
export class SurfaceTestsComponent implements OnInit {
    private readonly destroyRef = inject(DestroyRef);

    tests: SurfaceSample[];

    constructor(
        private surfaceTestService: SurfaceTestService,
        private toasterService: ToastrService) {}

    getTests() {
        this.surfaceTestService.tests().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
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
