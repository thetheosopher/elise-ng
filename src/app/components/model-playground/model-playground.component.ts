import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { NgbNavChangeEvent } from '@ng-bootstrap/ng-bootstrap';

import { ToastrService } from 'ngx-toastr';
import { ModelService } from '../../services/model.service';

// Elise core classes
import { Model } from 'elise-graphics';

import { default as elise } from 'elise-graphics';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { EliseViewComponent } from '../../elise/view/elise-view.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    imports: [CommonModule, FormsModule, NgbModule, EliseViewComponent],
    selector: 'app-model-playground',
    templateUrl: './model-playground.component.html',
    styleUrls: ['./model-playground.component.scss']
})
export class ModelPlaygroundComponent implements OnInit {

    private readonly destroyRef = inject(DestroyRef);

    scale = 1;
    background = 'grid';
    modelEditorNavId = 1;

    model: Model;

    playgroundText: string;
    scriptError: string;

    constructor(
        private toasterService: ToastrService,
        private modelService: ModelService) {
    }

    ngOnInit() {
        this.loadModel('animations', 'simple');
    }

    runScript() {
        this.evaluate();
        if(this.scriptError == null) {
            this.modelEditorNavId = 2;
        }
    }

    evaluate() {
        try {
            const modelFunction = new Function('elise', this.playgroundText);
            const model = modelFunction(elise);
            model.prepareResources(null, (result) => {
                if (result) {
                    this.model = model;
                    this.scriptError = null;
                }
                else {
                    this.scriptError = 'Error loading model resources.';
                    this.toasterService.error(this.scriptError);
                }
            });
        }
        catch(error) {
            this.scriptError = 'Error in model code. ' + error;
            this.toasterService.error(this.scriptError);
        }
    }

    loadModel(type: string, name: string) {
        this.modelService.getModel(type, name).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: (modelData) => {
                this.playgroundText = modelData;
                this.evaluate();
            },
            error: (er) => {
                this.toasterService.error('Unable to load model. ' + er);
                // this.model = Model.create(1, 1);
            }
        });
    }

    backgroundClass() {
        return {
            'view-host': true,
            'border': true,
            grid: this.background === 'grid',
            black: this.background === 'black',
            white: this.background === 'white',
            gray: this.background === 'gray'
        };
    }

    onNavChange(changeEvent: NgbNavChangeEvent) {
        if (changeEvent.nextId === 1) {
        }
        else if (changeEvent.nextId === 2) {
            this.evaluate();
        }
    }

    onError(error, title?) {
        console.log(error);
        this.toasterService.error(error, title);
    }

}
