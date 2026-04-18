import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocsService, DocsPage } from '../../../../services/docs.service';
import { DocsPageNavComponent } from '../../docs-page-nav.component';
import { DocsCodeSampleComponent } from '../../docs-code-sample.component';

@Component({
    selector: 'app-polyline-page',
    standalone: true,
    imports: [CommonModule, DocsPageNavComponent, DocsCodeSampleComponent],
    template: `
        <h1>Polyline</h1>
        <p class="lead">
            The polyline element renders an open series of connected line segments.
            Polylines only support stroke styling and support point editing in design mode.
        </p>

        <h2>Factory Method</h2>
        <p>
            Create a polyline using <code>elise.polyline()</code> and add vertices with
            <code>.addPoint(elise.point(x, y))</code>.
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
                    <td>Array of points that define the connected path</td>
                </tr>
                <tr>
                    <td><code>smoothPoints</code></td>
                    <td>boolean</td>
                    <td>false</td>
                    <td>When true, renders smooth cubic bezier curves through the points</td>
                </tr>
            </tbody>
        </table>

        <h2>Basic Polyline</h2>
        <p>
            Create a polyline by adding a series of connected points.
        </p>
        <app-docs-code-sample [code]="basicCode" language="javascript" label="JavaScript"></app-docs-code-sample>

        <h2>Smooth Polyline</h2>
        <p>
            Enable <code>smoothPoints</code> to render smooth cubic bezier curves through each point.
        </p>
        <app-docs-code-sample [code]="smoothCode" language="javascript" label="JavaScript"></app-docs-code-sample>

        <h2>Styled Polyline</h2>
        <p>
            Polylines support dashed strokes and custom stroke widths.
        </p>
        <app-docs-code-sample [code]="styledCode" language="javascript" label="JavaScript"></app-docs-code-sample>

        <app-docs-page-nav [previousPage]="previousPage" [nextPage]="nextPage"></app-docs-page-nav>
    `
})
export class PolylinePageComponent {
    previousPage?: DocsPage;
    nextPage?: DocsPage;

    basicCode = `const m = elise.model(200, 120);
elise.polyline()
    .addPoint(elise.point(20, 100))
    .addPoint(elise.point(60, 20))
    .addPoint(elise.point(100, 80))
    .addPoint(elise.point(140, 30))
    .addPoint(elise.point(180, 100))
    .setStroke('#3b82f6,2')
    .addTo(m);`;

    smoothCode = `const m = elise.model(200, 120);
elise.polyline()
    .addPoint(elise.point(20, 100))
    .addPoint(elise.point(60, 20))
    .addPoint(elise.point(100, 80))
    .addPoint(elise.point(140, 30))
    .addPoint(elise.point(180, 100))
    .setSmoothPoints(true)
    .setStroke('#8b5cf6,2')
    .addTo(m);`;

    styledCode = `const m = elise.model(200, 120);
elise.polyline()
    .addPoint(elise.point(20, 60))
    .addPoint(elise.point(70, 20))
    .addPoint(elise.point(120, 100))
    .addPoint(elise.point(180, 40))
    .setStroke('#ef4444,4')
    .setStrokeDash([12, 6])
    .addTo(m);`;

    constructor(docsService: DocsService) {
        this.previousPage = docsService.getPreviousPage('elements', 'polyline');
        this.nextPage = docsService.getNextPage('elements', 'polyline');
    }
}
