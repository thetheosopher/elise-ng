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
    isEnabled: boolean = true;

    @Output() public colorSelected: EventEmitter<Color | null> = new EventEmitter();

    @Input() public selectedColor: Color = Color.NamedColors[0].color;

    ngOnInit() {
    }

    onColorSelected(event) {
        this.colorSelected.emit(this.selectedColor);
    }

    compareColors(colorA: Color, colorB: Color) {
        try {
            if(colorA.a === 0 && colorB.a === 0) {
                return true;
            }
            return colorA.equalsHue(colorB);
        }
        catch {
            return false;
        }
    }

}
