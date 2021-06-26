import { Injectable } from '@angular/core';
import { Color, NamedColor } from 'elise-graphics';

@Injectable({
    providedIn: 'root'
})
export class ColorService {

    colors: string[];

    constructor() { }

    listColors() {
        if (!this.colors) {
            this.colors = [];
            for (let i = 0; i < Color.NamedColors.length; i++) {
                const namedColor = Color.NamedColors[i];
                if (namedColor.color.a === 255) {
                    this.colors.push(namedColor.color.toHexString());
                }
            }
        }
        return this.colors;
    }
}
