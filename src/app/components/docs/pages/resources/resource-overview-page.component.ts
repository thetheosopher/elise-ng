import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DocsService, DocsPage } from '../../../../services/docs.service';
import { DocsPageNavComponent } from '../../docs-page-nav.component';
import { CodeBlockComponent } from '../../../code-block/code-block.component';

@Component({
    selector: 'app-resource-overview-page',
    standalone: true,
    imports: [CommonModule, RouterModule, DocsPageNavComponent, CodeBlockComponent],
    template: `
        <h1>Resource Overview</h1>
        <p class="lead">
            Resources are external assets — images, nested models, and text fragments — that are loaded
            asynchronously and referenced by key. A model's ResourceManager holds all resource registrations
            and coordinates loading before rendering begins.
        </p>

        <h2>How Resources Work</h2>
        <p>
            Each resource is registered with a unique string key and a source (a filename, URL, or inline data).
            When the controller initializes, it calls <code>prepareResources()</code> to load all registered
            resources asynchronously. Once loaded, elements can reference resources by key. The model's
            <code>basePath</code> is prepended to relative filenames to form full URLs.
        </p>

        <h2>Resource Types</h2>
        <table class="docs-table">
            <thead>
                <tr>
                    <th>Type</th>
                    <th>Description</th>
                    <th>Used By</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><a routerLink="/docs/resources/bitmap-resources">Bitmap Resources</a></td>
                    <td>Images in PNG, JPG, GIF, WebP, or SVG format</td>
                    <td>ImageElement, image fills</td>
                </tr>
                <tr>
                    <td><a routerLink="/docs/resources/model-resources">Model Resources</a></td>
                    <td>Nested Elise models loaded by URL or registered inline</td>
                    <td>ModelElement, model fills</td>
                </tr>
                <tr>
                    <td><a routerLink="/docs/resources/text-resources">Text Resources</a></td>
                    <td>Text fragments for localization or dynamic content</td>
                    <td>TextElement</td>
                </tr>
            </tbody>
        </table>

        <h2>Resource Lifecycle</h2>
        <p>
            Resources follow a defined lifecycle: registration, loading, usage, and disposal.
        </p>
        <table class="docs-table">
            <thead>
                <tr>
                    <th>Phase</th>
                    <th>Description</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Registration</td>
                    <td>Resources are added to the model's ResourceManager with a key and source</td>
                </tr>
                <tr>
                    <td>Loading</td>
                    <td>The controller calls <code>prepareResources()</code> to load all resources asynchronously</td>
                </tr>
                <tr>
                    <td>Usage</td>
                    <td>Elements reference loaded resources by key for rendering</td>
                </tr>
                <tr>
                    <td>Disposal</td>
                    <td>Resources can be removed individually or cleared entirely via the ResourceManager</td>
                </tr>
            </tbody>
        </table>

        <h2>Registering Resources</h2>
        <app-code-block [code]="registerCode" language="javascript" label="JavaScript"></app-code-block>

        <h2>Serialized Resource Format</h2>
        <p>
            In serialized models, resources are stored in the model's <code>resources</code> array.
        </p>
        <app-code-block [code]="serializedCode" language="javascript" label="JavaScript"></app-code-block>

        <app-docs-page-nav [previousPage]="previousPage" [nextPage]="nextPage"></app-docs-page-nav>
    `
})
export class ResourceOverviewPageComponent {
    previousPage?: DocsPage;
    nextPage?: DocsPage;

    registerCode = `const m = elise.model(400, 300);

// Register a bitmap resource
m.resourceManager.add('logo', 'logo.png');

// Register a model resource by URL
m.resourceManager.add('badge', 'badge.mdl');

// Register a text resource
m.resourceManager.add('greeting', 'Hello, World!');

// Set base path for relative resource URLs
m.setBasePath('https://example.com/assets/');`;

    serializedCode = `{
    "width": 400,
    "height": 300,
    "basePath": "https://example.com/assets/",
    "resources": [
        { "key": "logo", "type": "image", "uri": "logo.png" },
        { "key": "badge", "type": "model", "uri": "badge.mdl" },
        { "key": "greeting", "type": "text", "uri": "Hello, World!" }
    ]
}`;

    constructor(docsService: DocsService) {
        this.previousPage = docsService.getPreviousPage('resources', 'resource-overview');
        this.nextPage = docsService.getNextPage('resources', 'resource-overview');
    }
}
