import { LayeredSurfaceElement } from './layered-surface-element';
import { CommonEvent } from '../core/common-event';
import { AnimationFrame } from './animation-frame';
import { Model } from '../core/model';
import { AnimationViewController } from './animation-view-controller';
import { SpriteElement } from '../elements/sprite-element';
import { SpriteFrame } from '../elements/sprite-frame';
import { ResourceManager, ResourceState } from '../resource/resource';
import { EliseException } from '../core/elise-exception';
import { BitmapResource } from '../resource/bitmap-resource';
import { TransitionRenderer } from '../transitions/transitions';
import { ElementCommandHandler } from '../command/element-command-handler';
import { Surface } from './surface';

export class Animation extends LayeredSurfaceElement {
    static ANIMATION_CLICK = 'animationClick';
    static ANIMATION_ADVANCE = 'animationAdvance';

    /**
      Starting animation frame
    */
    initialIndex: number;

    /**
      If true, loop animation
    */
    loop: boolean;

    /**
      Clicked event
    */
    clicked: CommonEvent<Animation> = new CommonEvent<Animation>();

    /**
      Frame advance event
    */
    frameAdvanced: CommonEvent<Animation> = new CommonEvent<Animation>();

    /**
      Animation frame array
    */
    frames: AnimationFrame[] = [];

    /**
      Current frame index
    */
    frameIndex: number;

    /**
      True when paused
    */
    isPaused: boolean;

    /**
      True when stopped
    */
    isStopped: boolean;

    /**
      If true, remember frame index
    */
    rememberFrame: boolean;

    /**
      Animation drawing model
    */
    model: Model;

    /**
      Animation view controller
    */
    controller: AnimationViewController;

    /**
      Animation host canvas element
    */
    element: HTMLCanvasElement;

    /**
      Animation sprite element
    */
    sprite: SpriteElement;

    /**
      Constructs an animation
      @classdesc Renders timed image frames with optional transitions
      @extends Elise.Player.LayeredSurfaceElement
      @param id - Animation id
      @param left - Layout area x coordinate
      @param top - Layout area y coordinate
      @param width - Layout area width
      @param height - Layout area height
      @param loop - Loop animation
      @param clickListener - Click event listener
      @param initialIndex - Initial frame index
      @param frameAdvancedListener - Frame advance event listener
    */
    constructor(
        id: string,
        left: number,
        top: number,
        width: number,
        height: number,
        loop: boolean,
        clickListener: (animation: Animation) => void,
        initialIndex: number,
        frameAdvancedListener: (animation: Animation) => void
    ) {
        super(id, left, top, width, height);
        this.frameIndex = 0;
        this.isPaused = false;
        this.isStopped = false;
        this.rememberFrame = false;

        this.addFrame = this.addFrame.bind(this);
        this.setResourceListener = this.setResourceListener.bind(this);
        this.pause = this.pause.bind(this);
        this.onAnimationClick = this.onAnimationClick.bind(this);
        this.onAnimationAdvance = this.onAnimationAdvance.bind(this);

        this.loop = loop;
        if (clickListener) {
            this.clicked.add(clickListener);
        }
        this.initialIndex = initialIndex;
        if (frameAdvancedListener) {
            this.frameAdvanced.add(frameAdvancedListener);
        }
    }

    /**
      Constructs an animation
      @classdesc Renders timed image frames with optional transitions
      @extends Elise.Player.LayeredSurfaceElement
      @param id - Animation id
      @param left - Layout area x coordinate
      @param top - Layout area y coordinate
      @param width - Layout area width
      @param height - Layout area height
      @param loop - Loop animation
      @param clickListener - Click event listener
      @param initialIndex - Initial frame index
      @param frameAdvancedListener - Frame advance event listener
    */
    static create(
        id: string,
        left: number,
        top: number,
        width: number,
        height: number,
        loop: boolean,
        clickListener: (animation: Animation) => void,
        initialIndex: number,
        frameAdvancedListener: (animation: Animation) => void
    ) {
        const animation = new Animation(
            id,
            left,
            top,
            width,
            height,
            loop,
            clickListener,
            initialIndex,
            frameAdvancedListener
        );
        return animation;
    }

    /**
      Adds an animation frame
      @method Elise.Player.Animation#addFrame
      @param id - Animation frame id
      @param source - Animation frame bitmap source
      @param left - Source bitmap crop x coordinate
      @param top - Source bitmap crop y coordinate
      @param width - Source bitmap crop width
      @param height - Source bitmap crop height
      @param duration - Frame duration in seconds
      @param transition - Frame "to" transition
      @param transitionDuration - Transition duration in seconds
      @param pauseFrame - Pause frame until tapped
      @returns New animation frame
    */
    addFrame(
        id: string,
        source: string,
        left: number,
        top: number,
        width: number,
        height: number,
        duration: number,
        transition: string,
        transitionDuration: number,
        pauseFrame: boolean
    ) {
        const frame = new AnimationFrame(
            id,
            left,
            top,
            width,
            height,
            source,
            duration,
            transition,
            transitionDuration,
            pauseFrame
        );
        this.frames.push(frame);
        return frame;
    }

    /**
      Registers a resource listener
      @param listener - Animation resource listener (rm: Elise.ResourceManager, state: Elise.ResourceState)
    */
    setResourceListener(listener: (rm: ResourceManager, state: ResourceState) => void) {
        if (this.model) {
            this.model.resourceManager.listenerEvent.add(listener);
        }
    }

    /**
      Adds animation to parent surface
    */
    addToSurface(surface: Surface) {
        this.surface = surface;

        // If no frames, throw error
        if (this.frames.length < 1) {
            throw new EliseException('No animation frames defined.');
        }

        // Create model
        const model = Model.create(this.width, this.height);
        this.model = model;
        if (surface.resourceListenerEvent.hasListeners()) {
            surface.resourceListenerEvent.listeners.forEach((listener) => {
                this.model.resourceManager.listenerEvent.add(listener);
            });
        }

        // Create bitmap resources for animation frames
        const registered = [];
        for (let i = 0; i < this.frames.length; i++) {
            const frame = this.frames[i];
            const source = frame.source;
            let found = false;
            for (let j = 0; j < registered.length; j++) {
                if (registered[j].toLowerCase() === source.toLowerCase()) {
                    found = true;
                    break;
                }
            }
            if (!found) {
                const key = registered.length.toString();
                BitmapResource.create(key, frame.source).addTo(model);
                registered.push(frame.source);
            }
        }

        // Create sprite element
        const sprite = SpriteElement.create(0, 0, this.width, this.height);
        sprite.id = this.id;
        sprite.loop = this.loop;
        sprite.timer = TransitionRenderer.SPRITE_TRANSITION;
        sprite.click = Animation.ANIMATION_CLICK;
        sprite.onAdvance = Animation.ANIMATION_ADVANCE;
        sprite.setInteractive(true);

        // Add frames
        for (let i = 0; i < this.frames.length; i++) {
            const frame = this.frames[i];
            let key = '';
            for (let j = 0; j < registered.length; j++) {
                if (registered[j].toLowerCase() === frame.source.toLowerCase()) {
                    key = j.toString();
                    break;
                }
            }
            sprite.frames.push(
                SpriteFrame.create(
                    key,
                    frame.left,
                    frame.top,
                    frame.width,
                    frame.height,
                    frame.duration,
                    frame.transition,
                    frame.transitionDuration
                )
            );
        }

        // Set non-default initial frame
        if (this.initialIndex) {
            sprite.frameIndex = this.initialIndex;
        }

        // Add sprite to model
        model.add(sprite);

        const controller = new AnimationViewController();
        this.controller = controller;
        this.controller.surface = this.surface;
        controller.animation = this;
        controller.setScale(surface.scale);
        controller.setModel(this.model);
        const canvas = controller.getCanvas();
        canvas.setAttribute('id', this.id + '_canvas');
        canvas.style.position = 'absolute';
        canvas.style.left = this.translateX + this.left * surface.scale + 'px';
        canvas.style.top = this.translateY + this.top * surface.scale + 'px';
        canvas.style.opacity = (this.surface.opacity * this.opacity).toString();
        this.element = canvas;
        this.sprite = sprite;
    }

    /**
      Loads required resource and calls completion callback
      @param callback - Completion callback (success: boolean)
    */
    prepare(callback: (result: boolean) => void) {
        const self = this;

        // let parentElement = document.getElementById(self.surface.hostDivId);
        // parentElement.appendChild(self.element);
        self.surface.div.appendChild(self.element);

        // self.controller.surface = self.surface;
        const elementCommandHandler = new ElementCommandHandler();
        elementCommandHandler.attachController(self.controller);
        elementCommandHandler.addHandler(
            TransitionRenderer.SPRITE_TRANSITION,
            TransitionRenderer.spriteTransitionHandler
        );
        elementCommandHandler.addHandler(Animation.ANIMATION_CLICK, function(
            controller: AnimationViewController,
            element: SpriteElement,
            command: string,
            trigger: string,
            parameters: any
        ) {
            const animation = controller.animation;
            if (animation) {
                animation.onAnimationClick();
            }
        });
        elementCommandHandler.addHandler(Animation.ANIMATION_ADVANCE, function(
            controller: AnimationViewController,
            element: SpriteElement,
            command: string,
            trigger: string,
            parameters: any
        ) {
            const animation = controller.animation;
            animation.frameIndex = animation.sprite.frameIndex;
            if (animation) {
                animation.onAnimationAdvance();
            }
        });

        self.model.prepareResources(null, function(success) {
            if (success) {
                self.isPrepared = true;
                self.controller.draw();
                if (callback) {
                    callback(true);
                }
            }
            else {
                self.surface.onErrorInternal('One or more resources failed to load.');
                if (callback) {
                    callback(false);
                }
            }
        });
    }

    /**
      Unloads animation and destroys visual elements
      @method Elise.Player.Animation#destroy
    */
    destroy() {
        if (this.controller) {
            this.controller.detach();
        }
        if (this.element) {
            delete this.element;
        }
        delete this.surface;
    }

    /**
      Pauses animation
      @method Elise.Player.Animation#pause
    */
    pause() {
        if (this.isPaused) {
            this.controller.resumeTimer();
            this.isPaused = false;
        }
        else {
            // Only pause if not transitioning
            const spriteState = this.sprite.getStateForTime(this.controller.elapsedTime());
            if (spriteState.transition === null) {
                this.controller.pauseTimer();
                this.isPaused = true;
            }
        }
    }

    /**
      Onload initialization
      @method Elise.Player.Animation#onload
    */
    onload() {
        if (this.controller) {
            if (this.initialIndex) {
            }

            // If initial frame is specified, set starting time in the past
            // by an offset equal to the starting time for the frame
            if (this.initialIndex) {
                const startTime = this.sprite.getTimeForFrame(this.initialIndex);
                this.controller.startTimer(-startTime);
            }
            else {
                this.controller.startTimer(0);
            }
        }
    }

    /**
      Onunload teardown
      @method Elise.Player.Animation#onunload
    */
    onunload() {
        if (this.controller) {
            this.controller.stopTimer();
        }
    }

    /**
      Sets rendering scale
    */
    setScale(scale: number) {
        if(this.controller) {
            this.controller.setScale(scale);
        }
        if (!this.element) { return; }
        const layer = this.element as HTMLCanvasElement;
        layer.style.left = this.translateX + this.left * scale + 'px';
        layer.style.top = this.translateY + this.top * scale + 'px';
        layer.style.width = this.width * scale + 'px';
        layer.style.height = this.height * scale + 'px';
        return this;
    }

    /**
      Sets rendering opacity
      @method Elise.Player.Animation#setOpacity
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
      @method Elise.Player.Animation#setTranslateX
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
      @method Elise.Player.Animation#setTranslateY
    */
    setTranslateY(translateY: number) {
        this.translateY = translateY;
        if (this.element) {
            this.element.style.top = (this.translateY + this.top) * this.surface.scale + 'px';
        }
        return this;
    }

    onAnimationClick() {
        this.clicked.trigger(this);
    }

    onAnimationAdvance() {
        this.frameAdvanced.trigger(this);
    }

    addTo(surface: Surface) {
        surface.layers.push(this);
        return this;
    }
}
