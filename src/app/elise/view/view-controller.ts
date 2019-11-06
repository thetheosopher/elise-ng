import { IController } from '../controller/controller';
import { ControllerEvent } from '../controller/controller-event';
import { Model } from '../core/model';
import { PointEventParameters } from '../core/point-event-parameters';
import { ElementBase } from '../elements/element-base';
import { TimerParameters } from '../core/timer-parameters';
import { Point } from '../core/point';
import { ViewRenderer } from './view-renderer';
import { ElementCommandHandler } from '../command/element-command-handler';
import { MousePositionInfo } from '../core/mouse-position-info';
import { EliseException } from '../core/elise-exception';
import { Logging } from '../core/logging';
import { MouseEventArgs } from '../core/mouse-event-args';

const log = Logging.log;

export class ViewController implements IController {
    /**
      Captured view controller for mouse event routing when mouse is down
    */
    static captured: ViewController;

    /**
      Fired when model is updated
    */
    modelUpdated: ControllerEvent<Model> = new ControllerEvent<Model>();

    /**
      Fired when enabled state is changed
    */
    enabledChanged: ControllerEvent<boolean> = new ControllerEvent<boolean>();

    /**
      Fired when mouse enters view
    */
    mouseEnteredView: ControllerEvent<MouseEventArgs> = new ControllerEvent<MouseEventArgs>();

    /**
      Fired when mouse leaves view
    */
    mouseLeftView: ControllerEvent<MouseEventArgs> = new ControllerEvent<MouseEventArgs>();

    /**
      Fired when mouse is pressed over view. Captures mouse activity.
    */
    mouseDownView: ControllerEvent<PointEventParameters> = new ControllerEvent<PointEventParameters>();

    /**
      Fired when mouse is released and mouse is captured.
    */
    mouseUpView: ControllerEvent<PointEventParameters> = new ControllerEvent<PointEventParameters>();

    /**
      Fired when mouse is moved over view
    */
    mouseMovedView: ControllerEvent<PointEventParameters> = new ControllerEvent<PointEventParameters>();

    /**
      Fired when mouse enters element bounds
    */
    mouseEnteredElement: ControllerEvent<ElementBase> = new ControllerEvent<ElementBase>();

    /**
      Fired when mouse leaves element bounds
    */
    mouseLeftElement: ControllerEvent<ElementBase> = new ControllerEvent<ElementBase>();

    /**
      Fired when mouse is pressed over element
    */
    mouseDownElement: ControllerEvent<ElementBase> = new ControllerEvent<ElementBase>();

    /**
      Fired when mouse is released over element
    */
    mouseUpElement: ControllerEvent<ElementBase> = new ControllerEvent<ElementBase>();

    /**
      Fired when mouse is pressed and released over an element
    */
    elementClicked: ControllerEvent<ElementBase> = new ControllerEvent<ElementBase>();

    /**
      Period animation event timer fired when timer is enabled
    */
    timer: ControllerEvent<TimerParameters> = new ControllerEvent<TimerParameters>();

    /**
      Controlled model
    */
    model: Model;

    /**
      Canvas rendering target
    */
    canvas: HTMLCanvasElement;

    /**
      Current mouse x position
    */
    currentX: number;

    /**
      Current mouse y position
    */
    currentY: number;

    /**
      Mouse down location
    */
    mouseDownPosition: Point;

    /**
      True when mouse is over view
    */
    isMouseOver: boolean;

    /**
      True when mouse is down and captured over view
    */
    isMouseDown: boolean;

    /**
      Rendering origin X offset
    */
    offsetX: number;

    /**
      Rendering origin y offset
    */
    offsetY: number;

    /**
      Rendering scale
    */
    scale: number;

    /**
      Last mouse movement X delta
    */
    lastDeltaX: number;

    /**
      Last mouse movement Y delta
    */
    lastDeltaY: number;

    /**
      Last mouse client X position
    */
    lastClientX: number;

    /**
      Last mouse client Y position
    */
    lastClientY: number;

    /**
      Topmost element at mouse location
    */
    mouseOverElement: ElementBase;

    /**
      Pressed element
    */
    pressedElement: ElementBase;

    /**
      Touch delayed pending mouse down element
    */
    pendingMouseDownElement: ElementBase;

    /**
      Click cancelled flag
    */
    clickCancelled: boolean;

    /**
      Cancel action flag
    */
    cancelAction: boolean;

    /**
      Set internally when view should be redrawn
    */
    needsRedraw: boolean;

    /**
      Associated view renderer
    */
    renderer: ViewRenderer;

    /**
      Event delay period when using event delay
    */
    eventDelay: number;

    /**
      Event delay timer handle
    */
    eventTimer: any;

    /**
      Animation timer start time
    */
    startTime: number;

    /**
      Last animation timer tick time
    */
    lastTick: number;

    /**
      Last frame render time
    */
    lastFrameTime: number;

    /**
      Animation timer handle
    */
    timerHandle: number;

    /**
      Animation timer enabled flag
    */
    timerEnabled: boolean;

    /*
        Reused object for timer event parameters
    */
    timerParameters: TimerParameters;

    /**
      Animation timer pause time
    */
    pauseTime: number;

    /**
      User interaction enabled flag
    */
    enabled: boolean;

    /**
      Fill to render over disabled view
    */
    disabledFill: string;

    /**
      Command handler for handling routed events
    */
    commandHandler: ElementCommandHandler;

    /**
      Create a new view controller and canvas and bind to host DIV element
      @param hostDiv - Host div element
      @param model - Drawing model
      @param scale - Rendering scale
      @returns New view controller
    */
    static initializeTarget(hostDiv: HTMLDivElement, model: Model, scale: number) {
        log('Initializing view controller target');
        if (!hostDiv) {
            throw new EliseException('Host element not defined.');
        }
        hostDiv.innerHTML = '';
        const controller = new ViewController();
        controller.setScale(scale);
        controller.setModel(model);
        const canvas = controller.getCanvas();
        hostDiv.appendChild(canvas);
        hostDiv.style.width = model.getSize().width * scale + 'px';
        hostDiv.style.height = model.getSize().height * scale + 'px';
        controller.draw();
        model.controllerAttached.trigger(model, controller);
        return controller;
    }

    /**
      Constructs a new view controller
      @classdesc Manages rendering and interaction with rendered model content
    */
    constructor() {
        /** Initialize animation timer function */
        // Animation.initialize();

        this.enabled = true;
        this.scale = 1;
        this.offsetX = 0;
        this.offsetY = 0;
        this.lastDeltaX = -1;
        this.lastDeltaY = -1;
        this.eventDelay = 0;

        this.timerParameters = new TimerParameters(0, 0);
        this.setModel = this.setModel.bind(this);
        this.setEnabled = this.setEnabled.bind(this);
        this.getCanvas = this.getCanvas.bind(this);
        this.drawIfNeeded = this.drawIfNeeded.bind(this);
        this.createCanvas = this.createCanvas.bind(this);
        this.detach = this.detach.bind(this);
        this.windowToCanvas = this.windowToCanvas.bind(this);
        this.windowMouseUp = this.windowMouseUp.bind(this);
        this.windowMouseMove = this.windowMouseMove.bind(this);
        this.onCanvasMouseEnter = this.onCanvasMouseEnter.bind(this);
        this.onCanvasMouseLeave = this.onCanvasMouseLeave.bind(this);
        this.onCanvasMouseDown = this.onCanvasMouseDown.bind(this);
        this.onCanvasMouseUp = this.onCanvasMouseUp.bind(this);
        this.onCanvasMouseMove = this.onCanvasMouseMove.bind(this);
        this.setMouseDownElement = this.setMouseDownElement.bind(this);
        this.setMouseOverElement = this.setMouseOverElement.bind(this);
        this.setScale = this.setScale.bind(this);
        this.onModelUpdated = this.onModelUpdated.bind(this);
        this.draw = this.draw.bind(this);
        this.calculateFPS = this.calculateFPS.bind(this);
        this.invalidate = this.invalidate.bind(this);
        this.startTimer = this.startTimer.bind(this);
        this.pauseTimer = this.pauseTimer.bind(this);
        this.resumeTimer = this.resumeTimer.bind(this);
        this.stopTimer = this.stopTimer.bind(this);
        this.tick = this.tick.bind(this);
        this.elapsedTime = this.elapsedTime.bind(this);
        this.timerPhase = this.timerPhase.bind(this);
        this.bindTarget = this.bindTarget.bind(this);
    }

    /**
      Sets controller model
      @param model - Drawing model
    */
    setModel(model: Model): void {
        if (model === this.model) {
            return;
        }
        if (this.model) {
            this.model.controllerDetached.trigger(this.model, this);
        }
        log('Setting view controller model');
        this.model = model;
        this.currentX = undefined;
        this.currentY = undefined;
        this.isMouseDown = false;
        this.mouseDownPosition = undefined;
        this.mouseOverElement = undefined;
        this.pressedElement = undefined;
        this.lastDeltaX = -1;
        this.lastDeltaY = -1;
        this.offsetX = 0;
        this.offsetY = 0;
        if (!this.canvas) {
            this.createCanvas();
        }
        else {
            this.canvas.width = this.model.getSize().width * this.scale;
            this.canvas.height = this.model.getSize().height * this.scale;
            const element = this.canvas.parentElement;
            element.style.width = this.model.getSize().width * this.scale + 'px';
            element.style.height = this.model.getSize().height * this.scale + 'px';
        }
        if (this.model.elements !== undefined && this.model.elements.length > 0) {
            this.model.elements.forEach(function(element) {
                if (element.interactive === undefined) {
                    element.interactive = true;
                }
            });
        }
        this.draw();
        model.controllerAttached.trigger(model, this);
    }

    /**
      Sets enabled state with optional disabled state overlay fill
      @param enabled - User interactivity enabled state
      @param disabledFill - Optional disabled state fill as string
    */
    setEnabled(enabled: boolean, disabledFill?: string): void {
        if (enabled === this.enabled) {
            return;
        }
        this.enabled = enabled;
        if (arguments.length > 1) {
            this.disabledFill = disabledFill;
        }
        if (!enabled) {
            if (this.isMouseDown) {
                this.cancelAction = true;
                this.onCanvasMouseUp(new MousePositionInfo(this.lastClientX, this.lastClientY));
            }
        }
        this.draw();
        this.enabledChanged.trigger(this, enabled);
    }

    /**
      Creates if necessary and returns canvas element
    */
    getCanvas(): HTMLCanvasElement {
        if (!this.canvas) {
            this.createCanvas();
        }
        return this.canvas;
    }

    /**
      Renders to canvas if needed and clears redraw flag
    */
    drawIfNeeded(): void {
        if (this.needsRedraw) {
            this.draw();
            this.needsRedraw = false;
        }
    }

    /**
      Creates canvas for model at current scale and attached event handlers
      @method Drawing.ViewController#createCanvas
    */
    createCanvas(): void {
        log('Creating canvas and attaching event handlers');
        const self = this;
        if (!self.model) {
            return;
        }
        const canvas = document.createElement('canvas');
        canvas.width = self.model.getSize().width * self.scale;
        canvas.height = self.model.getSize().height * self.scale;
        canvas.addEventListener('mouseenter', self.onCanvasMouseEnter);
        canvas.addEventListener('mouseleave', self.onCanvasMouseLeave);
        canvas.addEventListener('mousedown', self.onCanvasMouseDown);
        canvas.addEventListener('mousemove', self.onCanvasMouseMove);

        self.canvas = canvas;
        self.renderer = new ViewRenderer(self);
    }

    /**
      Detaches and destroys current canvas
      @method Drawing.ViewController#detach
    */
    detach(): void {
        this.stopTimer();
        if (this.model) {
            this.model.controllerDetached.trigger(this.model, this);
            this.model.controllerDetached.clear();
            this.model.controllerAttached.clear();
        }
        if (!this.canvas) {
            return;
        }
        log('Detaching event handlers and destroying canvas');
        this.canvas.removeEventListener('mouseenter', this.onCanvasMouseEnter);
        this.canvas.removeEventListener('mouseleave', this.onCanvasMouseLeave);
        this.canvas.removeEventListener('mousedown', this.onCanvasMouseDown);
        this.canvas.removeEventListener('mousemove', this.onCanvasMouseMove);
        const element = this.canvas.parentElement;
        if (element) {
            element.removeChild(this.canvas);
        }
        this.mouseEnteredView.clear();
        this.mouseLeftView.clear();
        this.mouseDownView.clear();
        this.mouseUpView.clear();
        this.mouseMovedView.clear();
        this.elementClicked.clear();
        this.mouseDownElement.clear();
        this.mouseEnteredElement.clear();
        this.mouseLeftElement.clear();
        this.mouseUpElement.clear();
        this.modelUpdated.clear();
        this.enabledChanged.clear();
        if(this.timer) {
            this.timer.clear();
        }
        this.canvas = undefined;
    }

    /**
     Translates raw window coordinates to model coordinates
     compensating for current scale and origin offset
     @param x - Raw x coordinate
     @param y - Raw y coordinate
    */
    windowToCanvas(x: number, y: number): Point {
        if (!this.canvas) {
            return new Point(x, y);
        }
        const bounds = this.canvas.getBoundingClientRect();
        let x1: number, y1: number;
        x1 = x - Math.round(bounds.left);
        y1 = y - Math.round(bounds.top);
        if (this.canvas.width !== bounds.width) {
            x1 *= this.canvas.width / bounds.width;
        }
        if (this.canvas.height !== bounds.height) {
            y1 *= this.canvas.height / bounds.height;
        }
        if (this.scale !== 1) {
            x1 /= this.scale;
            y1 /= this.scale;
        }
        if (this.isMouseOver) {
            if (x1 < 0) {
                x1 = 0;
            }
            if (x1 > this.model.getSize().width - 1) {
                x1 = this.model.getSize().width - 1;
            }
            if (y1 < 0) {
                y1 = 0;
            }
            if (y1 > this.model.getSize().height - 1) {
                y1 = this.model.getSize().height - 1;
            }
        }
        x1 = x1 + this.offsetX;
        y1 = y1 + this.offsetY;
        return new Point(x1, y1);
    }

    /**
      Handles captured mouse up event
      @param e - Window mouse up event
    */
    windowMouseUp(e: MouseEvent) {
        const captured = ViewController.captured;
        if (captured) {
            log(`Window mouse up ${e.clientX}:${e.clientY}`);
            // const canvas = captured.canvas;
            captured.onCanvasMouseUp(e);
            captured.drawIfNeeded();
            window.removeEventListener('mouseup', captured.windowMouseUp, true);
            window.removeEventListener('mousemove', captured.windowMouseMove, true);
            ViewController.captured = undefined;
        }
    }

    /**
      Handles captured mouse move event
      @param e - Window mouse up event
    */
    windowMouseMove(e: MouseEvent) {
        const captured = ViewController.captured;
        if (captured) {
            log(`Window mouse move ${e.clientX}:${e.clientY}`);
            e.preventDefault();
            e.stopPropagation();
            captured.onCanvasMouseMove(e);
            captured.drawIfNeeded();
        }
    }

    /**
      Handles canvas mouse enter event
      @param e - DOM event
    */
    onCanvasMouseEnter(e: MouseEvent) {
        log(`Canvas mouse enter`);
        this.isMouseOver = true;
        if (!this.enabled) {
            return;
        }
        if (this.mouseEnteredView.hasListeners) {
            this.mouseEnteredView.trigger(this, new MouseEventArgs(e));
        }
        this.drawIfNeeded();
    }

    /**
      Handles canvas mouse leave event
      @param e - DOM event
    */
    onCanvasMouseLeave(e: MouseEvent) {
        log(`Canvas mouse leave`);
        this.isMouseOver = false;
        if (!this.enabled) {
            return;
        }
        if (this.mouseLeftView.hasListeners) {
            this.mouseLeftView.trigger(this, new MouseEventArgs(e));
        }
        this.drawIfNeeded();
    }

    /**
      Handles canvas mouse down event
      @param e - Mouse event
    */
    onCanvasMouseDown(e: MouseEvent) {
        const self = this;
        log(`Canvas mouse down ${e.clientX}:${e.clientY}`);
        ViewController.captured = self;
        window.addEventListener('mouseup', self.windowMouseUp, true);
        window.addEventListener('mousemove', self.windowMouseMove, true);

        if (!self.enabled) {
            return;
        }
        self.lastClientX = e.clientX;
        self.lastClientY = e.clientY;
        const p = self.windowToCanvas(e.clientX, e.clientY);
        const context = self.canvas.getContext('2d');
        self.currentX = p.x;
        self.currentY = p.y;
        self.mouseDownPosition = Point.create(p.x, p.y);
        self.isMouseDown = true;
        self.mouseDownView.trigger(self, new PointEventParameters(e, self.mouseDownPosition));
        const activeElement = self.model.firstActiveElementAt(context, p.x, p.y);
        self.clickCancelled = false;
        if (self.eventDelay > 0) {
            self.pendingMouseDownElement = activeElement;
            if (self.eventTimer) {
                clearTimeout(self.eventTimer);
                self.eventTimer = undefined;
            }
            self.eventTimer = setTimeout(function() {
                if (!self.clickCancelled) {
                    self.setMouseDownElement(self.pendingMouseDownElement);
                }
            }, self.eventDelay);
        }
        else {
            self.setMouseDownElement(activeElement);
        }
        self.drawIfNeeded();
    }

    /**
      Handles canvas mouse move event
      @param e - Mouse event
    */
    onCanvasMouseMove(e: MouseEvent): void {
        log(`Canvas mouse move ${e.clientX}:${e.clientY}`);

        if (!this.enabled) {
            return;
        }
        const deltaX = this.lastClientX - e.clientX;
        if (Math.abs(deltaX) > 8) {
            this.clickCancelled = true;
        }
        const p = this.windowToCanvas(e.clientX, e.clientY);
        if (p.x === this.currentX && this.currentY === p.y) {
            return;
        }
        this.currentX = p.x;
        this.currentY = p.y;
        this.mouseMovedView.trigger(this, new PointEventParameters(e, p));
        if (!this.canvas) {
            return;
        }
        const context = this.canvas.getContext('2d');
        const activeElement = this.model.firstActiveElementAt(context, p.x, p.y);
        this.setMouseOverElement(activeElement);
    }

    /**
      Handles canvas mouse up
      @param e - Mouse event info
    */
    onCanvasMouseUp(e: MouseEvent | MousePositionInfo) {
        log(`Canvas mouse up ${e.clientX}:${e.clientY}`);
        ViewController.captured = undefined;
        window.removeEventListener('mouseup', this.windowMouseUp, true);
        window.removeEventListener('mousemove', this.windowMouseMove, true);

        if (!this.enabled) {
            return;
        }
        if (!this.isMouseDown) {
            return;
        }
        this.lastClientX = e.clientX;
        this.lastClientY = e.clientY;
        const p = this.windowToCanvas(e.clientX, e.clientY);
        this.currentX = p.x;
        this.currentY = p.y;
        this.isMouseDown = false;
        this.mouseUpView.trigger(this, new PointEventParameters(e, p));
        if (this.pressedElement) {
            const el = this.pressedElement;
            this.mouseUpElement.trigger(this, el);
            if (!this.clickCancelled) {
                if (el === this.mouseOverElement) {
                    this.elementClicked.trigger(this, el);
                }
            }
            this.pressedElement = undefined;
        }
        else if (this.pendingMouseDownElement && !this.clickCancelled) {
            this.setMouseOverElement(this.pendingMouseDownElement);
            this.setMouseDownElement(this.pendingMouseDownElement);
            this.mouseUpElement.trigger(this, this.pendingMouseDownElement);
            this.elementClicked.trigger(this, this.pendingMouseDownElement);
            this.pendingMouseDownElement = undefined;
        }
        this.drawIfNeeded();
    }

    /**
      Sets current mouse down element
      @param el - Mouse down element
    */
    setMouseDownElement(el: ElementBase) {
        if (el) {
            this.setMouseOverElement(el);
        }
        if (el !== this.pressedElement) {
            if (this.pressedElement) {
                this.mouseUpElement.trigger(this, this.pressedElement);
            }
            this.pressedElement = el;
            if (el) {
                this.mouseDownElement.trigger(this, el);
            }
        }
    }

    /**
      Sets current mouse over element
      @param el -Mouse over element
    */
    setMouseOverElement(el: ElementBase) {
        if (el !== this.mouseOverElement) {
            if (this.mouseOverElement) {
                this.mouseLeftElement.trigger(this, this.mouseOverElement);
            }
            this.mouseOverElement = el;
            if (el) {
                this.mouseEnteredElement.trigger(this, el);
            }
        }
        if (this.mouseOverElement) {
            this.canvas.style.cursor = 'pointer';
        }
        else {
            this.canvas.style.cursor = 'default';
        }
    }

    /**
      Sets rendering scale.  Recreates or sizes target canvas.
      @param Render scale
    */
    setScale(scale: number): void {
        if (scale === this.scale) {
            return;
        }
        this.scale = scale;
        if (this.canvas) {
            this.canvas.width = this.model.getSize().width * scale;
            this.canvas.height = this.model.getSize().height * scale;
        }
        else {
            this.createCanvas();
        }
        const hostDiv = this.canvas.parentElement;
        if(hostDiv) {
            hostDiv.style.width = this.model.getSize().width * scale + 'px';
            hostDiv.style.height = this.model.getSize().height * scale + 'px';
        }
        this.draw();
    }

    /**
      Called when model is updated. Sets redraw flag and triggers
      model updated event
      @method Drawing.ViewController#onModelUpdated
    */
    onModelUpdated(): void {
        this.modelUpdated.trigger(this, this.model);
        this.invalidate();
    }

    /**
      Renders model to canvas and clears redraw flag
      @method Drawing.ViewController#draw
    */
    draw(): void {
        if (!this.canvas) {
            return;
        }
        if (!this.model) {
            return;
        }

        const context = this.canvas.getContext('2d');
        this.model.context = context;
        const w = this.model.getSize().width;
        const h = this.model.getSize().height;

        // Clear context
        if (this.scale !== 1.0) {
            context.clearRect(0, 0, w * this.scale, h * this.scale);
        }
        else {
            context.clearRect(0, 0, w, h);
        }

        // Offset for scroll
        context.save();
        context.translate(-this.offsetX * this.scale, -this.offsetY * this.scale);

        // Render model
        this.renderer.renderToContext(context, this.scale);

        // Restore from offset
        context.restore();

        // If displaying frame rate
        if (this.model.displayFPS) {
            context.fillStyle = 'cornflowerblue';
            context.font = '16px monospace';
            context.fillText(this.calculateFPS().toFixed() + ' fps', 20, 20);
        }

        // Clear redraw flag
        this.needsRedraw = false;
    }

    /**
      Begins direct rendering
      @method Drawing.ViewController#beginDraw
    */
    beginDraw(): CanvasRenderingContext2D {
        if (!this.canvas) {
            return null;
        }
        if (!this.model) {
            return null;
        }

        const context = this.canvas.getContext('2d');
        this.model.context = context;
        const w = this.model.getSize().width;
        const h = this.model.getSize().height;

        // Clear context
        if (this.scale !== 1.0) {
            context.clearRect(0, 0, w * this.scale, h * this.scale);
        }
        else {
            context.clearRect(0, 0, w, h);
        }

        // Offset for scroll
        context.save();
        context.translate(-this.offsetX * this.scale, -this.offsetY * this.scale);

        // Render model
        this.renderer.renderToContext(context, this.scale);

        return context;
    }

    /**
      Ends direct rendering
      @method Drawing.ViewController#beginDraw
    */
    endDraw(context: CanvasRenderingContext2D) {
        // Render model
        // this.renderer.renderToContext(context, this.scale);

        // Restore from offset
        context.restore();

        // Clear redraw flag
        this.needsRedraw = false;
    }

    /**
      Calculates frame rate based on elapsed time since last frame
    */
    calculateFPS(): number {
        const now = +new Date();
        const fps = 1000 / (now - this.lastFrameTime);
        this.lastFrameTime = now;
        return fps;
    }

    /**
      Sets redraw flag to induce draw on next draw cycle
    */
    invalidate(): void {
        this.needsRedraw = true;
    }

    /**
      Starts animation timer to induce period tick events
      @param offset - Timer start offset
    */
    startTimer(offset: number = 0): void {
        this.startTime = +new Date();
        if (offset) {
            this.startTime += offset * 1000;
        }
        this.lastTick = 0.0;
        if (this.timerEnabled) {
            return;
        }
        this.timerEnabled = true;
        const controller = this;
        this.timerHandle = window.requestAnimationFrame(controller.tick);
    }

    /**
      Pauses animation timer
    */
    pauseTimer(): void {
        if (!this.timerEnabled) {
            return;
        }
        this.pauseTime = +new Date();
        this.timerEnabled = false;
        if (this.timerHandle) {
            window.cancelAnimationFrame(this.timerHandle);
            this.timerHandle = undefined;
        }
    }

    /**
      Resumes animation timer at time paused
      @method Drawing.ViewController#resumeTimer
    */
    resumeTimer(): void {
        if (this.timerEnabled) {
            return;
        }
        const controller = this;
        const now = +new Date();
        const elapsed = now - this.pauseTime;
        controller.startTime += elapsed;
        controller.pauseTime = undefined;
        controller.timerEnabled = true;
        this.timerHandle = window.requestAnimationFrame(controller.tick);
    }

    /**
      Stops animation timer
      @method Drawing.ViewController#stopTimer
    */
    stopTimer(): void {
        if (!this.timerEnabled) {
            return;
        }
        this.timerEnabled = false;
        if (this.timerHandle) {
            window.cancelAnimationFrame(this.timerHandle);
            this.timerHandle = undefined;
        }
    }

    /**
      Animation timer callback. Called by system animation frame timer and induces tick event when timer is enabled.
      @method Drawing.ViewController#tick
    */
    tick(): void {
        const controller = this;
        if (controller.timerEnabled) {
            this.timerParameters.elapsedTime = controller.elapsedTime();
            this.timerParameters.tickDelta = this.timerParameters.elapsedTime - controller.lastTick;
            controller.lastTick = this.timerParameters.elapsedTime;
            controller.timer.trigger(controller, this.timerParameters);
            controller.drawIfNeeded();
            this.timerHandle = window.requestAnimationFrame(controller.tick);
        }
        else {
            this.timerHandle = undefined;
        }
    }

    /**
      Computes animation timer elapsed time
    */
    elapsedTime(): number {
        const now = +new Date();
        return (now - this.startTime) / 1000.0;
    }

    /**
      Computes floating point modulus (remainder) of two number
      @param a - Numerator
      @param b - Denominator
      @returns Floating point remainder
    */
    private fmod(a: number, b: number): number {
        return Number((a - Math.floor(a / b) * b).toPrecision(8));
    }

    /**
      Computes periodic timer phase angle based on timer offset and frequency
      @param frequency - Timer frequency in cycles per second
      @returns Timer phase angle in radians
    */
    private timerPhase(frequency: number): number {
        const elapsed = this.elapsedTime();
        const period = 1.0 / frequency;
        const partial = this.fmod(elapsed, period) / period;
        const phase = partial * 2.0 * Math.PI;
        return phase;
    }

    /**
      Binds existing controller to host DIV element
      @param hostDiv - Hosting div element
      @returns This view controller
    */
    bindTarget(hostDiv: HTMLDivElement) {
        if (!hostDiv) {
            throw new EliseException('Null host element specified');
        }
        hostDiv.innerHTML = '';
        const canvas = this.getCanvas();
        hostDiv.appendChild(canvas);
        hostDiv.style.width = this.model.getSize().width * this.scale + 'px';
        hostDiv.style.height = this.model.getSize().height * this.scale + 'px';
        this.draw();
        this.model.controllerAttached.trigger(this.model, this);
        return this;
    }
}
