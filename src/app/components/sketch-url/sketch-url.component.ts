import { Component, OnInit, ElementRef, ViewChild, Input, EventEmitter, Output } from '@angular/core';
import { ModelService } from '../../services/model.service';
import { Model } from 'elise-graphics/lib/core/model';
import { Sketcher } from 'elise-graphics/lib/sketcher/sketcher';

@Component({
    selector: 'app-sketch-url',
    templateUrl: './sketch-url.component.html',
    styleUrls: [ './sketch-url.component.scss' ]
})
export class SketchUrlComponent implements OnInit {
    private _url: string;

    model: Model;

    private _scale = 1;
    private _timerDelay = 100;
    private _strokeBatchSize = 16;
    private _fillBatchSize = 4;
    private _strokeOpacity = 16;
    private _sketchColor = true;
    private _sketchFill = 'White';
    private _repeat = true;
    private _repeatDelay = 10000;
    private _fillDelay = 10000;

    errorMessage: string;
    @Output() sketchDone = new EventEmitter<boolean>();

    @ViewChild('elise', { read: ElementRef, static: true })
    elise: ElementRef;

    @Input()
    set url(url: string) {
        if (url !== this.url) {
            this._url = url;
            this.onChange();
        }
    }
    get url(): string {
        return this._url;
    }
    @Input()
    set scale(scale: number) {
        if (scale !== this._scale) {
            this._scale = scale;
            this.onChange();
        }
    }
    get scale(): number {
        return this._scale;
    }

    @Input()
    set timerDelay(timerDelay: number) {
        if (timerDelay !== this._timerDelay) {
            this._timerDelay = timerDelay;
            this.onChange();
        }
    }
    get timerDelay(): number {
        return this._timerDelay;
    }

    @Input()
    set strokeBatchSize(strokeBatchSize: number) {
        if (strokeBatchSize !== this.strokeBatchSize) {
            this._strokeBatchSize = strokeBatchSize;
            this.onChange();
        }
    }
    get strokeBatchSize(): number {
        return this._strokeBatchSize;
    }

    @Input()
    set fillBatchSize(fillBatchSize: number) {
        if (fillBatchSize !== this._fillBatchSize) {
            this._fillBatchSize = fillBatchSize;
            this.onChange();
        }
    }
    get fillBatchSize(): number {
        return this._fillBatchSize;
    }

    @Input()
    set strokeOpacity(strokeOpacity: number) {
        if (strokeOpacity !== this._strokeOpacity) {
            this._strokeOpacity = strokeOpacity;
            this.onChange();
        }
    }
    get strokeOpacity(): number {
        return this._strokeOpacity;
    }

    @Input()
    set sketchColor(sketchColor: boolean) {
        if (sketchColor !== this.sketchColor) {
            this._sketchColor = sketchColor;
            this.onChange();
        }
    }
    get sketchColor(): boolean {
        return this._sketchColor;
    }

    @Input()
    set sketchFill(sketchFill: string) {
        if (sketchFill !== this._sketchFill) {
            this._sketchFill = sketchFill;
            this.onChange();
        }
    }
    get sketchFill(): string {
        return this._sketchFill;
    }

    @Input()
    set repeat(repeat: boolean) {
        if (repeat !== this._repeat) {
            this._repeat = repeat;
            this.onChange();
        }
    }
    get repeat(): boolean {
        return this._repeat;
    }

    @Input()
    set repeatDelay(repeatDelay: number) {
        if (repeatDelay !== this._repeatDelay) {
            this._repeatDelay = repeatDelay;
            this.onChange();
        }
    }
    get repeatDelay(): number {
        return this._repeatDelay;
    }

    @Input()
    set fillDelay(fillDelay: number) {
        if (fillDelay !== this._fillDelay) {
            this._fillDelay = fillDelay;
            this.onChange();
        }
    }

    constructor(private modelService: ModelService) {
        this.scale = 1.0;
        this.onSketchDone = this.onSketchDone.bind(this);
    }

    onSketchDone() {
        this.sketchDone.emit(true);
    }

    ngOnInit() {
        this.onChange();
    }

    onChange() {
        if (this.url) {
            this.modelService.getRemoteModel(this.url).subscribe({
                next: (modelData) => {
                    const remoteModel = Model.parse(modelData);
                    const drawModel = Model.create(remoteModel.getSize().width, remoteModel.getSize().height);
                    drawModel.setFill(this._sketchFill);
                    const sketcher = new Sketcher(remoteModel).addTo(drawModel);
                    sketcher.timerDelay = this.timerDelay;
                    sketcher.strokeBatchSize = this.strokeBatchSize;
                    sketcher.fillBatchSize = this.fillBatchSize;
                    sketcher.strokeOpacity = this.strokeOpacity;
                    sketcher.sketchColor = this.sketchColor;
                    sketcher.repeat = this.repeat;
                    sketcher.repeatDelay = this.repeatDelay;
                    sketcher.fillDelay = this.fillDelay;
                    sketcher.sketchDone.add((v) => {
                        this.onSketchDone();
                    });
                    this.model = drawModel;
                    this.errorMessage = undefined;
                },
                error: (er) => {
                    console.log(er);
                    this.errorMessage = 'Unable to load model data.';
                }
            });
        }
    }
}
