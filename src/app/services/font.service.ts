import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class FontService {

    constructor() { }

    listFonts() {
        return [
            'Arial',
            'Arial Black',
            'Book Antigua',
            'Charcoal',
            'Comic Sans MS',
            'Courier',
            'Courier New',
            'Cursive',
            'Gadget',
            'Geneva',
            'Georgia',
            'Helvetica',
            'Impact',
            'Lucida Console',
            'Lucida Sans Unicode',
            'Lucida Grande',
            'Monaco',
            'Monospace',
            'Palatino',
            'Palatino Linotype',
            'Sans-Serif',
            'Serif',
            'Tahoma',
            'Trebuchet MS',
            'Times',
            'Times New Roman',
            'Verdana'
        ];
    }
}
