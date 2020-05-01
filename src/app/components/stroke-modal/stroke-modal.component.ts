import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Color, NamedColor } from 'elise-graphics';

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

    onColorSelected(color) {
        this.modalInfo.color = color;
        if (color.a === 0) {
            this.modalInfo.colorDisplay = Color.Transparent;
        }
        else {
            this.modalInfo.colorDisplay = new Color(this.modalInfo.opacity, color.r, color.g, color.b);
        }
    }

    onOpacityChanged(event) {
        if (this.modalInfo.color.a === 0) {
            this.modalInfo.colorDisplay = Color.Transparent;
        }
        else {
            this.modalInfo.colorDisplay.r = this.modalInfo.color.r;
            this.modalInfo.colorDisplay.g = this.modalInfo.color.g;
            this.modalInfo.colorDisplay.b = this.modalInfo.color.b;
            this.modalInfo.colorDisplay.a = this.modalInfo.opacity;
        }
    }

    commit() {
        this.activeModal.close(this.modalInfo);
    }

}

export class StrokeModalInfo {
    width?: number;
    color?: Color;
    opacity?: number;
    colorDisplay?: Color;
}
