import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocsService, DocsPage } from '../../../../services/docs.service';
import { DocsPageNavComponent } from '../../docs-page-nav.component';
import { DocsCodeSampleComponent } from '../../docs-code-sample.component';

@Component({
    selector: 'app-wedge-page',
    standalone: true,
    imports: [CommonModule, DocsPageNavComponent, DocsCodeSampleComponent],
    template: `
        <h1>Wedge</h1>
        <p class="lead">
            The wedge element renders a pie or sector slice of an ellipse, like a slice from a pie chart.
            It supports both fill and stroke styling.
        </p>

        <h2>Factory</h2>
        <p>
            Create a wedge element using <code>elise.wedge(x, y, width, height)</code>. Set
            <code>setStartAngle()</code> and <code>setEndAngle()</code> to define the slice.
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

        <h2>Basic Wedge</h2>
        <p>
            A simple quarter wedge spanning from 0 to 90 degrees.
        </p>
        <app-docs-code-sample [code]="basicCode" language="javascript" label="JavaScript"></app-docs-code-sample>

        <h2>Pie Chart</h2>
        <p>
            Multiple wedges combined to create a simple pie chart.
        </p>
        <app-docs-code-sample [code]="pieCode" language="javascript" label="JavaScript"></app-docs-code-sample>

        <h2>Styled Wedge</h2>
        <p>
            A wedge with gradient fill styling.
        </p>
        <app-docs-code-sample [code]="styledCode" language="javascript" label="JavaScript"></app-docs-code-sample>

        <app-docs-page-nav [previousPage]="previousPage" [nextPage]="nextPage"></app-docs-page-nav>
    `
})
export class WedgePageComponent {
    previousPage?: DocsPage;
    nextPage?: DocsPage;

    basicCode = `const m = elise.model(200, 200);
elise.wedge(20, 20, 160, 160)
    .setStartAngle(0)
    .setEndAngle(90)
    .setFill('CornflowerBlue')
    .setStroke('Navy,1')
    .addTo(m);`;

    pieCode = `const m = elise.model(200, 200);
elise.wedge(20, 20, 160, 160)
    .setStartAngle(0)
    .setEndAngle(120)
    .setFill('Tomato')
    .setStroke('White,2')
    .addTo(m);

elise.wedge(20, 20, 160, 160)
    .setStartAngle(120)
    .setEndAngle(240)
    .setFill('MediumSeaGreen')
    .setStroke('White,2')
    .addTo(m);

elise.wedge(20, 20, 160, 160)
    .setStartAngle(240)
    .setEndAngle(360)
    .setFill('Gold')
    .setStroke('White,2')
    .addTo(m);`;

    styledCode = `const m = elise.model(200, 200);
const gradient = elise.linearGradientFill('20,20', '180,180');
gradient.addFillStop('DeepPink', 0);
gradient.addFillStop('HotPink', 1);

elise.wedge(20, 20, 160, 160)
    .setStartAngle(45)
    .setEndAngle(315)
    .setFill(gradient)
    .setStroke('MediumVioletRed,2')
    .addTo(m);`;

    constructor(docsService: DocsService) {
        this.previousPage = docsService.getPreviousPage('elements', 'wedge');
        this.nextPage = docsService.getNextPage('elements', 'wedge');
    }
}
