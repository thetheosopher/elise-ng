import { Component, OnInit } from '@angular/core';
import { ModelInfo } from '../../services/model-info';
import { ModelService } from '../../services/model.service';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-primitives',
    templateUrl: './primitives.component.html',
    styleUrls: [ './primitives.component.scss' ]
})
export class PrimitivesComponent implements OnInit {
    models: ModelInfo[];

    constructor(
        private modelService: ModelService,
        private toasterService: ToastrService) {}

    getModels() {
        this.modelService.listModels('primitives').subscribe({
            next: (modelArray) => {
                this.models = modelArray;
            },
            error: (er) => {
                console.log(er);
                this.toasterService.error('Unable to load model list.');
                this.models = [];
            }
        });
    }

    ngOnInit() {
        this.getModels();
    }
}
