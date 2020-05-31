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
        // this.compareColors = this.compareColors.bind(this);
     }

    @Input()
    modalInfo: FillModalInfo;

    colors: NamedColor[] = Color.NamedColors.filter((c) => c.color.a === 255);

    ngOnInit(): void {
    }

    commit() {
        this.activeModal.close(this.modalInfo);
    }

    onColorSelected(event) {
        if(this.modalInfo.namedColor) {
            this.modalInfo.color = this.modalInfo.namedColor.color.toHexString();
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
    fillType: string = 'color';
    color: string;
    namedColor: NamedColor;
    scale?: number;
    opacity: number = 1;
    bitmapResources: BitmapResource[];
    selectedBitmapResource: BitmapResource;
    modelResources: ModelResource[];
    selectedModelResource: ModelResource;
    applyToModel: boolean;
    applyToSelected: boolean;
    selectedElementCount: number;
}
