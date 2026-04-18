import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocsService, DocsPage } from '../../../../services/docs.service';
import { DocsPageNavComponent } from '../../docs-page-nav.component';
import { DocsCodeSampleComponent } from '../../docs-code-sample.component';

@Component({
    selector: 'app-ring-page',
    standalone: true,
    imports: [CommonModule, DocsPageNavComponent, DocsCodeSampleComponent],
    template: `
        <h1>Ring</h1>
        <p class="lead">
            The ring element renders a donut or annulus shape defined by an outer ellipse and an inner
            radius scale. It supports both fill and stroke styling.
        </p>

        <h2>Factory</h2>
        <p>
            Create a ring element using <code>elise.ring(x, y, width, height)</code>. The
            <code>setInnerRadiusScale()</code> method controls the size of the inner hole.
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
                    <td>innerRadiusScale</td>
                    <td>number</td>
                    <td>0.55</td>
                    <td>Ratio of inner to outer radius (0 to 1). Higher values create thinner rings.</td>
                </tr>
            </tbody>
        </table>

        <h2>Basic Ring</h2>
        <p>
            A ring with the default inner radius scale and a fill color.
        </p>
        <app-docs-code-sample [code]="basicCode" language="javascript" label="JavaScript"></app-docs-code-sample>

        <h2>Thin Ring</h2>
        <p>
            A thin ring created by setting a high <code>innerRadiusScale</code> value.
        </p>
        <app-docs-code-sample [code]="thinCode" language="javascript" label="JavaScript"></app-docs-code-sample>

        <h2>Styled Ring</h2>
        <p>
            A ring with gradient fill and stroke styling.
        </p>
        <app-docs-code-sample [code]="styledCode" language="javascript" label="JavaScript"></app-docs-code-sample>

        <app-docs-page-nav [previousPage]="previousPage" [nextPage]="nextPage"></app-docs-page-nav>
    `
})
export class RingPageComponent {
    previousPage: DocsPage | undefined;
    nextPage: DocsPage | undefined;

    basicCode = `const m = elise.model(200, 200);
elise.ring(20, 20, 160, 160)
    .setFill('DodgerBlue')
    .addTo(m);`;

    thinCode = `const m = elise.model(200, 200);
elise.ring(20, 20, 160, 160)
    .setInnerRadiusScale(0.85)
    .setFill('SeaGreen')
    .setStroke('DarkGreen,1')
    .addTo(m);`;

    styledCode = `const m = elise.model(200, 200);
const gradient = elise.linearGradientFill('20,20', '180,180');
gradient.addFillStop('SlateBlue', 0);
gradient.addFillStop('MediumOrchid', 1);

elise.ring(20, 20, 160, 160)
    .setInnerRadiusScale(0.6)
    .setFill(gradient)
    .setStroke('Indigo,2')
    .addTo(m);`;

    constructor(private docsService: DocsService) {
        this.previousPage = docsService.getPreviousPage('elements', 'ring');
        this.nextPage = docsService.getNextPage('elements', 'ring');
    }
}
