import { Component, DestroyRef, OnInit, ElementRef, ViewChild, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ModelService } from '../../services/model.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule, Location } from '@angular/common';

import { Model } from 'elise-graphics/lib/core/model';
import { default as elise } from 'elise-graphics';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { EliseViewComponent } from '../../elise/view/elise-view.component';
import { CodeBlockComponent } from '../code-block/code-block.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    imports: [CommonModule, FormsModule, RouterModule, EliseViewComponent, CodeBlockComponent],
    selector: 'app-animation',
    templateUrl: './animation.component.html',
    styleUrls: [ './animation.component.scss' ]
})
export class AnimationComponent implements OnInit {
    private readonly destroyRef = inject(DestroyRef);

    model: Model;
    modelName: string;
    modelDescription: string;
    modelCode: string;
    scale: number;
    background = 'grid';

    modelType = 'animations';

    @ViewChild('elise', { read: ElementRef, static: true })
    elise: ElementRef;

    constructor(
        private modelService: ModelService,
        private route: ActivatedRoute,
        private location: Location,
        private toasterService: ToastrService) {
        this.scale = 1.0;
    }

    private loadModelFromCode(modelData: string) {
        const modelFunction = new Function('elise', modelData);
        const model = modelFunction(elise);
        model.prepareResources(null, (result) => {
            if (result) {
                this.model = model;
            }
            else {
                this.toasterService.error('Error loading model resources');
            }
        });
    }

    createModel() {
        const id = this.route.snapshot.paramMap.get('id');
        this.modelDescription = id;
        this.modelService.getModelDescription(this.modelType, id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: (modelDescription) => {
                this.modelDescription = modelDescription;
            },
            error: (er) => {
                console.log(er);
                this.toasterService.error('Unable to load model description');
                this.modelDescription = '???';
            }
        });
        this.modelService.getModelInfo(this.modelType, id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: (modelInfo) => {
                this.modelName = modelInfo.name;
            },
            error: (er) => {
                console.log(er);
                this.toasterService.error('Unable to load model name');
                this.modelName = '???';
            }
        });
        this.modelService.getModel(this.modelType, id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: (modelData) => {
                this.modelCode = modelData;
                this.loadModelFromCode(modelData);
            },
            error: (er) => {
                console.log(er);
                this.modelCode = '';
                this.toasterService.error('Unable to load model');
                this.model = Model.create(1, 1);
            }
        });
    }

    ngOnInit() {
        this.createModel();
    }
}
