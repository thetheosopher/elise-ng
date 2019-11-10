import { Component, Input, Output, EventEmitter, AfterViewInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Model } from 'elise-graphics/lib/core/model';
import { DesignController } from 'elise-graphics/lib/design/design-controller';
import { PointEventParameters } from 'elise-graphics/lib/core/point-event-parameters';
import { ElementBase } from 'elise-graphics/lib/elements/element-base';
import { MouseEventArgs } from 'elise-graphics/lib/core/mouse-event-args';
import { Region } from 'elise-graphics/lib/core/region';

@Component({
    selector: 'app-elise-design',
    template: '<div class="elise-design" #eref></div>'
})
export class EliseDesignComponent implements AfterViewInit, OnDestroy {
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
    @Output() controllerSet = new EventEmitter<DesignController>();

    @Output() selectionChanged = new EventEmitter<number>();
    @Output() elementCreated = new EventEmitter<Region>();

    private _model: Model;
    private _hostDiv: HTMLDivElement;
    private _scale: number;
    private _selectionEnabled: boolean;

    controller: DesignController;

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
    set selectionEnabled(enabled: boolean) {
        this._selectionEnabled = enabled;
        this.onChange();
    }

    get selectionEnabled(): boolean {
        return this._selectionEnabled;
    }

    constructor() {
        this._scale = 1.0;
        this._model = Model.create(1, 1);
        this._selectionEnabled = true;
    }

    onChange() {
        if (this._hostDiv) {
            if (this.model) {
                if (!this.controller) {
                    this.controller = DesignController.initializeTarget(this._hostDiv, this.model, this.scale);
                    this.controller.selectionEnabled = this.selectionEnabled;
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
                    this.controller.selectionChanged.add((c, e) => {
                        this.selectionChanged.emit(e);
                    });
                    this.controller.elementCreated.add((c, e) => {
                        this.elementCreated.emit(e);
                    });

                    this.controllerSet.emit(this.controller);
                }
                else {
                    this.controller.setModel(this.model);
                    this.controller.setScale(this.scale);
                    this.controller.selectionEnabled = this.selectionEnabled;
                    this.controllerSet.emit(null);
                }
                this.controller.draw();
            }
        }
        else {
            if (this.controller) {
                this.controller.detach();
                this.controller = undefined;
                this.controllerSet.emit(null);
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
