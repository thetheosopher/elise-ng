import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Color, NamedColor } from 'elise-graphics';

@Component({
    selector: 'app-color-selector',
    templateUrl: './color-selector.component.html',
    styleUrls: ['./color-selector.component.scss']
})
export class ColorSelectorComponent implements OnInit {

    constructor() { }

    colors: NamedColor[] = Color.NamedColors.filter((c) => c.color.a === 255);
    isEnabled = true;

    @Output() public colorSelected: EventEmitter<NamedColor> = new EventEmitter();

    @Input() @Output() public selectedColor: NamedColor = Color.NamedColors[0];

    ngOnInit() {
    }

    onColorSelected(event) {
        this.colorSelected.emit(this.selectedColor);
    }

    compareColors(colorA: NamedColor, colorB: NamedColor) {
        try {
            return colorA.name === colorB.name;
        }
        catch {
            return false;
        }
    }
}
