import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { DesignSample } from '../../interfaces/design-sample';
import { DesignTestService } from '../../services/design-test.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DesignTestPreviewComponent } from './design-test-preview.component';

@Component({
    imports: [CommonModule, RouterModule, DesignTestPreviewComponent],
    selector: 'app-design-tests',
    templateUrl: './design-tests.component.html',
    styleUrls: ['./design-tests.component.scss']
})
export class DesignTestsComponent implements OnInit {
    private readonly destroyRef = inject(DestroyRef);

    tests: DesignSample[];

    constructor(
        private _designTestService: DesignTestService,
        private toasterService: ToastrService) { }

    getTests() {
        this._designTestService.tests().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
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

    trackByTestId(_index: number, test: DesignSample): string {
        return test.id;
    }
}
