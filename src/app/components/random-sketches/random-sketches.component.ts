import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
    selector: 'app-random-sketches',
    templateUrl: './random-sketches.component.html',
    styleUrls: [ './random-sketches.component.scss' ]
})
export class RandomSketchesComponent implements OnInit, OnDestroy {
    url: string;

    timer: NodeJS.Timer;

    modelNames = [
        'Abstract01',
        'Autumn',
        'Autumn2',
        'Cathedral',
        'Christmas01',
        'Christmas02',
        'Christmas03',
        'Christmas04',
        'Christmas05',
        'Christmas06',
        'Christmas07',
        'Christmas08',
        'Desert',
        'EiffelTower',
        'Flowers01',
        'Forest01',
        'Forest01',
        'Leaves1_low',
        'Mountains',
        'Mountains2',
        'Nature01',
        'Nature02',
        'Nature03',
        'Nature04',
        'Nature05',
        'Nature06',
        'Nature07',
        'Nature08',
        'Nature09',
        'Nature10',
        'Nature11',
        'Nature12',
        'Nature13',
        'Nature14',
        'Nature15',
        'Nature16',
        'Nature17',
        'Nature18',
        'Nature19',
        'Nature20',
        'Nature21',
        'Nature22',
        'Nature23',
        'Nature24',
        'Nature25',
        'Nature26',
        'Nature27',
        'Nature28',
        'Nature29',
        'Nature30',
        'Nature31',
        'Nature32',
        'Nature33',
        'Nature34',
        'Nature35',
        'Nature36',
        'Nature37',
        'Nature38',
        'Nature39',
        'Nature40',
        'Nature41',
        'Nature42',
        'Nature43',
        'Nature44',
        'Nature45',
        'Nature46',
        'Nature47',
        'Nature48',
        'Nature49',
        'Nature50',
        'Pattern01',
        'Pattern02',
        'Pattern03',
        'Pattern04',
        'Picnic',
        'Santa01',
        'Sunset1',
        'Sunset2',
        'Sunset3',
        'Sunset4'
    ];

    constructor() {
        this.loadNextSketch = this.loadNextSketch.bind(this);
        this.sketchDone = this.sketchDone.bind(this);
    }

    ngOnInit() {
        this.loadNextSketch();
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
        const index = Math.floor(Math.random() * this.modelNames.length) + 1;
        const sketchSource = 'https://s3.amazonaws.com/elise/643bea0c-45f8-4dd1-a1bf-57377a686443/Traced/' +
            this.modelNames[index] + '.mdl';
        this.url = sketchSource;
    }
}
