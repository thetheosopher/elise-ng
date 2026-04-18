import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DocsService, DocsPage } from '../../../../services/docs.service';
import { DocsPageNavComponent } from '../../docs-page-nav.component';
import { DocsCodeSampleComponent } from '../../docs-code-sample.component';

@Component({
    selector: 'app-image-fills-page',
    standalone: true,
    imports: [CommonModule, RouterModule, DocsPageNavComponent, DocsCodeSampleComponent],
    template: `
        <h1>Image Fills</h1>
        <p class="lead">
            Image fills use registered bitmap resources as tiled patterns to fill elements. Register
            a bitmap image as a named resource, then reference it with an <code>image(...)</code>
            fill string. The image tiles to fill the element bounds and can be scaled and offset.
        </p>

        <h2>How Image Fills Work</h2>
        <p>
            First, register a bitmap resource on the model using a unique key. Then set the element's
            <code>fill</code> property to <code>image(resourceKey)</code>. The bitmap tiles across the
            element area. Use <code>setFillScale()</code>, <code>setFillOffsetX()</code>, and
            <code>setFillOffsetY()</code> to control the pattern appearance.
        </p>

        <h2>Fill Properties</h2>
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
                    <td><code>fill</code></td>
                    <td>string</td>
                    <td>—</td>
                    <td>Image fill string such as <code>image(texture)</code></td>
                </tr>
                <tr>
                    <td><code>fillScale</code></td>
                    <td>number</td>
                    <td>1.0</td>
                    <td>Scale factor for the fill pattern (values &gt; 1 enlarge, &lt; 1 shrink)</td>
                </tr>
                <tr>
                    <td><code>fillOffsetX</code></td>
                    <td>number</td>
                    <td>0</td>
                    <td>Horizontal offset of the fill pattern in pixels</td>
                </tr>
                <tr>
                    <td><code>fillOffsetY</code></td>
                    <td>number</td>
                    <td>0</td>
                    <td>Vertical offset of the fill pattern in pixels</td>
                </tr>
            </tbody>
        </table>

        <h2>Basic Image Fill</h2>
        <p>
            Register a bitmap resource and use its key as the fill. The image will tile across the
            element at its native size.
        </p>
        <app-docs-code-sample [code]="basicCode" language="javascript" label="JavaScript"></app-docs-code-sample>

        <h2>Scaled Image Fill</h2>
        <p>
            Use <code>fillScale</code> to enlarge or shrink the pattern. A value of 2 doubles
            the tile size, while 0.5 halves it.
        </p>
        <app-docs-code-sample [code]="scaledCode" language="javascript" label="JavaScript"></app-docs-code-sample>

        <h2>Offset Image Fill</h2>
        <p>
            Use <code>fillOffsetX</code> and <code>fillOffsetY</code> to shift the pattern origin,
            controlling where the tile grid begins.
        </p>
        <app-docs-code-sample [code]="offsetCode" language="javascript" label="JavaScript"></app-docs-code-sample>

        <app-docs-page-nav [previousPage]="previousPage" [nextPage]="nextPage"></app-docs-page-nav>
    `
})
export class ImageFillsPageComponent {
    previousPage?: DocsPage;
    nextPage?: DocsPage;

    basicCode = `const m = elise.model(300, 200);

// Register a bitmap resource with key 'texture'
m.setBasePath('/assets/test');
elise.bitmapResource('texture', '/images/texture1.png').addTo(m);

// Use the bitmap resource as a tiled image fill
elise.rectangle(20, 20, 260, 160)
    .setFill('image(texture)')
    .setStroke('#0f172a,2')
    .addTo(m);`;

    scaledCode = `const m = elise.model(300, 200);
m.setBasePath('/assets/test');
elise.bitmapResource('texture', '/images/texture2.jpg').addTo(m);

elise.ellipse(150, 100, 110, 70)
    .setFill('image(texture)')
    .setFillScale(0.5)
    .setStroke('#1e293b,2')
    .addTo(m);`;

    offsetCode = `const m = elise.model(300, 200);
m.setBasePath('/assets/test');
elise.bitmapResource('texture', '/images/texture1.png').addTo(m);

elise.rectangle(20, 20, 260, 160)
    .setFill('image(texture)')
    .setFillOffsetX(16)
    .setFillOffsetY(8)
    .setStroke('#0f172a,2')
    .addTo(m);`;

    constructor(docsService: DocsService) {
        this.previousPage = docsService.getPreviousPage('styling', 'image-fills');
        this.nextPage = docsService.getNextPage('styling', 'image-fills');
    }
}
