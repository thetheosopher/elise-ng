import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DocsService, DocsPage } from '../../../../services/docs.service';
import { DocsPageNavComponent } from '../../docs-page-nav.component';
import { DocsCodeSampleComponent } from '../../docs-code-sample.component';

@Component({
    selector: 'app-rectangle-page',
    standalone: true,
    imports: [CommonModule, RouterModule, DocsPageNavComponent, DocsCodeSampleComponent],
    template: `
        <h1>Rectangle</h1>
        <p class="lead">
            The rectangle element renders a rectangular shape with optional rounded corners,
            fill, and stroke styling.
        </p>

        <h2>Factory Method</h2>
        <p>
            Create a rectangle using the <code>elise.rectangle(x, y, width, height)</code> factory method.
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
                    <td><code>x</code></td>
                    <td>number</td>
                    <td>0</td>
                    <td>X coordinate of the rectangle's top-left corner</td>
                </tr>
                <tr>
                    <td><code>y</code></td>
                    <td>number</td>
                    <td>0</td>
                    <td>Y coordinate of the rectangle's top-left corner</td>
                </tr>
                <tr>
                    <td><code>width</code></td>
                    <td>number</td>
                    <td>0</td>
                    <td>Width of the rectangle</td>
                </tr>
                <tr>
                    <td><code>height</code></td>
                    <td>number</td>
                    <td>0</td>
                    <td>Height of the rectangle</td>
                </tr>
                <tr>
                    <td><code>cornerRadii</code></td>
                        <td>[number, number, number, number]</td>
                    <td>undefined</td>
                        <td>Per-corner radii stored as [topLeft, topRight, bottomRight, bottomLeft]. Use <code>setCornerRadius(radius)</code> for uniform rounding or <code>setCornerRadii(topLeft, topRight, bottomRight, bottomLeft)</code> for per-corner control.</td>
                </tr>
            </tbody>
        </table>

        <h2>Basic Rectangle</h2>
        <p>
            Create a rectangle with a position and solid fill color.
        </p>
        <app-docs-code-sample [code]="basicCode" language="javascript" label="JavaScript"></app-docs-code-sample>

        <h2>Rounded Corners</h2>
        <p>
            Use <code>setCornerRadius(radius)</code> for uniform rounding or
            <code>setCornerRadii(topLeft, topRight, bottomRight, bottomLeft)</code> for per-corner control.
        </p>
        <app-docs-code-sample [code]="roundedCode" language="javascript" label="JavaScript"></app-docs-code-sample>

        <h2>Styled Rectangle</h2>
        <p>
            Rectangles support gradient fills, strokes, shadows, and opacity.
        </p>
        <app-docs-code-sample [code]="styledCode" language="javascript" label="JavaScript"></app-docs-code-sample>

        <app-docs-page-nav [previousPage]="previousPage" [nextPage]="nextPage"></app-docs-page-nav>
    `
})
export class RectanglePageComponent {
    previousPage?: DocsPage;
    nextPage?: DocsPage;

    basicCode = `const m = elise.model(200, 120);
elise.rectangle(20, 20, 160, 80)
    .setFill('#3b82f6')
    .addTo(m);`;

    roundedCode = `const m = elise.model(200, 200);
// Uniform corner radius
elise.rectangle(20, 20, 160, 60)
    .setCornerRadii(12)
    .setFill('#10b981')
    .addTo(m);

// Per-corner radii
elise.rectangle(20, 110, 160, 60)
    .setCornerRadii(20, 0, 20, 0)
    .setFill('#f59e0b')
    .addTo(m);`;

    styledCode = `const m = elise.model(200, 200);
const gradient = elise.linearGradientFill('20,20', '180,180');
gradient.addFillStop('#3b82f6', 0);
gradient.addFillStop('#8b5cf6', 1);

elise.rectangle(20, 20, 160, 160)
    .setCornerRadii(8)
    .setFill(gradient)
    .setStroke('#1e3a5f,2')
    .setShadow({ color: 'rgba(0,0,0,0.3)', blur: 8, offsetX: 4, offsetY: 4 })
    .setOpacity(0.9)
    .addTo(m);`;

    constructor(docsService: DocsService) {
        this.previousPage = docsService.getPreviousPage('elements', 'rectangle');
        this.nextPage = docsService.getNextPage('elements', 'rectangle');
    }
}
