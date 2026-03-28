import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Color, NamedColor } from 'elise-graphics';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
    imports: [CommonModule, NgbModule],
    selector: 'app-color-selector',
    templateUrl: './color-selector.component.html',
    styleUrls: ['./color-selector.component.scss']
})
export class ColorSelectorComponent {

    constructor() { }

    colors: NamedColor[] = Color.NamedColors.filter((c) => c.color.a === 255);
    @Input() isEnabled = true;
    @Input() placeholder = 'Select Color';

    @Output() public colorSelected: EventEmitter<NamedColor> = new EventEmitter();
    @Output() public selectedColorChange: EventEmitter<NamedColor> = new EventEmitter();

    @Input() public selectedColor: NamedColor = Color.NamedColors[0];

    selectColor(color: NamedColor) {
        this.selectedColor = color;
        this.selectedColorChange.emit(color);
        this.colorSelected.emit(color);
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

    getColorHex(color?: NamedColor) {
        if(!color) {
            return '#000000';
        }

        return (color.color as Color).toHexString();
    }
}
