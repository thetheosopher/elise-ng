import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-new-model-modal',
    templateUrl: './new-model-modal.component.html',
    styleUrls: ['./new-model-modal.component.scss']
})
export class NewModelModalComponent implements OnInit {

    constructor(public activeModal: NgbActiveModal) { }

    @Input()
    modalInfo: NewModelModalInfo;

    ngOnInit(): void {
    }

    commit() {
        this.activeModal.close(this.modalInfo);
    }
}

export class NewModelModalInfo {
    name: string;
    width?: number = 1024;
    height?: number = 768;
}
