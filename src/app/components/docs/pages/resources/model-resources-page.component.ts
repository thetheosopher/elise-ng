import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DocsService, DocsPage } from '../../../../services/docs.service';
import { DocsPageNavComponent } from '../../docs-page-nav.component';
import { DocsCodeSampleComponent } from '../../docs-code-sample.component';

@Component({
    selector: 'app-model-resources-page',
    standalone: true,
    imports: [CommonModule, RouterModule, DocsPageNavComponent, DocsCodeSampleComponent],
    template: `
        <h1>Model Resources</h1>
        <p class="lead">
            Model resources are nested Elise models registered for use with ModelElement or as model fills.
            They can be registered inline by passing a Model object directly, or by URL for deferred loading.
        </p>

        <h2>Serialized Format</h2>
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
                    <td>key</td>
                    <td>string</td>
                    <td>Unique identifier for the model resource</td>
                </tr>
                <tr>
                    <td>type</td>
                    <td>string</td>
                    <td>Always <code>'model'</code> for model resources</td>
                </tr>
                <tr>
                    <td>uri</td>
                    <td>string</td>
                    <td>URL of the model file (for URL-based registration)</td>
                </tr>
            </tbody>
        </table>

        <h2>Inline Model Resource</h2>
        <p>
            Create a model programmatically and register it directly as a resource. The nested model
            is available immediately without an asynchronous load.
        </p>
        <app-docs-code-sample [code]="inlineCode" language="javascript" label="JavaScript"></app-docs-code-sample>

        <h2>URL-Based Model Resource</h2>
        <p>
            Register a model resource by URL. The model file is loaded asynchronously during
            <code>prepareResources()</code>.
        </p>
        <app-docs-code-sample [code]="urlCode" language="javascript" label="JavaScript"></app-docs-code-sample>

        <h2>Displaying with ModelElement</h2>
        <p>
            ModelElement renders a nested model resource at a specified position and size within the
            parent model.
        </p>
        <app-docs-code-sample [code]="displayCode" language="javascript" label="JavaScript"></app-docs-code-sample>

        <h2>Using as a Model Fill</h2>
        <p>
            A model resource can be used as a repeating fill pattern on shape elements, rendering
            the nested model's output as a tiled texture.
        </p>
        <app-docs-code-sample [code]="fillCode" language="javascript" label="JavaScript"></app-docs-code-sample>

        <app-docs-page-nav [previousPage]="previousPage" [nextPage]="nextPage"></app-docs-page-nav>
    `
})
export class ModelResourcesPageComponent {
    previousPage?: DocsPage;
    nextPage?: DocsPage;

    inlineCode = `const m = elise.model(320, 220);

// Create a reusable badge model inline
const badge = elise.model(72, 72);
elise.ellipse(36, 36, 30, 30)
    .setFill('#f59e0b')
    .setStroke('#92400e,3')
    .addTo(badge);
elise.text('E', 36, 38, 'center', 'middle')
    .setFill('White')
    .setTypesize(28)
    .addTo(badge);

// Register the inline model resource
elise.modelResource('badge', badge).addTo(m);

elise.innerModel('badge', 18, 74, 64, 64).addTo(m);
elise.innerModel('badge', 128, 28, 72, 72).setOpacity(0.9).addTo(m);
elise.innerModel('badge', 230, 92, 54, 54).setOpacity(0.7).addTo(m);`;

    urlCode = `const m = elise.model(320, 220);

// Set a base path for relative model URLs
m.setBasePath('/assets/resources/models');

// Register a serialized model resource by URL
elise.modelResource('embedded', '/model-element-embedded/model.json').addTo(m);

elise.innerModel('embedded', 24, 20, 126, 126).addTo(m);
elise.innerModel('embedded', 170, 86, 110, 110)
    .setOpacity(0.85)
    .addTo(m);`;

    displayCode = `const m = elise.model(320, 220);

const chip = elise.model(64, 64);
elise.rectangle(8, 8, 48, 48)
    .setFill('#10b981')
    .setStroke('#065f46,3')
    .addTo(chip);
elise.rectangle(22, 22, 20, 20)
    .setFill('#d1fae5')
    .addTo(chip);

elise.modelResource('chip', chip).addTo(m);

// Display the resource as nested model elements
elise.innerModel('chip', 24, 48, 76, 76).addTo(m);
elise.innerModel('chip', 122, 72, 52, 52).addTo(m);
elise.innerModel('chip', 208, 34, 88, 88)
    .setOpacity(0.78)
    .addTo(m);`;

    fillCode = `const m = elise.model(320, 220);

// Create a small pattern model
const tile = elise.model(48, 48);
elise.rectangle(0, 0, 48, 48).setFill('#eff6ff').addTo(tile);
elise.ellipse(12, 12, 8, 8).setFill('#2563eb').addTo(tile);
elise.ellipse(36, 36, 8, 8).setFill('#2563eb').addTo(tile);
elise.rectangle(18, 18, 12, 12).setFill('#93c5fd').addTo(tile);

// Register as a reusable model fill resource
elise.modelResource('dots', tile).addTo(m);

// Use as a model fill on a rectangle
elise.rectangle(20, 20, 130, 180)
    .setFill('model(dots)')
    .setStroke('#1e3a8a,1')
    .addTo(m);

elise.ellipse(230, 110, 70, 70)
    .setFill('model(dots)')
    .setFillScale(1.25)
    .setStroke('#1e3a8a,1')
    .addTo(m);`;

    constructor(docsService: DocsService) {
        this.previousPage = docsService.getPreviousPage('resources', 'model-resources');
        this.nextPage = docsService.getNextPage('resources', 'model-resources');
    }
}
