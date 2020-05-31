import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Color } from 'elise-graphics';

@Component({
    selector: 'app-stroke-modal',
    templateUrl: './stroke-modal.component.html',
    styleUrls: ['./stroke-modal.component.scss']
})
export class StrokeModalComponent implements OnInit {

    constructor(public activeModal: NgbActiveModal) { }

    @Input()
    modalInfo: StrokeModalInfo;

    ngOnInit(): void {
    }

    onWidthChanged(event) {
        this.modalInfo.width = parseFloat(event.target.value);
    }

    commit() {
        this.activeModal.close(this.modalInfo);
    }

}

export class StrokeModalInfo {
    strokeType: string = 'color';
    width?: number;
    color: string;
    applyToModel: boolean;
    applyToSelected: boolean;
    selectedElementCount: number;
}
