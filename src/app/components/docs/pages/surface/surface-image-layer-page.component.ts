import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DocsService, DocsPage } from '../../../../services/docs.service';
import { DocsPageNavComponent } from '../../docs-page-nav.component';
import { DocsSurfaceSampleComponent } from '../../docs-surface-sample.component';

@Component({
    imports: [CommonModule, RouterModule, DocsPageNavComponent, DocsSurfaceSampleComponent],
    template: `
        <h1>Image Layers</h1>
        <p class="lead">
            SurfaceImageLayer renders an image into a positioned rectangle on a surface. Use image
            layers for full-surface backgrounds, gallery cards, and decorative media blocks behind
            interactive overlays.
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
                    <td><code>source</code></td>
                    <td>string</td>
                    <td>Image URL used for the underlying HTML <code>img</code> element</td>
                </tr>
                <tr>
                    <td><code>opacity</code></td>
                    <td>number</td>
                    <td>Layer opacity multiplier, configurable with <code>setOpacity()</code></td>
                </tr>
                <tr>
                    <td><code>translateX</code></td>
                    <td>number</td>
                    <td>Horizontal offset applied after the layer is positioned</td>
                </tr>
                <tr>
                    <td><code>translateY</code></td>
                    <td>number</td>
                    <td>Vertical offset applied after the layer is positioned</td>
                </tr>
                <tr>
                    <td><code>click listener</code></td>
                    <td>function</td>
                    <td>Optional callback raised when the user clicks the image layer</td>
                </tr>
            </tbody>
        </table>

        <h2>Layout Behavior</h2>
        <p>
            The current <code>SurfaceImageLayer</code> API does not use fill modes. Instead, the
            image is rendered at the layer's <code>left</code>, <code>top</code>,
            <code>width</code>, and <code>height</code>. In practice, that means you control the
            presentation by choosing the rectangle the layer should occupy.
        </p>
        <p>
            Image layers are positioned DOM elements, so they visually sit above the canvas-backed
            surface model in the same region. If you need text or vector elements to appear beneath
            a full-surface background, use the surface's built-in background image support instead.
        </p>
        <table class="docs-table">
            <thead>
                <tr>
                    <th>Pattern</th>
                    <th>How To Use It</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><code>0, 0, surface.width, surface.height</code></td>
                    <td>Use the full surface area for a background or hero image</td>
                </tr>
                <tr>
                    <td><code>x, y, cardWidth, cardHeight</code></td>
                    <td>Use smaller rectangles for gallery tiles, thumbnails, or callout art</td>
                </tr>
                <tr>
                    <td><code>setOpacity()</code> and <code>setTranslateX/Y()</code></td>
                    <td>Adjust emphasis or nudge decorative layers without rebuilding the surface</td>
                </tr>
            </tbody>
        </table>

        <h2>Background Image Layer</h2>
        <p>
            This example uses a large image layer as the hero media panel, then keeps the caption
            in the canvas area below it so both remain visible.
        </p>
        <app-docs-surface-sample [code]="basicCode" language="javascript" label="JavaScript"></app-docs-surface-sample>

        <h2>Layered Gallery Cards</h2>
        <p>
            Image layers also work well as fixed-position media cards. This sample mixes multiple
            images, opacity, and slight translation offsets inside one surface.
        </p>
        <app-docs-surface-sample [code]="galleryCode" language="javascript" label="JavaScript"></app-docs-surface-sample>

        <app-docs-page-nav [previousPage]="previousPage" [nextPage]="nextPage"></app-docs-page-nav>
    `
})
export class SurfaceImageLayerPageComponent {
    previousPage: DocsPage | undefined;
    nextPage: DocsPage | undefined;

    basicCode = `const surface = new elise.Surface(320, 220);
surface.backgroundColor = '#e2e8f0';

const hero = elise.SurfaceImageLayer.create(
    'hero',
    18,
    16,
    284,
    132,
    '/assets/test/images/clouds.jpg',
    () => undefined
).addTo(surface);
hero.setOpacity(0.96);

const caption = elise.SurfaceTextElement.create(
    'caption',
    24,
    164,
    272,
    34,
    'SurfaceImageLayer places media in a fixed DOM-backed region.',
    () => undefined
).addTo(surface);
caption.color = '#0f172a';
caption.typeFace = 'sans-serif';
caption.typeSize = 12;
caption.textAlignment = 'center,middle';
caption.background = 'rgba(255,255,255,0.88)';
caption.border = '#cbd5e1,1';
caption.padding = 8;

const badge = elise.SurfaceTextElement.create(
    'badge',
    92,
    202,
    136,
    14,
    'Hero image layer',
    () => undefined
).addTo(surface);
badge.color = '#082f49';
badge.typeFace = 'sans-serif';
badge.typeSize = 11;
badge.textAlignment = 'center,middle';
badge.background = '#bae6fd';
badge.padding = 4;

return surface;`;

    galleryCode = `const surface = new elise.Surface(320, 220);
surface.backgroundColor = '#0f172a';

const hero = elise.SurfaceImageLayer.create(
    'hero',
    16,
    18,
    190,
    110,
    '/assets/test/images/texture2.jpg',
    () => undefined
).addTo(surface);
hero.setOpacity(0.94);

const accent = elise.SurfaceImageLayer.create(
    'accent',
    222,
    18,
    82,
    82,
    '/assets/test/images/bulb.png',
    () => undefined
).addTo(surface);
accent.setTranslateY(6);

elise.SurfaceImageLayer.create(
    'thumb-1',
    16,
    146,
    88,
    56,
    '/assets/resources/transitions/400x300/fade.jpg',
    () => undefined
).addTo(surface);

elise.SurfaceImageLayer.create(
    'thumb-2',
    116,
    146,
    88,
    56,
    '/assets/resources/transitions/400x300/grid.jpg',
    () => undefined
).addTo(surface);

elise.SurfaceImageLayer.create(
    'thumb-3',
    216,
    146,
    88,
    56,
    '/assets/resources/transitions/400x300/slideRight.jpg',
    () => undefined
).addTo(surface);

const caption = elise.SurfaceTextElement.create(
    'caption',
    222,
    112,
    82,
    22,
    'Offset layer',
    () => undefined
).addTo(surface);
caption.color = '#e2e8f0';
caption.typeFace = 'sans-serif';
caption.typeSize = 10;
caption.textAlignment = 'center,middle';

const footer = elise.SurfaceTextElement.create(
    'footer',
    16,
    118,
    190,
    18,
    'Gallery cards are just additional image layers with their own rectangles.',
    () => undefined
).addTo(surface);
footer.color = '#cbd5e1';
footer.typeFace = 'sans-serif';
footer.typeSize = 9;
footer.textAlignment = 'left,middle';

return surface;`;

    constructor(docsService: DocsService) {
        this.previousPage = docsService.getPreviousPage('surface', 'surface-image-layer');
        this.nextPage = docsService.getNextPage('surface', 'surface-image-layer');
    }
}
