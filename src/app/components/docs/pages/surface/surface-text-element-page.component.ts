import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DocsService, DocsPage } from '../../../../services/docs.service';
import { DocsPageNavComponent } from '../../docs-page-nav.component';
import { DocsSurfaceSampleComponent } from '../../docs-surface-sample.component';

@Component({
    imports: [CommonModule, RouterModule, DocsPageNavComponent, DocsSurfaceSampleComponent],
    template: `
        <h1>SurfaceTextElement</h1>
        <p class="lead">
            SurfaceTextElement renders styled text overlays inside a surface. Use text elements for
            titles, callouts, labels, and lightweight interactive captions layered above images,
            video, or pane content.
        </p>

        <h2>Overview</h2>
        <p>
            <code>SurfaceTextElement.create(id, left, top, width, height, content, click)</code>
            creates a text block with optional click handling. The element supports text alignment,
            typography, background fills, borders, and padding.
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
                    <td><code>id</code></td>
                    <td>string</td>
                    <td>Unique identifier for the text element</td>
                </tr>
                <tr>
                    <td><code>content</code></td>
                    <td>string</td>
                    <td>Text content to display</td>
                </tr>
                <tr>
                    <td><code>left</code></td>
                    <td>number</td>
                    <td>Horizontal position within the surface</td>
                </tr>
                <tr>
                    <td><code>top</code></td>
                    <td>number</td>
                    <td>Vertical position within the surface</td>
                </tr>
                <tr>
                    <td><code>width</code> / <code>height</code></td>
                    <td>number</td>
                    <td>Layout bounds for the text block</td>
                </tr>
                <tr>
                    <td><code>typeFace</code></td>
                    <td>string</td>
                    <td>Font family for text rendering</td>
                </tr>
                <tr>
                    <td><code>typeSize</code></td>
                    <td>number</td>
                    <td>Font size in pixels</td>
                </tr>
                <tr>
                    <td><code>typeStyle</code></td>
                    <td>string</td>
                    <td>Font style: Normal, Bold, Italic, or BoldItalic</td>
                </tr>
                <tr>
                    <td><code>color</code></td>
                    <td>string</td>
                    <td>Text color (CSS color string)</td>
                </tr>
                <tr>
                    <td><code>background</code> / <code>border</code></td>
                    <td>string</td>
                    <td>Optional rectangle fill and stroke behind the text</td>
                </tr>
                <tr>
                    <td><code>padding</code></td>
                    <td>number</td>
                    <td>Inset applied between the text and its layout bounds</td>
                </tr>
            </tbody>
        </table>

        <h2>Hero Copy Overlay</h2>
        <p>
            This sample layers a title, summary, and badge over a background image.
        </p>
        <app-docs-surface-sample [code]="basicCode" language="javascript" label="JavaScript"></app-docs-surface-sample>

        <h2>Interactive Text Labels</h2>
        <p>
            Text elements can act as lightweight buttons. Clicking the chips below updates the
            larger status label without requiring a separate control type.
        </p>
        <app-docs-surface-sample [code]="interactiveCode" language="javascript" label="JavaScript"></app-docs-surface-sample>

        <app-docs-page-nav [previousPage]="previousPage" [nextPage]="nextPage"></app-docs-page-nav>
    `
})
export class SurfaceTextElementPageComponent {
    previousPage: DocsPage | undefined;
    nextPage: DocsPage | undefined;

    basicCode = `const surface = new elise.Surface(320, 220);
surface.backgroundColor = '#0f172a';
surface.normalImageSource = '/assets/test/images/clouds.jpg';

const title = elise.SurfaceTextElement.create(
    'title',
    26,
    20,
    268,
    30,
    'SurfaceTextElement',
    () => undefined
).addTo(surface);
title.color = 'White';
title.typeFace = 'sans-serif';
title.typeSize = 20;
title.textAlignment = 'center,middle';
title.background = 'rgba(15,23,42,0.66)';
title.padding = 6;

const summary = elise.SurfaceTextElement.create(
    'summary',
    40,
    68,
    240,
    42,
    'Text elements support bounds, alignment, backgrounds, and click callbacks.',
    () => undefined
).addTo(surface);
summary.color = '#e2e8f0';
summary.typeFace = 'sans-serif';
summary.typeSize = 12;
summary.textAlignment = 'center,middle';
summary.background = 'rgba(15,23,42,0.54)';
summary.padding = 8;

const badge = elise.SurfaceTextElement.create(
    'badge',
    92,
    164,
    136,
    24,
    'Styled text overlay',
    () => undefined
).addTo(surface);
badge.color = '#082f49';
badge.typeFace = 'sans-serif';
badge.typeSize = 11;
badge.textAlignment = 'center,middle';
badge.background = '#bae6fd';
badge.padding = 4;

return surface;`;

    interactiveCode = `const surface = new elise.Surface(320, 220);
surface.backgroundColor = '#e2e8f0';

const status = elise.SurfaceTextElement.create(
    'status',
    42,
    24,
    236,
    56,
    'Choose a label style',
    () => undefined
).addTo(surface);
status.color = '#0f172a';
status.typeFace = 'sans-serif';
status.typeSize = 18;
status.textAlignment = 'center,middle';
status.background = 'rgba(255,255,255,0.88)';
status.border = '#cbd5e1,1';
status.padding = 8;

function setStatus(text, color) {
    status.content = text;
    status.color = color;
    if (status.textElement) {
        status.textElement.setText(text);
        status.textElement.setFill(color);
    }
    surface.controller?.draw();
}

const info = elise.SurfaceTextElement.create('info', 30, 112, 78, 34, 'Info', () => setStatus('Information label', '#0369a1')).addTo(surface);
info.color = 'White';
info.typeFace = 'sans-serif';
info.typeSize = 12;
info.textAlignment = 'center,middle';
info.background = '#0284c7';
info.padding = 4;

const warn = elise.SurfaceTextElement.create('warn', 121, 112, 78, 34, 'Warning', () => setStatus('Warning label', '#b45309')).addTo(surface);
warn.color = 'White';
warn.typeFace = 'sans-serif';
warn.typeSize = 12;
warn.textAlignment = 'center,middle';
warn.background = '#d97706';
warn.padding = 4;

const ok = elise.SurfaceTextElement.create('ok', 212, 112, 78, 34, 'Success', () => setStatus('Success label', '#15803d')).addTo(surface);
ok.color = 'White';
ok.typeFace = 'sans-serif';
ok.typeSize = 12;
ok.textAlignment = 'center,middle';
ok.background = '#16a34a';
ok.padding = 4;

return surface;`;

    constructor(docsService: DocsService) {
        this.previousPage = docsService.getPreviousPage('surface', 'surface-text-element');
        this.nextPage = docsService.getNextPage('surface', 'surface-text-element');
    }
}
