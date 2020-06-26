import { Component, OnInit, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Color, ModelResource, BitmapResource, NamedColor } from 'elise-graphics';

@Component({
    selector: 'app-fill-modal',
    templateUrl: './fill-modal.component.html',
    styleUrls: ['./fill-modal.component.scss']
})
export class FillModalComponent implements OnInit {

    constructor(public activeModal: NgbActiveModal) {
     }

    @Input()
    modalInfo: FillModalInfo;

    colors: NamedColor[] = Color.NamedColors.filter((c) => c.color.a === 255);

    ngOnInit(): void {
    }

    commit() {
        this.activeModal.close(this.modalInfo);
    }

    colorPickerChange(event) {
        this.modalInfo.color = event;
    }

    onColorSelected(event) {
        if(this.modalInfo.namedColor) {
            this.modalInfo.color = this.modalInfo.namedColor.color.toHexString();
        }
    }

    gradient1ColorPickerChange(event) {
        this.modalInfo.gradientColor1 = event;
    }

    onGradient1ColorSelected(event) {
        if(this.modalInfo.gradientNamedColor1) {
            this.modalInfo.gradientColor1 = this.modalInfo.gradientNamedColor1.color.toHexString();
        }
    }

    gradient2ColorPickerChange(event) {
        this.modalInfo.gradientColor2 = event;
    }

    onGradient2ColorSelected(event) {
        if(this.modalInfo.gradientNamedColor2) {
            this.modalInfo.gradientColor2 = this.modalInfo.gradientNamedColor2.color.toHexString();
        }
    }

    compareColors(colorA: NamedColor, colorB: NamedColor) {
        try {
            if(!colorB) {
                return false;
            }
            return colorA.name == colorB.name;
        }
        catch {
            return false;
        }
    }

    compareBitmapResources(resourceA: BitmapResource, resourceB: BitmapResource) {
        try {
            return resourceA.key == resourceB.key;
        }
        catch {
            return false;
        }
    }

    compareModelResources(resourceA: ModelResource, resourceB: ModelResource) {
        try {
            return resourceA.key == resourceB.key;
        }
        catch {
            return false;
        }
    }
}

export class FillModalInfo {
    scale?: number;
    fillType: string = 'color';
    applyToModel: boolean;
    applyToSelected: boolean;
    selectedElementCount: number;

    color: string;
    namedColor: NamedColor;

    gradientColor1: string = "#000000ff";
    gradientNamedColor1: NamedColor = new NamedColor("Black", Color.Black);
    gradientColor2: string = "#ffffffff";
    gradientNamedColor2: NamedColor = new NamedColor("White", Color.White);

    linearGradientStartX: number;
    linearGradientStartY: number;
    linearGradientEndX: number;
    linearGradientEndY: number;

    radialGradientCenterX: number;
    radialGradientCenterY: number;
    radialGradientFocusX: number;
    radialGradientFocusY: number;
    radialGradientRadiusX: number;
    radialGradientRadiusY: number;

    opacity: number = 1;
    fillOffsetX: number = 0;
    fillOffsetY: number = 0;
    bitmapResources: BitmapResource[];
    selectedBitmapResource: BitmapResource;
    modelResources: ModelResource[];
    selectedModelResource: ModelResource;
}
