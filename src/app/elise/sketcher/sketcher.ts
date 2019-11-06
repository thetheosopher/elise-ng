import { ViewController } from '../view/view-controller';
import { Model } from '../core/model';
import { FillFactory } from '../fill/fill-factory';
import { Color } from '../core/color';
import { FillInfo } from '../fill/fill-info';
import { CommonEvent } from '../core/common-event';

export class Sketcher {
    sketchDone: CommonEvent<boolean> = new CommonEvent<boolean>();

    modelUrl: string;
    timerDelay: number;
    strokeBatchSize: number;
    repeat: boolean;
    fillDelay: number;
    fillBatchSize: number;
    repeatDelay: number;
    sketchColor: boolean;
    strokeOpacity: number;

    drawModel: Model;
    sourceModel: Model;
    context: CanvasRenderingContext2D;
    elementIndex: number;
    elementCount: number;
    passIndex: number;
    timerHandle: NodeJS.Timer;
    controller: ViewController;
    scale: number;

    constructor(model: string | Model, scale: number = 1) {
        if (model instanceof Model) {
            this.sourceModel = model;
        }
        else {
            this.modelUrl = model;
        }
        this.timerDelay = 20;
        this.strokeBatchSize = 128;
        this.repeat = true;
        (this.fillDelay = 5000), (this.fillBatchSize = 1024);
        this.repeatDelay = 10000;
        this.sketchColor = false;
        this.strokeOpacity = 128;

        this.addTo = this.addTo.bind(this);
        this.controllerAttached = this.controllerAttached.bind(this);
        this.controllerDetached = this.controllerDetached.bind(this);
        this.clampColor = this.clampColor.bind(this);
        this.drawNextElement = this.drawNextElement.bind(this);
        this.onModelSet = this.onModelSet.bind(this);
    }

    static create(modelUrl: string, scale: number = 1) {
        return new Sketcher(modelUrl, scale);
    }

    addTo(model: Model) {
        model.controllerAttached.add(this.controllerAttached);
        model.controllerDetached.add(this.controllerDetached);
        return this;
    }

    controllerAttached(drawModel, controller) {
        drawModel.controllerAttached.clear();
        this.drawModel = drawModel;
        this.controller = controller;
        const self = this;

        // If model not provided, load externally
        if (!self.sourceModel) {
            Model.load('', this.modelUrl, function(_sourceModel) {
                self.sourceModel = _sourceModel;
                self.onModelSet();
            });
        }
        else {
            self.onModelSet();
        }
    }

    onModelSet() {
        const self = this;

        // If we no longer have a canvas, abort
        if (!self.controller || !self.controller.canvas) {
            return;
        }

        // Start rendering context
        self.context = self.controller.canvas.getContext('2d');
        self.controller.model.context = self.context;
        self.controller.renderer.beginRender(self.context, self.controller.scale);

        // Set up timer to add elements from source model to draw model
        self.elementCount = self.sourceModel.elements.length;
        self.elementIndex = 0;
        self.passIndex = 0;
        self.timerHandle = setTimeout(self.drawNextElement, self.timerDelay, self);
    }

    controllerDetached(drawModel, controller) {
        this.controller = undefined;
        drawModel.controllerDetached.clear();
        this.drawModel = undefined;
        if (this.timerHandle) {
            clearTimeout(this.timerHandle);
            this.timerHandle = undefined;
        }
    }

    clampColor(value: number) {
        let rvalue = value;
        if (rvalue < 0) {
            rvalue = 0;
        }
        else if (rvalue > 255) {
            rvalue = 255;
        }
        return Math.floor(rvalue);
    }

    drawNextElement(sketchContext) {
        this.timerHandle = undefined;
        if (!this.controller.canvas) {
            return;
        }
        if (sketchContext.elementIndex >= sketchContext.elementCount || sketchContext.elementIndex < 0) {
            if (sketchContext.passIndex === 1) {
                if (sketchContext.repeat) {
                    sketchContext.drawModel.elements = [];
                    sketchContext.passIndex = 0;
                    sketchContext.elementIndex = 0;
                    sketchContext.timerHandle = setTimeout(
                        this.drawNextElement,
                        sketchContext.repeatDelay,
                        sketchContext
                    );
                }
                else {
                    sketchContext.controller.renderer.endRender(sketchContext.context);
                    sketchContext.context = undefined;
                    if (this.sketchDone.hasListeners()) {
                        this.sketchDone.trigger(true);
                    }
                }
            }
            else {
                sketchContext.passIndex += 1;
                sketchContext.elementIndex = 0;
                sketchContext.timerHandle = setTimeout(this.drawNextElement, sketchContext.fillDelay, sketchContext);
            }
        }
        else {
            if (sketchContext.passIndex === 0 && sketchContext.elementIndex === 0) {
                const w = sketchContext.controller.model.getSize().width;
                const h = sketchContext.controller.model.getSize().height;
                if (FillFactory.setElementFill(sketchContext.context, sketchContext.controller.model)) {
                    sketchContext.context.fillRect(0, 0, w, h);
                }
                else {
                    sketchContext.context.clearRect(0, 0, w, h);
                }
            }

            const els = sketchContext.sourceModel.elements;
            const batchSize = sketchContext.passIndex === 0 ? this.strokeBatchSize : this.fillBatchSize;
            for (let i = 0; i < batchSize; i++) {
                // Get next element from source model
                const el = els[sketchContext.elementIndex];
                if (!el) {
                    return;
                }

                // If first pass, draw outline
                if (sketchContext.passIndex === 0) {
                    const elc = el.clone();
                    if (el.type === 'path' || el.type === 'polygon') {
                        const fillInfo = FillInfo.getFillInfo(el);
                        if (fillInfo.type === 'color') {
                            const color = Color.parse(fillInfo.color);
                            elc.setFill('#FFFFFF');
                            if (this.sketchColor) {
                                const strokeColor = new Color(this.strokeOpacity, color.r, color.g, color.b);
                                elc.setStroke(strokeColor.toHexString());
                            }
                            else {
                                const grayColor = this.clampColor(0.21 * color.r + 0.72 * color.g + 0.07 * color.b);
                                const strokeColor = new Color(this.strokeOpacity, grayColor, grayColor, grayColor);
                                elc.setStroke(strokeColor.toHexString());
                            }
                        }
                    }
                    sketchContext.drawModel.add(elc);
                    sketchContext.controller.renderer.renderElement(sketchContext.context, elc);
                }
                else {
                    // On second pass, replace fill and erase stroke
                    const elc = sketchContext.drawModel.elements[sketchContext.elementIndex];
                    if (el.type === 'path' || el.type === 'polygon') {
                        elc.setFill(el.fill);
                        elc.setStroke(undefined);
                    }
                    sketchContext.controller.renderer.renderElement(sketchContext.context, elc);
                }

                sketchContext.elementIndex++;
                if (sketchContext.elementIndex >= sketchContext.elementCount || sketchContext.elementIndex < 0) {
                    break;
                }
            }
            if (sketchContext.controller) {
                sketchContext.timerHandle = setTimeout(this.drawNextElement, sketchContext.timerDelay, sketchContext);
            }
        }
    }
}
