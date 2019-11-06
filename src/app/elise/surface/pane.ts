import { LayeredSurfaceElement } from './layered-surface-element';
import { EliseException } from '../core/elise-exception';
import { Utility } from '../core/utility';
import { TransitionRenderer } from '../transitions/transitions';
import { Surface } from './surface';

export class Pane extends LayeredSurfaceElement {
    /**
      Hosted pane surface
    */
    childSurface: Surface;

    /**
      Host HTML div element
    */
    element: HTMLDivElement;

    /**
      Constructs a pane
      @classdesc Hosts a child surface in a parent surface layer
      @extends Elise.Player.LayeredSurfaceElement
      @param id - Pane id
      @param left - Layout area x coordinate
      @param top - Layout area y coordinate
      @param width - Layout area width
      @param height - Layout area height
      @param childSurface - Hosted child surface
    */
    constructor(id: string, left: number, top: number, width: number, height: number, childSurface: Surface) {
        super(id, left, top, width, height);
        this.replaceSurface = this.replaceSurface.bind(this);
        this.setHostDivScrolling = this.setHostDivScrolling.bind(this);
        this.childSurface = childSurface;
        this.childSurface.isChild = true;
    }

    /**
      Creates a surface pane layer
      @param id - Pane layer id
      @param left - Layout area x coordinate
      @param top - Layout area y coordinate
      @param width - Layout area width
      @param height - Layout area height
      @param surface - Pane surface
      @returns New HTML layer
    */
    static create(id: string, left: number, top: number, width: number, height: number, surface: Surface) {
        const layer = new Pane(id, left, top, width, height, surface);
        return layer;
    }

    /**
      Adds pane to parent surface
    */
    addToSurface(surface: Surface) {
        this.surface = surface;

        // If no child surface, throw error
        if (!this.childSurface) {
            throw new EliseException('No child surface defined.');
        }

        // Create div to host child surface
        const hostDiv = document.createElement('div');
        const id = Utility.guid() + '_div';
        hostDiv.setAttribute('id', id);
        hostDiv.style.position = 'absolute';
        hostDiv.style.left = this.translateX + this.left * surface.scale + 'px';
        hostDiv.style.top = this.translateY + this.top * surface.scale + 'px';
        hostDiv.style.width = this.width * surface.scale + 'px';
        hostDiv.style.height = this.height * surface.scale + 'px';
        hostDiv.style.opacity = (this.surface.opacity * this.opacity).toString();
        this.childSurface.scale = this.surface.scale;
        this.element = hostDiv;
        this.setHostDivScrolling();
    }

    /**
      Prepares child surface resources and call completion callback
    */
    prepare(callback: (success: boolean) => void) {
        const self = this;
        self.surface.div.appendChild(self.element);
        if (self.surface.resourceListenerEvent.hasListeners()) {
            self.surface.resourceListenerEvent.listeners.forEach((listener) => {
                self.childSurface.resourceListenerEvent.add(listener);
            });
        }
        self.childSurface.bind(
            self.element,
            function(surface) {
                self.isPrepared = true;
                callback(true);
            },
            false
        );
    }

    setHostDivScrolling() {
        const self = this;
        const hostDiv = self.element;
        if (self.childSurface.width > self.width) {
            hostDiv.style.overflowX = 'scroll';
        }
        else {
            hostDiv.style.overflowX = 'hidden';
        }
        if (self.childSurface.height > self.height) {
            hostDiv.style.overflowY = 'scroll';
        }
        else {
            hostDiv.style.overflowY = 'hidden';
        }
    }

    /**
      Swaps existing child surface with a new child surface, prepares its resources
      and calls completion callback
      @method Elise.Player.Pane#replaceSurface
      @param newChild - New child surface
      @param callback - Callback (pane: Pane)
    */
    replaceSurface(newChild: Surface, callback: (pane: Pane) => void, transition?: string, duration?: number) {
        if (transition !== undefined) {
            switch (transition.toLowerCase()) {
                case 'fade':
                    {
                        const t = new FadeTransition(this, newChild, callback, duration);
                        t.start();
                    }
                    break;

                case 'pushleft':
                    {
                        const t = new PushTransition(this, newChild, callback, duration, TransitionDirection.Left);
                        t.start();
                    }
                    break;

                case 'pushright':
                    {
                        const t = new PushTransition(this, newChild, callback, duration, TransitionDirection.Right);
                        t.start();
                    }
                    break;

                case 'pushup':
                    {
                        const t = new PushTransition(this, newChild, callback, duration, TransitionDirection.Up);
                        t.start();
                    }
                    break;

                case 'pushdown':
                    {
                        const t = new PushTransition(this, newChild, callback, duration, TransitionDirection.Down);
                        t.start();
                    }
                    break;

                case 'wipeleft':
                    {
                        const t = new WipeTransition(this, newChild, callback, duration, TransitionDirection.Left);
                        t.start();
                    }
                    break;

                case 'wipeleftup':
                    {
                        const t = new WipeTransition(this, newChild, callback, duration, TransitionDirection.LeftUp);
                        t.start();
                    }
                    break;

                case 'wipeleftdown':
                    {
                        const t = new WipeTransition(this, newChild, callback, duration, TransitionDirection.LeftDown);
                        t.start();
                    }
                    break;

                case 'wiperight':
                    {
                        const t = new WipeTransition(this, newChild, callback, duration, TransitionDirection.Right);
                        t.start();
                    }
                    break;

                case 'wiperightup':
                    {
                        const t = new WipeTransition(this, newChild, callback, duration, TransitionDirection.RightUp);
                        t.start();
                    }
                    break;

                case 'wiperightdown':
                    {
                        const t = new WipeTransition(this, newChild, callback, duration, TransitionDirection.RightDown);
                        t.start();
                    }
                    break;

                case 'wipeup':
                    {
                        const t = new WipeTransition(this, newChild, callback, duration, TransitionDirection.Up);
                        t.start();
                    }
                    break;

                case 'wipedown':
                    {
                        const t = new WipeTransition(this, newChild, callback, duration, TransitionDirection.Down);
                        t.start();
                    }
                    break;

                case 'wipein':
                    {
                        const t = new WipeTransition(this, newChild, callback, duration, TransitionDirection.In);
                        t.start();
                    }
                    break;

                case 'wipeinx':
                    {
                        const t = new WipeTransition(this, newChild, callback, duration, TransitionDirection.InX);
                        t.start();
                    }
                    break;

                case 'wipeiny':
                    {
                        const t = new WipeTransition(this, newChild, callback, duration, TransitionDirection.InY);
                        t.start();
                    }
                    break;

                case 'wipeout':
                    {
                        const t = new WipeTransition(this, newChild, callback, duration, TransitionDirection.Out);
                        t.start();
                    }
                    break;

                case 'wipeoutx':
                    {
                        const t = new WipeTransition(this, newChild, callback, duration, TransitionDirection.OutX);
                        t.start();
                    }
                    break;

                case 'wipeouty':
                    {
                        const t = new WipeTransition(this, newChild, callback, duration, TransitionDirection.OutY);
                        t.start();
                    }
                    break;

                case 'revealleft':
                    {
                        const t = new RevealTransition(this, newChild, callback, duration, TransitionDirection.Left);
                        t.start();
                    }
                    break;

                case 'revealleftup':
                    {
                        const t = new RevealTransition(this, newChild, callback, duration, TransitionDirection.LeftUp);
                        t.start();
                    }
                    break;

                case 'revealleftdown':
                    {
                        const t = new RevealTransition(
                            this,
                            newChild,
                            callback,
                            duration,
                            TransitionDirection.LeftDown
                        );
                        t.start();
                    }
                    break;

                case 'revealright':
                    {
                        const t = new RevealTransition(this, newChild, callback, duration, TransitionDirection.Right);
                        t.start();
                    }
                    break;

                case 'revealrightup':
                    {
                        const t = new RevealTransition(this, newChild, callback, duration, TransitionDirection.RightUp);
                        t.start();
                    }
                    break;

                case 'revealrightdown':
                    {
                        const t = new RevealTransition(
                            this,
                            newChild,
                            callback,
                            duration,
                            TransitionDirection.RightDown
                        );
                        t.start();
                    }
                    break;

                case 'revealup':
                    {
                        const t = new RevealTransition(this, newChild, callback, duration, TransitionDirection.Up);
                        t.start();
                    }
                    break;

                case 'revealdown':
                    {
                        const t = new RevealTransition(this, newChild, callback, duration, TransitionDirection.Down);
                        t.start();
                    }
                    break;

                case 'slideleft':
                    {
                        const t = new SlideTransition(this, newChild, callback, duration, TransitionDirection.Left);
                        t.start();
                    }
                    break;

                case 'slideleftup':
                    {
                        const t = new SlideTransition(this, newChild, callback, duration, TransitionDirection.LeftUp);
                        t.start();
                    }
                    break;

                case 'slideleftdown':
                    {
                        const t = new SlideTransition(this, newChild, callback, duration, TransitionDirection.LeftDown);
                        t.start();
                    }
                    break;

                case 'slideright':
                    {
                        const t = new SlideTransition(this, newChild, callback, duration, TransitionDirection.Right);
                        t.start();
                    }
                    break;

                case 'sliderightup':
                    {
                        const t = new SlideTransition(this, newChild, callback, duration, TransitionDirection.RightUp);
                        t.start();
                    }
                    break;

                case 'sliderightdown':
                    {
                        const t = new SlideTransition(
                            this,
                            newChild,
                            callback,
                            duration,
                            TransitionDirection.RightDown
                        );
                        t.start();
                    }
                    break;

                case 'slideup':
                    {
                        const t = new SlideTransition(this, newChild, callback, duration, TransitionDirection.Up);
                        t.start();
                    }
                    break;

                case 'slidedown':
                    {
                        const t = new SlideTransition(this, newChild, callback, duration, TransitionDirection.Down);
                        t.start();
                    }
                    break;

                default:
                    {
                        const t = new NoTransition(this, newChild, callback);
                        t.start();
                    }
                    break;
            }
        }
        else {
            const t = new NoTransition(this, newChild, callback);
            t.start();
        }

        /*
        let self = this;
        let oldChild = self.childSurface;
        oldChild.resourceListenerEvent.clear();
        self.childSurface = newChild;
        newChild.scale = self.surface.scale;
        newChild.isChild = true;
        self.childSurface.bind(self.element, function (model) {
            oldChild.unbind();
            self.isPrepared = true;
            self.setHostDivScrolling();
            if (callback) {
                callback(self);
            }
        });
        */
    }

    /**
      Unloads child surface element
      @method Elise.Player.Pane#destroy
    */
    destroy() {
        if (this.childSurface) {
            this.childSurface.unbind();
        }
        if (this.element) {
            this.element.parentElement.removeChild(this.element);
            delete this.element;
        }
        delete this.surface;
    }

    /**
      Sets rendering scale
    */
    setScale(scale: number) {
        if (!this.element) { return; }
        const hostDiv = this.element as HTMLDivElement;
        hostDiv.style.left = this.translateX + this.left * scale + 'px';
        hostDiv.style.top = this.translateY + this.top * scale + 'px';
        hostDiv.style.width = this.width * scale + 'px';
        hostDiv.style.height = this.height * scale + 'px';
        if(this.childSurface) {
            this.childSurface.scale = scale;
        }
        return this;
    }

    /**
      Sets rendering opacity
      @method Elise.Player.Pane#setOpacity
    */
    setOpacity(opacity: number) {
        this.opacity = opacity;
        if (this.element) {
            this.element.style.opacity = (this.surface.opacity * this.opacity).toString();
        }
        return this;
    }

    /**
      Sets X translation
      @method Elise.Player.Pane#setTranslateX
    */
    setTranslateX(translateX: number) {
        this.translateX = translateX;
        if (this.element) {
            this.element.style.left = (this.translateX + this.left) * this.surface.scale + 'px';
        }
        return this;
    }

    /**
      Sets Y translation
      @method Elise.Player.Pane#setTranslateY
    */
    setTranslateY(translateY: number) {
        this.translateY = translateY;
        if (this.element) {
            this.element.style.top = (this.translateY + this.top) * this.surface.scale + 'px';
        }
        return this;
    }

    addTo(surface: Surface) {
        surface.layers.push(this);
        return this;
    }
}

export class PaneTransition {
    pane: Pane;
    target: Surface;
    callback: (pane: Pane) => void;

    constructor(pane: Pane, target: Surface, callback: (pane: Pane) => void) {
        this.pane = pane;
        this.target = target;
        this.callback = callback;
        this.start = this.start.bind(this);
        this.onStart = this.onStart.bind(this);
        this.onComplete = this.onComplete.bind(this);
        this.bind = this.bind.bind(this);
    }

    start() {}

    onStart() {
        this.pane.childSurface.resourceListenerEvent.clear();
        this.pane.element.style.overflow = 'hidden';
        this.pane.childSurface = this.target;
        this.target.scale = this.pane.surface.scale;
        this.target.isChild = true;
        this.pane.isPrepared = false;
    }

    onComplete() {
        const self = this;
        if (self.callback) {
            self.callback(self.pane);
        }
        self.pane.isPrepared = true;
        self.pane.setHostDivScrolling();
        self.target.onload();
        delete self.pane;
        delete self.callback;
        delete self.target;
    }

    bind(callback: (surface: Surface) => void, onBottom: boolean) {
        const surface = this.target;
        const hostDiv = this.pane.element;
        if (surface.controller) {
            surface.onErrorInternal('Surface is already bound.');
            return;
        }
        surface.hostDiv = hostDiv;
        surface.createDiv(onBottom);
        if (surface.model) {
            surface.initializeController();
            if (callback) {
                callback(surface);
            }
        }
        else {
            surface.createModel(function() {
                if (surface.model) {
                    surface.initializeController();
                    if (callback) {
                        callback(surface);
                    }
                }
            });
        }
    }
}

/*
  NoTransition
*/
export class NoTransition extends PaneTransition {
    constructor(pane: Pane, target: Surface, callback: (pane: Pane) => void) {
        super(pane, target, callback);
    }

    start() {
        const self = this;
        const source = self.pane.childSurface;
        self.onStart();
        self.bind(function(surface) {
            source.unbind();
            self.onComplete();
        }, false);
    }
}

/*
  FadeTransition
*/
export class FadeTransition extends PaneTransition {
    duration: number;
    startTime: number;
    source: Surface;
    timer: NodeJS.Timer;

    constructor(pane: Pane, target: Surface, callback: (pane: Pane) => void, duration: number) {
        super(pane, target, callback);
        this.tick = this.tick.bind(this);
        this.duration = duration;
    }

    start() {
        const self = this;
        self.source = self.pane.childSurface;
        self.onStart();
        self.target.setOpacity(0);
        self.bind(function(surface) {
            // Save start time after preparation
            self.startTime = performance.now();

            // Fade in
            self.timer = setInterval(self.tick, 15);
        }, false);
    }

    tick() {
        // Get elapsed time since start
        const elapsed: number = performance.now() - this.startTime;

        // Map elapsed time to offset
        let offset: number = elapsed / (this.duration * 1000);

        if (offset >= 1 || isNaN(offset)) {
            this.target.setOpacity(1);
            clearInterval(this.timer);
            delete this.timer;
            this.source.unbind();
            this.onComplete();
        }
        else {
            // Apply easing
            offset = TransitionRenderer.easeInOutCubic(offset);

            this.target.setOpacity(offset);
            this.source.setOpacity(1 - offset);
        }
    }
}

/*
  PushDirection
*/
export enum TransitionDirection {
    Left = 0,
    Right = 1,
    Up = 2,
    Down = 3,
    LeftUp = 4,
    RightUp = 5,
    LeftDown = 6,
    RightDown = 7,
    In = 8,
    Out = 9,
    InX = 10,
    InY = 11,
    OutX = 12,
    OutY = 13
}

/*
  PushTransition
*/
export class PushTransition extends PaneTransition {
    duration: number;
    startTime: number;
    source: Surface;
    timer: NodeJS.Timer;
    direction: TransitionDirection;

    constructor(
        pane: Pane,
        target: Surface,
        callback: (pane: Pane) => void,
        duration: number,
        direction: TransitionDirection
    ) {
        super(pane, target, callback);
        this.tick = this.tick.bind(this);
        this.duration = duration;
        this.direction = direction;
    }

    start() {
        const self = this;
        self.source = self.pane.childSurface;
        self.onStart();

        switch (self.direction) {
            case TransitionDirection.Left:
                self.target.setTranslateX(self.pane.width);
                break;

            case TransitionDirection.Right:
                self.target.setTranslateX(-self.target.width);
                break;

            case TransitionDirection.Up:
                self.target.setTranslateY(self.pane.height);
                break;

            case TransitionDirection.Down:
                self.target.setTranslateY(-self.target.height);
                break;
        }
        self.bind(function(surface) {
            // Save start time after preparation
            self.startTime = performance.now();

            // Fade in
            self.timer = setInterval(self.tick, 15);
        }, false);
    }

    tick() {
        // Get elapsed time since start
        const elapsed: number = performance.now() - this.startTime;

        // Map elapsed time to offset
        let offset: number = elapsed / (this.duration * 1000);

        if (offset >= 1 || isNaN(offset)) {
            this.target.setTranslateX(0);
            this.target.setTranslateY(0);
            clearInterval(this.timer);
            delete this.timer;
            this.source.unbind();
            this.onComplete();
        }
        else {
            // Apply easing
            offset = TransitionRenderer.easeInOutCubic(offset);

            switch (this.direction) {
                case TransitionDirection.Left:
                    {
                        const offsetX = offset * this.pane.width;
                        this.target.setTranslateX(this.pane.width - offsetX);
                        this.source.setTranslateX(-offsetX);
                    }
                    break;

                case TransitionDirection.Right:
                    {
                        const offsetX = offset * this.target.width;
                        this.target.setTranslateX(-this.target.width + offsetX);
                        this.source.setTranslateX(offsetX);
                    }
                    break;

                case TransitionDirection.Up:
                    {
                        const offsetY = offset * this.pane.height;
                        this.target.setTranslateY(this.pane.height - offsetY);
                        this.source.setTranslateY(-offsetY);
                    }
                    break;

                case TransitionDirection.Down:
                    {
                        const offsetY = offset * this.target.height;
                        this.target.setTranslateY(-this.target.height + offsetY);
                        this.source.setTranslateY(offsetY);
                    }
                    break;
            }
        }
    }
}

/*
  WipeTransition
*/
export class WipeTransition extends PaneTransition {
    duration: number;
    startTime: number;
    source: Surface;
    timer: NodeJS.Timer;
    direction: TransitionDirection;

    constructor(
        pane: Pane,
        target: Surface,
        callback: (pane: Pane) => void,
        duration: number,
        direction: TransitionDirection
    ) {
        super(pane, target, callback);
        this.tick = this.tick.bind(this);
        this.duration = duration;
        this.direction = direction;
    }

    start() {
        const self = this;
        self.source = self.pane.childSurface;
        self.onStart();

        let onBottom = true;

        switch (this.direction) {
            case TransitionDirection.Out:
            case TransitionDirection.OutX:
            case TransitionDirection.OutY:
                onBottom = false;
                break;
        }

        self.bind(function(surface) {
            const scale = self.pane.surface.scale;

            switch (self.direction) {
                case TransitionDirection.Out:
                    {
                        const halfX = self.pane.width * scale / 2;
                        const halfY = self.pane.height * scale / 2;
                        self.target.div.style.clip =
                            'rect(' + halfY + 'px, ' + halfX + 'px, ' + halfY + 'px, ' + halfX + 'px)';
                    }
                    break;

                case TransitionDirection.OutX:
                    {
                        const halfX = self.pane.width * scale / 2;
                        self.target.div.style.clip =
                            'rect(' + 0 + 'px, ' + halfX + 'px, ' + self.pane.height * scale + 'px, ' + halfX + 'px)';
                    }
                    break;

                case TransitionDirection.OutY:
                    {
                        const halfY = self.pane.height * scale / 2;
                        self.target.div.style.clip =
                            'rect(' + halfY + 'px, ' + self.pane.width * scale + 'px, ' + halfY + 'px, ' + 0 + 'px)';
                    }
                    break;
            }

            // Save start time after preparation
            self.startTime = performance.now();

            // Fade in
            self.timer = setInterval(self.tick, 15);
        }, onBottom);
    }

    tick() {
        // Get elapsed time since start
        const elapsed: number = performance.now() - this.startTime;

        // Map elapsed time to offset
        let offset: number = elapsed / (this.duration * 1000);

        if (offset >= 1 || isNaN(offset)) {
            switch (this.direction) {
                case TransitionDirection.Out:
                case TransitionDirection.OutX:
                case TransitionDirection.OutY:
                    this.target.div.style.clip = null;

                    break;

                default:
                    this.source.div.style.clip = null;
                    break;
            }

            clearInterval(this.timer);
            delete this.timer;
            this.source.unbind();
            this.onComplete();
        }
        else {
            // Apply easing
            offset = TransitionRenderer.easeInOutCubic(offset);

            const scale = this.pane.surface.scale;

            switch (this.direction) {
                case TransitionDirection.Left:
                    {
                        const offsetX = Math.floor(offset * this.pane.width * this.pane.surface.scale);
                        this.source.div.style.clip =
                            'rect(' +
                            0 +
                            'px, ' +
                            (this.pane.width * scale - offsetX) +
                            'px, ' +
                            this.pane.height * scale +
                            'px, ' +
                            0 +
                            'px)';
                    }
                    break;

                case TransitionDirection.LeftUp:
                    {
                        const offsetX = Math.floor(offset * this.pane.width * this.pane.surface.scale);
                        const offsetY = Math.floor(offset * this.pane.height * this.pane.surface.scale);
                        this.source.div.style.clip =
                            'rect(' +
                            0 +
                            'px, ' +
                            (this.pane.width * scale - offsetX) +
                            'px, ' +
                            (this.pane.height * scale - offsetY) +
                            'px, ' +
                            0 +
                            'px)';
                    }
                    break;

                case TransitionDirection.LeftDown:
                    {
                        const offsetX = Math.floor(offset * this.pane.width * this.pane.surface.scale);
                        const offsetY = Math.floor(offset * this.pane.height * this.pane.surface.scale);
                        this.source.div.style.clip =
                            'rect(' +
                            offsetY +
                            'px, ' +
                            (this.pane.width * scale - offsetX) +
                            'px, ' +
                            this.pane.height * scale +
                            'px, ' +
                            0 +
                            'px)';
                    }
                    break;

                case TransitionDirection.Right:
                    {
                        const offsetX = Math.floor(offset * this.pane.width * this.pane.surface.scale);
                        this.source.div.style.clip =
                            'rect(' +
                            0 +
                            'px, ' +
                            this.pane.width * scale +
                            'px, ' +
                            this.pane.height * scale +
                            'px, ' +
                            offsetX +
                            'px)';
                    }
                    break;

                case TransitionDirection.RightUp:
                    {
                        const offsetX = Math.floor(offset * this.pane.width * this.pane.surface.scale);
                        const offsetY = Math.floor(offset * this.pane.height * this.pane.surface.scale);
                        this.source.div.style.clip =
                            'rect(' +
                            0 +
                            'px, ' +
                            this.pane.width * scale +
                            'px, ' +
                            (this.pane.height * scale - offsetY) +
                            'px, ' +
                            offsetX +
                            'px)';
                    }
                    break;

                case TransitionDirection.RightDown:
                    {
                        const offsetX = Math.floor(offset * this.pane.width * this.pane.surface.scale);
                        const offsetY = Math.floor(offset * this.pane.height * this.pane.surface.scale);
                        this.source.div.style.clip =
                            'rect(' +
                            offsetY +
                            'px, ' +
                            this.pane.width * scale +
                            'px, ' +
                            this.pane.height * scale +
                            'px, ' +
                            offsetX +
                            'px)';
                    }
                    break;

                case TransitionDirection.Up:
                    {
                        const offsetY = Math.floor(offset * this.pane.height * this.pane.surface.scale);
                        this.source.div.style.clip =
                            'rect(' +
                            0 +
                            'px, ' +
                            this.pane.width * scale +
                            'px, ' +
                            (this.pane.height * scale - offsetY) +
                            'px, ' +
                            0 +
                            'px)';
                    }
                    break;

                case TransitionDirection.Down:
                    {
                        const offsetY = Math.floor(offset * this.pane.height * this.pane.surface.scale);
                        this.source.div.style.clip =
                            'rect(' +
                            offsetY +
                            'px, ' +
                            this.pane.width * scale +
                            'px, ' +
                            this.pane.height * scale +
                            'px, ' +
                            0 +
                            'px)';
                    }
                    break;

                case TransitionDirection.Out:
                    {
                        const halfX = this.pane.width * scale / 2;
                        const halfY = this.pane.height * scale / 2;
                        const offsetX = Math.floor(offset * this.pane.width * this.pane.surface.scale / 2);
                        const offsetY = Math.floor(offset * this.pane.height * this.pane.surface.scale / 2);
                        this.target.div.style.clip =
                            'rect(' +
                            (halfY - offsetY) +
                            'px, ' +
                            (halfX + offsetX) +
                            'px, ' +
                            (halfY + offsetY) +
                            'px, ' +
                            (halfX - offsetX) +
                            'px)';
                    }
                    break;

                case TransitionDirection.OutX:
                    {
                        const halfX = this.pane.width * scale / 2;
                        const height = this.pane.height * scale;
                        const offsetX = Math.floor(offset * this.pane.width * this.pane.surface.scale / 2);
                        this.target.div.style.clip =
                            'rect(' +
                            0 +
                            'px, ' +
                            (halfX + offsetX) +
                            'px, ' +
                            height +
                            'px, ' +
                            (halfX - offsetX) +
                            'px)';
                    }
                    break;

                case TransitionDirection.OutY:
                    {
                        const width = this.pane.width * scale;
                        const halfY = this.pane.height * scale / 2;
                        const offsetY = Math.floor(offset * this.pane.height * this.pane.surface.scale / 2);
                        this.target.div.style.clip =
                            'rect(' +
                            (halfY - offsetY) +
                            'px, ' +
                            width +
                            'px, ' +
                            (halfY + offsetY) +
                            'px, ' +
                            0 +
                            'px)';
                    }
                    break;

                case TransitionDirection.In:
                    {
                        const width = this.pane.width * scale;
                        const height = this.pane.height * scale;
                        const offsetX = Math.floor(offset * this.pane.width * this.pane.surface.scale / 2);
                        const offsetY = Math.floor(offset * this.pane.height * this.pane.surface.scale / 2);
                        this.source.div.style.clip =
                            'rect(' +
                            offsetY +
                            'px, ' +
                            (width - offsetX) +
                            'px, ' +
                            (height - offsetY) +
                            'px, ' +
                            offsetX +
                            'px)';
                    }
                    break;

                case TransitionDirection.InX:
                    {
                        const width = this.pane.width * scale;
                        const height = this.pane.height * scale;
                        const offsetX = Math.floor(offset * this.pane.width * this.pane.surface.scale / 2);
                        this.source.div.style.clip =
                            'rect(' + 0 + 'px, ' + (width - offsetX) + 'px, ' + height + 'px, ' + offsetX + 'px)';
                    }
                    break;

                case TransitionDirection.InY:
                    {
                        const width = this.pane.width * scale;
                        const height = this.pane.height * scale;
                        const offsetY = Math.floor(offset * this.pane.height * this.pane.surface.scale / 2);
                        this.source.div.style.clip =
                            'rect(' + offsetY + 'px, ' + width + 'px, ' + (height - offsetY) + 'px, ' + 0 + 'px)';
                    }
                    break;
            }
        }
    }
}

/*
  RevealTransition
*/
export class RevealTransition extends PaneTransition {
    duration: number;
    startTime: number;
    source: Surface;
    timer: NodeJS.Timer;
    direction: TransitionDirection;

    constructor(
        pane: Pane,
        target: Surface,
        callback: (pane: Pane) => void,
        duration: number,
        direction: TransitionDirection
    ) {
        super(pane, target, callback);
        this.tick = this.tick.bind(this);
        this.duration = duration;
        this.direction = direction;
    }

    start() {
        const self = this;
        self.source = self.pane.childSurface;
        self.onStart();

        self.bind(function(surface) {
            // Save start time after preparation
            self.startTime = performance.now();

            // Fade in
            self.timer = setInterval(self.tick, 15);
        }, true);
    }

    tick() {
        // Get elapsed time since start
        const elapsed: number = performance.now() - this.startTime;

        // Map elapsed time to offset
        let offset: number = elapsed / (this.duration * 1000);

        if (offset >= 1 || isNaN(offset)) {
            clearInterval(this.timer);
            delete this.timer;
            this.source.unbind();
            this.onComplete();
        }
        else {
            // Apply easing
            offset = TransitionRenderer.easeInOutCubic(offset);

            switch (this.direction) {
                case TransitionDirection.Left:
                    {
                        const offsetX = Math.floor(offset * this.source.width);
                        this.source.setTranslateX(-offsetX);
                    }
                    break;

                case TransitionDirection.LeftUp:
                    {
                        const offsetX = Math.floor(offset * this.source.width);
                        const offsetY = Math.floor(offset * this.source.height);
                        this.source.setTranslateX(-offsetX);
                        this.source.setTranslateY(-offsetY);
                    }
                    break;

                case TransitionDirection.LeftDown:
                    {
                        const offsetX = Math.floor(offset * this.source.width);
                        const offsetY = Math.floor(offset * this.source.height);
                        this.source.setTranslateX(-offsetX);
                        this.source.setTranslateY(offsetY);
                    }
                    break;

                case TransitionDirection.Right:
                    {
                        const offsetX = Math.floor(offset * this.pane.width);
                        this.source.setTranslateX(offsetX);
                    }
                    break;

                case TransitionDirection.RightUp:
                    {
                        const offsetX = Math.floor(offset * this.pane.width);
                        const offsetY = Math.floor(offset * this.source.height);
                        this.source.setTranslateX(offsetX);
                        this.source.setTranslateY(-offsetY);
                    }
                    break;

                case TransitionDirection.RightDown:
                    {
                        const offsetX = Math.floor(offset * this.pane.width);
                        const offsetY = Math.floor(offset * this.source.height);
                        this.source.setTranslateX(offsetX);
                        this.source.setTranslateY(offsetY);
                    }
                    break;

                case TransitionDirection.Up:
                    {
                        const offsetY = Math.floor(offset * this.source.height);
                        this.source.setTranslateY(-offsetY);
                    }
                    break;

                case TransitionDirection.Down:
                    {
                        const offsetY = Math.floor(offset * this.source.height);
                        this.source.setTranslateY(offsetY);
                    }
                    break;
            }
        }
    }
}

/*
  RevealTransition
*/
export class SlideTransition extends PaneTransition {
    duration: number;
    startTime: number;
    source: Surface;
    timer: NodeJS.Timer;
    direction: TransitionDirection;

    constructor(
        pane: Pane,
        target: Surface,
        callback: (pane: Pane) => void,
        duration: number,
        direction: TransitionDirection
    ) {
        super(pane, target, callback);
        this.tick = this.tick.bind(this);
        this.duration = duration;
        this.direction = direction;
    }

    start() {
        const self = this;
        self.source = self.pane.childSurface;
        self.onStart();

        self.bind(function(surface) {
            switch (self.direction) {
                case TransitionDirection.Left:
                    {
                        self.target.setTranslateX(self.pane.width);
                    }
                    break;

                case TransitionDirection.LeftUp:
                    {
                        self.target.setTranslateX(self.pane.width);
                        self.target.setTranslateY(self.pane.height);
                    }
                    break;

                case TransitionDirection.LeftDown:
                    {
                        self.target.setTranslateX(self.pane.width);
                        self.target.setTranslateY(-self.target.height);
                    }
                    break;

                case TransitionDirection.Right:
                    {
                        self.target.setTranslateX(-self.source.width);
                    }
                    break;

                case TransitionDirection.RightUp:
                    {
                        self.target.setTranslateX(-self.source.width);
                        self.target.setTranslateY(self.pane.height);
                    }
                    break;

                case TransitionDirection.RightDown:
                    {
                        self.target.setTranslateX(-self.source.width);
                        self.target.setTranslateY(-self.source.height);
                    }
                    break;

                case TransitionDirection.Up:
                    {
                        self.target.setTranslateY(self.pane.height);
                    }
                    break;

                case TransitionDirection.Down:
                    {
                        self.target.setTranslateY(-self.source.height);
                    }
                    break;
            }

            // Save start time after preparation
            self.startTime = performance.now();

            // Fade in
            self.timer = setInterval(self.tick, 15);
        }, false);
    }

    tick() {
        // Get elapsed time since start
        const elapsed: number = performance.now() - this.startTime;

        // Map elapsed time to offset
        let offset: number = elapsed / (this.duration * 1000);

        if (offset >= 1 || isNaN(offset)) {
            this.target.setTranslateX(0);
            this.target.setTranslateY(0);
            clearInterval(this.timer);
            delete this.timer;
            this.source.unbind();
            this.onComplete();
        }
        else {
            // Apply easing
            offset = TransitionRenderer.easeInOutCubic(offset);

            switch (this.direction) {
                case TransitionDirection.Left:
                    {
                        const offsetX = Math.floor(offset * this.pane.width);
                        this.target.setTranslateX(this.pane.width - offsetX);
                    }
                    break;

                case TransitionDirection.LeftUp:
                    {
                        const offsetX = Math.floor(offset * this.pane.width);
                        const offsetY = Math.floor(offset * this.pane.height);
                        this.target.setTranslateX(this.pane.width - offsetX);
                        this.target.setTranslateY(this.pane.height - offsetY);
                    }
                    break;

                case TransitionDirection.LeftDown:
                    {
                        const offsetX = Math.floor(offset * this.pane.width);
                        const offsetY = Math.floor(offset * this.target.height);
                        this.target.setTranslateX(this.pane.width - offsetX);
                        this.target.setTranslateY(offsetY - this.target.height);
                    }
                    break;

                case TransitionDirection.Right:
                    {
                        const offsetX = Math.floor(offset * this.source.width);
                        this.target.setTranslateX(offsetX - this.source.width);
                    }
                    break;

                case TransitionDirection.RightUp:
                    {
                        const offsetX = Math.floor(offset * this.source.width);
                        const offsetY = Math.floor(offset * this.pane.height);
                        this.target.setTranslateX(offsetX - this.source.width);
                        this.target.setTranslateY(this.pane.height - offsetY);
                    }
                    break;

                case TransitionDirection.RightDown:
                    {
                        const offsetX = Math.floor(offset * this.source.width);
                        const offsetY = Math.floor(offset * this.target.height);
                        this.target.setTranslateX(offsetX - this.source.width);
                        this.target.setTranslateY(offsetY - this.target.height);
                    }
                    break;

                case TransitionDirection.Up:
                    {
                        const offsetY = Math.floor(offset * this.pane.height);
                        this.target.setTranslateY(this.pane.height - offsetY);
                    }
                    break;

                case TransitionDirection.Down:
                    {
                        const offsetY = Math.floor(offset * this.target.height);
                        this.target.setTranslateY(offsetY - this.target.height);
                    }
                    break;
            }
        }
    }
}
