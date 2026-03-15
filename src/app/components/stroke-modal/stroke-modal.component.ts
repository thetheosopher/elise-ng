import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Color, NamedColor } from 'elise-graphics';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ColorPickerDirective } from 'ngx-color-picker';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
    imports: [CommonModule, FormsModule, ColorPickerDirective, NgbModule],
    selector: 'app-stroke-modal',
    templateUrl: './stroke-modal.component.html',
    styleUrls: ['./stroke-modal.component.scss']
})
export class StrokeModalComponent implements OnInit {

    constructor(public activeModal: NgbActiveModal) { }

    @Input()
    modalInfo: StrokeModalInfo;

    colors: NamedColor[] = Color.NamedColors.filter((c) => c.color.a === 255);

    ngOnInit(): void {
    }

    onWidthChanged(event) {
        this.modalInfo.width = parseFloat(event.target.value);
    }

    commit() {
        this.activeModal.close(this.modalInfo);
    }

    onColorSelected(event) {
        if(this.modalInfo.namedColor) {
            this.modalInfo.color = (this.modalInfo.namedColor.color as Color).toHexString();
        }
    }

    colorPickerChange(event) {
        console.log(event);
        this.modalInfo.color = event;
    }

    compareColors(colorA: NamedColor, colorB: NamedColor) {
        try {
            if(!colorB) {
                return false;
            }
            return colorA.name === colorB.name;
        }
        catch {
            return false;
        }
    }
}

export class StrokeModalInfo {
    strokeType = 'color';
    width?: number;
    color: string;
    namedColor: NamedColor;
    applyToModel: boolean;
    applyToSelected: boolean;
    selectedElementCount: number;
}
