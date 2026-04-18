import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DocsService, DocsPage } from '../../../../services/docs.service';
import { DocsPageNavComponent } from '../../docs-page-nav.component';
import { DocsCodeSampleComponent } from '../../docs-code-sample.component';

@Component({
    selector: 'app-arrow-page',
    standalone: true,
    imports: [CommonModule, RouterModule, DocsPageNavComponent, DocsCodeSampleComponent],
    template: `
        <h1>Arrow</h1>
        <p class="lead">
            The arrow element renders a parameterized arrow shape within a bounding box.
            The arrow's head and shaft proportions are controlled through scale properties.
        </p>

        <h2>Factory</h2>
        <p>
            Create an arrow element using <code>elise.arrow(x, y, width, height)</code>. The arrow
            supports both fill and stroke styling.
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
                    <td>headLengthScale</td>
                    <td>number</td>
                    <td>0.33</td>
                    <td>Proportion of total length used for the arrowhead</td>
                </tr>
                <tr>
                    <td>headWidthScale</td>
                    <td>number</td>
                    <td>1.0</td>
                    <td>Head width relative to the bounding box height</td>
                </tr>
                <tr>
                    <td>shaftWidthScale</td>
                    <td>number</td>
                    <td>0.5</td>
                    <td>Shaft width relative to the bounding box height</td>
                </tr>
            </tbody>
        </table>

        <h2>Basic Arrow</h2>
        <p>
            A default arrow with a fill color.
        </p>
        <app-docs-code-sample [code]="basicCode" language="javascript" label="JavaScript"></app-docs-code-sample>

        <h2>Thin Shaft Arrow</h2>
        <p>
            An arrow with a narrow shaft created by reducing the <code>shaftWidthScale</code>.
        </p>
        <app-docs-code-sample [code]="thinCode" language="javascript" label="JavaScript"></app-docs-code-sample>

        <h2>Wide Head Arrow</h2>
        <p>
            An arrow with a wide head and stroke styling.
        </p>
        <app-docs-code-sample [code]="fatCode" language="javascript" label="JavaScript"></app-docs-code-sample>

        <app-docs-page-nav [previousPage]="previousPage" [nextPage]="nextPage"></app-docs-page-nav>
    `
})
export class ArrowPageComponent {
    previousPage: DocsPage | undefined;
    nextPage: DocsPage | undefined;

    basicCode = `const m = elise.model(200, 120);
const arrow = elise.arrow(20, 20, 160, 80);
arrow.setFill('SteelBlue');
arrow.addTo(m);`;

    thinCode = `const m = elise.model(200, 120);
const arrow = elise.arrow(20, 20, 160, 80);
arrow.shaftWidthScale = 0.2;
arrow.setFill('ForestGreen');
arrow.addTo(m);`;

    fatCode = `const m = elise.model(200, 120);
const arrow = elise.arrow(20, 10, 160, 100);
arrow.headLengthScale = 0.5;
arrow.headWidthScale = 1.2;
arrow.shaftWidthScale = 0.3;
arrow.setFill('Orange');
arrow.setStroke('DarkOrange', 2);
arrow.addTo(m);`;

    constructor(private docsService: DocsService) {
        this.previousPage = docsService.getPreviousPage('elements', 'arrow');
        this.nextPage = docsService.getNextPage('elements', 'arrow');
    }
}
