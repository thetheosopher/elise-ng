import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
    selector: 'app-random-sketches',
    templateUrl: './random-sketches.component.html',
    styleUrls: [ './random-sketches.component.scss' ]
})
export class RandomSketchesComponent implements OnInit, OnDestroy {
    url: string;

    timer: NodeJS.Timer;

    constructor() {
        this.loadNextSketch = this.loadNextSketch.bind(this);
    }

    ngOnInit() {
        this.loadNextSketch();
        // this.timer = setInterval(this.loadNextSketch, 45000);
        /*
        const name = 'trace01/Trace' + 1 + '.mdl';
        this.url = 'https://s3.amazonaws.com/elise/f5fc194e-0fd0-40cf-a66d-23eaa04a3f70/' + name;
        */
    }

    ngOnDestroy() {
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = undefined;
        }
    }

    sketchDone() {
        this.timer = setTimeout(this.loadNextSketch, 10000);
    }

    loadNextSketch() {
        let index = 1;
        while (true) {
            index = Math.floor(Math.random() * 2367) + 1;
            let isOkay = true;
            switch (index) {
                case 55:
                case 208:
                case 1803:
                case 1804:
                case 1821:
                case 1822:
                case 1823:
                case 1824:
                case 1825:
                case 1826:
                case 1827:
                case 1828:
                case 1829:
                case 2334:
                    isOkay = false;
                    break;
            }
            if (isOkay) {
                break;
            }
        }

        let name = '/Trace' + index + '.mdl';
        if (index < 251) {
            name = 'trace01' + name;
        }
        else if (index < 501) {
            name = 'trace02' + name;
        }
        else if (index < 751) {
            name = 'trace03' + name;
        }
        else if (index < 1001) {
            name = 'trace04' + name;
        }
        else if (index < 1251) {
            name = 'trace05' + name;
        }
        else if (index < 1501) {
            name = 'trace06' + name;
        }
        else if (index < 1751) {
            name = 'trace07' + name;
        }
        else if (index < 2000) {
            name = 'trace08' + name;
        }
        else if (index < 2250) {
            name = 'trace09' + name;
        }
        else {
            name = 'trace10' + name;
        }

        const sketchSource = 'https://s3.amazonaws.com/elise/f5fc194e-0fd0-40cf-a66d-23eaa04a3f70/' + name;
        this.url = sketchSource;
    }
}
