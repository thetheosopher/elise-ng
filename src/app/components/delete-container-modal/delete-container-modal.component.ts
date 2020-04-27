import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-delete-container-modal',
    templateUrl: './delete-container-modal.component.html'
})
export class DeleteContainerModalComponent implements OnInit {

    constructor(public activeModal: NgbActiveModal) { }

    @Input()
    modalInfo: DeleteContainerModalInfo;

    ngOnInit(): void {
    }

    commit() {
        this.activeModal.close(this.modalInfo);
    }
}

export class DeleteContainerModalInfo {
    name: string;
    containerID: string;
}
