import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { ModelInfo } from '../../services/model-info';
import { ModelService } from '../../services/model.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    imports: [CommonModule, FormsModule, RouterModule],
    selector: 'app-animations',
    templateUrl: './animations.component.html',
    styleUrls: [ './animations.component.scss' ]
})
export class AnimationsComponent implements OnInit {
    private readonly destroyRef = inject(DestroyRef);

    models: ModelInfo[];
    filterText = '';

    get filteredModels(): ModelInfo[] {
        if (!this.models) { return []; }
        if (!this.filterText) { return this.models; }
        const term = this.filterText.toLowerCase();
        return this.models.filter(m => m.name.toLowerCase().includes(term));
    }

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

    trackByModelId(_index: number, model: ModelInfo): string {
        return model.id;
    }

    getThumbnailPath(model: ModelInfo): string {
        return `assets/images/animations/${model.id}.jpg`;
    }
}
