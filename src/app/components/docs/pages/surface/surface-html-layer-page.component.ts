import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DocsService, DocsPage } from '../../../../services/docs.service';
import { DocsPageNavComponent } from '../../docs-page-nav.component';
import { DocsSurfaceSampleComponent } from '../../docs-surface-sample.component';

@Component({
    imports: [CommonModule, RouterModule, DocsPageNavComponent, DocsSurfaceSampleComponent],
    template: `
        <h1>HTML Layers</h1>
        <p class="lead">
            SurfaceHtmlLayer embeds an HTML document in an iframe positioned inside a surface. Use
            HTML layers when you need a local HTML experience, legacy web content, or a self-contained
            document region inside a surface layout.
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
                    <td>URL for the HTML document loaded by the iframe</td>
                </tr>
                <tr>
                    <td><code>scrolling</code></td>
                    <td>string</td>
                    <td>IFrame scrolling mode, such as <code>auto</code> or <code>no</code></td>
                </tr>
                <tr>
                    <td><code>sandbox</code></td>
                    <td>boolean</td>
                    <td>Enables iframe sandboxing for safer embedded content</td>
                </tr>
                <tr>
                    <td><code>sandboxPermissions</code></td>
                    <td>string[]</td>
                    <td>Sandbox permission tokens applied when sandboxing is enabled</td>
                </tr>
                <tr>
                    <td><code>scaleContent</code></td>
                    <td>boolean</td>
                    <td>Scales the iframe content with the surface instead of resizing the iframe itself</td>
                </tr>
            </tbody>
        </table>

        <h2>Usage Notes</h2>
        <ul>
            <li>The current API loads a document from <code>source</code>; it does not accept inline HTML strings</li>
            <li>Prefer local app assets for docs and embedded experiences so the layer remains deterministic</li>
            <li>Sandboxing is enabled by default and can be tuned with <code>sandboxPermissions</code></li>
            <li>Set <code>scaleContent = false</code> if you want the iframe itself to resize instead of applying CSS transform scaling</li>
        </ul>

        <h2>Working HTML Layer Example</h2>
        <p>
            This preview loads a local HTML asset into a surface-sized iframe, then places a title
            overlay above it so you can see how HTML layers fit into the broader surface layout.
        </p>
        <app-docs-surface-sample [code]="htmlCode" language="javascript" label="JavaScript"></app-docs-surface-sample>

        <app-docs-page-nav [previousPage]="previousPage" [nextPage]="nextPage"></app-docs-page-nav>
    `
})
export class SurfaceHtmlLayerPageComponent {
    previousPage: DocsPage | undefined;
    nextPage: DocsPage | undefined;

    htmlCode = `const surface = new elise.Surface(320, 220);
surface.backgroundColor = '#0f172a';

const htmlLayer = elise.SurfaceHtmlLayer.create(
    'embedded-html',
    18,
    18,
    284,
    184,
    '/assets/player/html/html2/default.htm'
).addTo(surface);
htmlLayer.scrolling = 'no';
htmlLayer.sandboxPermissions = ['allow-same-origin', 'allow-scripts'];

const title = elise.SurfaceTextElement.create(
    'html-title',
    54,
    26,
    212,
    24,
    'SurfaceHtmlLayer',
    () => undefined
).addTo(surface);
title.color = 'White';
title.typeFace = 'sans-serif';
title.typeSize = 14;
title.textAlignment = 'center,middle';
title.background = 'rgba(15,23,42,0.72)';
title.padding = 4;

const note = elise.SurfaceTextElement.create(
    'html-note',
    70,
    176,
    180,
    18,
    'Local HTML rendered in an iframe layer',
    () => undefined
).addTo(surface);
note.color = '#e2e8f0';
note.typeFace = 'sans-serif';
note.typeSize = 10;
note.textAlignment = 'center,middle';
note.background = 'rgba(15,23,42,0.68)';

return surface;`;

    constructor(docsService: DocsService) {
        this.previousPage = docsService.getPreviousPage('surface', 'surface-html-layer');
        this.nextPage = docsService.getNextPage('surface', 'surface-html-layer');
    }
}
