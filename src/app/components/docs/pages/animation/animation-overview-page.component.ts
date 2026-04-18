import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DocsService, DocsPage } from '../../../../services/docs.service';
import { DocsPageNavComponent } from '../../docs-page-nav.component';
import { CodeBlockComponent } from '../../../code-block/code-block.component';

@Component({
    imports: [CommonModule, RouterModule, DocsPageNavComponent, CodeBlockComponent],
    template: `
        <h1>Animation Overview</h1>
        <p class="lead">
            Elise provides three complementary animation approaches — property tweens, timer callbacks, and sprite
            animation — all driven by a unified animation controller.
        </p>

        <h2>Animation Controller</h2>
        <p>
            All animation in Elise is driven by the <code>ViewController</code>. When <code>timerEnabled</code> is set
            to <code>true</code>, the controller starts a <code>requestAnimationFrame</code> loop that drives tweens,
            fires timer callbacks, and advances sprite frames each tick.
        </p>

        <h2>Three Animation Approaches</h2>
        <table class="docs-table">
            <thead>
                <tr>
                    <th>Approach</th>
                    <th>Mechanism</th>
                    <th>Best For</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><strong>Property Tweens</strong></td>
                    <td>Smooth interpolation of element properties from current to target values over a duration</td>
                    <td>UI transitions, entrance/exit effects, hover animations</td>
                </tr>
                <tr>
                    <td><strong>Timer Callbacks</strong></td>
                    <td>Frame-by-frame scripted animation via <code>controller.timer</code> or per-element
                        <code>timer</code> command tags</td>
                    <td>Physics simulations, game loops, complex choreography</td>
                </tr>
                <tr>
                    <td><strong>Sprite Animation</strong></td>
                    <td>Frame sequence playback with configurable transitions between frames</td>
                    <td>Slideshows, character animations, image sequences</td>
                </tr>
            </tbody>
        </table>

        <h2>Enabling Animation</h2>
        <p>
            To start the animation loop, set <code>timerEnabled</code> on the controller. Register a callback on
            <code>controller.timer</code> to run logic every frame.
        </p>
        <app-code-block [code]="basicExample" language="javascript" label="JavaScript"></app-code-block>

        <h2>Model Timer Handler</h2>
        <p>
            The controller's <code>timer</code> event provides elapsed animation time and per-frame delta values.
            Use <code>params.tickDelta</code> when you want frame-rate independent motion.
        </p>
        <app-code-block [code]="timerHandlerExample" language="javascript" label="JavaScript"></app-code-block>

        <h2>Per-Element Timers</h2>
        <p>
            Individual elements can participate in the timer loop by setting a <code>timer</code> property to a command
            tag string. When the model's <code>controllerAttached</code> handler registers element command handlers,
            the controller dispatches timer events to matching elements each frame.
        </p>

        <h2>Combining Approaches</h2>
        <p>
            The three approaches can be freely combined in a single model. For example, a timer callback can trigger
            property tweens, or a sprite animation can run alongside scripted element movement. The animation
            controller processes all active animations each frame in a single render pass.
        </p>

        <app-docs-page-nav [previousPage]="previousPage" [nextPage]="nextPage"></app-docs-page-nav>
    `
})
export class AnimationOverviewPageComponent {
    previousPage: DocsPage | undefined;
    nextPage: DocsPage | undefined;

    basicExample = `const model = elise.model(400, 300);

const circle = elise.ellipse(120, 150, 40, 40)
    .setFill('SteelBlue')
    .addTo(model);

model.controllerAttached.add((_model, controller) => {
    controller.timer.add((_controller, params) => {
        const x = 200 + Math.cos(params.elapsedTime * 1.5) * 80;
        circle.setCenter(x + ',150');
        controller.invalidate();
    });
});`;

    timerHandlerExample = `model.controllerAttached.add((_model, controller) => {
    controller.timer.add((_controller, params) => {
        const el = model.getElement(0);

        // Move the element to the right at 60 pixels per second
        el.translate(60 * params.tickDelta, 0);

        // Wrap around when off screen
        const bounds = el.getBounds();
        if (bounds && bounds.x > model.width) {
            el.translate(-model.width - bounds.width, 0);
        }

        controller.invalidate();
    });
});`;

    constructor(docsService: DocsService) {
        this.previousPage = docsService.getPreviousPage('animation', 'animation-overview');
        this.nextPage = docsService.getNextPage('animation', 'animation-overview');
    }
}
