import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-size-modal',
    templateUrl: './size-modal.component.html',
    styleUrls: ['./size-modal.component.scss']
})
export class SizeModalComponent implements OnInit {
    constructor(public activeModal: NgbActiveModal) { }

    @Input()
    modalInfo: SizeModalInfo;

    ngOnInit(): void {
    }

    commit() {
        this.activeModal.close(this.modalInfo);
    }
}

export class SizeModalInfo {
    width?: number;
    height?: number;
}
