import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Color } from 'elise-graphics';

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

    onBackgroundColorSelected(color) {
        this.modalInfo.backgroundColor = color.color;
        if (color.color.a === 0) {
            this.modalInfo.backgroundColorDisplay = Color.Transparent;
        }
        else {
            this.modalInfo.backgroundColorDisplay = new Color(this.modalInfo.backgroundOpacity, color.color.r, color.color.g, color.color.b);
        }
    }

    onBackgroundOpacityChanged(event) {
        this.modalInfo.backgroundOpacity = parseInt(event.target.value);
        if (this.modalInfo.backgroundColor.a === 0) {
            this.modalInfo.backgroundColorDisplay = Color.Transparent;
        }
        else {
            this.modalInfo.backgroundColorDisplay.r = this.modalInfo.backgroundColor.r;
            this.modalInfo.backgroundColorDisplay.g = this.modalInfo.backgroundColor.g;
            this.modalInfo.backgroundColorDisplay.b = this.modalInfo.backgroundColor.b;
            this.modalInfo.backgroundColorDisplay.a = this.modalInfo.backgroundOpacity;
        }
    }

    commit() {
        this.activeModal.close(this.modalInfo);
    }
}

export class NewModelModalInfo {
    name: string;
    width?: number = 1024;
    height?: number = 768;
    backgroundColor: Color = Color.Transparent;
    backgroundOpacity: number = 255;
    backgroundColorDisplay: Color = Color.Transparent;
}
