import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { SurfaceSample } from '../../interfaces/surface-sample';
import { SurfaceExampleService } from '../../services/surface-example.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SurfaceExamplePreviewComponent } from './surface-example-preview.component';

@Component({
    imports: [CommonModule, RouterModule, SurfaceExamplePreviewComponent],
    selector: 'app-surface-examples',
    templateUrl: './surface-examples.component.html',
    styleUrls: ['./surface-examples.component.scss']
})
export class SurfaceExamplesComponent implements OnInit {
    private readonly destroyRef = inject(DestroyRef);

    examples: SurfaceSample[];

    constructor(
        private surfaceExampleService: SurfaceExampleService,
        private toasterService: ToastrService) {}

    ngOnInit() {
        this.surfaceExampleService.examples().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: (list) => {
                this.examples = list;
            },
            error: (err) => {
                console.log(err);
                this.toasterService.error('Unable to load surface examples.');
                this.examples = [];
            }
        });
    }

    trackById(_index: number, ex: SurfaceSample): string {
        return ex.id;
    }
}
