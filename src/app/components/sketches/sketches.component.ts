import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { ModelInfo } from '../../services/model-info';
import { ModelService } from '../../services/model.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    imports: [CommonModule, RouterModule],
    selector: 'app-sketches',
    templateUrl: './sketches.component.html',
    styleUrls: [ './sketches.component.scss' ]
})
export class SketchesComponent implements OnInit {
    private readonly destroyRef = inject(DestroyRef);

    models: ModelInfo[];

    constructor(
        private modelService: ModelService,
        private toasterService: ToastrService) {}

    getModels() {
        this.modelService.listModels('sketches').pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: (modelArray) => {
                this.models = modelArray;
            },
            error: (err) => {
                console.log(err);
                this.toasterService.error('Unable to load model list.');
                this.models = [];
            }
        });
    }

    ngOnInit() {
        this.getModels();
    }

    trackByModelId(_index: number, model: ModelInfo): string {
        return model.id;
    }

    getThumbnailPath(model: ModelInfo): string {
        return `assets/images/sketches/${model.id}.jpg`;
    }
}
