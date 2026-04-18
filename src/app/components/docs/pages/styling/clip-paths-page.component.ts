import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DocsService, DocsPage } from '../../../../services/docs.service';
import { DocsPageNavComponent } from '../../docs-page-nav.component';
import { DocsCodeSampleComponent } from '../../docs-code-sample.component';

@Component({
    selector: 'app-clip-paths-page',
    standalone: true,
    imports: [CommonModule, RouterModule, DocsPageNavComponent, DocsCodeSampleComponent],
    template: `
        <h1>Clip Paths</h1>
        <p class="lead">
            Clip paths define a clipping region that masks an element to a specific shape.
            Set via <code>element.setClipPath(clipPath)</code> or
            <code>element.clipPath = config</code>. Clip paths use SVG-like path commands
            to describe the clipping boundary.
        </p>

        <h2>Clip Path Properties</h2>
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
                    <td><code>commands</code></td>
                    <td>string</td>
                    <td>SVG path data defining the clip region (e.g. M, L, C, A, Z commands)</td>
                </tr>
            </tbody>
        </table>

        <h2>SVG Path Commands</h2>
        <table class="docs-table">
            <thead>
                <tr>
                    <th>Command</th>
                    <th>Description</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><code>M x,y</code></td>
                    <td>Move to point</td>
                </tr>
                <tr>
                    <td><code>L x,y</code></td>
                    <td>Line to point</td>
                </tr>
                <tr>
                    <td><code>C x1,y1 x2,y2 x,y</code></td>
                    <td>Cubic Bézier curve</td>
                </tr>
                <tr>
                    <td><code>Q x1,y1 x,y</code></td>
                    <td>Quadratic Bézier curve</td>
                </tr>
                <tr>
                    <td><code>A rx,ry rot large-arc sweep x,y</code></td>
                    <td>Elliptical arc</td>
                </tr>
                <tr>
                    <td><code>Z</code></td>
                    <td>Close path</td>
                </tr>
            </tbody>
        </table>

        <h2>Circle Clip Path</h2>
        <p>
            A circular clip path applied to a rectangle. Only the area within the circle is visible.
        </p>
        <app-docs-code-sample [code]="circleClipCode" language="javascript" label="JavaScript"></app-docs-code-sample>

        <h2>Triangle Clip Path</h2>
        <p>
            A triangular clip path created with three line segments. The element content is
            masked to the triangle shape.
        </p>
        <app-docs-code-sample [code]="triangleClipCode" language="javascript" label="JavaScript"></app-docs-code-sample>

        <h2>Complex Clip Path</h2>
        <p>
            Clip paths can include curves and arcs for more organic shapes. This example
            uses cubic Bézier curves to create a smooth, irregular clipping region.
        </p>
        <app-docs-code-sample [code]="complexClipCode" language="javascript" label="JavaScript"></app-docs-code-sample>

        <app-docs-page-nav [previousPage]="previousPage" [nextPage]="nextPage"></app-docs-page-nav>
    `
})
export class ClipPathsPageComponent {
    previousPage?: DocsPage;
    nextPage?: DocsPage;

    circleClipCode = `const m = elise.model(200, 200);

// Rectangle clipped to a circle
elise.rectangle(20, 20, 160, 160)
    .setFill('SteelBlue')
    .setClipPath({ commands: ['m100,20', 'A80,80,0,1,1,100,180', 'A80,80,0,1,1,100,20', 'z'] })
    .addTo(m);`;

    triangleClipCode = `const m = elise.model(200, 200);

// Rectangle clipped to a triangle
elise.rectangle(10, 10, 180, 180)
    .setFill('Coral')
    .setClipPath({ commands: ['m100,10', 'l190,180', 'l10,180', 'z'] })
    .addTo(m);`;

    complexClipCode = `const m = elise.model(300, 200);

// Rectangle clipped with a smooth curved path
elise.rectangle(10, 10, 280, 180)
    .setFill('MediumSeaGreen')
    .setClipPath({
        commands: ['m50,10', 'c100,10,150,60,200,40', 'c250,20,280,80,280,120', 'c280,160,220,190,150,180', 'c80,170,10,140,10,100', 'c10,60,20,10,50,10', 'z']
    })
    .addTo(m);`;

    constructor(private docsService: DocsService) {
        this.previousPage = docsService.getPreviousPage('styling', 'clip-paths');
        this.nextPage = docsService.getNextPage('styling', 'clip-paths');
    }
}
