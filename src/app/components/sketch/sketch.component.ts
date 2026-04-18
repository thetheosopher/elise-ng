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
import { FullscreenSketcherComponent } from '../fullscreen-sketcher/fullscreen-sketcher.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    imports: [CommonModule, FormsModule, RouterModule, EliseViewComponent, CodeBlockComponent, FullscreenSketcherComponent],
    selector: 'app-sketch',
    templateUrl: './sketch.component.html',
    styleUrls: [ './sketch.component.scss' ]
})
export class SketchComponent implements OnInit {
    private readonly destroyRef = inject(DestroyRef);

    model: Model;
    modelName: string;
    modelDescription: string;
    modelCode: string;
    scale: number;
    background = 'grid';

    modelType = 'sketches';

    @ViewChild('elise', { read: ElementRef, static: true })
    elise: ElementRef;

    showFullscreenSketcher = false;

    constructor(
        private modelService: ModelService,
        private route: ActivatedRoute,
        private location: Location,
        private toasterService: ToastrService) {
        this.scale = 1.0;
    }

    launchFullscreenSketch(): void {
        if (!this.modelCode) { return; }
        this.showFullscreenSketcher = true;
    }

    onFullscreenSketcherClosed(): void {
        this.showFullscreenSketcher = false;
    }

    createModel() {
        const id = this.route.snapshot.paramMap.get('id');
        this.modelDescription = id;
        this.modelService.getModelDescription(this.modelType, id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: (modelDescription) => {
                this.modelDescription = modelDescription;
            },
            error: (err) => {
                console.log(err);
                this.toasterService.error(err);
                this.modelDescription = '???';
            }
        });
        this.modelService.getModelInfo(this.modelType, id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: (modelInfo) => {
                this.modelName = modelInfo.name;
            },
            error: (err) => {
                console.log(err);
                this.toasterService.error(err);
                this.modelDescription = '???';
            }
        });
        this.modelService.getModel(this.modelType, id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: (modelData) => {
                this.modelCode = modelData;
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
            },
            error: (err) => {
                console.log(err);
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
