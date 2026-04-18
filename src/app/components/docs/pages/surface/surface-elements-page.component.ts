import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DocsService, DocsPage } from '../../../../services/docs.service';
import { DocsPageNavComponent } from '../../docs-page-nav.component';
import { DocsSurfaceSampleComponent } from '../../docs-surface-sample.component';

@Component({
    imports: [CommonModule, RouterModule, DocsPageNavComponent, DocsSurfaceSampleComponent],
    template: `
        <h1>Surface Elements</h1>
        <p class="lead">
            Surface elements are interactive overlays positioned on top of layers. They provide
            text labels, clickable buttons, and radio selectors for navigation and user interaction.
        </p>

        <h2>Element Types</h2>
        <table class="docs-table">
            <thead>
                <tr>
                    <th>Type</th>
                    <th>Description</th>
                    <th>Key Properties</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><code>SurfaceTextElement</code></td>
                    <td>Styled text label overlay</td>
                    <td>content, left/top, width/height, color, typeFace, typeSize</td>
                </tr>
                <tr>
                    <td><code>SurfaceButtonElement</code></td>
                    <td>Clickable image-backed button or toggle</td>
                    <td>left/top, width/height, isToggle, isSelected, click callback</td>
                </tr>
                <tr>
                    <td><code>SurfaceRadioStrip</code></td>
                    <td>Scrollable selector strip rendered inside its own surface</td>
                    <td>items, orientation, buttonWidth, buttonHeight, colors, typeFace</td>
                </tr>
            </tbody>
        </table>

        <h2>Common Properties</h2>
        <p>
            All surface elements share a set of common positioning and styling properties.
        </p>
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
                    <td><code>left</code></td>
                    <td>number</td>
                    <td>Horizontal position of the element</td>
                </tr>
                <tr>
                    <td><code>top</code></td>
                    <td>number</td>
                    <td>Vertical position of the element</td>
                </tr>
                <tr>
                    <td><code>width</code></td>
                    <td>number</td>
                    <td>Layout width of the element or strip area</td>
                </tr>
                <tr>
                    <td><code>height</code></td>
                    <td>number</td>
                    <td>Layout height of the element or strip area</td>
                </tr>
                <tr>
                    <td><code>id</code></td>
                    <td>string</td>
                    <td>Unique identifier used for lookup and event handling</td>
                </tr>
                <tr>
                    <td><code>click listener</code></td>
                    <td>function</td>
                    <td>Callback invoked when the user activates the element</td>
                </tr>
            </tbody>
        </table>

        <h2>Interaction Model</h2>
        <p>
            Surface elements use callback functions and events rather than command strings. Text and
            button elements receive click callbacks directly, while radio strips raise an
            <code>itemSelected</code> event when the active item changes.
        </p>
        <table class="docs-table">
            <thead>
                <tr>
                    <th>Pattern</th>
                    <th>Description</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><code>SurfaceTextElement.create(..., click)</code></td>
                    <td>Text overlays can be interactive and respond to clicks</td>
                </tr>
                <tr>
                    <td><code>SurfaceButtonElement.create(..., click)</code></td>
                    <td>Buttons and toggles invoke a callback when activated</td>
                </tr>
                <tr>
                    <td><code>SurfaceRadioStrip.create(..., itemSelected)</code></td>
                    <td>Selection changes are delivered through the strip's itemSelected callback</td>
                </tr>
            </tbody>
        </table>

        <h2>SurfaceTextElement</h2>
        <app-docs-surface-sample [code]="textCode" language="javascript" label="JavaScript"></app-docs-surface-sample>

        <h2>SurfaceButtonElement</h2>
        <p>
            Surface buttons are image-backed. Set the surface's state images first, then place
            buttons or toggles within that surface.
        </p>
        <app-docs-surface-sample [code]="buttonCode" language="javascript" label="JavaScript"></app-docs-surface-sample>

        <h2>SurfaceRadioStrip</h2>
        <p>
            Radio strips are typically hosted inside a <code>SurfacePane</code> so they can manage
            their own internal model and scrolling behavior.
        </p>
        <app-docs-surface-sample [code]="radioCode" language="javascript" label="JavaScript"></app-docs-surface-sample>

        <app-docs-page-nav [previousPage]="previousPage" [nextPage]="nextPage"></app-docs-page-nav>
    `
})
export class SurfaceElementsPageComponent {
    previousPage: DocsPage | undefined;
    nextPage: DocsPage | undefined;

    textCode = `const surface = new elise.Surface(320, 220);
surface.backgroundColor = '#0f172a';

const title = elise.SurfaceTextElement.create(
    'title',
    24,
    22,
    272,
    34,
    'SurfaceTextElement',
    () => undefined
).addTo(surface);
title.color = 'White';
title.typeFace = 'sans-serif';
title.typeSize = 20;
title.textAlignment = 'center,middle';
title.background = 'rgba(30,41,59,0.72)';
title.padding = 6;

const caption = elise.SurfaceTextElement.create(
    'caption',
    42,
    76,
    236,
    40,
    'Text overlays can be styled, padded, and layered above any surface pane.',
    () => undefined
).addTo(surface);
caption.color = '#e2e8f0';
caption.typeFace = 'sans-serif';
caption.typeSize = 12;
caption.textAlignment = 'center,middle';
caption.background = 'rgba(15,23,42,0.56)';
caption.padding = 8;

const badge = elise.SurfaceTextElement.create(
    'badge',
    108,
    146,
    104,
    26,
    'Interactive Label',
    () => undefined
).addTo(surface);
badge.color = '#082f49';
badge.typeFace = 'sans-serif';
badge.typeSize = 12;
badge.textAlignment = 'center,middle';
badge.background = '#bae6fd';
badge.border = '#0284c7,1';
badge.padding = 4;

return surface;`;

    buttonCode = `const surface = new elise.Surface(480, 320);
surface.backgroundColor = 'White';
surface.normalImageSource = ':assets/player/page2/normal.png';
surface.selectedImageSource = ':assets/player/page2/selected.png';
surface.highlightedImageSource = ':assets/player/page2/highlighted.png';

const title = elise.SurfaceTextElement.create(
    'button-title',
    286,
    18,
    168,
    34,
    'Image-backed buttons',
    () => undefined
).addTo(surface);
title.color = 'Black';
title.typeFace = 'sans-serif';
title.typeSize = 18;
title.textAlignment = 'center,middle';

// These button rectangles match the real labeled regions in page2/normal.png
elise.SurfaceButtonElement.create('button-1', 34, 24, 132, 52, () => undefined).addTo(surface);
elise.SurfaceButtonElement.create('button-2', 34, 98, 132, 52, () => undefined).addTo(surface);
elise.SurfaceButtonElement.create('button-3', 34, 172, 132, 52, () => undefined).addTo(surface);
elise.SurfaceButtonElement.create('button-4', 34, 246, 132, 52, () => undefined).addTo(surface);

return surface;`;

    radioCode = `const surface = new elise.Surface(320, 220);
surface.backgroundColor = '#0f172a';

const heading = elise.SurfaceTextElement.create(
    'heading',
    26,
    20,
    268,
    26,
    'SurfaceRadioStrip hosted in a pane',
    () => undefined
).addTo(surface);
heading.color = 'White';
heading.typeFace = 'sans-serif';
heading.typeSize = 16;
heading.textAlignment = 'center,middle';

const stripSurface = new elise.Surface(252, 36);
stripSurface.normalImageSource = ':assets/player/page11/normal.png';
stripSurface.selectedImageSource = ':assets/player/page11/selected.png';
stripSurface.highlightedImageSource = ':assets/player/page11/highlighted.png';

const strip = elise.SurfaceRadioStrip.create(
    'mode-strip',
    0,
    0,
    252,
    36,
    0,
    0,
    84,
    36,
    () => undefined
).addTo(stripSurface);
strip.normalColor = 'rgba(255,255,255,0.82)';
        strip.selectedColor = 'White';
        strip.highlightedColor = '#f8fafc';
strip.typeFace = 'sans-serif';
strip.typeSize = 12;
strip.addItem('intro', 'Intro');
strip.addItem('demo', 'Demo');
strip.addItem('summary', 'Summary');
strip.selectItem('demo', true);

elise.SurfacePane.create('strip-pane', 34, 96, 252, 36, stripSurface).addTo(surface);

const note = elise.SurfaceTextElement.create(
    'note',
    58,
    152,
    204,
    24,
    'The selected item is styled by the strip itself.',
    () => undefined
).addTo(surface);
note.color = '#cbd5e1';
note.typeFace = 'sans-serif';
note.typeSize = 11;
note.textAlignment = 'center,middle';

return surface;`;

    constructor(docsService: DocsService) {
        this.previousPage = docsService.getPreviousPage('surface', 'surface-elements');
        this.nextPage = docsService.getNextPage('surface', 'surface-elements');
    }
}
