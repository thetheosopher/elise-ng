import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocsService, DocsPage } from '../../../../services/docs.service';
import { DocsPageNavComponent } from '../../docs-page-nav.component';
import { DocsCodeSampleComponent } from '../../docs-code-sample.component';

@Component({
    selector: 'app-polygon-page',
    standalone: true,
    imports: [CommonModule, DocsPageNavComponent, DocsCodeSampleComponent],
    template: `
        <h1>Polygon</h1>
        <p class="lead">
            The polygon element renders a closed shape defined by a series of points.
            Polygons support both fill and stroke styling, and support point editing in design mode.
        </p>

        <h2>Factory Method</h2>
        <p>
            Create a polygon using <code>elise.polygon()</code> and add vertices with
            <code>.addPoint(elise.point(x, y))</code>. The shape closes automatically.
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
                    <td><code>points</code></td>
                    <td>PointDepth[]</td>
                    <td>[]</td>
                    <td>Array of points defining the polygon vertices</td>
                </tr>
                <tr>
                    <td><code>winding</code></td>
                    <td><code>WindingMode</code></td>
                    <td><code>WindingMode.NonZero</code></td>
                    <td>Controls how overlapping areas are filled using <code>elise.WindingMode.NonZero</code> or <code>elise.WindingMode.EvenOdd</code></td>
                </tr>
                <tr>
                    <td><code>smoothPoints</code></td>
                    <td>boolean</td>
                    <td>false</td>
                    <td>When true, renders smooth cubic bezier curves through the points</td>
                </tr>
            </tbody>
        </table>

        <h2>Triangle</h2>
        <p>
            A simple polygon created from three points.
        </p>
        <app-docs-code-sample [code]="triangleCode" language="javascript" label="JavaScript"></app-docs-code-sample>

        <h2>Star</h2>
        <p>
            A star shape created by alternating between outer and inner radius points.
        </p>
        <app-docs-code-sample [code]="starCode" language="javascript" label="JavaScript"></app-docs-code-sample>

        <h2>Styled Polygon</h2>
        <p>
            Polygons support gradients and stroke styling for more decorative shapes.
        </p>
        <app-docs-code-sample [code]="styledCode" language="javascript" label="JavaScript"></app-docs-code-sample>

        <app-docs-page-nav [previousPage]="previousPage" [nextPage]="nextPage"></app-docs-page-nav>
    `
})
export class PolygonPageComponent {
    previousPage?: DocsPage;
    nextPage?: DocsPage;

    triangleCode = `const m = elise.model(200, 200);
elise.polygon()
    .addPoint(elise.point(100, 20))
    .addPoint(elise.point(180, 180))
    .addPoint(elise.point(20, 180))
    .setFill('#3b82f6')
    .setStroke('#ef4444,2')
    .addTo(m);`;

    starCode = `const m = elise.model(200, 200);
elise.polygon()
    .addPoint(elise.point(100, 10))
    .addPoint(elise.point(120, 75))
    .addPoint(elise.point(190, 75))
    .addPoint(elise.point(135, 120))
    .addPoint(elise.point(155, 185))
    .addPoint(elise.point(100, 145))
    .addPoint(elise.point(45, 185))
    .addPoint(elise.point(65, 120))
    .addPoint(elise.point(10, 75))
    .addPoint(elise.point(80, 75))
    .setFill('#f59e0b')
    .setStroke('#ef4444,2')
    .addTo(m);`;

    styledCode = `const m = elise.model(200, 200);
const gradient = elise.linearGradientFill('30,20', '170,150');
gradient.addFillStop('#10b981', 0);
gradient.addFillStop('#3b82f6', 1);

elise.polygon()
    .addPoint(elise.point(100, 20))
    .addPoint(elise.point(170, 70))
    .addPoint(elise.point(150, 150))
    .addPoint(elise.point(50, 150))
    .addPoint(elise.point(30, 70))
    .setFill(gradient)
    .setStroke('#8b5cf6,3')
    .addTo(m);`;

    constructor(docsService: DocsService) {
        this.previousPage = docsService.getPreviousPage('elements', 'polygon');
        this.nextPage = docsService.getNextPage('elements', 'polygon');
    }
}
