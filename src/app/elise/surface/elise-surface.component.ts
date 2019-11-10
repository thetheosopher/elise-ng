import { Component, Input, Output, EventEmitter, AfterViewInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Surface } from 'elise-graphics/lib/surface/surface';
import { Model } from 'elise-graphics/lib/core/model';
import { SurfaceViewController } from 'elise-graphics/lib/surface/surface-view-controller';
import { PointEventParameters } from 'elise-graphics/lib/core/point-event-parameters';
import { ElementBase } from 'elise-graphics/lib/elements/element-base';
import { TimerParameters } from 'elise-graphics/lib/core/timer-parameters';
import { MouseEventArgs } from 'elise-graphics/lib/core/mouse-event-args';

@Component({
    selector: 'app-elise-surface',
    template: '<div class="elise-surface" #eref></div>'
})
export class EliseSurfaceComponent implements AfterViewInit, OnDestroy {
    @ViewChild('eref', { read: ElementRef })
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
    @Output() controllerSet = new EventEmitter<SurfaceViewController>();

    private _surface: Surface;
    private _hostDiv: HTMLDivElement;
    private _scale: number;
    private _opacity: number;
    private _timerEnabled: boolean;

    controller: SurfaceViewController;

    @Input()
    set surface(surface: Surface) {
        this._surface = surface;
        this.onChange();
    }

    get surface(): Surface {
        return this._surface;
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
    set opacity(opacity: number) {
        this._opacity = opacity;
        this.onChange();
    }

    get opacity(): number {
        return this._opacity;
    }

    @Input()
    set timerEnabled(timerEnabled: boolean) {
        if (timerEnabled !== this._timerEnabled) {
            this._timerEnabled = timerEnabled;
            if (this.controller) {
                if (this._timerEnabled) {
                    if (this.controller.pauseTime) {
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
        this._scale = 1;
        this._opacity = 1;
        this.surface = Surface.create(1, 1, '', this._scale);
    }

    onChange() {
        if (this._hostDiv && this.surface) {
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
        if (this.surface) {
            this.surface.unbind();
        }
        if (this.controller) {
            this.controller.detach();
            this.controller = undefined;
            this.controllerSet.emit(null);
        }
    }

    private initializeController() {
        this.surface.scale = this.scale;
        this.surface.opacity = this.opacity;
        const self = this;
        this.surface.bind(
            this._hostDiv,
            function(surface: Surface) {
                self.controller = surface.controller;
                self.controller.mouseEnteredView.add((c, e) => {
                    self.mouseEnteredView.emit(e);
                });
                self.controller.mouseLeftView.add((c, e) => {
                    self.mouseLeftView.emit(e);
                });
                self.controller.mouseDownView.add((c, e) => {
                    self.mouseDownView.emit(e);
                });
                self.controller.mouseUpView.add((c, e) => {
                    self.mouseUpView.emit(e);
                });
                self.controller.mouseMovedView.add((c, e) => {
                    self.mouseMovedView.emit(e);
                });
                self.controller.modelUpdated.add((c, m) => {
                    self.modelUpdated.emit(m);
                });
                self.controller.enabledChanged.add((c, enabled) => {
                    self.enabledChanged.emit(enabled);
                });
                self.controller.mouseEnteredElement.add((c, e) => {
                    self.mouseEnteredElement.emit(e);
                });
                self.controller.mouseLeftElement.add((c, e) => {
                    self.mouseLeftElement.emit(e);
                });
                self.controller.mouseDownElement.add((c, e) => {
                    self.mouseDownElement.emit(e);
                });
                self.controller.mouseUpElement.add((c, e) => {
                    self.mouseUpElement.emit(e);
                });
                self.controller.elementClicked.add((c, e) => {
                    self.elementClicked.emit(e);
                });
                self.controller.timer.add((c, t) => {
                    self.timerTick.emit(t);
                });
                self.controllerSet.emit(self.controller);
                if (self.timerEnabled) {
                    self.controller.startTimer();
                }
                surface.onload();
            },
            false
        );
    }

    private refreshController() {
        this.surface.setScale(this.scale);
        this.surface.setOpacity(this.opacity);
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
