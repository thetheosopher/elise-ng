import { Component, OnInit, ElementRef, Input, Output, EventEmitter, ViewChild, AfterViewInit } from '@angular/core';
import { Color } from 'elise-graphics/lib/core/color';
import { NamedColor } from 'elise-graphics/lib/core/named-color';

@Component({
    selector: 'app-color-selector',
    templateUrl: './color-selector.component.html',
    styleUrls: ['./color-selector.component.scss']
})
export class ColorSelectorComponent implements OnInit {

    constructor() { }

    colors: NamedColor[] = Color.NamedColors;
    colorName: string;
    isEnabled: boolean = true;

    @Output() public colorSelected: EventEmitter<NamedColor | null> = new EventEmitter();

    @Input() public selectedColor: NamedColor = Color.NamedColors[0];

    ngOnInit() {
    }

    onColorSelected(event) {
        if (this.selectedColor.name) {
            this.colorSelected.emit(this.selectedColor);
        }
        /*
        else {
            this.colorSelected.emit(null);
        }*/
    }

    compareColors(colorA: NamedColor, colorB: Color) {
        if(!colorA || !colorB) {
            return false;
        }
        try {
            if(colorA.color.a === 0 && colorB.a === 0) {
                return true;
            }
            return colorA.color.equalsHue(colorB);
        }
        catch {
            return false;
        }
    }

}
