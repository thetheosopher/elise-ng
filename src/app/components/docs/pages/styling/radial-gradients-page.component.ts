import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DocsService, DocsPage } from '../../../../services/docs.service';
import { DocsPageNavComponent } from '../../docs-page-nav.component';
import { DocsCodeSampleComponent } from '../../docs-code-sample.component';

@Component({
    selector: 'app-radial-gradients-page',
    standalone: true,
    imports: [CommonModule, RouterModule, DocsPageNavComponent, DocsCodeSampleComponent],
    template: `
        <h1>Radial Gradients</h1>
        <p class="lead">
            Radial gradients create circular or elliptical color transitions radiating from a center point.
            Create them with <code>elise.radialGradientFill(center, focus, radiusX, radiusY)</code>,
            then add fill stops before assigning the gradient to an element.
        </p>

        <h2>Creating a Radial Gradient</h2>
        <p>
            The gradient is defined by a center point, a focal point, and X/Y radii that control the
            extent. Center and focus are serialized as <code>'x,y'</code> strings in model space,
            and color stops are added with <code>.addFillStop(color, offset)</code>.
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
                    <td><code>center</code></td>
                    <td>string</td>
                    <td>Center point of the gradient, serialized as <code>'x,y'</code></td>
                </tr>
                <tr>
                    <td><code>focus</code></td>
                    <td>string</td>
                    <td>Focal point where the first color stop appears, serialized as <code>'x,y'</code></td>
                </tr>
                <tr>
                    <td><code>radiusX</code></td>
                    <td>number</td>
                    <td>Horizontal radius of the gradient extent</td>
                </tr>
                <tr>
                    <td><code>radiusY</code></td>
                    <td>number</td>
                    <td>Vertical radius of the gradient extent</td>
                </tr>
                <tr>
                    <td><code>stops</code></td>
                    <td>GradientStop[]</td>
                    <td>Array of color stops, each with an offset (0–1) and a color string</td>
                </tr>
            </tbody>
        </table>

        <h2>Centered Radial Gradient</h2>
        <p>
            A centered radial gradient with equal radii creates a circular color transition.
        </p>
        <app-docs-code-sample [code]="centeredCode" language="javascript" label="JavaScript"></app-docs-code-sample>

        <h2>Off-Center Focus</h2>
        <p>
            Moving the focus point away from the center creates a highlight effect, as if light
            is hitting the surface from an angle.
        </p>
        <app-docs-code-sample [code]="offsetCode" language="javascript" label="JavaScript"></app-docs-code-sample>

        <h2>Elliptical Gradient</h2>
        <p>
            Using different values for radiusX and radiusY produces an elliptical gradient shape.
        </p>
        <app-docs-code-sample [code]="ellipticalCode" language="javascript" label="JavaScript"></app-docs-code-sample>

        <h2>Sphere Effect</h2>
        <p>
            Combine an off-center focus with carefully chosen color stops to simulate a
            three-dimensional sphere with lighting.
        </p>
        <app-docs-code-sample [code]="sphereCode" language="javascript" label="JavaScript"></app-docs-code-sample>

        <app-docs-page-nav [previousPage]="previousPage" [nextPage]="nextPage"></app-docs-page-nav>
    `
})
export class RadialGradientsPageComponent {
    previousPage?: DocsPage;
    nextPage?: DocsPage;

    centeredCode = `const m = elise.model(200, 200);
const gradient = elise.radialGradientFill('100,100', '100,100', 80, 80);
gradient.addFillStop('#fbbf24', 0);
gradient.addFillStop('#ef4444', 1);

elise.ellipse(100, 100, 80, 80)
    .setFill(gradient)
    .addTo(m);`;

    offsetCode = `const m = elise.model(200, 200);
const gradient = elise.radialGradientFill('100,100', '70,70', 80, 80);
gradient.addFillStop('White', 0);
gradient.addFillStop('#3b82f6', 1);

elise.ellipse(100, 100, 80, 80)
    .setFill(gradient)
    .addTo(m);`;

    ellipticalCode = `const m = elise.model(300, 160);
const gradient = elise.radialGradientFill('150,80', '150,80', 120, 60);
gradient.addFillStop('#a78bfa', 0);
gradient.addFillStop('#4c1d95', 1);

elise.ellipse(150, 80, 120, 60)
    .setFill(gradient)
    .addTo(m);`;

    sphereCode = `const m = elise.model(200, 200);
const gradient = elise.radialGradientFill('100,100', '75,75', 80, 80);
gradient.addFillStop('White', 0);
gradient.addFillStop('#60a5fa', 0.3);
gradient.addFillStop('#2563eb', 0.7);
gradient.addFillStop('#1e3a8a', 1);

elise.ellipse(100, 100, 80, 80)
    .setFill(gradient)
    .addTo(m);`;

    constructor(docsService: DocsService) {
        this.previousPage = docsService.getPreviousPage('styling', 'radial-gradients');
        this.nextPage = docsService.getNextPage('styling', 'radial-gradients');
    }
}
