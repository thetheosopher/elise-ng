import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DocsService, DocsPage } from '../../../../services/docs.service';
import { DocsPageNavComponent } from '../../docs-page-nav.component';
import { DocsCodeSampleComponent } from '../../docs-code-sample.component';

@Component({
    selector: 'app-line-page',
    standalone: true,
    imports: [CommonModule, RouterModule, DocsPageNavComponent, DocsCodeSampleComponent],
    template: `
        <h1>Line</h1>
        <p class="lead">
            The line element renders a straight line between two points.
            Lines only support stroke styling (no fill) and support point editing in design mode.
        </p>

        <h2>Factory Method</h2>
        <p>
            Create a line using the <code>elise.line(x1, y1, x2, y2)</code> factory method.
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
                    <td><code>x1</code></td>
                    <td>number</td>
                    <td>0</td>
                    <td>X coordinate of the start point</td>
                </tr>
                <tr>
                    <td><code>y1</code></td>
                    <td>number</td>
                    <td>0</td>
                    <td>Y coordinate of the start point</td>
                </tr>
                <tr>
                    <td><code>x2</code></td>
                    <td>number</td>
                    <td>0</td>
                    <td>X coordinate of the end point</td>
                </tr>
                <tr>
                    <td><code>y2</code></td>
                    <td>number</td>
                    <td>0</td>
                    <td>Y coordinate of the end point</td>
                </tr>
            </tbody>
        </table>

        <h2>Basic Line</h2>
        <p>
            Create a simple line with a colored stroke.
        </p>
        <app-docs-code-sample [code]="basicCode" language="javascript" label="JavaScript"></app-docs-code-sample>

        <h2>Dashed Line</h2>
        <p>
            Use a dash pattern to create dashed or dotted lines.
        </p>
        <app-docs-code-sample [code]="dashedCode" language="javascript" label="JavaScript"></app-docs-code-sample>

        <h2>Thick Line</h2>
        <p>
            Increase the stroke width for a thicker line.
        </p>
        <app-docs-code-sample [code]="thickCode" language="javascript" label="JavaScript"></app-docs-code-sample>

        <app-docs-page-nav [previousPage]="previousPage" [nextPage]="nextPage"></app-docs-page-nav>
    `
})
export class LinePageComponent {
    previousPage?: DocsPage;
    nextPage?: DocsPage;

    basicCode = `const m = elise.model(200, 120);
elise.line(20, 20, 180, 100)
    .setStroke('#3b82f6,2')
    .addTo(m);`;

    dashedCode = `const m = elise.model(200, 120);
elise.line(20, 60, 180, 60)
    .setStroke('#ef4444,2')
    .setStrokeDash([8, 4])
    .addTo(m);`;

    thickCode = `const m = elise.model(200, 120);
elise.line(20, 100, 180, 20)
    .setStroke('#10b981,6')
    .addTo(m);`;

    constructor(docsService: DocsService) {
        this.previousPage = docsService.getPreviousPage('elements', 'line');
        this.nextPage = docsService.getNextPage('elements', 'line');
    }
}
