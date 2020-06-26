import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-points-modal',
    templateUrl: './points-modal.component.html',
    styleUrls: ['./points-modal.component.scss']
})
export class PointsModalComponent implements OnInit {

    constructor(public activeModal: NgbActiveModal) { }

    @Input()
    modalInfo: PointsModalInfo;

    ngOnInit(): void {
    }

    commit() {
        this.activeModal.close(this.modalInfo);
    }

}

export class PointsModalInfo {
    pointsString: string;
}