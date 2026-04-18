import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DocsService, DocsPage } from '../../../../services/docs.service';
import { DocsPageNavComponent } from '../../docs-page-nav.component';
import { DocsSurfaceSampleComponent } from '../../docs-surface-sample.component';

@Component({
    imports: [CommonModule, RouterModule, DocsPageNavComponent, DocsSurfaceSampleComponent],
    template: `
        <h1>Animation Layers</h1>
        <p class="lead">
            SurfaceAnimationLayer renders timed bitmap frames inside a surface rectangle. Use it for
            transition reels, looping motion panels, or interactive animated regions that sit beside
            normal surface elements.
        </p>

        <h2>Properties</h2>
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
                    <td><code>SurfaceAnimationFrame[]</code></td>
                    <td>Ordered list of animation frames added with <code>addFrame(...)</code></td>
                </tr>
                <tr>
                    <td><code>loop</code></td>
                    <td>boolean</td>
                    <td>If true, the sequence restarts after the last frame</td>
                </tr>
                <tr>
                    <td><code>initialIndex</code></td>
                    <td>number</td>
                    <td>Starting frame index for the animation</td>
                </tr>
                <tr>
                    <td><code>frameIndex</code></td>
                    <td>number</td>
                    <td>Current frame index reported as the animation advances</td>
                </tr>
                <tr>
                    <td><code>clicked</code> / <code>frameAdvanced</code></td>
                    <td>event</td>
                    <td>Callbacks raised for click interaction and frame advancement</td>
                </tr>
            </tbody>
        </table>

        <h2>How It Works</h2>
        <p>
            A surface animation layer builds an internal sprite from the frames you add. Each frame
            references an image source, crop rectangle, duration, and an optional transition. The
            surface timer must be running for the animation to advance, which is why the live preview
            samples enable <code>timerEnabled</code>.
        </p>

        <h2>Frame Construction</h2>
        <table class="docs-table">
            <thead>
                <tr>
                    <th>Argument</th>
                    <th>Description</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><code>source</code></td>
                    <td>Bitmap URI for the frame image</td>
                </tr>
                <tr>
                    <td><code>left, top, width, height</code></td>
                    <td>Crop rectangle inside the source image</td>
                </tr>
                <tr>
                    <td><code>duration</code></td>
                    <td>How long the frame is shown before advancing</td>
                </tr>
                <tr>
                    <td><code>transition</code> and <code>transitionDuration</code></td>
                    <td>Visual transition used while moving to the next frame</td>
                </tr>
            </tbody>
        </table>

        <h2>Transition Reel</h2>
        <p>
            This sample plays a full-surface slideshow using the local transition gallery images.
            It loops continuously so you can see the frame sequencing and transition timing.
        </p>
        <app-docs-surface-sample [code]="basicCode" [timerEnabled]="true" language="javascript" label="JavaScript"></app-docs-surface-sample>

        <h2>Inset Animation Card</h2>
        <p>
            Animation layers do not need to occupy the full surface. This sample places a smaller
            looping animation panel inside a dashboard-style layout, and clicking the animation toggles
            pause and resume.
        </p>
        <app-docs-surface-sample [code]="interactiveCode" [timerEnabled]="true" language="javascript" label="JavaScript"></app-docs-surface-sample>

        <app-docs-page-nav [previousPage]="previousPage" [nextPage]="nextPage"></app-docs-page-nav>
    `
})
export class SurfaceAnimationLayerPageComponent {
    previousPage: DocsPage | undefined;
    nextPage: DocsPage | undefined;

    basicCode = `const surface = new elise.Surface(400, 300);
surface.backgroundColor = '#020617';

const animation = elise.SurfaceAnimationLayer.create(
    'transition-reel',
    0,
    0,
    400,
    300,
    true,
    () => undefined,
    0,
    () => undefined
).addTo(surface);

animation.addFrame('fade', '/assets/resources/transitions/400x300/fade.jpg', 0, 0, 400, 300, 0.55, 'fade', 0.45, false);
animation.addFrame('grid', '/assets/resources/transitions/400x300/grid.jpg', 0, 0, 400, 300, 0.55, 'grid', 0.6, false);
animation.addFrame('slide', '/assets/resources/transitions/400x300/slideRight.jpg', 0, 0, 400, 300, 0.55, 'slideRight', 0.5, false);
animation.addFrame('zoom', '/assets/resources/transitions/400x300/zoomIn.jpg', 0, 0, 400, 300, 0.55, 'zoomIn', 0.5, false);

const title = elise.SurfaceTextElement.create(
    'title',
    92,
    16,
    216,
    24,
    'SurfaceAnimationLayer',
    () => undefined
).addTo(surface);
title.color = 'White';
title.typeFace = 'sans-serif';
title.typeSize = 16;
title.textAlignment = 'center,middle';
title.background = 'rgba(2,6,23,0.72)';
title.padding = 4;

return surface;`;

    interactiveCode = `const surface = new elise.Surface(320, 220);
surface.backgroundColor = '#0f172a';

const heading = elise.SurfaceTextElement.create(
    'heading',
    18,
    16,
    284,
    24,
    'Inset animation panel',
    () => undefined
).addTo(surface);
heading.color = 'White';
heading.typeFace = 'sans-serif';
heading.typeSize = 15;
heading.textAlignment = 'center,middle';
heading.background = 'rgba(15,23,42,0.68)';

const animation = elise.SurfaceAnimationLayer.create(
    'dashboard-anim',
    18,
    52,
    180,
    120,
    true,
    anim => anim && anim.pause(),
    0,
    () => undefined
).addTo(surface);

animation.addFrame('wipe-left', '/assets/resources/transitions/400x300/wipeLeft.jpg', 0, 0, 400, 300, 0.6, 'wipeLeft', 0.45, false);
animation.addFrame('push-up', '/assets/resources/transitions/400x300/pushUp.jpg', 0, 0, 400, 300, 0.6, 'pushUp', 0.45, false);
animation.addFrame('reveal-down', '/assets/resources/transitions/400x300/revealDown.jpg', 0, 0, 400, 300, 0.6, 'revealDown', 0.45, false);

const note = elise.SurfaceTextElement.create(
    'note',
    212,
    60,
    90,
    64,
    'Animation layers can be smaller panels inside a larger surface.',
    () => undefined
).addTo(surface);
note.color = '#e2e8f0';
note.typeFace = 'sans-serif';
note.typeSize = 11;
note.textAlignment = 'center,middle';
note.background = 'rgba(15,23,42,0.6)';
note.padding = 6;

const badge = elise.SurfaceTextElement.create(
    'badge',
    64,
    182,
    188,
    20,
    'Click the animation to pause or resume',
    () => undefined
).addTo(surface);
badge.color = '#082f49';
badge.typeFace = 'sans-serif';
badge.typeSize = 10;
badge.textAlignment = 'center,middle';
badge.background = '#bae6fd';
badge.padding = 3;

return surface;`;

    constructor(docsService: DocsService) {
        this.previousPage = docsService.getPreviousPage('surface', 'surface-animation-layer');
        this.nextPage = docsService.getNextPage('surface', 'surface-animation-layer');
    }
}
