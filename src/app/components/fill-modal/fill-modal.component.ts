import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Color, ModelResource, BitmapResource } from 'elise-graphics';

@Component({
    selector: 'app-fill-modal',
    templateUrl: './fill-modal.component.html',
    styleUrls: ['./fill-modal.component.scss']
})
export class FillModalComponent implements OnInit {

    constructor(public activeModal: NgbActiveModal) { }

    @Input()
    modalInfo: FillModalInfo;

    ngOnInit(): void {
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
    fillType: string = 'color';
    color?: Color;
    opacity?: number;
    scale?: number;
    colorDisplay?: Color;
    bitmapResources: BitmapResource[];
    selectedBitmapResource: BitmapResource;
    modelResources: ModelResource[];
    selectedModelResource: ModelResource;
    applyToModel: boolean;
    applyToSelected: boolean;
    selectedElementCount: number;
}
