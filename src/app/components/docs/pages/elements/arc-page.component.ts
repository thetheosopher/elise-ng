import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocsService, DocsPage } from '../../../../services/docs.service';
import { DocsPageNavComponent } from '../../docs-page-nav.component';
import { DocsCodeSampleComponent } from '../../docs-code-sample.component';

@Component({
    selector: 'app-arc-page',
    standalone: true,
    imports: [CommonModule, DocsPageNavComponent, DocsCodeSampleComponent],
    template: `
        <h1>Arc</h1>
        <p class="lead">
            The arc element renders an open elliptical arc segment. Since it is an open shape,
            it only supports stroke styling.
        </p>

        <h2>Factory</h2>
        <p>
            Create an arc element using <code>elise.arc(x, y, width, height)</code>. The arc is
            positioned and sized using a bounding box, similar to the rectangle element. Use
            <code>setStartAngle()</code> and <code>setEndAngle()</code> to configure the sweep.
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
                    <td>x</td>
                    <td>number</td>
                    <td>0</td>
                    <td>X coordinate of the bounding box</td>
                </tr>
                <tr>
                    <td>y</td>
                    <td>number</td>
                    <td>0</td>
                    <td>Y coordinate of the bounding box</td>
                </tr>
                <tr>
                    <td>width</td>
                    <td>number</td>
                    <td>0</td>
                    <td>Width of the bounding box</td>
                </tr>
                <tr>
                    <td>height</td>
                    <td>number</td>
                    <td>0</td>
                    <td>Height of the bounding box</td>
                </tr>
                <tr>
                    <td>startAngle</td>
                    <td>number</td>
                    <td>0</td>
                    <td>Start angle in degrees</td>
                </tr>
                <tr>
                    <td>endAngle</td>
                    <td>number</td>
                    <td>90</td>
                    <td>End angle in degrees</td>
                </tr>
            </tbody>
        </table>

        <h2>Basic Semicircle</h2>
        <p>
            A semicircular arc spanning from 0 to 180 degrees.
        </p>
        <app-docs-code-sample [code]="basicCode" language="javascript" label="JavaScript"></app-docs-code-sample>

        <h2>Quarter Arc</h2>
        <p>
            A quarter arc spanning from 0 to 90 degrees.
        </p>
        <app-docs-code-sample [code]="quarterCode" language="javascript" label="JavaScript"></app-docs-code-sample>

        <h2>Styled Arc</h2>
        <p>
            An arc with a thick, colorful stroke.
        </p>
        <app-docs-code-sample [code]="styledCode" language="javascript" label="JavaScript"></app-docs-code-sample>

        <app-docs-page-nav [previousPage]="previousPage" [nextPage]="nextPage"></app-docs-page-nav>
    `
})
export class ArcPageComponent {
    previousPage?: DocsPage;
    nextPage?: DocsPage;

    basicCode = `const m = elise.model(200, 200);
elise.arc(20, 40, 160, 160)
    .setStartAngle(0)
    .setEndAngle(180)
    .setStroke('Blue,2')
    .addTo(m);`;

    quarterCode = `const m = elise.model(200, 200);
elise.arc(20, 20, 160, 160)
    .setStartAngle(0)
    .setEndAngle(90)
    .setStroke('Green,2')
    .addTo(m);`;

    styledCode = `const m = elise.model(200, 200);
elise.arc(20, 20, 160, 160)
    .setStartAngle(30)
    .setEndAngle(270)
    .setStroke('OrangeRed,6')
    .addTo(m);`;

    constructor(docsService: DocsService) {
        this.previousPage = docsService.getPreviousPage('elements', 'arc');
        this.nextPage = docsService.getNextPage('elements', 'arc');
    }
}
