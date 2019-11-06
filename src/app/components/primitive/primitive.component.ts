import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModelService } from '../../services/model.service';
import { Location } from '@angular/common';
import { Model } from '../../elise/core/model';
import { default as elise } from '../../elise/elise';

@Component({
    selector: 'app-primitive',
    templateUrl: './primitive.component.html',
    styleUrls: [ './primitive.component.scss' ]
})
export class PrimitiveComponent implements OnInit {
    model: Model;
    modelDescription: string;
    modelCode: string;
    scale: number;

    errorMessage: string;
    modelType = 'primitives';

    @ViewChild('elise', { read: ElementRef })
    elise: ElementRef;

    constructor(private modelService: ModelService, private route: ActivatedRoute, private location: Location) {
        this.scale = 1.0;
    }

    createModel() {
        const id = this.route.snapshot.paramMap.get('id');
        this.modelDescription = id;
        this.modelService.getModelDescription(this.modelType, id).subscribe({
            next: (modelDescription) => {
                this.modelDescription = modelDescription;
                this.errorMessage = undefined;
            },
            error: (er) => {
                console.log(er);
                this.errorMessage = 'Unable to load model description';
                this.modelDescription = '???';
            }
        });
        this.modelService.getModel(this.modelType, id).subscribe({
            next: (modelData) => {
                this.modelCode = modelData;
                const wrapped = `(function(elise) {
                    ${modelData}
                })`;
                const modelFunction = eval(wrapped);
                const model = modelFunction(elise);
                const self = this;
                model.prepareResources(null, function(result) {
                    if (result) {
                        self.model = model;
                    }
                    else {
                        self.errorMessage = 'Error loading model resources';
                    }
                });
            },
            error: (er) => {
                console.log(er);
                this.modelCode = '';
                this.errorMessage = 'Unable to load model';
                this.model = Model.create(1, 1);
            }
        });
    }

    ngOnInit() {
        this.createModel();
    }
}
