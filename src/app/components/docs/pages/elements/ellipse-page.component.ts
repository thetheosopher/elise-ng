import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DocsService, DocsPage } from '../../../../services/docs.service';
import { DocsPageNavComponent } from '../../docs-page-nav.component';
import { DocsCodeSampleComponent } from '../../docs-code-sample.component';

@Component({
    selector: 'app-ellipse-page',
    standalone: true,
    imports: [CommonModule, RouterModule, DocsPageNavComponent, DocsCodeSampleComponent],
    template: `
        <h1>Ellipse</h1>
        <p class="lead">
            The ellipse element renders an elliptical or circular shape with fill and stroke styling.
            When radiusX and radiusY are equal, the ellipse renders as a perfect circle.
        </p>

        <h2>Factory Method</h2>
        <p>
            Create an ellipse using the <code>elise.ellipse(centerX, centerY, radiusX, radiusY)</code> factory method.
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
                    <td><code>cx</code></td>
                    <td>number</td>
                    <td>0</td>
                    <td>X coordinate of the ellipse center</td>
                </tr>
                <tr>
                    <td><code>cy</code></td>
                    <td>number</td>
                    <td>0</td>
                    <td>Y coordinate of the ellipse center</td>
                </tr>
                <tr>
                    <td><code>radiusX</code></td>
                    <td>number</td>
                    <td>0</td>
                    <td>Horizontal radius of the ellipse</td>
                </tr>
                <tr>
                    <td><code>radiusY</code></td>
                    <td>number</td>
                    <td>0</td>
                    <td>Vertical radius of the ellipse</td>
                </tr>
            </tbody>
        </table>

        <h2>Circle</h2>
        <p>
            When radiusX and radiusY are equal, the ellipse renders as a circle.
        </p>
        <app-docs-code-sample [code]="basicCode" language="javascript" label="JavaScript"></app-docs-code-sample>

        <h2>Oval</h2>
        <p>
            Use different values for radiusX and radiusY to create an oval shape.
        </p>
        <app-docs-code-sample [code]="ovalCode" language="javascript" label="JavaScript"></app-docs-code-sample>

        <h2>Styled Ellipse</h2>
        <p>
            Ellipses support gradient fills and strokes for rich visual styling.
        </p>
        <app-docs-code-sample [code]="styledCode" language="javascript" label="JavaScript"></app-docs-code-sample>

        <app-docs-page-nav [previousPage]="previousPage" [nextPage]="nextPage"></app-docs-page-nav>
    `
})
export class EllipsePageComponent {
    previousPage?: DocsPage;
    nextPage?: DocsPage;

    basicCode = `const m = elise.model(200, 200);
elise.ellipse(100, 100, 60, 60)
    .setFill('#3b82f6')
    .addTo(m);`;

    ovalCode = `const m = elise.model(200, 120);
elise.ellipse(100, 60, 80, 40)
    .setFill('#ef4444')
    .addTo(m);`;

    styledCode = `const m = elise.model(200, 200);
const gradient = elise.radialGradientFill('100,100', '100,100', 80, 50);
gradient.addFillStop('#f59e0b', 0);
gradient.addFillStop('#ef4444', 1);

elise.ellipse(100, 100, 80, 50)
    .setFill(gradient)
    .setStroke('#8b5cf6,3')
    .addTo(m);`;

    constructor(docsService: DocsService) {
        this.previousPage = docsService.getPreviousPage('elements', 'ellipse');
        this.nextPage = docsService.getNextPage('elements', 'ellipse');
    }
}
