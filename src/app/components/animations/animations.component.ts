import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { ModelInfo } from '../../services/model-info';
import { ModelService } from '../../services/model.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    imports: [CommonModule, RouterModule],
    selector: 'app-animations',
    templateUrl: './animations.component.html',
    styleUrls: [ './animations.component.scss' ]
})
export class AnimationsComponent implements OnInit {
    private readonly destroyRef = inject(DestroyRef);

    models: ModelInfo[];

    constructor(
        private modelService: ModelService,
        private toasterService: ToastrService) {}

    getModels() {
        this.modelService.listModels('animations').pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
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
}
