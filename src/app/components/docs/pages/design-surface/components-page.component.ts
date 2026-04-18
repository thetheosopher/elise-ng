import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DocsService, DocsPage } from '../../../../services/docs.service';
import { DocsPageNavComponent } from '../../docs-page-nav.component';
import { DocsCodeSampleComponent } from '../../docs-code-sample.component';

@Component({
    imports: [CommonModule, RouterModule, DocsPageNavComponent, DocsCodeSampleComponent],
    template: `
        <h1>Components</h1>
        <p class="lead">
            The component system allows grouping elements into reusable, self-contained units
            with their own local coordinate system that can be positioned, scaled, and nested.
        </p>

        <h2>ComponentElement</h2>
        <p>
            A <code>ComponentElement</code> is a special design-time element that acts as a
            container for other elements. The contained elements share a local coordinate
            system relative to the component's origin, so moving or scaling the component
            affects all of its children as a unit.
        </p>

        <h2>Component Properties</h2>
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
                    <td><code>elements</code></td>
                    <td><code>ElementBase[]</code></td>
                    <td>The child elements contained within the component.</td>
                </tr>
                <tr>
                    <td><code>transform</code></td>
                    <td><code>Matrix2D</code></td>
                    <td>Local transform applied to the component's coordinate system.</td>
                </tr>
                <tr>
                    <td><code>bounds</code></td>
                    <td><code>Region</code></td>
                    <td>Bounding rectangle of the component in parent coordinates.</td>
                </tr>
            </tbody>
        </table>

        <h2>ComponentService</h2>
        <p>
            The <code>ComponentService</code> manages component creation, editing, and navigation.
            It tracks the current editing context — whether the user is editing at the root model
            level or inside a component.
        </p>

        <h2>Editing Components</h2>
        <p>
            <strong>Enter component</strong> — Double-click a component to enter its editing
            context. The component's child elements become selectable and editable. Elements
            outside the component are dimmed and non-interactive.
        </p>
        <p>
            <strong>Exit component</strong> — Click outside the component boundary or press
            <kbd>Escape</kbd> to return to the parent editing context. The component becomes
            a single selectable unit again.
        </p>

        <h2>Nesting</h2>
        <p>
            Components support nesting — a component can contain other components. Double-clicking
            drills into one level at a time than Double-clicking again on a nested component enters
            its context. <kbd>Escape</kbd> exits one level at a time back toward the root.
        </p>

        <h2>Creating a Component</h2>
        <app-docs-code-sample [code]="createCode" language="javascript" label="JavaScript"></app-docs-code-sample>

        <h2>Using Components</h2>
        <app-docs-code-sample [code]="usageCode" language="javascript" label="JavaScript"></app-docs-code-sample>

        <app-docs-page-nav [previousPage]="previousPage" [nextPage]="nextPage"></app-docs-page-nav>
    `
})
export class ComponentsPageComponent {
    previousPage: DocsPage | undefined;
    nextPage: DocsPage | undefined;

    createCode = `const m = elise.model(320, 220);

// Build the component contents in local coordinates
const buttonModel = elise.model(120, 64);
elise.rectangle(0, 0, 120, 64)
    .setFill('#2563eb')
    .setStroke('#1e3a8a,3')
    .addTo(buttonModel);

elise.ellipse(22, 32, 10, 10)
    .setFill('#bfdbfe')
    .addTo(buttonModel);

elise.text('Launch', 38, 18, 62, 28)
    .setFill('White')
    .setTypesize(18)
    .setTypeface('Segoe UI')
    .setAlignment('center,middle')
    .addTo(buttonModel);

// Register the model as a reusable component resource
elise.modelResource('primaryButton', buttonModel).addTo(m);

// Place the component element in the parent model
new elise.ComponentElement('primaryButton', 28, 78, 120, 64).addTo(m);

elise.text('A component is rendered from its own local model.', 26, 22, 268, 34)
    .setFill('#334155')
    .setTypesize(15)
    .setTypeface('Segoe UI')
    .setAlignment('center,middle')
    .addTo(m);`;

    usageCode = `const m = elise.model(320, 220);

// Create a nested badge component
const badgeModel = elise.model(44, 44);
elise.ellipse(22, 22, 18, 18)
    .setFill('#f59e0b')
    .setStroke('#b45309,2')
    .addTo(badgeModel);
elise.text('GO', 4, 11, 36, 20)
    .setFill('White')
    .setTypesize(12)
    .setTypeface('Segoe UI')
    .setAlignment('center,middle')
    .addTo(badgeModel);

// Create a larger card component that contains the badge
const cardModel = elise.model(140, 92);
elise.rectangle(0, 0, 140, 92)
    .setFill('#ecfeff')
    .setStroke('#0891b2,2')
    .addTo(cardModel);
elise.modelResource('badge', badgeModel).addTo(cardModel);
new elise.ComponentElement('badge', 12, 24, 44, 44).addTo(cardModel);
elise.text('Reusable card', 62, 14, 66, 24)
    .setFill('#0f172a')
    .setTypesize(13)
    .setTypeface('Segoe UI')
    .setAlignment('center,middle')
    .addTo(cardModel);
elise.text('Nested badge', 62, 42, 66, 16)
    .setFill('#475569')
    .setTypesize(9)
    .setTypeface('Segoe UI')
    .setAlignment('center,middle')
    .addTo(cardModel);
elise.text('Reused twice', 62, 58, 66, 14)
    .setFill('#475569')
    .setTypesize(9)
    .setTypeface('Segoe UI')
    .setAlignment('center,middle')
    .addTo(cardModel);

elise.modelResource('card', cardModel).addTo(m);

new elise.ComponentElement('card', 18, 26, 140, 92).addTo(m);
new elise.ComponentElement('card', 170, 48, 124, 82)
    .setOpacity(0.92)
    .addTo(m);`;

    constructor(private docsService: DocsService) {
        this.previousPage = docsService.getPreviousPage('design-surface', 'components');
        this.nextPage = docsService.getNextPage('design-surface', 'components');
    }
}
