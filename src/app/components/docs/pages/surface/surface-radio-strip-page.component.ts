import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DocsService, DocsPage } from '../../../../services/docs.service';
import { DocsPageNavComponent } from '../../docs-page-nav.component';
import { DocsSurfaceSampleComponent } from '../../docs-surface-sample.component';

@Component({
    imports: [CommonModule, RouterModule, DocsPageNavComponent, DocsSurfaceSampleComponent],
    template: `
        <h1>SurfaceRadioStrip</h1>
        <p class="lead">
            SurfaceRadioStrip renders a scrollable row or column of mutually exclusive options
            derived from surface skin images. It is best suited to tab bars, category selectors,
            and other pane-switching controls.
        </p>

        <h2>Overview</h2>
        <p>
            Radio strips are layers rather than overlay elements. They are usually hosted on their
            own child surface or dedicated strip surface so the correct skin images can be applied
            without affecting the rest of the screen.
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
                    <td>Unique identifier for the radio strip</td>
                </tr>
                <tr>
                    <td><code>areaLeft</code> / <code>areaTop</code></td>
                    <td>number</td>
                    <td>Position of the strip viewport</td>
                </tr>
                <tr>
                    <td><code>areaWidth</code> / <code>areaHeight</code></td>
                    <td>number</td>
                    <td>Visible strip area dimensions</td>
                </tr>
                <tr>
                    <td><code>orientation</code></td>
                    <td>enum</td>
                    <td>Horizontal by default, or vertical for sidebar-style strips</td>
                </tr>
                <tr>
                    <td><code>items</code></td>
                    <td><code>SurfaceRadioStripItem[]</code></td>
                    <td>Selectable items added with <code>addItem(id, text)</code></td>
                </tr>
                <tr>
                    <td><code>buttonLeft</code> / <code>buttonTop</code></td>
                    <td>number</td>
                    <td>Template crop origin inside the strip skin image</td>
                </tr>
                <tr>
                    <td><code>buttonWidth</code> / <code>buttonHeight</code></td>
                    <td>number</td>
                    <td>Template button dimensions within the skin image</td>
                </tr>
                <tr>
                    <td><code>normalColor</code>, <code>selectedColor</code>, <code>highlightedColor</code></td>
                    <td>string</td>
                    <td>Text colors used for each interaction state</td>
                </tr>
                <tr>
                    <td><code>typeFace</code> / <code>typeSize</code></td>
                    <td>string</td>
                    <td>Typography used for strip item labels</td>
                </tr>
            </tbody>
        </table>

        <h2>Horizontal Radio Strip</h2>
        <p>
            This sample uses the page11 strip skin to create a horizontal navigation bar.
        </p>
        <app-docs-surface-sample [code]="horizontalCode" language="javascript" label="JavaScript"></app-docs-surface-sample>

        <h2>Vertical Radio Strip</h2>
        <p>
            This sample uses the page12 vertical skin and updates the visible status when a topic
            is selected.
        </p>
        <app-docs-surface-sample [code]="verticalCode" language="javascript" label="JavaScript"></app-docs-surface-sample>

        <app-docs-page-nav [previousPage]="previousPage" [nextPage]="nextPage"></app-docs-page-nav>
    `
})
export class SurfaceRadioStripPageComponent {
    previousPage: DocsPage | undefined;
    nextPage: DocsPage | undefined;

    horizontalCode = `const surface = new elise.Surface(480, 320);
surface.backgroundColor = '#0f172a';
surface.normalImageSource = ':assets/player/page11/normal.png';
surface.selectedImageSource = ':assets/player/page11/selected.png';
surface.highlightedImageSource = ':assets/player/page11/highlighted.png';

const status = elise.SurfaceTextElement.create(
    'status',
    60,
    44,
    360,
    24,
    'Selected: Overview',
    () => undefined
).addTo(surface);
status.color = 'White';
status.typeFace = 'sans-serif';
status.typeSize = 16;
status.textAlignment = 'center,middle';

const strip = elise.SurfaceRadioStrip.create(
    'sections',
    34,
    249,
    411,
    34,
    34,
    249,
    101,
    34,
    args => {
        const text = 'Selected: ' + (args?.item?.text || 'Overview');
        status.content = text;
        if (status.textElement) {
            status.textElement.setText(text);
        }
        surface.controller?.draw();
    }
).addTo(surface);
strip.normalColor = 'Black';
strip.selectedColor = 'White';
strip.highlightedColor = '#f8fafc';
strip.typeFace = 'sans-serif';
strip.typeSize = 14;

['Overview', 'Gallery', 'Timeline', 'Specs', 'Media'].forEach((item, index) => {
    strip.addItem('item-' + index, item);
});
strip.selectItem('item-0', true);

return surface;`;

    verticalCode = `const surface = new elise.Surface(480, 320);
surface.backgroundColor = '#0f172a';
surface.normalImageSource = ':assets/player/page12/normal.png';
surface.selectedImageSource = ':assets/player/page12/selected.png';
surface.highlightedImageSource = ':assets/player/page12/highlighted.png';

const status = elise.SurfaceTextElement.create(
    'status',
    188,
    56,
    210,
    64,
    'Topic: Atmosphere',
    () => undefined
).addTo(surface);
status.color = '#e2e8f0';
status.typeFace = 'sans-serif';
status.typeSize = 14;
status.textAlignment = 'center,middle';
status.background = 'rgba(15,23,42,0.62)';
status.padding = 8;

const strip = elise.SurfaceRadioStrip.create(
    'topics',
    33,
    40,
    132,
    244,
    33,
    40,
    132,
    33,
    args => {
        const text = 'Topic: ' + (args?.item?.text || 'Atmosphere');
        status.content = text;
        if (status.textElement) {
            status.textElement.setText(text);
        }
        surface.controller?.draw();
    }
).addTo(surface);
strip.orientation = elise.RadioStripOrientation ? elise.RadioStripOrientation.Vertical : 1;
strip.normalColor = 'White';
strip.selectedColor = '#fde047';
strip.highlightedColor = '#020617';
strip.typeFace = 'sans-serif';
strip.typeSize = 14;

['Atmosphere', 'Terrain', 'Water', 'Signals', 'Archive', 'Telemetry'].forEach((item, index) => {
    strip.addItem('topic-' + index, item);
});
strip.selectItem('topic-0', true);

return surface;`;

    constructor(docsService: DocsService) {
        this.previousPage = docsService.getPreviousPage('surface', 'surface-radio-strip');
        this.nextPage = docsService.getNextPage('surface', 'surface-radio-strip');
    }
}
