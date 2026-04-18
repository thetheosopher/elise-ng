import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DocsService, DocsPage } from '../../../../services/docs.service';
import { DocsPageNavComponent } from '../../docs-page-nav.component';
import { DocsCodeSampleComponent } from '../../docs-code-sample.component';

@Component({
    imports: [CommonModule, RouterModule, DocsPageNavComponent, DocsCodeSampleComponent],
    template: `
        <h1>Timer Callbacks</h1>
        <p class="lead">
            Timer callbacks provide frame-by-frame control over animation, enabling physics simulations, game loops,
            and complex choreography through model-level and per-element timer handlers.
        </p>

        <h2>Timer Properties</h2>
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
                    <td><code>controller.timer</code></td>
                    <td>event</td>
                    <td>Raised every animation frame with <code>(controller, params)</code> where
                        <code>params.elapsedTime</code> is total time and <code>params.tickDelta</code> is the frame delta</td>
                </tr>
                <tr>
                    <td><code>element.timer</code></td>
                    <td>string</td>
                    <td>Command tag string that enables per-element timer callbacks via the element command handler
                        system</td>
                </tr>
                <tr>
                    <td><code>controller.timerEnabled</code></td>
                    <td>boolean</td>
                    <td>Starts or stops the <code>requestAnimationFrame</code> loop that drives all animation</td>
                </tr>
            </tbody>
        </table>

        <h2>Model-Level Timer Handler</h2>
        <p>
            Register a frame callback from <code>model.controllerAttached</code> and use the controller's
            <code>timer</code> event. Use <code>params.tickDelta</code> to keep motion frame-rate independent.
        </p>
        <app-docs-code-sample [code]="modelTimerCode" [timerEnabled]="true" language="javascript" label="JavaScript"></app-docs-code-sample>

        <h2>Per-Element Timer Commands</h2>
        <p>
            Individual elements can participate in the timer loop by setting their <code>timer</code> property to a
            command tag string. In the model's <code>controllerAttached</code> event, attach an
            <code>ElementCommandHandler</code> and register a handler for that timer tag. The controller dispatches
            timer events to each element with a matching command tag.
        </p>
        <app-docs-code-sample [code]="elementTimerCode" [timerEnabled]="true" language="javascript" label="JavaScript"></app-docs-code-sample>

        <h2>Physics Simulation</h2>
        <p>
            Timer callbacks are ideal for physics simulations. Use elapsed time to integrate velocity and acceleration
            each frame. This example demonstrates a simple bouncing ball with gravity.
        </p>
        <app-docs-code-sample [code]="physicsCode" [timerEnabled]="true" language="javascript" label="JavaScript"></app-docs-code-sample>

        <app-docs-page-nav [previousPage]="previousPage" [nextPage]="nextPage"></app-docs-page-nav>
    `
})
export class TimerCallbacksPageComponent {
    previousPage: DocsPage | undefined;
    nextPage: DocsPage | undefined;

    modelTimerCode = `const m = elise.model(400, 300);

const centerX = 200;
const centerY = 150;
const radius = 80;

elise.ellipse(centerX, centerY, 4, 4)
    .setFill('#1e293b')
    .addTo(m);

const orbiter = elise.ellipse(centerX + radius, centerY, 16, 16)
    .setFill('#38bdf8')
    .addTo(m);

m.controllerAttached.add((_model, controller) => {
    controller.timer.add((_controller, params) => {
        const angle = params.elapsedTime;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;

        orbiter.setCenter(x + ',' + y);
        controller.invalidate();
    });
});`;

    elementTimerCode = `const m = elise.model(400, 300);

const spinner = elise.rectangle(160, 110, 80, 80)
    .setFill('Coral')
    .setTimer('spin')
    .addTo(m);

m.controllerAttached.add((_model, controller) => {
    const handler = new elise.ElementCommandHandler();
    let angle = 0;

    handler.attachController(controller);
    handler.addHandler('spin', (_controller, element, _command, _trigger, parameters) => {
        angle += (parameters ? parameters.tickDelta : 0) * 90;
        element.setRotation(angle);
        controller.invalidate();
    });
});`;

    physicsCode = `const m = elise.model(400, 300);

elise.line(0, 270, 400, 270)
    .setStroke('#475569,1')
    .addTo(m);

const ball = elise.ellipse(200, 40, 20, 20)
    .setFill('#f472b6')
    .addTo(m);

let y = 40;
let velocityY = 0;
const gravity = 400;
const bounceFactor = 0.75;
const groundY = 250;
const startY = 40;
const restartDelay = 0.7;
let settledTime = 0;

m.controllerAttached.add((_model, controller) => {
    controller.timer.add((_controller, params) => {
        if (velocityY === 0 && y >= groundY) {
            settledTime += params.tickDelta;

            if (settledTime >= restartDelay) {
                y = startY;
                velocityY = 0;
                settledTime = 0;
            }

            ball.setCenter('200,' + y);
            controller.invalidate();
            return;
        }

        velocityY += gravity * params.tickDelta;
        y += velocityY * params.tickDelta;

        if (y >= groundY) {
            y = groundY;
            velocityY = -velocityY * bounceFactor;

            if (Math.abs(velocityY) < 10) {
                velocityY = 0;
                settledTime = 0;
            }
        }

        ball.setCenter('200,' + y);
        controller.invalidate();
    });
});`;

    constructor(docsService: DocsService) {
        this.previousPage = docsService.getPreviousPage('animation', 'timer-callbacks');
        this.nextPage = docsService.getNextPage('animation', 'timer-callbacks');
    }
}
