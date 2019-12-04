import { Component, Input, Output, EventEmitter, AfterViewInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Model } from 'elise-graphics/lib/core/model';
import { ViewController } from 'elise-graphics/lib/view/view-controller';
import { PointEventParameters } from 'elise-graphics/lib/core/point-event-parameters';
import { ElementBase } from 'elise-graphics/lib/elements/element-base';
import { TimerParameters } from 'elise-graphics/lib/core/timer-parameters';
import { MouseEventArgs } from 'elise-graphics/lib/core/mouse-event-args';

@Component({
    selector: 'app-elise-view',
    template: '<div class="elise-view" #eref></div>'
})
export class EliseViewComponent implements AfterViewInit, OnDestroy {
    @ViewChild('eref', { read: ElementRef, static: true })
    eref: ElementRef;

    @Output() modelUpdated = new EventEmitter<Model>();
    @Output() enabledChanged = new EventEmitter<boolean>();
    @Output() mouseEnteredView = new EventEmitter<MouseEventArgs>();
    @Output() mouseLeftView = new EventEmitter<MouseEventArgs>();
    @Output() mouseDownView = new EventEmitter<PointEventParameters>();
    @Output() mouseUpView = new EventEmitter<PointEventParameters>();
    @Output() mouseMovedView = new EventEmitter<PointEventParameters>();
    @Output() mouseEnteredElement = new EventEmitter<ElementBase>();
    @Output() mouseLeftElement = new EventEmitter<ElementBase>();
    @Output() mouseDownElement = new EventEmitter<ElementBase>();
    @Output() mouseUpElement = new EventEmitter<ElementBase>();
    @Output() elementClicked = new EventEmitter<ElementBase>();
    @Output() timerTick = new EventEmitter<TimerParameters>();
    @Output() controllerSet = new EventEmitter<ViewController>();

    private _model: Model;
    private _hostDiv: HTMLDivElement;
    private _scale: number;
    private _timerEnabled: boolean;

    controller: ViewController;

    @Input()
    set model(model: Model) {
        this._model = model;
        this.onChange();
    }

    get model(): Model {
        return this._model;
    }

    @Input()
    set scale(scale: number) {
        this._scale = scale;
        this.onChange();
    }

    get scale(): number {
        return this._scale;
    }

    @Input()
    set timerEnabled(timerEnabled: boolean) {
        if(timerEnabled !== this._timerEnabled) {
            this._timerEnabled = timerEnabled;
            if(this.controller) {
                if(this._timerEnabled) {
                    if(this.controller.pauseTime) {
                        this.controller.resumeTimer();
                    }
                    else {
                        this.controller.startTimer();
                    }
                }
                else {
                    this.controller.pauseTimer();
                }
            }
        }
    }

    get timerEnabled(): boolean {
        return this._timerEnabled;
    }

    constructor() {
        this._scale = 1.0;
        this.model = Model.create(1, 1);
    }

    onChange() {
        if (this._hostDiv && this.model) {
            if (!this.controller) {
                this.initializeController();
            }
            else {
                this.refreshController();
            }
        }
        else {
            this.clearController();
        }
    }

    private clearController() {
        if (this.controller) {
            this.controller.detach();
            this.controller = undefined;
            this.controllerSet.emit(null);
        }
    }

    private initializeController() {
        this.controller = ViewController.initializeTarget(this._hostDiv, this.model, this.scale);
        this.controller.mouseEnteredView.add((c, e) => {
            this.mouseEnteredView.emit(e);
        });
        this.controller.mouseLeftView.add((c, e) => {
            this.mouseLeftView.emit(e);
        });
        this.controller.mouseDownView.add((c, e) => {
            this.mouseDownView.emit(e);
        });
        this.controller.mouseUpView.add((c, e) => {
            this.mouseUpView.emit(e);
        });
        this.controller.mouseMovedView.add((c, e) => {
            this.mouseMovedView.emit(e);
        });
        this.controller.modelUpdated.add((c, m) => {
            this.modelUpdated.emit(m);
        });
        this.controller.enabledChanged.add((c, enabled) => {
            this.enabledChanged.emit(enabled);
        });
        this.controller.mouseEnteredElement.add((c, e) => {
            this.mouseEnteredElement.emit(e);
        });
        this.controller.mouseLeftElement.add((c, e) => {
            this.mouseLeftElement.emit(e);
        });
        this.controller.mouseDownElement.add((c, e) => {
            this.mouseDownElement.emit(e);
        });
        this.controller.mouseUpElement.add((c, e) => {
            this.mouseUpElement.emit(e);
        });
        this.controller.elementClicked.add((c, e) => {
            this.elementClicked.emit(e);
        });
        this.controller.timer.add((c, t) => {
            this.timerTick.emit(t);
        });
        this.controllerSet.emit(this.controller);
        if (this.timerEnabled) {
            this.controller.startTimer();
        }
    }

    private refreshController() {
        this.controller.setModel(this.model);
        this.controller.setScale(this.scale);
        this.controllerSet.emit(null);
        if (this.timerEnabled !== this.controller.timerEnabled) {
            if (this.timerEnabled) {
                this.controller.startTimer();
            }
            else {
                this.controller.stopTimer();
            }
        }
    }


    ngAfterViewInit(): void {
        this._hostDiv = this.eref.nativeElement as HTMLDivElement;
        this.onChange();
    }

    ngOnDestroy(): void {
        this._hostDiv = null;
        this.onChange();
    }
}
