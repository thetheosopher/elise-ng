import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModelService } from '../../services/model.service';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';

import { Model } from 'elise-graphics/lib/core/model';
import { default as elise } from 'elise-graphics/lib/index';

@Component({
    selector: 'app-primitive',
    templateUrl: './primitive.component.html',
    styleUrls: [ './primitive.component.scss' ]
})
export class PrimitiveComponent implements OnInit {
    model: Model;
    modelName: string;
    modelDescription: string;
    modelCode: string;
    scale: number;

    modelType = 'primitives';

    @ViewChild('elise', { read: ElementRef, static: true })
    elise: ElementRef;

    constructor(
        private modelService: ModelService,
        private route: ActivatedRoute,
        private location: Location,
        private toasterService: ToastrService) {
        this.scale = 1.0;
    }

    createModel() {
        const id = this.route.snapshot.paramMap.get('id');
        this.modelDescription = id;
        this.modelService.getModelDescription(this.modelType, id).subscribe({
            next: (modelDescription) => {
                this.modelDescription = modelDescription;
            },
            error: (err) => {
                console.log(err);
                this.toasterService.error(err, 'Model Description Error');
                this.modelDescription = '???';
            }
        });
        this.modelService.getModelInfo(this.modelType, id).subscribe({
            next: (modelInfo) => {
                this.modelName = modelInfo.name;
            },
            error: (err) => {
                console.log(err);
                this.toasterService.error(err, 'Model Name Error')
                this.modelName = '???';
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
