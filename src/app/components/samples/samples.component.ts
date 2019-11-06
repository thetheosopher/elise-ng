import { Component, OnInit } from '@angular/core';
import { ModelInfo } from '../../services/model-info';
import { ModelService } from '../../services/model.service';

@Component({
    selector: 'app-samples',
    templateUrl: './samples.component.html',
    styleUrls: [ './samples.component.scss' ]
})
export class SamplesComponent implements OnInit {
    models: ModelInfo[];
    errorMessage: string;

    constructor(private modelService: ModelService) {}

    getModels() {
        this.modelService.listModels('samples').subscribe({
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
