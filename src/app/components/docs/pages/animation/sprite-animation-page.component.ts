import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DocsService, DocsPage } from '../../../../services/docs.service';
import { DocsPageNavComponent } from '../../docs-page-nav.component';
import { DocsCodeSampleComponent } from '../../docs-code-sample.component';

@Component({
    imports: [CommonModule, RouterModule, DocsPageNavComponent, DocsCodeSampleComponent],
    template: `
        <h1>Sprite Animation</h1>
        <p class="lead">
            Sprite animation plays a sequence of bitmap frames with configurable durations and transitions between
            them, driven automatically by the animation controller's timer loop.
        </p>

        <h2>How Sprite Animation Works</h2>
        <p>
            A <code>SpriteElement</code> contains an array of frames, each referencing a bitmap resource. When the
            animation controller's timer is enabled, the sprite automatically advances through its frame sequence.
            Each frame specifies how long it displays and an optional transition effect used when switching to it.
        </p>

        <h2>Sprite Properties</h2>
        <table class="docs-table">
            <thead>
                <tr>
                    <th>Property</th>
                    <th>Type</th>
                    <th>Description</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><code>frames</code></td>
                    <td>SpriteFrame[]</td>
                    <td>Array of frames defining the animation sequence</td>
                </tr>
                <tr>
                    <td><code>frameIndex</code></td>
                    <td>number</td>
                    <td>Current frame index — can be read or set programmatically</td>
                </tr>
                <tr>
                    <td><code>loop</code></td>
                    <td>boolean</td>
                    <td>Whether the animation loops back to the first frame after the last</td>
                </tr>
                <tr>
                    <td><code>timelineLength</code></td>
                    <td>number</td>
                    <td>Total duration of all frames in seconds (read-only computed value)</td>
                </tr>
            </tbody>
        </table>

        <h2>SpriteFrame Properties</h2>
        <table class="docs-table">
            <thead>
                <tr>
                    <th>Property</th>
                    <th>Type</th>
                    <th>Description</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><code>source</code></td>
                    <td>string</td>
                    <td>Resource key referencing a bitmap image in the model's resource collection</td>
                </tr>
                <tr>
                    <td><code>duration</code></td>
                    <td>number</td>
                    <td>How long this frame displays in seconds</td>
                </tr>
                <tr>
                    <td><code>transition</code></td>
                    <td>string</td>
                    <td>Transition type used when entering this frame (e.g., <code>'fade'</code>,
                        <code>'pushLeft'</code>)</td>
                </tr>
            </tbody>
        </table>

        <h2>Basic Frame Sequence</h2>
        <p>
            Define a sprite with a series of frames. Each frame references a resource key and specifies a display
            duration in seconds.
        </p>
        <app-docs-code-sample [code]="basicFramesCode" [timerEnabled]="true" language="javascript" label="JavaScript"></app-docs-code-sample>

        <h2>Frames with Transitions</h2>
        <p>
            Add transition effects between frames for polished visual changes. Transitions are applied when entering
            a frame, smoothly blending from the previous frame's image.
        </p>
        <app-docs-code-sample [code]="transitionsCode" [timerEnabled]="true" language="javascript" label="JavaScript"></app-docs-code-sample>

        <h2>Programmatic Frame Control</h2>
        <p>
            Read or set the <code>frameIndex</code> property to jump to a specific frame. This is useful for
            interactive slideshows or event-driven frame changes.
        </p>
        <app-docs-code-sample [code]="controlledCode" language="javascript" label="JavaScript"></app-docs-code-sample>

        <app-docs-page-nav [previousPage]="previousPage" [nextPage]="nextPage"></app-docs-page-nav>
    `
})
export class SpriteAnimationPageComponent {
    previousPage: DocsPage | undefined;
    nextPage: DocsPage | undefined;

    basicFramesCode = `const m = elise.model(240, 190);
elise.bitmapResource('santa', '/assets/resources/sprites/santa.png').addTo(m);

const sprite = elise.sprite(45, 20, 150, 150)
    .setFrames([
        elise.spriteFrame('santa', 0, 0, 150, 150, 0.22, 'none', 0),
        elise.spriteFrame('santa', 150, 0, 150, 150, 0.22, 'none', 0),
        elise.spriteFrame('santa', 300, 0, 150, 150, 0.22, 'none', 0),
        elise.spriteFrame('santa', 450, 0, 150, 150, 0.22, 'none', 0)
    ])
    .setLoop(true)
    .setTimer('basicTick')
    .addTo(m);

m.controllerAttached.add((_model, controller) => {
    const handler = new elise.ElementCommandHandler();
    handler.attachController(controller);
    handler.addHandler('basicTick', (_controller, element, command, trigger, parameters) => {
        elise.TransitionRenderer.spriteTransitionHandler(_controller, element, command, trigger, parameters);
    });
});`;

    transitionsCode = `const m = elise.model(240, 190);
elise.bitmapResource('explosion', '/assets/resources/sprites/explosion.png').addTo(m);

const sprite = elise.sprite(56, 31, 128, 128)
    .setFrames([
        elise.spriteFrame('explosion', 0, 0, 64, 64, 0.28, 'none', 0),
        elise.spriteFrame('explosion', 64, 0, 64, 64, 0.28, 'fade', 0.05),
        elise.spriteFrame('explosion', 128, 64, 64, 64, 0.28, 'pushLeft', 0.05),
        elise.spriteFrame('explosion', 192, 128, 64, 64, 0.28, 'zoomIn', 0.05),
        elise.spriteFrame('explosion', 128, 192, 64, 64, 0.28, 'grid', 0.05)
    ])
    .setLoop(true)
    .setTimer('transitionTick')
    .addTo(m);

m.controllerAttached.add((_model, controller) => {
    const handler = new elise.ElementCommandHandler();
    handler.attachController(controller);
    handler.addHandler('transitionTick', (_controller, element, command, trigger, parameters) => {
        elise.TransitionRenderer.spriteTransitionHandler(_controller, element, command, trigger, parameters);
    });
});`;

    controlledCode = `const m = elise.model(260, 210);
elise.bitmapResource('explosion', '/assets/resources/sprites/explosion.png').addTo(m);

const sprite = elise.sprite(66, 24, 128, 128)
    .setFrames([
        elise.spriteFrame('explosion', 0, 0, 64, 64, 999, 'fade', 0.06),
        elise.spriteFrame('explosion', 64, 0, 64, 64, 999, 'fade', 0.06),
        elise.spriteFrame('explosion', 128, 64, 64, 64, 999, 'fade', 0.06),
        elise.spriteFrame('explosion', 192, 128, 64, 64, 999, 'fade', 0.06),
        elise.spriteFrame('explosion', 128, 192, 64, 64, 999, 'fade', 0.06)
    ])
    .addTo(m);

const prevBtn = elise.rectangle(28, 176, 78, 24)
    .setFill('DodgerBlue')
    .setInteractive(true)
    .addTo(m);
prevBtn.click = 'prevSlide';

const nextBtn = elise.rectangle(154, 176, 78, 24)
    .setFill('DodgerBlue')
    .setInteractive(true)
    .addTo(m);
nextBtn.click = 'nextSlide';

elise.text('Prev', 49, 179, 40, 18)
    .setFill('White')
    .setInteractive(false)
    .addTo(m);

elise.text('Next', 175, 179, 40, 18)
    .setFill('White')
    .setInteractive(false)
    .addTo(m);

m.controllerAttached.add((_model, controller) => {
    const handler = new elise.ElementCommandHandler();
    handler.attachController(controller);

    handler.addHandler('nextSlide', (_controller) => {
        let idx = sprite.frameIndex + 1;
        if (!sprite.frames || idx >= sprite.frames.length) {
            idx = 0;
        }
        sprite.setFrameIndex(idx);
        controller.invalidate();
    });

    handler.addHandler('prevSlide', (_controller) => {
        let idx = sprite.frameIndex - 1;
        if (!sprite.frames || idx < 0) {
            idx = sprite.frames ? sprite.frames.length - 1 : 0;
        }
        sprite.setFrameIndex(idx);
        controller.invalidate();
    });
});`;

    constructor(docsService: DocsService) {
        this.previousPage = docsService.getPreviousPage('animation', 'sprite-animation');
        this.nextPage = docsService.getNextPage('animation', 'sprite-animation');
    }
}
