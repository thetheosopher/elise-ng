import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DocsService, DocsPage } from '../../../../services/docs.service';
import { DocsPageNavComponent } from '../../docs-page-nav.component';
import { DocsSurfaceSampleComponent } from '../../docs-surface-sample.component';

@Component({
    imports: [CommonModule, RouterModule, DocsPageNavComponent, DocsSurfaceSampleComponent],
    template: `
        <h1>SurfaceHiddenLayer</h1>
        <p class="lead">
            SurfaceHiddenLayer creates an invisible rectangular hotspot. It does not host visible
            content or child elements. Instead, it captures clicks over a region of the surface and
            lets you react without drawing a visible control.
        </p>

        <h2>Overview</h2>
        <p>
            Hidden layers are useful for edge hotspots, invisible tap targets on top of images, and
            large click zones that should not visually compete with the surrounding design.
        </p>

        <h2>Use Cases</h2>
        <table class="docs-table">
            <thead>
                <tr>
                    <th>Use Case</th>
                    <th>Description</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><strong>Edge Hotspots</strong></td>
                    <td>Make the left or right side of a gallery clickable without visible buttons</td>
                </tr>
                <tr>
                    <td><strong>Image Hit Areas</strong></td>
                    <td>Define specific regions over a photo, diagram, or mockup</td>
                </tr>
                <tr>
                    <td><strong>Large Touch Targets</strong></td>
                    <td>Capture taps across a broad area while keeping the screen visually clean</td>
                </tr>
                <tr>
                    <td><strong>Overlay Interaction</strong></td>
                    <td>Place invisible zones above existing media or text layers</td>
                </tr>
            </tbody>
        </table>

        <h2>Invisible Navigation Hotspots</h2>
        <p>
            This sample places invisible hotspots over the left and right edges of the image. Click
            either side to update the center status label and the highlighted edge indicator.
        </p>
        <app-docs-surface-sample [code]="basicCode" language="javascript" label="JavaScript"></app-docs-surface-sample>

        <app-docs-page-nav [previousPage]="previousPage" [nextPage]="nextPage"></app-docs-page-nav>
    `
})
export class SurfaceHiddenLayerPageComponent {
    previousPage: DocsPage | undefined;
    nextPage: DocsPage | undefined;

    basicCode = `const surface = new elise.Surface(320, 220);
surface.backgroundColor = '#0f172a';
surface.normalImageSource = '/assets/test/images/texture2.jpg';

const title = elise.SurfaceTextElement.create(
    'title',
    62,
    18,
    196,
    26,
    'SurfaceHiddenLayer',
    () => undefined
).addTo(surface);
title.color = 'White';
title.typeFace = 'sans-serif';
title.typeSize = 16;
title.textAlignment = 'center,middle';
title.background = 'rgba(15,23,42,0.68)';

const status = elise.SurfaceTextElement.create(
    'status',
    52,
    154,
    216,
    28,
    'Click a hotspot edge',
    () => undefined
).addTo(surface);
status.color = '#e2e8f0';
status.typeFace = 'sans-serif';
status.typeSize = 12;
status.textAlignment = 'center,middle';
status.background = 'rgba(15,23,42,0.62)';
status.padding = 5;

const leftIndicator = elise.SurfaceTextElement.create(
    'left-indicator',
    0,
    0,
    78,
    220,
    'LEFT HOTSPOT',
    () => undefined
).addTo(surface);
leftIndicator.color = 'White';
leftIndicator.typeFace = 'sans-serif';
leftIndicator.typeSize = 14;
leftIndicator.textAlignment = 'center,middle';
leftIndicator.background = 'rgba(8,47,73,0.58)';
leftIndicator.border = 'rgba(186,230,253,0.92),2';
leftIndicator.padding = 10;

const rightIndicator = elise.SurfaceTextElement.create(
    'right-indicator',
    242,
    0,
    78,
    220,
    'RIGHT HOTSPOT',
    () => undefined
).addTo(surface);
rightIndicator.color = 'White';
rightIndicator.typeFace = 'sans-serif';
rightIndicator.typeSize = 14;
rightIndicator.textAlignment = 'center,middle';
rightIndicator.background = 'rgba(8,47,73,0.58)';
rightIndicator.border = 'rgba(186,230,253,0.92),2';
rightIndicator.padding = 10;

function styleZone(zone, active) {
    if (!zone.element) {
        return;
    }

    zone.element.style.cursor = 'pointer';
    zone.element.style.boxSizing = 'border-box';
    zone.element.style.background = active ? 'rgba(14,165,233,0.26)' : 'rgba(255,255,255,0.02)';
    zone.element.style.outline = active ? '3px solid rgba(255,255,255,0.92)' : '1px solid rgba(186,230,253,0.24)';
    zone.element.style.outlineOffset = '-2px';
}

function setActiveZone(target) {
    styleZone(leftZone, target === 'left');
    styleZone(rightZone, target === 'right');
}

function setStatus(text) {
    status.content = text;
    if (status.textElement) {
        status.textElement.setText(text);
    }
    surface.controller?.draw();
}

const centerHint = elise.SurfaceTextElement.create(
    'hint',
    86,
    94,
    148,
    24,
    'Click either side rail',
    () => undefined
).addTo(surface);
centerHint.color = 'White';
centerHint.typeFace = 'sans-serif';
centerHint.typeSize = 11;
centerHint.textAlignment = 'center,middle';
centerHint.background = 'rgba(15,23,42,0.78)';
centerHint.padding = 4;

const leftZone = elise.SurfaceHiddenLayer.create('left-zone', 0, 0, 78, 220, () => {
    setActiveZone('left');
    setStatus('Left hidden hotspot pressed');
}).addTo(surface);

const rightZone = elise.SurfaceHiddenLayer.create('right-zone', 242, 0, 78, 220, () => {
    setActiveZone('right');
    setStatus('Right hidden hotspot pressed');
}).addTo(surface);

surface.initialized.add(() => {
    styleZone(leftZone, false);
    styleZone(rightZone, false);
});

return surface;`;

    constructor(docsService: DocsService) {
        this.previousPage = docsService.getPreviousPage('surface', 'surface-hidden-layer');
        this.nextPage = docsService.getNextPage('surface', 'surface-hidden-layer');
    }
}
