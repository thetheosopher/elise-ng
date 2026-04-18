import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DocsService, DocsPage } from '../../../../services/docs.service';
import { DocsPageNavComponent } from '../../docs-page-nav.component';
import { CodeBlockComponent } from '../../../code-block/code-block.component';

@Component({
    selector: 'app-resource-manager-page',
    standalone: true,
    imports: [CommonModule, RouterModule, DocsPageNavComponent, CodeBlockComponent],
    template: `
        <h1>Resource Manager</h1>
        <p class="lead">
            The ResourceManager is accessed via <code>model.resourceManager</code> and provides the API
            for registering, retrieving, and managing all model resources. The controller calls
            <code>prepareResources()</code> during initialization to load all registered resources
            asynchronously before rendering.
        </p>

        <h2>Methods</h2>
        <table class="docs-table">
            <thead>
                <tr>
                    <th>Method</th>
                    <th>Returns</th>
                    <th>Description</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>add(key, source)</td>
                    <td>void</td>
                    <td>Register a resource with the given key and source (filename, URL, or inline data)</td>
                </tr>
                <tr>
                    <td>get(key)</td>
                    <td>Resource</td>
                    <td>Retrieve a registered resource by key</td>
                </tr>
                <tr>
                    <td>remove(key)</td>
                    <td>void</td>
                    <td>Unregister and dispose a resource by key</td>
                </tr>
                <tr>
                    <td>has(key)</td>
                    <td>boolean</td>
                    <td>Check whether a resource with the given key exists</td>
                </tr>
                <tr>
                    <td>clear()</td>
                    <td>void</td>
                    <td>Remove all registered resources</td>
                </tr>
                <tr>
                    <td>getKeys()</td>
                    <td>string[]</td>
                    <td>Return an array of all registered resource keys</td>
                </tr>
            </tbody>
        </table>

        <h2>API Usage</h2>
        <app-code-block [code]="apiCode" language="javascript" label="JavaScript"></app-code-block>

        <h2>Checking Resource Loading Status</h2>
        <p>
            Resources are loaded asynchronously by the controller. You can check loading status
            and handle loaded/error events during the preparation phase.
        </p>
        <app-code-block [code]="checkCode" language="javascript" label="JavaScript"></app-code-block>

        <app-docs-page-nav [previousPage]="previousPage" [nextPage]="nextPage"></app-docs-page-nav>
    `
})
export class ResourceManagerPageComponent {
    previousPage?: DocsPage;
    nextPage?: DocsPage;

    apiCode = `const m = elise.model(400, 300);
const rm = m.resourceManager;

// Add resources
rm.add('logo', 'logo.png');
rm.add('badge', 'badge.mdl');
rm.add('greeting', 'Hello, World!');

// Check existence
if (rm.has('logo')) {
    console.log('Logo resource is registered');
}

// Get all registered keys
const keys = rm.getKeys();
console.log('Resources:', keys); // ['logo', 'badge', 'greeting']

// Retrieve a resource
const logoResource = rm.get('logo');

// Remove a single resource
rm.remove('badge');

// Clear all resources
rm.clear();`;

    checkCode = `const m = elise.model(400, 300);
const rm = m.resourceManager;

// Register resources
rm.add('photo', 'photo.jpg');
rm.add('icon', 'icon.png');

// The controller handles resource loading during initialization
// prepareResources() returns a promise that resolves when all resources are loaded
controller.prepareResources().then(() => {
    console.log('All resources loaded successfully');
    controller.draw();
}).catch((error) => {
    console.error('Resource loading failed:', error);
});`;

    constructor(docsService: DocsService) {
        this.previousPage = docsService.getPreviousPage('resources', 'resource-manager');
        this.nextPage = docsService.getNextPage('resources', 'resource-manager');
    }
}
