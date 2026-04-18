import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DocsService, DocsPage } from '../../../../services/docs.service';
import { DocsPageNavComponent } from '../../docs-page-nav.component';
import { DocsCodeSampleComponent } from '../../docs-code-sample.component';

@Component({
    selector: 'app-model-fills-page',
    standalone: true,
    imports: [CommonModule, RouterModule, DocsPageNavComponent, DocsCodeSampleComponent],
    template: `
        <h1>Model Fills</h1>
        <p class="lead">
            Model fills use another Elise model's rendering as a fill pattern. Register a model as a
            named resource, then reference it with a <code>model(...)</code> fill string. The model's
            rendering tiles into the element's area, enabling vector pattern fills where any nested
            Elise scene can become a reusable texture.
        </p>

        <h2>How Model Fills Work</h2>
        <p>
            Create an inner model with the desired visual pattern, register it as a model resource
            on the outer model using a unique key, then set the element's <code>fill</code> property
            to <code>model(resourceKey)</code>. The inner model renders and tiles across the element
            bounds. Use <code>setFillScale()</code>, <code>setFillOffsetX()</code>, and
            <code>setFillOffsetY()</code> to control the pattern appearance, just like image fills.
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
                    <td>Model fill string such as <code>model(dots)</code></td>
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

        <h2>Basic Model Fill</h2>
        <p>
            Create an inner model with colored shapes, register it as a resource, and use its key
            as the fill on a rectangle. The inner model's rendering tiles across the element.
        </p>
        <app-docs-code-sample [code]="basicCode" language="javascript" label="JavaScript"></app-docs-code-sample>

        <h2>Scaled Model Fill</h2>
        <p>
            Use <code>setFillScale()</code> to enlarge or shrink the model pattern. Larger values
            produce bigger tiles, while smaller values create a denser pattern.
        </p>
        <app-docs-code-sample [code]="scaledCode" language="javascript" label="JavaScript"></app-docs-code-sample>

        <app-docs-page-nav [previousPage]="previousPage" [nextPage]="nextPage"></app-docs-page-nav>
    `
})
export class ModelFillsPageComponent {
    previousPage?: DocsPage;
    nextPage?: DocsPage;

    basicCode = `const m = elise.model(300, 200);

// Create an inner model with a simple pattern
const pattern = elise.model(24, 24);
elise.ellipse(12, 12, 8, 8).setFill('CornflowerBlue').addTo(pattern);
elise.rectangle(0, 0, 24, 24).setStroke('SteelBlue,1').addTo(pattern);

// Register the inner model as a resource
elise.modelResource('dots', pattern).addTo(m);

// Use the model resource as a tiled fill
elise.rectangle(20, 20, 260, 160)
    .setFill('model(dots)')
    .setStroke('SteelBlue,2')
    .addTo(m);`;

    scaledCode = `const m = elise.model(400, 200);

// Create a filled pattern tile that stays readable at different scales
const tile = elise.model(32, 32);
tile.setFill('#fff7ed');
elise.rectangle(0, 0, 16, 16).setFill('#fdba74').addTo(tile);
elise.rectangle(16, 16, 16, 16).setFill('#fb923c').addTo(tile);
elise.ellipse(16, 16, 8, 8).setFill('#7c2d12').addTo(tile);
elise.modelResource('tile', tile).addTo(m);

// Normal scale
elise.rectangle(10, 20, 120, 160)
    .setFill('model(tile)')
    .setFillScale(1)
    .setStroke('#7c2d12,2')
    .addTo(m);

// Double scale
elise.rectangle(140, 20, 120, 160)
    .setFill('model(tile)')
    .setFillScale(2)
    .setStroke('#7c2d12,2')
    .addTo(m);

// Half scale
elise.rectangle(270, 20, 120, 160)
    .setFill('model(tile)')
    .setFillScale(0.5)
    .setStroke('#7c2d12,2')
    .addTo(m);`;

    constructor(docsService: DocsService) {
        this.previousPage = docsService.getPreviousPage('styling', 'model-fills');
        this.nextPage = docsService.getNextPage('styling', 'model-fills');
    }
}
