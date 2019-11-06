import { Component, OnInit } from '@angular/core';
import { ModelInfo } from '../../services/model-info';
import { ModelService } from '../../services/model.service';

@Component({
    selector: 'app-sketches',
    templateUrl: './sketches.component.html',
    styleUrls: [ './sketches.component.scss' ]
})
export class SketchesComponent implements OnInit {
    models: ModelInfo[];
    errorMessage: string;

    constructor(private modelService: ModelService) {}

    getModels() {
        this.modelService.listModels('sketches').subscribe({
            next: (modelArray) => {
                this.models = modelArray;
                this.errorMessage = undefined;
            },
            error: (er) => {
                console.log(er);
                this.errorMessage = 'Unable to load model list.';
                this.models = [];
            }
        });
    }

    ngOnInit() {
        this.getModels();
    }
}
