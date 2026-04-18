import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DocsService, DocsPage } from '../../../../services/docs.service';
import { DocsPageNavComponent } from '../../docs-page-nav.component';
import { DocsCodeSampleComponent } from '../../docs-code-sample.component';

@Component({
    imports: [CommonModule, RouterModule, DocsPageNavComponent, DocsCodeSampleComponent],
    template: `
        <h1>Frame Transitions</h1>
        <p class="lead">
            A complete reference of sprite frame transition types. Elise includes 38 built-in transitions, organized by
            visual category — from simple fades and slides to shape reveals and zoom effects.
        </p>

        <h2>None</h2>
        <table class="docs-table">
            <thead>
                <tr>
                    <th>Transition</th>
                    <th>Description</th>
                </tr>
            </thead>
            <tbody>
                <tr><td><code>none</code></td><td>Immediate switch with no visual transition</td></tr>
            </tbody>
        </table>

        <h2>Fade</h2>
        <table class="docs-table">
            <thead>
                <tr>
                    <th>Transition</th>
                    <th>Description</th>
                </tr>
            </thead>
            <tbody>
                <tr><td><code>fade</code></td><td>Smooth crossfade blending the outgoing and incoming frames</td></tr>
            </tbody>
        </table>

        <h2>Push</h2>
        <p>The incoming frame pushes the outgoing frame off screen in the specified direction.</p>
        <table class="docs-table">
            <thead>
                <tr>
                    <th>Transition</th>
                    <th>Description</th>
                </tr>
            </thead>
            <tbody>
                <tr><td><code>pushLeft</code></td><td>Incoming frame pushes outgoing frame to the left</td></tr>
                <tr><td><code>pushRight</code></td><td>Incoming frame pushes outgoing frame to the right</td></tr>
                <tr><td><code>pushUp</code></td><td>Incoming frame pushes outgoing frame upward</td></tr>
                <tr><td><code>pushDown</code></td><td>Incoming frame pushes outgoing frame downward</td></tr>
            </tbody>
        </table>

        <h2>Slide</h2>
        <p>The incoming frame slides in over the outgoing frame from the specified direction or corner.</p>
        <table class="docs-table">
            <thead>
                <tr>
                    <th>Transition</th>
                    <th>Description</th>
                </tr>
            </thead>
            <tbody>
                <tr><td><code>slideLeft</code></td><td>Incoming frame slides in from the right</td></tr>
                <tr><td><code>slideRight</code></td><td>Incoming frame slides in from the left</td></tr>
                <tr><td><code>slideUp</code></td><td>Incoming frame slides in from below</td></tr>
                <tr><td><code>slideDown</code></td><td>Incoming frame slides in from above</td></tr>
                <tr><td><code>slideLeftUp</code></td><td>Incoming frame slides in from the lower-right corner</td></tr>
                <tr><td><code>slideRightUp</code></td><td>Incoming frame slides in from the lower-left corner</td></tr>
                <tr><td><code>slideLeftDown</code></td><td>Incoming frame slides in from the upper-right corner</td></tr>
                <tr><td><code>slideRightDown</code></td><td>Incoming frame slides in from the upper-left corner</td></tr>
            </tbody>
        </table>

        <h2>Wipe</h2>
        <p>A wipe edge sweeps across the frame, progressively revealing the incoming frame beneath.</p>
        <table class="docs-table">
            <thead>
                <tr>
                    <th>Transition</th>
                    <th>Description</th>
                </tr>
            </thead>
            <tbody>
                <tr><td><code>wipeLeft</code></td><td>Wipe edge moves from right to left</td></tr>
                <tr><td><code>wipeRight</code></td><td>Wipe edge moves from left to right</td></tr>
                <tr><td><code>wipeUp</code></td><td>Wipe edge moves from bottom to top</td></tr>
                <tr><td><code>wipeDown</code></td><td>Wipe edge moves from top to bottom</td></tr>
            </tbody>
        </table>

        <h2>Reveal</h2>
        <p>The outgoing frame slides away to reveal the incoming frame already in place. Available in cardinal and
            diagonal directions.</p>
        <table class="docs-table">
            <thead>
                <tr>
                    <th>Transition</th>
                    <th>Description</th>
                </tr>
            </thead>
            <tbody>
                <tr><td><code>revealLeft</code></td><td>Outgoing frame slides left to reveal incoming</td></tr>
                <tr><td><code>revealRight</code></td><td>Outgoing frame slides right to reveal incoming</td></tr>
                <tr><td><code>revealUp</code></td><td>Outgoing frame slides up to reveal incoming</td></tr>
                <tr><td><code>revealDown</code></td><td>Outgoing frame slides down to reveal incoming</td></tr>
                <tr><td><code>revealLeftUp</code></td><td>Outgoing frame slides to upper-left corner</td></tr>
                <tr><td><code>revealRightUp</code></td><td>Outgoing frame slides to upper-right corner</td></tr>
                <tr><td><code>revealLeftDown</code></td><td>Outgoing frame slides to lower-left corner</td></tr>
                <tr><td><code>revealRightDown</code></td><td>Outgoing frame slides to lower-right corner</td></tr>
            </tbody>
        </table>

        <h2>Shape</h2>
        <p>Geometric shapes expand or contract to reveal or conceal the incoming frame.</p>
        <table class="docs-table">
            <thead>
                <tr>
                    <th>Transition</th>
                    <th>Description</th>
                </tr>
            </thead>
            <tbody>
                <tr><td><code>ellipticalIn</code></td><td>Ellipse expands from center to reveal incoming frame</td></tr>
                <tr><td><code>ellipticalOut</code></td><td>Ellipse contracts to center, concealing outgoing frame</td></tr>
                <tr><td><code>rectangularIn</code></td><td>Rectangle expands from center to reveal incoming frame</td></tr>
                <tr><td><code>rectangularOut</code></td><td>Rectangle contracts to center, concealing outgoing frame</td></tr>
            </tbody>
        </table>

        <h2>Expand</h2>
        <p>The incoming frame expands from a thin strip along an axis.</p>
        <table class="docs-table">
            <thead>
                <tr>
                    <th>Transition</th>
                    <th>Description</th>
                </tr>
            </thead>
            <tbody>
                <tr><td><code>expandHorizontal</code></td><td>Incoming frame expands from a vertical center line outward</td></tr>
                <tr><td><code>expandVertical</code></td><td>Incoming frame expands from a horizontal center line outward</td></tr>
            </tbody>
        </table>

        <h2>Zoom</h2>
        <p>Scale-based transitions that zoom the incoming or outgoing frame.</p>
        <table class="docs-table">
            <thead>
                <tr>
                    <th>Transition</th>
                    <th>Description</th>
                </tr>
            </thead>
            <tbody>
                <tr><td><code>zoomIn</code></td><td>Incoming frame zooms in from a small point at center</td></tr>
                <tr><td><code>zoomOut</code></td><td>Outgoing frame zooms out while incoming appears behind</td></tr>
                <tr><td><code>zoomRotateIn</code></td><td>Incoming frame zooms and rotates in from center</td></tr>
                <tr><td><code>zoomRotateOut</code></td><td>Outgoing frame zooms and rotates out while incoming appears</td></tr>
            </tbody>
        </table>

        <h2>Special</h2>
        <table class="docs-table">
            <thead>
                <tr>
                    <th>Transition</th>
                    <th>Description</th>
                </tr>
            </thead>
            <tbody>
                <tr><td><code>radar</code></td><td>Radial sweep like a radar beam reveals the incoming frame</td></tr>
                <tr><td><code>grid</code></td><td>Grid cells flip individually to reveal the incoming frame in a mosaic pattern</td></tr>
            </tbody>
        </table>

        <h2>Example: Transitions in Action</h2>
        <p>
            This sprite cycles through frames using a variety of transition types to demonstrate the visual
            differences.
        </p>
        <app-docs-code-sample [code]="exampleCode" [timerEnabled]="true" language="javascript" label="JavaScript"></app-docs-code-sample>

        <app-docs-page-nav [previousPage]="previousPage" [nextPage]="nextPage"></app-docs-page-nav>
    `
})
export class FrameTransitionsPageComponent {
    previousPage: DocsPage | undefined;
    nextPage: DocsPage | undefined;

    exampleCode = `const m = elise.model(320, 240);
const transitions = [
    'none',
    'fade',
    'pushLeft',
    'slideRightUp',
    'wipeDown',
    'revealLeftDown',
    'ellipticalIn',
    'zoomRotateIn',
    'grid'
];

for (const name of transitions) {
    elise.bitmapResource(name, '/assets/resources/transitions/400x300/' + name + '.jpg').addTo(m);
}

const frames = transitions.map((name, index) =>
    elise.spriteFrame(name, 0, 0, 400, 300, 0.55, index === 0 ? 'none' : name, 0.45)
);

const sprite = elise.sprite(0, 0, 320, 240)
    .setFrames(frames)
    .setLoop(true)
    .setTimer(elise.TransitionRenderer.SPRITE_TRANSITION)
    .addTo(m);

m.controllerAttached.add((_model, controller) => {
    const handler = new elise.ElementCommandHandler();
    handler.attachController(controller);
    handler.addHandler(
        elise.TransitionRenderer.SPRITE_TRANSITION,
        elise.TransitionRenderer.spriteTransitionHandler
    );
});`;

    constructor(docsService: DocsService) {
        this.previousPage = docsService.getPreviousPage('animation', 'frame-transitions');
        this.nextPage = docsService.getNextPage('animation', 'frame-transitions');
    }
}
