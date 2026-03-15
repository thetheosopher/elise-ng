import { Component, OnInit } from '@angular/core';
import { ModelInfo } from '../../services/model-info';
import { ModelService } from '../../services/model.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
    imports: [CommonModule, RouterModule],
    selector: 'app-sketches',
    templateUrl: './sketches.component.html',
    styleUrls: [ './sketches.component.scss' ]
})
export class SketchesComponent implements OnInit {
    models: ModelInfo[];

    constructor(
        private modelService: ModelService,
        private toasterService: ToastrService) {}

    getModels() {
        this.modelService.listModels('sketches').subscribe({
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
