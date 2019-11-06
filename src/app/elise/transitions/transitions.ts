import { IController } from '../controller/controller';
import { SpriteElement } from '../elements/sprite-element';
import { BitmapResource } from '../resource/bitmap-resource';
import { ElementCommand } from '../command/element-command';
import { TimerParameters } from '../core/timer-parameters';

export type TransitionRenderFunction = (
    context: CanvasRenderingContext2D,
    c1: HTMLCanvasElement,
    c2: HTMLCanvasElement,
    offset: number,
    left: number,
    top: number,
    width: number,
    height: number
) => void;

export interface NamedTransitionRenderFunction {
    name: string;
    render: TransitionRenderFunction;
}

export type EasingFunction = (t: number) => number;

export interface NamedEasingFunction {
    name: string;
    ease: EasingFunction;
}

export class TransitionRenderer {
    static PUSH_FRAME_TRANSITION = 'pushFrameTransition';
    static POP_FRAME_TRANSITION = 'popFrameTransition';
    static SPRITE_INCREMENT = 'spriteIncrement';
    static SPRITE_TRANSITION = 'spriteTransition';

    static renderFunctions: NamedTransitionRenderFunction[] = [
        { name: 'none', render: TransitionRenderer.renderNone },
        { name: 'fade', render: TransitionRenderer.renderFade },
        { name: 'pushLeft', render: TransitionRenderer.renderPushLeft },
        { name: 'pushRight', render: TransitionRenderer.renderPushRight },
        { name: 'pushUp', render: TransitionRenderer.renderPushUp },
        { name: 'pushDown', render: TransitionRenderer.renderPushDown },
        { name: 'wipeLeft', render: TransitionRenderer.renderWipeLeft },
        { name: 'wipeRight', render: TransitionRenderer.renderWipeRight },
        { name: 'wipeUp', render: TransitionRenderer.renderWipeUp },
        { name: 'wipeDown', render: TransitionRenderer.renderWipeDown },
        { name: 'slideLeft', render: TransitionRenderer.renderSlideLeft },
        { name: 'slideRight', render: TransitionRenderer.renderSlideRight },
        { name: 'slideUp', render: TransitionRenderer.renderSlideUp },
        { name: 'slideDown', render: TransitionRenderer.renderSlideDown },
        { name: 'slideLeftDown', render: TransitionRenderer.renderSlideLeftDown },
        { name: 'slideRightDown', render: TransitionRenderer.renderSlideRightDown },
        { name: 'slideLeftUp', render: TransitionRenderer.renderSlideLeftUp },
        { name: 'slideRightUp', render: TransitionRenderer.renderSlideRightUp },
        { name: 'revealLeft', render: TransitionRenderer.renderRevealLeft },
        { name: 'revealRight', render: TransitionRenderer.renderRevealRight },
        { name: 'revealUp', render: TransitionRenderer.renderRevealUp },
        { name: 'revealDown', render: TransitionRenderer.renderRevealDown },
        { name: 'revealLeftDown', render: TransitionRenderer.renderRevealLeftDown },
        { name: 'revealRightDown', render: TransitionRenderer.renderRevealRightDown },
        { name: 'revealLeftUp', render: TransitionRenderer.renderRevealLeftUp },
        { name: 'revealRightUp', render: TransitionRenderer.renderRevealRightUp },
        { name: 'ellipticalIn', render: TransitionRenderer.renderEllipticalIn },
        { name: 'ellipticalOut', render: TransitionRenderer.renderEllipticalOut },
        { name: 'rectangularIn', render: TransitionRenderer.renderRectangularIn },
        { name: 'rectangularOut', render: TransitionRenderer.renderRectangularOut },
        { name: 'grid', render: TransitionRenderer.renderGrid },
        { name: 'expandHorizontal', render: TransitionRenderer.renderExpandHorizontal },
        { name: 'expandVertical', render: TransitionRenderer.renderExpandVertical },
        { name: 'zoomIn', render: TransitionRenderer.renderZoomIn },
        { name: 'zoomOut', render: TransitionRenderer.renderZoomOut },
        { name: 'zoomRotateIn', render: TransitionRenderer.renderZoomRotateIn },
        { name: 'zoomRotateOut', render: TransitionRenderer.renderZoomRotateOut },
        { name: 'radar', render: TransitionRenderer.renderRadar }
    ];

    static easingFunctions: NamedEasingFunction[] = [
        { name: 'easeLinear', ease: TransitionRenderer.easeLinear },
        { name: 'easeInQuad', ease: TransitionRenderer.easeInQuad },
        { name: 'easeOutQuad', ease: TransitionRenderer.easeOutQuad },
        { name: 'easeInOutQuad', ease: TransitionRenderer.easeInOutQuad },
        { name: 'easeInCubic', ease: TransitionRenderer.easeInCubic },
        { name: 'easeOutCubic', ease: TransitionRenderer.easeOutCubic },
        { name: 'easeInOutCubic', ease: TransitionRenderer.easeInOutCubic },
        { name: 'easeInQuart', ease: TransitionRenderer.easeInQuart },
        { name: 'easeOutQuart', ease: TransitionRenderer.easeOutQuart },
        { name: 'easeInOutQuart', ease: TransitionRenderer.easeInOutQuart },
        { name: 'easeInQuint', ease: TransitionRenderer.easeInQuint },
        { name: 'easeOutQuint', ease: TransitionRenderer.easeOutQuint },
        { name: 'easeInOutQuint', ease: TransitionRenderer.easeInOutQuint }
    ];

    static transitionSprite(
        controller: IController,
        sprite: SpriteElement,
        sourceFrame: number,
        targetFrame: number,
        transition: string
    ) {
        if (!sprite.c2) {
            sprite.c2 = document.createElement('canvas');
            sprite.c2.width = sprite.getSize().width;
            sprite.c2.height = sprite.getSize().height;
        }
        if (!sprite.c1) {
            sprite.c1 = document.createElement('canvas');
            sprite.c1.width = sprite.getSize().width;
            sprite.c1.height = sprite.getSize().height;
        }

        if (!sprite.c1index || sprite.c1index !== sourceFrame) {
            const c = sprite.c1.getContext('2d');
            const f = sprite.frames[sourceFrame];
            const r = sprite.model.resourceManager.get(f.source) as BitmapResource;
            c.clearRect(0, 0, sprite.getSize().width, sprite.getSize().height);
            c.drawImage(r.image, f.x, f.y, f.width, f.height, 0, 0, sprite.getSize().width, sprite.getSize().height);
            sprite.c1index = sourceFrame;
        }
        if (!sprite.c2index || sprite.c2index !== targetFrame) {
            const c = sprite.c2.getContext('2d');
            const f = sprite.frames[targetFrame];
            const r = sprite.model.resourceManager.get(f.source) as BitmapResource;
            c.clearRect(0, 0, sprite.getSize().width, sprite.getSize().height);
            c.drawImage(r.image, f.x, f.y, f.width, f.height, 0, 0, sprite.getSize().width, sprite.getSize().height);
            sprite.c2index = targetFrame;
        }
        sprite.transition = TransitionRenderer.getRenderFunction(transition);
        // sprite.transitionOffset = spriteState.offset;

        // Animate on timer
        if (sprite.timerHandle) {
            clearInterval(sprite.timerHandle);
        }
        let offset = 0;
        sprite.timerHandle = setInterval(function() {
            offset += 0.075;
            if (offset >= 1.0) {
                clearInterval(sprite.timerHandle);
                delete sprite.timerHandle;
                sprite.frameIndex = targetFrame;
                delete sprite.transition;
                delete sprite.transitionOffset;
                delete sprite.c1index;
                delete sprite.c2index;
                delete sprite.c2;
                delete sprite.c1;
                controller.draw();
            }
            else {
                sprite.transitionOffset = TransitionRenderer.getEasingFunction('easeInOutCubic')(offset);
                controller.draw();
            }
        }, 15);
    }

    static pushFrameTransition(c: IController, el: SpriteElement, command: string, trigger: string, parameters: any) {
        if (!el.frameStack) {
            el.frameStack = [];
        }
        el.frameStack.push(el.frameIndex);
        const ec: ElementCommand = ElementCommand.parse(command);
        const sourceFrame: number = el.frameIndex;
        const targetFrame: number = parseInt(ec.parameter, 10);
        TransitionRenderer.transitionSprite(c, el, sourceFrame, targetFrame, 'fade');
    }

    static popFrameTransition(c: IController, el: SpriteElement, command: string, trigger: string, parameters: any) {
        if (!el.frameStack) {
            return;
        }
        const sourceFrame: number = el.frameIndex;
        let targetFrame: number = sourceFrame;
        if (el.frameStack.length > 0) {
            targetFrame = el.frameStack.pop();
        }
        if (el.frameStack.length === 0) {
            delete el.frameStack;
        }
        TransitionRenderer.transitionSprite(c, el, sourceFrame, targetFrame, 'fade');
    }

    static spriteIncrementHandler(
        c: IController,
        el: SpriteElement,
        command: string,
        trigger: string,
        parameters: TimerParameters
    ) {
        const sprite = el;
        const time = parameters.elapsedTime;
        const spriteState = sprite.getStateForTime(time);
        if (sprite.frameIndex !== spriteState.frame1) {
            sprite.frameIndex = spriteState.frame1;
            c.invalidate();
        }
    }

    static renderNone(
        context: CanvasRenderingContext2D,
        c1: HTMLCanvasElement,
        c2: HTMLCanvasElement,
        offset: number,
        left: number,
        top: number,
        width: number,
        height: number
    ): void {
        context.drawImage(c1, left, top, width, height);
    }

    static renderFade(
        context: CanvasRenderingContext2D,
        c1: HTMLCanvasElement,
        c2: HTMLCanvasElement,
        offset: number,
        left: number,
        top: number,
        width: number,
        height: number
    ): void {
        context.globalAlpha = 1.0;
        context.drawImage(c1, left, top, width, height);
        context.globalAlpha = offset;
        context.drawImage(c2, left, top, width, height);
    }

    static renderPushLeft(
        context: CanvasRenderingContext2D,
        c1: HTMLCanvasElement,
        c2: HTMLCanvasElement,
        offset: number,
        left: number,
        top: number,
        width: number,
        height: number
    ): void {
        const offsetX = offset * width;
        context.drawImage(c2, left + width - offsetX, top);
        context.drawImage(c1, left - offsetX, top);
    }

    static renderPushRight(
        context: CanvasRenderingContext2D,
        c1: HTMLCanvasElement,
        c2: HTMLCanvasElement,
        offset: number,
        left: number,
        top: number,
        width: number,
        height: number
    ): void {
        const offsetX = offset * width;
        context.drawImage(c2, left - width + offsetX, top);
        context.drawImage(c1, left + offsetX, top);
    }

    static renderPushUp(
        context: CanvasRenderingContext2D,
        c1: HTMLCanvasElement,
        c2: HTMLCanvasElement,
        offset: number,
        left: number,
        top: number,
        width: number,
        height: number
    ): void {
        const offsetY = offset * height;
        context.drawImage(c2, left, top + height - offsetY);
        context.drawImage(c1, left, top - offsetY);
    }

    static renderPushDown(
        context: CanvasRenderingContext2D,
        c1: HTMLCanvasElement,
        c2: HTMLCanvasElement,
        offset: number,
        left: number,
        top: number,
        width: number,
        height: number
    ): void {
        const offsetY = offset * height;
        context.drawImage(c2, left, top - height + offsetY);
        context.drawImage(c1, left, top + offsetY);
    }

    static renderWipeLeft(
        context: CanvasRenderingContext2D,
        c1: HTMLCanvasElement,
        c2: HTMLCanvasElement,
        offset: number,
        left: number,
        top: number,
        width: number,
        height: number
    ): void {
        const offsetX = offset * width;
        context.drawImage(c1, left, top);
        if (offsetX >= 1) {
            context.drawImage(c2, width - offsetX, 0, offsetX, height, left + width - offsetX, top, offsetX, height);
        }
    }

    static renderWipeRight(
        context: CanvasRenderingContext2D,
        c1: HTMLCanvasElement,
        c2: HTMLCanvasElement,
        offset: number,
        left: number,
        top: number,
        width: number,
        height: number
    ): void {
        const offsetX = offset * width;
        context.drawImage(c1, left, top);
        if (offsetX >= 1) {
            context.drawImage(c2, 0, 0, offsetX, height, left, top, offsetX, height);
        }
    }

    static renderWipeUp(
        context: CanvasRenderingContext2D,
        c1: HTMLCanvasElement,
        c2: HTMLCanvasElement,
        offset: number,
        left: number,
        top: number,
        width: number,
        height: number
    ): void {
        const offsetY = offset * height;
        context.drawImage(c1, left, top);
        if (offsetY >= 1) {
            context.drawImage(c2, 0, height - offsetY, width, offsetY, left, top + height - offsetY, width, offsetY);
        }
    }

    static renderWipeDown(
        context: CanvasRenderingContext2D,
        c1: HTMLCanvasElement,
        c2: HTMLCanvasElement,
        offset: number,
        left: number,
        top: number,
        width: number,
        height: number
    ): void {
        const offsetY = offset * height;
        context.drawImage(c1, left, top);
        if (offsetY >= 1) {
            context.drawImage(c2, 0, 0, width, offsetY, left, top, width, offsetY);
        }
    }

    static renderSlideLeft(
        context: CanvasRenderingContext2D,
        c1: HTMLCanvasElement,
        c2: HTMLCanvasElement,
        offset: number,
        left: number,
        top: number,
        width: number,
        height: number
    ): void {
        const offsetX = offset * width;
        context.drawImage(c1, left, top);
        context.drawImage(c2, left + width - offsetX, top);
    }

    static renderSlideRight(
        context: CanvasRenderingContext2D,
        c1: HTMLCanvasElement,
        c2: HTMLCanvasElement,
        offset: number,
        left: number,
        top: number,
        width: number,
        height: number
    ): void {
        const offsetX = offset * width;
        context.drawImage(c1, left, top);
        context.drawImage(c2, left - width + offsetX, top);
    }

    static renderSlideUp(
        context: CanvasRenderingContext2D,
        c1: HTMLCanvasElement,
        c2: HTMLCanvasElement,
        offset: number,
        left: number,
        top: number,
        width: number,
        height: number
    ): void {
        const offsetY = offset * height;
        context.drawImage(c1, left, top);
        context.drawImage(c2, left, top + height - offsetY);
    }

    static renderSlideDown(
        context: CanvasRenderingContext2D,
        c1: HTMLCanvasElement,
        c2: HTMLCanvasElement,
        offset: number,
        left: number,
        top: number,
        width: number,
        height: number
    ): void {
        const offsetY = offset * height;
        context.drawImage(c1, left, top);
        context.drawImage(c2, left, top - height + offsetY);
    }

    static renderSlideLeftDown(
        context: CanvasRenderingContext2D,
        c1: HTMLCanvasElement,
        c2: HTMLCanvasElement,
        offset: number,
        left: number,
        top: number,
        width: number,
        height: number
    ): void {
        const offsetX = offset * width;
        const offsetY = offset * height;
        context.drawImage(c1, left, top);
        context.drawImage(c2, left + width - offsetX, top - height + offsetY);
    }

    static renderSlideRightDown(
        context: CanvasRenderingContext2D,
        c1: HTMLCanvasElement,
        c2: HTMLCanvasElement,
        offset: number,
        left: number,
        top: number,
        width: number,
        height: number
    ): void {
        const offsetX = offset * width;
        const offsetY = offset * height;
        context.drawImage(c1, left, top);
        context.drawImage(c2, left - width + offsetX, top - height + offsetY);
    }

    static renderSlideLeftUp(
        context: CanvasRenderingContext2D,
        c1: HTMLCanvasElement,
        c2: HTMLCanvasElement,
        offset: number,
        left: number,
        top: number,
        width: number,
        height: number
    ): void {
        const offsetX = offset * width;
        const offsetY = offset * height;
        context.drawImage(c1, left, top);
        context.drawImage(c2, left + width - offsetX, top + height - offsetY);
    }

    static renderSlideRightUp(
        context: CanvasRenderingContext2D,
        c1: HTMLCanvasElement,
        c2: HTMLCanvasElement,
        offset: number,
        left: number,
        top: number,
        width: number,
        height: number
    ): void {
        const offsetX = offset * width;
        const offsetY = offset * height;
        context.drawImage(c1, left, top);
        context.drawImage(c2, left - width + offsetX, top + height - offsetY);
    }

    static renderRevealLeft(
        context: CanvasRenderingContext2D,
        c1: HTMLCanvasElement,
        c2: HTMLCanvasElement,
        offset: number,
        left: number,
        top: number,
        width: number,
        height: number
    ): void {
        const offsetX = offset * width;
        context.drawImage(c2, left, top);
        context.drawImage(c1, left - offsetX, top);
    }

    static renderRevealRight(
        context: CanvasRenderingContext2D,
        c1: HTMLCanvasElement,
        c2: HTMLCanvasElement,
        offset: number,
        left: number,
        top: number,
        width: number,
        height: number
    ): void {
        const offsetX = offset * width;
        context.drawImage(c2, left, top);
        context.drawImage(c1, left + offsetX, top);
    }

    static renderRevealUp(
        context: CanvasRenderingContext2D,
        c1: HTMLCanvasElement,
        c2: HTMLCanvasElement,
        offset: number,
        left: number,
        top: number,
        width: number,
        height: number
    ): void {
        const offsetY = offset * height;
        context.drawImage(c2, left, top);
        context.drawImage(c1, left, top - offsetY);
    }

    static renderRevealDown(
        context: CanvasRenderingContext2D,
        c1: HTMLCanvasElement,
        c2: HTMLCanvasElement,
        offset: number,
        left: number,
        top: number,
        width: number,
        height: number
    ): void {
        const offsetY = offset * height;
        context.drawImage(c2, left, top);
        context.drawImage(c1, left, top + offsetY);
    }

    static renderRevealLeftDown(
        context: CanvasRenderingContext2D,
        c1: HTMLCanvasElement,
        c2: HTMLCanvasElement,
        offset: number,
        left: number,
        top: number,
        width: number,
        height: number
    ): void {
        const offsetX = offset * width;
        const offsetY = offset * height;
        context.drawImage(c2, left, top);
        context.drawImage(c1, left - offsetX, top + offsetY);
    }

    static renderRevealRightDown(
        context: CanvasRenderingContext2D,
        c1: HTMLCanvasElement,
        c2: HTMLCanvasElement,
        offset: number,
        left: number,
        top: number,
        width: number,
        height: number
    ): void {
        const offsetX = offset * width;
        const offsetY = offset * height;
        context.drawImage(c2, left, top);
        context.drawImage(c1, left + offsetX, top + offsetY);
    }

    static renderRevealLeftUp(
        context: CanvasRenderingContext2D,
        c1: HTMLCanvasElement,
        c2: HTMLCanvasElement,
        offset: number,
        left: number,
        top: number,
        width: number,
        height: number
    ): void {
        const offsetX = offset * width;
        const offsetY = offset * height;
        context.drawImage(c2, left, top);
        context.drawImage(c1, left - offsetX, top - offsetY);
    }

    static renderRevealRightUp(
        context: CanvasRenderingContext2D,
        c1: HTMLCanvasElement,
        c2: HTMLCanvasElement,
        offset: number,
        left: number,
        top: number,
        width: number,
        height: number
    ): void {
        const offsetX = offset * width;
        const offsetY = offset * height;
        context.drawImage(c2, left, top);
        context.drawImage(c1, left + offsetX, top - offsetY);
    }

    static renderEllipticalOut(
        context: CanvasRenderingContext2D,
        c1: HTMLCanvasElement,
        c2: HTMLCanvasElement,
        offset: number,
        left: number,
        top: number,
        width: number,
        height: number
    ): void {
        context.drawImage(c1, left, top);
        context.beginPath();
        const w = Math.round(width * offset);
        const h = Math.round(height * offset);
        const rw = w * 1.414;
        const rh = h * 1.414;
        const cx = left + width / 2;
        const cy = top + height / 2;
        let x, y, ox, oy, xe, ye, xm, ym;
        const kappa = 0.5522848;
        x = cx - rw / 2;
        y = cy - rh / 2;
        ox = rw / 2 * kappa; // control point offset horizontal
        oy = rh / 2 * kappa; // control point offset vertical
        xe = x + rw; // x-end
        ye = y + rh; // y-end
        xm = x + rw / 2; // x-middle
        ym = y + rh / 2; // y-middle
        context.moveTo(x, ym);
        context.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
        context.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
        context.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
        context.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
        context.clip();
        context.drawImage(c2, left, top);
    }

    static renderEllipticalIn(
        context: CanvasRenderingContext2D,
        c1: HTMLCanvasElement,
        c2: HTMLCanvasElement,
        offset: number,
        left: number,
        top: number,
        width: number,
        height: number
    ): void {
        context.drawImage(c2, left, top);
        context.beginPath();
        const w = Math.round(width * (1.0 - offset));
        const h = Math.round(height * (1.0 - offset));
        const rw = w * 1.414;
        const rh = h * 1.414;
        const cx = left + width / 2;
        const cy = top + height / 2;
        let x, y, ox, oy, xe, ye, xm, ym;
        const kappa = 0.5522848;
        x = cx - rw / 2;
        y = cy - rh / 2;
        ox = rw / 2 * kappa; // control point offset horizontal
        oy = rh / 2 * kappa; // control point offset vertical
        xe = x + rw; // x-end
        ye = y + rh; // y-end
        xm = x + rw / 2; // x-middle
        ym = y + rh / 2; // y-middle
        context.moveTo(x, ym);
        context.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
        context.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
        context.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
        context.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
        context.clip();
        context.drawImage(c1, left, top);
    }

    static renderRectangularIn(
        context: CanvasRenderingContext2D,
        c1: HTMLCanvasElement,
        c2: HTMLCanvasElement,
        offset: number,
        left: number,
        top: number,
        width: number,
        height: number
    ): void {
        context.drawImage(c2, left, top);
        context.beginPath();
        const rw = width / 2.0 * (1.0 - offset);
        const rh = height / 2.0 * (1.0 - offset);
        context.moveTo(left + width / 2 - rw, top + height / 2 - rh);
        context.lineTo(left + width / 2 + rw, top + height / 2 - rh);
        context.lineTo(left + width / 2 + rw, top + height / 2 + rh);
        context.lineTo(left + width / 2 - rw, top + height / 2 + rh);
        context.clip();
        context.drawImage(c1, left, top);
    }

    static renderRectangularOut(
        context: CanvasRenderingContext2D,
        c1: HTMLCanvasElement,
        c2: HTMLCanvasElement,
        offset: number,
        left: number,
        top: number,
        width: number,
        height: number
    ): void {
        context.drawImage(c1, left, top);
        context.beginPath();
        const rw = width / 2.0 * offset;
        const rh = height / 2.0 * offset;
        context.moveTo(left + width / 2 - rw, top + height / 2 - rh);
        context.lineTo(left + width / 2 + rw, top + height / 2 - rh);
        context.lineTo(left + width / 2 + rw, top + height / 2 + rh);
        context.lineTo(left + width / 2 - rw, top + height / 2 + rh);
        context.clip();
        context.drawImage(c2, left, top);
    }

    static renderGrid(
        context: CanvasRenderingContext2D,
        c1: HTMLCanvasElement,
        c2: HTMLCanvasElement,
        offset: number,
        left: number,
        top: number,
        width: number,
        height: number
    ): void {
        context.drawImage(c1, left, top);
        context.beginPath();
        const hdiv = 8;
        const vdiv = 6;
        const rw = width / (hdiv * 2) * offset;
        const rh = height / (vdiv * 2) * offset;
        const cx = width / hdiv;
        const cy = height / vdiv;
        let i, j, x, y;
        for (j = 0; j < vdiv; j++) {
            for (i = 0; i < hdiv; i++) {
                x = left + i * cx + cx / 2;
                y = top + j * cy + cy / 2;
                context.moveTo(x - rw, y - rh);
                context.lineTo(x + rw, y - rh);
                context.lineTo(x + rw, y + rh);
                context.lineTo(x - rw, y + rh);
            }
        }
        context.clip();
        context.drawImage(c2, left, top);
    }

    static renderExpandHorizontal(
        context: CanvasRenderingContext2D,
        c1: HTMLCanvasElement,
        c2: HTMLCanvasElement,
        offset: number,
        left: number,
        top: number,
        width: number,
        height: number
    ): void {
        context.drawImage(c1, left, top);
        const destinationWidth = width * offset;
        if (destinationWidth > 0) {
            context.drawImage(c2, left + (width - destinationWidth) / 2, top, destinationWidth, height);
        }
    }

    static renderExpandVertical(
        context: CanvasRenderingContext2D,
        c1: HTMLCanvasElement,
        c2: HTMLCanvasElement,
        offset: number,
        left: number,
        top: number,
        width: number,
        height: number
    ): void {
        context.drawImage(c1, left, top);
        const destinationHeight = height * offset;
        if (destinationHeight > 0) {
            context.drawImage(c2, left, top + (height - destinationHeight) / 2, width, destinationHeight);
        }
    }

    static renderZoomIn(
        context: CanvasRenderingContext2D,
        c1: HTMLCanvasElement,
        c2: HTMLCanvasElement,
        offset: number,
        left: number,
        top: number,
        width: number,
        height: number
    ): void {
        context.drawImage(c1, left, top);
        const destinationWidth = width * offset;
        const destinationHeight = height * offset;
        if (destinationHeight > 0) {
            context.drawImage(
                c2,
                left + (width - destinationWidth) / 2,
                top + (height - destinationHeight) / 2,
                destinationWidth,
                destinationHeight
            );
        }
    }

    static renderZoomOut(
        context: CanvasRenderingContext2D,
        c1: HTMLCanvasElement,
        c2: HTMLCanvasElement,
        offset: number,
        left: number,
        top: number,
        width: number,
        height: number
    ): void {
        context.drawImage(c2, left, top);
        const destinationWidth = width * (1 - offset);
        const destinationHeight = height * (1 - offset);
        if (destinationHeight > 0) {
            context.drawImage(
                c1,
                left + (width - destinationWidth) / 2,
                top + (height - destinationHeight) / 2,
                destinationWidth,
                destinationHeight
            );
        }
    }

    static renderZoomRotateIn(
        context: CanvasRenderingContext2D,
        c1: HTMLCanvasElement,
        c2: HTMLCanvasElement,
        offset: number,
        left: number,
        top: number,
        width: number,
        height: number
    ): void {
        context.drawImage(c1, left, top);
        const destinationWidth = width * offset;
        const destinationHeight = height * offset;
        const angle = offset * Math.PI * 2;
        if (destinationHeight > 0) {
            context.translate(left + width / 2, top + height / 2);
            context.rotate(angle);
            context.translate(-(left + width / 2), -(top + height / 2));
            context.drawImage(
                c2,
                left + (width - destinationWidth) / 2,
                top + (height - destinationHeight) / 2,
                destinationWidth,
                destinationHeight
            );
        }
    }

    static renderZoomRotateOut(
        context: CanvasRenderingContext2D,
        c1: HTMLCanvasElement,
        c2: HTMLCanvasElement,
        offset: number,
        left: number,
        top: number,
        width: number,
        height: number
    ): void {
        context.drawImage(c2, left, top);
        const destinationWidth = width * (1 - offset);
        const destinationHeight = height * (1 - offset);
        const angle = (1 - offset) * Math.PI * 2;
        if (destinationHeight > 0) {
            context.translate(left + width / 2, top + height / 2);
            context.rotate(angle);
            context.translate(-(left + width / 2), -(top + height / 2));
            context.drawImage(
                c1,
                left + (width - destinationWidth) / 2,
                top + (height - destinationHeight) / 2,
                destinationWidth,
                destinationHeight
            );
        }
    }

    static renderRadar(
        context: CanvasRenderingContext2D,
        c1: HTMLCanvasElement,
        c2: HTMLCanvasElement,
        offset: number,
        left: number,
        top: number,
        width: number,
        height: number
    ): void {
        context.drawImage(c1, left, top);
        context.beginPath();
        context.moveTo(left + width / 2, top + height / 2);
        let angle = 0;
        let x1, y1;
        for (angle = 0; angle <= Math.PI * 2; angle += 0.001) {
            x1 = left + Math.cos(angle * offset) * width;
            y1 = top + Math.sin(angle * offset) * height;
            context.lineTo(x1 + width / 2, y1 + height / 2);
        }
        context.closePath();
        context.clip();
        context.drawImage(c2, left, top);
    }

    //
    // Easing functions
    //

    // No easing, no acceleration
    static easeLinear(t: number) {
        return t;
    }

    // Accelaration from zero velocity
    static easeInQuad(t: number) {
        return t * t;
    }

    // Deceleration to zero velocity
    static easeOutQuad(t: number) {
        return t * (2 - t);
    }

    // Acceleration until halfway, then Deceleration
    static easeInOutQuad(t: number) {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }

    // Acceleration from zero velocity
    static easeInCubic(t: number) {
        return t * t * t;
    }

    // Deceleration to zero velocity
    static easeOutCubic(t: number) {
        return --t * t * t + 1;
    }

    // Acceleration until halfway, then deceleration
    static easeInOutCubic(t: number) {
        return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    }

    // Acceleration from zero velocity
    static easeInQuart(t: number) {
        return t * t * t * t;
    }

    // Deceleration to zero velocity
    static easeOutQuart(t: number) {
        return 1 - --t * t * t * t;
    }

    // Acceleration until halfway, then deceleration
    static easeInOutQuart(t: number) {
        return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t;
    }

    // Acceleration from zero velocity
    static easeInQuint(t: number) {
        return t * t * t * t * t;
    }

    // Deceleration to zero velocity
    static easeOutQuint(t: number) {
        return 1 + --t * t * t * t * t;
    }

    // Acceleration until halfway, then deceleration
    static easeInOutQuint(t: number) {
        return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t;
    }

    static getRenderFunction(name: string): TransitionRenderFunction {
        if (!name) {
            return this.renderNone;
        }
        for (let i = 0; i < TransitionRenderer.renderFunctions.length; i++) {
            if (this.renderFunctions[i].name.toLocaleLowerCase() === name.toLocaleLowerCase()) {
                return this.renderFunctions[i].render;
            }
        }
        return this.renderNone;
    }

    static getEasingFunction(name: string): EasingFunction {
        for (let i = 0; i < TransitionRenderer.easingFunctions.length; i++) {
            if (this.easingFunctions[i].name.toLocaleLowerCase() === name.toLocaleLowerCase()) {
                return this.easingFunctions[i].ease;
            }
        }
        return TransitionRenderer.easeLinear;
    }

    static renderTransition(
        name: string,
        context: CanvasRenderingContext2D,
        c1: HTMLCanvasElement,
        c2: HTMLCanvasElement,
        offset: number,
        left: number,
        top: number,
        width: number,
        height: number
    ): void {
        const renderFunction: TransitionRenderFunction = TransitionRenderer.getRenderFunction(name);
        renderFunction(context, c1, c2, offset, left, top, width, height);
    }

    //
    // Command Implementations
    //

    static spriteTransitionHandler = function(
        controller: IController,
        element: SpriteElement,
        command: string,
        trigger: string,
        parameters: any
    ) {
        const sprite = element;
        const time = parameters.elapsedTime;

        const spriteState = sprite.getStateForTime(time);

        // If no transition
        if (!spriteState.transition) {
            if (sprite.transition || sprite.frameIndex !== spriteState.frame1) {
                sprite.frameIndex = spriteState.frame1;
                delete sprite.transition;
                delete sprite.transitionOffset;
                delete sprite.c1index;
                delete sprite.c2index;
                delete sprite.c2;
                delete sprite.c1;
                controller.invalidate();
                if (sprite.onAdvance) {
                    controller.commandHandler.onElementCommandFired(
                        controller,
                        element,
                        sprite.onAdvance,
                        trigger,
                        parameters
                    );
                }
            }
        }
        else {
            // Transition active
            if (!sprite.c2) {
                sprite.c2 = document.createElement('canvas');
                sprite.c2.width = sprite.getSize().width;
                sprite.c2.height = sprite.getSize().height;
            }
            if (!sprite.c1) {
                sprite.c1 = document.createElement('canvas');
                sprite.c1.width = sprite.getSize().width;
                sprite.c1.height = sprite.getSize().height;
            }

            if (!sprite.c1index || sprite.c1index !== spriteState.frame1) {
                const c = sprite.c1.getContext('2d');
                const f = sprite.frames[spriteState.frame1];
                const r = sprite.model.resourceManager.get(f.source) as BitmapResource;
                c.clearRect(0, 0, sprite.getSize().width, sprite.getSize().height);
                c.drawImage(
                    r.image,
                    f.x,
                    f.y,
                    f.width,
                    f.height,
                    0,
                    0,
                    sprite.getSize().width,
                    sprite.getSize().height
                );
                sprite.c1index = spriteState.frame1;
            }
            if (!sprite.c2index || sprite.c2index !== spriteState.frame2) {
                const c = sprite.c2.getContext('2d');
                const f = sprite.frames[spriteState.frame2];
                const r = sprite.model.resourceManager.get(f.source) as BitmapResource;
                c.clearRect(0, 0, sprite.getSize().width, sprite.getSize().height);
                c.drawImage(
                    r.image,
                    f.x,
                    f.y,
                    f.width,
                    f.height,
                    0,
                    0,
                    sprite.getSize().width,
                    sprite.getSize().height
                );
                sprite.c2index = spriteState.frame2;
            }

            sprite.transition = TransitionRenderer.getRenderFunction(spriteState.transition);
            // sprite.transitionOffset = spriteState.offset;
            sprite.transitionOffset = TransitionRenderer.getEasingFunction('easeInOutCubic')(spriteState.offset);

            controller.invalidate();
        }
    };
}
