import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DocsService, DocsPage } from '../../../../services/docs.service';
import { DocsPageNavComponent } from '../../docs-page-nav.component';
import { DocsCodeSampleComponent } from '../../docs-code-sample.component';

@Component({
    selector: 'app-bitmap-resources-page',
    standalone: true,
    imports: [CommonModule, RouterModule, DocsPageNavComponent, DocsCodeSampleComponent],
    template: `
        <h1>Bitmap Resources</h1>
        <p class="lead">
            Bitmap resources are image assets — PNG, JPG, GIF, WebP, and SVG files — registered with the
            model's ResourceManager and loaded asynchronously before rendering. They are used by ImageElement
            for display and as image fills for shape elements.
        </p>

        <h2>Supported Formats</h2>
        <table class="docs-table">
            <thead>
                <tr>
                    <th>Format</th>
                    <th>Extensions</th>
                    <th>Notes</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>PNG</td>
                    <td>.png</td>
                    <td>Lossless compression, supports transparency</td>
                </tr>
                <tr>
                    <td>JPEG</td>
                    <td>.jpg, .jpeg</td>
                    <td>Lossy compression, no transparency</td>
                </tr>
                <tr>
                    <td>GIF</td>
                    <td>.gif</td>
                    <td>Limited colors, supports animation</td>
                </tr>
                <tr>
                    <td>WebP</td>
                    <td>.webp</td>
                    <td>Modern format, lossy and lossless</td>
                </tr>
                <tr>
                    <td>SVG</td>
                    <td>.svg</td>
                    <td>Vector format rendered as bitmap</td>
                </tr>
            </tbody>
        </table>

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
                    <td>Unique identifier for the resource</td>
                </tr>
                <tr>
                    <td>type</td>
                    <td>string</td>
                    <td>Always <code>'image'</code> for bitmap resources</td>
                </tr>
                <tr>
                    <td>uri</td>
                    <td>string</td>
                    <td>Filename or full URL of the image</td>
                </tr>
            </tbody>
        </table>

        <h2>Registering a Bitmap Resource</h2>
        <app-docs-code-sample [code]="registerCode" language="javascript" label="JavaScript"></app-docs-code-sample>

        <h2>Displaying with ImageElement</h2>
        <p>
            Use ImageElement to display a bitmap resource at a specified position and size.
            The <code>source</code> property references the resource key.
        </p>
        <app-docs-code-sample [code]="displayCode" language="javascript" label="JavaScript"></app-docs-code-sample>

        <h2>Using as an Image Fill</h2>
        <p>
            Bitmap resources can be used as repeating fill patterns on shape elements.
        </p>
        <app-docs-code-sample [code]="fillCode" language="javascript" label="JavaScript"></app-docs-code-sample>

        <h2>Setting the Base Path</h2>
        <p>
            Set the model's base path so relative resource filenames resolve to full URLs.
            The base path is prepended to all relative resource URIs during loading.
        </p>
        <app-docs-code-sample [code]="basePathCode" language="javascript" label="JavaScript"></app-docs-code-sample>

        <app-docs-page-nav [previousPage]="previousPage" [nextPage]="nextPage"></app-docs-page-nav>
    `
})
export class BitmapResourcesPageComponent {
    previousPage?: DocsPage;
    nextPage?: DocsPage;

    registerCode = `const m = elise.model(260, 180);

// Register two bitmap resources with explicit keys
elise.bitmapResource('clouds', '/assets/test/images/clouds.jpg').addTo(m);
elise.bitmapResource('bulb', '/assets/test/images/bulb.png').addTo(m);

elise.image('clouds', 12, 12, 150, 110).addTo(m);
elise.image('bulb', 182, 26, 56, 56).addTo(m);`;

    displayCode = `const m = elise.model(320, 220);

// Register the image resource
elise.bitmapResource('clouds', '/assets/test/images/clouds.jpg').addTo(m);

// Create an ImageElement referencing the resource key
elise.image('clouds', 20, 20, 280, 180)
    .addTo(m);`;

    fillCode = `const m = elise.model(320, 220);

// Register a pattern image
elise.bitmapResource('pattern', '/assets/test/images/texture1.png').addTo(m);

// Use the bitmap as a repeating fill on shapes
elise.rectangle(20, 20, 130, 180)
    .setFill('image(pattern)')
    .setStroke('Black,1')
    .addTo(m);

elise.ellipse(225, 110, 70, 70)
    .setFill('image(pattern)')
    .setFillScale(1.4)
    .setStroke('Black,1')
    .addTo(m);`;

    basePathCode = `const m = elise.model(320, 220);

// Set base path for relative bitmap URLs
m.setBasePath('/assets/test');

// These relative image paths resolve against the base path
elise.bitmapResource('texture', '/images/texture2.jpg').addTo(m);
elise.bitmapResource('bulb', '/images/bulb.png').addTo(m);

elise.image('texture', 20, 20, 170, 180).addTo(m);
elise.image('bulb', 220, 52, 64, 64).addTo(m);`;

    constructor(docsService: DocsService) {
        this.previousPage = docsService.getPreviousPage('resources', 'bitmap-resources');
        this.nextPage = docsService.getNextPage('resources', 'bitmap-resources');
    }
}
