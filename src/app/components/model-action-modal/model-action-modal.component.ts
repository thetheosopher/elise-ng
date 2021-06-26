import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Model } from 'elise-graphics/lib/core/model';

@Component({
    selector: 'app-model-action-modal',
    templateUrl: './model-action-modal.component.html',
    styleUrls: ['./model-action-modal.component.scss']
})
export class ModelActionModalComponent implements OnInit {

    constructor(public activeModal: NgbActiveModal) { }

    @Input()
    modalInfo: ModelActionModalInfo;

    ngOnInit(): void {
    }

    actionEdit() {
        this.modalInfo.action = 'edit';
        this.activeModal.close(this.modalInfo);
    }

    actionCreateElement() {
        this.modalInfo.action = 'create-element';
        this.activeModal.close(this.modalInfo);
    }

    actionAddResource() {
        this.modalInfo.action = 'add-resource';
        this.activeModal.close(this.modalInfo);
    }
}

export class ModelActionModalInfo {
    canEmbed: boolean;
    action: string;
    containerID: string;
    containerName: string;
    scale: number;
    path: string;
    model: Model;
    info: string;
}
