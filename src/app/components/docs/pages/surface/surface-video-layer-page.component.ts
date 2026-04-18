import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DocsService, DocsPage } from '../../../../services/docs.service';
import { DocsPageNavComponent } from '../../docs-page-nav.component';
import { DocsSurfaceSampleComponent } from '../../docs-surface-sample.component';

@Component({
    imports: [CommonModule, RouterModule, DocsPageNavComponent, DocsSurfaceSampleComponent],
    template: `
        <h1>Video Layers</h1>
        <p class="lead">
            SurfaceVideoLayer renders a video element inside a positioned surface rectangle. Use it
            for demos, ambient loops, or media panes with text and button overlays layered above the
            video.
        </p>

        <h2>Properties</h2>
        <table class="docs-table">
            <thead>
                <tr>
                    <th>Property</th>
                    <th>Type</th>
                    <th>Default</th>
                    <th>Description</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><code>source</code></td>
                    <td>string</td>
                    <td>—</td>
                    <td>Video URL used by the underlying HTML <code>video</code> element</td>
                </tr>
                <tr>
                    <td><code>autoPlay</code></td>
                    <td>boolean</td>
                    <td>false</td>
                    <td>Automatically start playback when the layer is shown</td>
                </tr>
                <tr>
                    <td><code>loop</code></td>
                    <td>boolean</td>
                    <td>false</td>
                    <td>Restart playback when the video ends</td>
                </tr>
                <tr>
                    <td><code>nativeControls</code></td>
                    <td>boolean</td>
                    <td>true</td>
                    <td>Displays the browser's built-in video controls when enabled</td>
                </tr>
            </tbody>
        </table>

        <h2>Runtime Behavior</h2>
        <table class="docs-table">
            <thead>
                <tr>
                    <th>Capability</th>
                    <th>Description</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><code>canPlay</code></td>
                    <td>Set to true when the video is ready for playback</td>
                </tr>
                <tr>
                    <td><code>started</code> / <code>stopped</code></td>
                    <td>Events exposed by the class for playback lifecycle handling</td>
                </tr>
                <tr>
                    <td><code>setOpacity()</code> and <code>setTranslateX/Y()</code></td>
                    <td>Inherited layer methods for visual emphasis and positioning tweaks</td>
                </tr>
            </tbody>
        </table>

        <h2>Playback Notes</h2>
        <p>
            The current docs sample uses the built-in browser controls so it works reliably in the
            preview without additional controller wiring. For kiosk-style experiences, disable
            <code>nativeControls</code> and place surface elements above the video as your own UI.
        </p>

        <h2>Working Video Layer Example</h2>
        <p>
            This preview loads a local MP4 asset, keeps native controls enabled, and overlays a
            small title bar so you can see how video layers sit alongside normal surface elements.
        </p>
        <app-docs-surface-sample [code]="basicCode" language="javascript" label="JavaScript"></app-docs-surface-sample>

        <app-docs-page-nav [previousPage]="previousPage" [nextPage]="nextPage"></app-docs-page-nav>
    `
})
export class SurfaceVideoLayerPageComponent {
    previousPage: DocsPage | undefined;
    nextPage: DocsPage | undefined;

    basicCode = `const surface = new elise.Surface(480, 320);
surface.backgroundColor = '#020617';

const videoLayer = elise.SurfaceVideoLayer.create(
    'demo-video',
    24,
    54,
    432,
    242,
    '/assets/player/video/water-480.mp4'
).addTo(surface);
videoLayer.loop = true;
videoLayer.autoPlay = false;
videoLayer.nativeControls = true;

const title = elise.SurfaceTextElement.create(
    'video-title',
    104,
    18,
    272,
    24,
    'SurfaceVideoLayer',
    () => undefined
).addTo(surface);
title.color = 'White';
title.typeFace = 'sans-serif';
title.typeSize = 16;
title.textAlignment = 'center,middle';
title.background = 'rgba(15,23,42,0.72)';
title.padding = 4;

const note = elise.SurfaceTextElement.create(
    'video-note',
    132,
    300,
    216,
    14,
    'Local MP4 asset with native controls',
    () => undefined
).addTo(surface);
note.color = '#cbd5e1';
note.typeFace = 'sans-serif';
note.typeSize = 9;
note.textAlignment = 'center,middle';

return surface;`;

    constructor(docsService: DocsService) {
        this.previousPage = docsService.getPreviousPage('surface', 'surface-video-layer');
        this.nextPage = docsService.getNextPage('surface', 'surface-video-layer');
    }
}
