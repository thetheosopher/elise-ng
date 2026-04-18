import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DocsService, DocsPage } from '../../../../services/docs.service';
import { DocsPageNavComponent } from '../../docs-page-nav.component';
import { DocsCodeSampleComponent } from '../../docs-code-sample.component';

@Component({
    selector: 'app-linear-gradients-page',
    standalone: true,
    imports: [CommonModule, RouterModule, DocsPageNavComponent, DocsCodeSampleComponent],
    template: `
        <h1>Linear Gradients</h1>
        <p class="lead">
            Linear gradients create smooth color transitions along a line between two points.
            Create them with <code>elise.linearGradientFill(start, end)</code>, add fill stops,
            and assign the result as an element's fill.
        </p>

        <h2>Creating a Linear Gradient</h2>
        <p>
            Create the gradient by specifying start and end points as serialized model coordinates
            such as <code>'20,20'</code> and <code>'280,100'</code>. Then add color stops with
            <code>.addFillStop(color, offset)</code>, where offset ranges from 0 (start) to 1 (end).
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
                    <td><code>start</code></td>
                    <td>string</td>
                    <td>Start point of the gradient line, serialized as <code>'x,y'</code></td>
                </tr>
                <tr>
                    <td><code>end</code></td>
                    <td>string</td>
                    <td>End point of the gradient line, serialized as <code>'x,y'</code></td>
                </tr>
                <tr>
                    <td><code>stops</code></td>
                    <td>GradientStop[]</td>
                    <td>Array of color stops, each with an offset (0–1) and a color string</td>
                </tr>
            </tbody>
        </table>

        <h2>Horizontal Gradient</h2>
        <p>
            A left-to-right gradient uses start and end points along the same horizontal line.
        </p>
        <app-docs-code-sample [code]="horizontalCode" language="javascript" label="JavaScript"></app-docs-code-sample>

        <h2>Vertical Gradient</h2>
        <p>
            A top-to-bottom gradient uses start and end points along the same vertical line.
        </p>
        <app-docs-code-sample [code]="verticalCode" language="javascript" label="JavaScript"></app-docs-code-sample>

        <h2>Diagonal Gradient</h2>
        <p>
            Use corner-to-corner points for a diagonal gradient effect.
        </p>
        <app-docs-code-sample [code]="diagonalCode" language="javascript" label="JavaScript"></app-docs-code-sample>

        <h2>Multiple Color Stops</h2>
        <p>
            Add multiple stops to create complex color transitions with intermediate colors.
        </p>
        <app-docs-code-sample [code]="multiStopCode" language="javascript" label="JavaScript"></app-docs-code-sample>

        <app-docs-page-nav [previousPage]="previousPage" [nextPage]="nextPage"></app-docs-page-nav>
    `
})
export class LinearGradientsPageComponent {
    previousPage?: DocsPage;
    nextPage?: DocsPage;

    horizontalCode = `const m = elise.model(300, 120);
const gradient = elise.linearGradientFill('20,60', '280,60');
gradient.addFillStop('#3b82f6', 0);
gradient.addFillStop('#8b5cf6', 1);

elise.rectangle(20, 10, 260, 100)
    .setFill(gradient)
    .addTo(m);`;

    verticalCode = `const m = elise.model(200, 200);
const gradient = elise.linearGradientFill('100,20', '100,180');
gradient.addFillStop('#ef4444', 0);
gradient.addFillStop('#fbbf24', 1);

elise.rectangle(20, 20, 160, 160)
    .setFill(gradient)
    .addTo(m);`;

    diagonalCode = `const m = elise.model(200, 200);
const gradient = elise.linearGradientFill('20,20', '180,180');
gradient.addFillStop('#10b981', 0);
gradient.addFillStop('#3b82f6', 1);

elise.ellipse(100, 100, 80, 80)
    .setFill(gradient)
    .addTo(m);`;

    multiStopCode = `const m = elise.model(400, 120);
const gradient = elise.linearGradientFill('20,60', '380,60');
gradient.addFillStop('#ef4444', 0);
gradient.addFillStop('#f59e0b', 0.25);
gradient.addFillStop('#10b981', 0.5);
gradient.addFillStop('#3b82f6', 0.75);
gradient.addFillStop('#8b5cf6', 1);

elise.rectangle(20, 10, 360, 100)
    .setFill(gradient)
    .addTo(m);`;

    constructor(docsService: DocsService) {
        this.previousPage = docsService.getPreviousPage('styling', 'linear-gradients');
        this.nextPage = docsService.getNextPage('styling', 'linear-gradients');
    }
}
