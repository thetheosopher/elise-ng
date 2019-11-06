import { ElementBase } from './element-base';
import { SpriteFrame } from './sprite-frame';
import { SpriteState } from './sprite-state';
import { Point } from '../core/point';
import { Size } from '../core/size';
import { ResourceManager } from '../resource/resource';
import { BitmapResource } from '../resource/bitmap-resource';
import { EliseException } from '../core/elise-exception';

export class SpriteElement extends ElementBase {
    /**
      Array of sprite frames
    */
    frames: SpriteFrame[];

    /**
      Current rendered frame index
    */
    frameIndex: number;

    /**
      True if sprite animation should loop
    */
    loop: boolean;

    /**
      Total computed timeline length from frame durations and transition durations
    */
    timelineLength: number;

    /**
      Frame stack used to push/pop frames in button events
    */
    frameStack: number[];

    /**
      Click event command handler tag
    */
    click: string;

    /**
      Frame advance command handler tag
    */
    onAdvance: string;

    /**
      Animation timer command handler tag
    */
    timer: string;

    /**
      Offset into current transition when transitioning
    */
    transitionOffset: number;

    /**
      Source canvas element when transitioning
    */
    c1: HTMLCanvasElement;

    /**
      Target canvas element when transitioning
    */
    c2: HTMLCanvasElement;

    /**
      Source frame index when transitioning
    */
    c1index: number;

    /**
      Target frame index when transitioning
    */
    c2index: number;

    /**
      Animation timer handle
     */
    timerHandle: NodeJS.Timer;

    /**
      Transition render function for current transition
        (c: CanvasRenderingContext2D, c1: HTMLCanvasElement, c2: HTMLCanvasElement,
        transitionOffset: number, x: number, y: number, width: number, height: number)
    */
    transition: (
        c: CanvasRenderingContext2D,
        c1: HTMLCanvasElement,
        c2: HTMLCanvasElement,
        transitionOffset: number,
        x: number,
        y: number,
        width: number,
        height: number
    ) => void;

    /**
      Constructs a sprite element
      @classdesc Renders one or more image frames from full or partial bitmap image source
      @extends Elise.Drawing.ElementBase
    */
    constructor() {
        super();
        this.type = 'sprite';
        this.frames = [];
        this.frameIndex = 0;
        this.loop = true;
        this.createSheetFrames = this.createSheetFrames.bind(this);
        this.computeTimeline = this.computeTimeline.bind(this);
        this.getStateForTime = this.getStateForTime.bind(this);
        this.getTimeForFrame = this.getTimeForFrame.bind(this);
    }

    /**
      Sprite element factory function
      @method Elise.Drawing.SpriteElement#create
      @param x - X coordinate
      @param y - Y coordinate
      @param width - Width
      @param height - Height
      @returns New sprite element
    */
    static create(x?: number, y?: number, width?: number, height?: number): SpriteElement {
        const e = new SpriteElement();
        if (arguments.length === 4) {
            e._location = new Point(x, y);
            e._size = new Size(width, height);
        }
        return e;
    }

    static cloneFrames(frames: SpriteFrame[]): SpriteFrame[] {
        const cloned = [];
        for (let i = 0; i < frames.length; i++) {
            cloned.push(SpriteFrame.clone(frames[i]));
        }
        return cloned;
    }

    /**
      Copies properies of another element instance to this instance
      @param o - Source element
    */
    parse(o: any): void {
        super.parse(o);
        if (o.frames) {
            this.frames = o.frames;
        }
        if (!this.location) {
            this._location = new Point(0, 0);
        }
    }

    /**
      Serializes persistent properties to new object instance
      @returns Serialized element
    */
    serialize(): any {
        const o = super.serialize();
        if (this.frames) {
            o.frames = JSON.parse(JSON.stringify(this.frames));
        }
        return o;
    }

    /**
      Clones this element to a new instance
      @returns Cloned sprite element instance
    */
    clone(): SpriteElement {
        const e: SpriteElement = SpriteElement.create();
        super.cloneTo(e);
        if (this.frames) {
            e.frames = this.frames;
        }
        return e;
    }

    /**
      Register image sources for all frames with resource manager
      @param rm - Resource manager
    */
    registerResources(rm: ResourceManager): void {
        super.registerResources(rm);
        if (this.frames) {
            const fl = this.frames.length;
            for (let i = 0; i < fl; i++) {
                rm.register(this.frames[i].source);
            }
        }
    }

    /**
      Returns list of referenced resource keys
    */
    getResourceKeys() {
        const keys = super.getResourceKeys();
        if (this.frames) {
            const fl = this.frames.length;
            for (let i = 0; i < fl; i++) {
                keys.push(this.frames[i].source);
            }
        }
        return keys;
    }

    /**
      Render sprite element to canvas context
      @param c - Rendering context
    */
    draw(c: CanvasRenderingContext2D): void {
        const model = this.model;

        // If transition renderer in place, then render transition using prepared c1 and c2 canvases
        if (this.transition) {
            c.save();
            if (this.transform) {
                model.setRenderTransform(c, this.transform, this._location);
            }
            c.beginPath();
            c.rect(this._location.x, this._location.y, this._size.width, this._size.height);
            c.clip();
            this.transition(
                c,
                this.c1,
                this.c2,
                this.transitionOffset,
                this._location.x,
                this._location.y,
                this._size.width,
                this._size.height
            );
            c.restore();
        }
        else {
            // Render static frame
            const frame = this.frames[this.frameIndex];
            const res = this.model.resourceManager.get(frame.source) as BitmapResource;
            if(!res.image) { return; }
            c.save();
            if (this.transform) {
                model.setRenderTransform(c, this.transform, this._location);
            }
            if (frame.opacity && frame.opacity > 0 && frame.opacity < 1.0) {
                const o = c.globalAlpha;
                c.globalAlpha = frame.opacity;
                c.drawImage(
                    res.image,
                    frame.x,
                    frame.y,
                    frame.width,
                    frame.height,
                    this._location.x,
                    this._location.y,
                    this._size.width,
                    this._size.height
                );
                c.globalAlpha = o;
            }
            else {
                c.drawImage(
                    res.image,
                    frame.x,
                    frame.y,
                    frame.width,
                    frame.height,
                    this._location.x,
                    this._location.y,
                    this._size.width,
                    this._size.height
                );
            }
            c.restore();
        }
    }

    /**
      Add sprite frames from a sprite sheet image containing one or more frame
      images in a grid array
      @method Elise.Drawing.SpriteElement#createSheetFrames
      @param source - Bitmap resource key for source image
      @param sheetWidth - Source image width
      @param sheetHeight - Source image height
      @param spriteWidth - Sprite frame width
      @param spriteHeight - Sprite frame height
      @param frameCount - Number of frames
      @param duration - Duration for each frame
      @param transition - Transition for each frame
      @param transitionDuration - Transition duration for each frame
      @param opacity - Optional opacity for each frame in the range (0-1). Default 1.
    */
    createSheetFrames(
        source: string,
        sheetWidth: number,
        sheetHeight: number,
        spriteWidth: number,
        spriteHeight: number,
        frameCount: number,
        duration: number,
        transition: string,
        transitionDuration: number,
        opacity?: number
    ): void {
        let index = 0;
        this.frames = [];
        for (let y = 0; y < sheetHeight; y += spriteHeight) {
            for (let x = 0; x < sheetWidth; x += spriteWidth) {
                this.frames.push(
                    new SpriteFrame(
                        source,
                        x,
                        y,
                        spriteWidth,
                        spriteHeight,
                        duration,
                        transition,
                        transitionDuration,
                        opacity
                    )
                );
                index++;
                if (index === frameCount) {
                    return;
                }
            }
        }
    }

    /**
      Computes total timeline length from duration and transition duration
      of all frames and sets result into timelineLength property
      @method Elise.Drawing.SpriteElement#computeTimeline
    */
    computeTimeline(): void {
        let total = 0;
        const fl = this.frames.length;
        for (let i = 0; i < fl; i++) {
            const frame = this.frames[i];
            if (frame.transition && frame.transitionDuration) {
                total += frame.duration + frame.transitionDuration;
            }
            else {
                total += frame.duration;
            }
        }
        this.timelineLength = total;
    }

    /**
      Determines whether or not a transition or static frame should be
      rendered based on a given timeline offset
      @method Elise.Drawing.SpriteElement#getStateForTime
      @param targetTime - Timeline offset
      @returns Sprite state for time offset
    */
    getStateForTime(targetTime: number): SpriteState {
        const fl = this.frames.length;
        let time = 0.0;
        let baseTime = 0.0;

        // Compute timeline length if not already done
        if (!this.timelineLength) {
            this.computeTimeline();
        }

        // If not looping and past end time, return end frame
        if (!this.loop) {
            if (targetTime > this.timelineLength) {
                return new SpriteState(null, 1.0, fl - 1, fl - 1);
            }
        }

        // Loop time
        if (this.loop) {
            if (targetTime >= this.timelineLength) {
                targetTime = targetTime % this.timelineLength;
            }
        }

        // Walk the frames until we hit the target time
        while (true) {
            for (let i = 0; i < fl; i++) {
                const index = i;
                let nextIndex = i + 1;
                if (nextIndex >= fl) {
                    nextIndex = 0;
                }
                const frame = this.frames[index];
                const nextFrame = this.frames[nextIndex];
                if (targetTime <= baseTime + time + frame.duration) {
                    return new SpriteState(
                        null,
                        1.0 - (baseTime + time + frame.duration - targetTime) / frame.duration,
                        index,
                        nextIndex
                    );
                }
                if (
                    nextFrame.transitionDuration &&
                    targetTime <= baseTime + time + frame.duration + nextFrame.transitionDuration
                ) {
                    const timeOffset = baseTime + time + frame.duration + nextFrame.transitionDuration - targetTime;
                    const offset = 1.0 - timeOffset / nextFrame.transitionDuration;
                    return new SpriteState(nextFrame.transition, offset, index, nextIndex);
                }
                if (nextFrame.transitionDuration) {
                    time += nextFrame.transitionDuration;
                }
                time += frame.duration;
            }

            // Increment base time in case target time exceeds total time line length
            baseTime += time;
            time = 0;
        }
    }

    /**
      Returns the timeline time offset for the start of a given frame
      @method Elise.Drawing.SpriteElement#getTimeForFrame
      @param targetFrame - Frame index
      @returns Timeline time offset in seconds
    */
    getTimeForFrame(targetFrame: number): number {
        const fl = this.frames.length;
        let time = 0.0;

        // Bounds check
        if (targetFrame > fl || targetFrame < 0) {
            throw new EliseException('Frame is out of bounds in SpriteElement getTimeForFrame().');
        }

        // Compute timeline length if not already done
        if (!this.timelineLength) {
            this.computeTimeline();
        }

        // Walk the frames until we hit the target frame, adding up the time
        for (let i = 0; i < targetFrame; i++) {
            let nextIndex = i + 1;
            if (nextIndex >= fl) {
                nextIndex = 0;
            }
            const frame = this.frames[i];
            const nextFrame = this.frames[nextIndex];
            time += frame.duration;
            if (nextFrame.transitionDuration) {
                time += nextFrame.transitionDuration;
            }
        }
        return time;
    }
}
