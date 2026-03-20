import { Component, OnInit } from '@angular/core';
import { ModelInfo } from '../../services/model-info';
import { ModelService } from '../../services/model.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
    imports: [CommonModule, RouterModule],
    selector: 'app-animations',
    templateUrl: './animations.component.html',
    styleUrls: [ './animations.component.scss' ]
})
export class AnimationsComponent implements OnInit {
    models: ModelInfo[];

    constructor(
        private modelService: ModelService,
        private toasterService: ToastrService) {}

    getModels() {
        this.modelService.listModels('animations').subscribe({
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
