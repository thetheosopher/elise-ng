import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DocsService, DocsPage } from '../../../../services/docs.service';
import { DocsPageNavComponent } from '../../docs-page-nav.component';
import { DocsCodeSampleComponent } from '../../docs-code-sample.component';

@Component({
    selector: 'app-color-fills-page',
    standalone: true,
    imports: [CommonModule, RouterModule, DocsPageNavComponent, DocsCodeSampleComponent],
    template: `
        <h1>Color Fills</h1>
        <p class="lead">
            Color fills are the simplest way to style fillable elements. Elise supports named colors,
            hex color codes, hex with alpha, and a semi-transparent opacity format. Fills can be set
            via the <code>fill</code> property or the fluent <code>setFill()</code> method.
        </p>

        <h2>Color Formats</h2>
        <table class="docs-table">
            <thead>
                <tr>
                    <th>Format</th>
                    <th>Example</th>
                    <th>Description</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Named color</td>
                    <td><code>'Red'</code>, <code>'Blue'</code>, <code>'Gold'</code></td>
                    <td>Standard CSS/HTML color names</td>
                </tr>
                <tr>
                    <td>Hex</td>
                    <td><code>'#3b82f6'</code></td>
                    <td>6-digit hex color (#RRGGBB)</td>
                </tr>
                <tr>
                    <td>Hex with alpha</td>
                    <td><code>'#3b82f680'</code></td>
                    <td>8-digit hex with alpha channel (#RRGGBBAA)</td>
                </tr>
                <tr>
                    <td>Opacity format</td>
                    <td><code>'0.5;Blue'</code></td>
                    <td>Semi-transparent using 'opacity;Color' notation</td>
                </tr>
            </tbody>
        </table>

        <h2>Named Colors</h2>
        <p>
            Use any standard CSS color name as a fill string. Color names are case-insensitive
            but conventionally capitalized in Elise.
        </p>
        <app-docs-code-sample [code]="namedCode" language="javascript" label="JavaScript"></app-docs-code-sample>

        <h2>Hex Colors</h2>
        <p>
            Hex color codes provide precise RGB control. Use the standard <code>#RRGGBB</code> format.
        </p>
        <app-docs-code-sample [code]="hexCode" language="javascript" label="JavaScript"></app-docs-code-sample>

        <h2>Semi-Transparent Fills</h2>
        <p>
            There are two ways to create semi-transparent fills: the <code>'opacity;Color'</code> format
            (where opacity is 0–1) and the <code>#RRGGBBAA</code> hex format (where AA is the alpha byte).
        </p>
        <app-docs-code-sample [code]="alphaCode" language="javascript" label="JavaScript"></app-docs-code-sample>

        <h2>Fluent API</h2>
        <p>
            The <code>setFill()</code> method returns the element for chaining with other style methods.
        </p>
        <app-docs-code-sample [code]="fluentCode" language="javascript" label="JavaScript"></app-docs-code-sample>

        <app-docs-page-nav [previousPage]="previousPage" [nextPage]="nextPage"></app-docs-page-nav>
    `
})
export class ColorFillsPageComponent {
    previousPage?: DocsPage;
    nextPage?: DocsPage;

    namedCode = `const m = elise.model(400, 120);
elise.rectangle(10, 10, 80, 100).setFill('Red').addTo(m);
elise.rectangle(110, 10, 80, 100).setFill('Blue').addTo(m);
elise.rectangle(210, 10, 80, 100).setFill('Gold').addTo(m);
elise.rectangle(310, 10, 80, 100).setFill('ForestGreen').addTo(m);`;

    hexCode = `const m = elise.model(400, 120);
elise.rectangle(10, 10, 80, 100).setFill('#3b82f6').addTo(m);
elise.rectangle(110, 10, 80, 100).setFill('#ef4444').addTo(m);
elise.rectangle(210, 10, 80, 100).setFill('#10b981').addTo(m);
elise.rectangle(310, 10, 80, 100).setFill('#f59e0b').addTo(m);`;

    alphaCode = `const m = elise.model(300, 160);

// Using 'opacity;Color' format
elise.ellipse(80, 80, 60, 60).setFill('0.5;Blue').addTo(m);
elise.ellipse(140, 80, 60, 60).setFill('0.5;Red').addTo(m);

// Using #RRGGBBAA hex format
elise.ellipse(200, 80, 60, 60).setFill('#10b98180').addTo(m);`;

    fluentCode = `const m = elise.model(200, 200);
elise.rectangle(20, 20, 160, 160)
    .setFill('CornflowerBlue')
    .setStroke('Navy,2')
    .setOpacity(0.85)
    .addTo(m);`;

    constructor(docsService: DocsService) {
        this.previousPage = docsService.getPreviousPage('styling', 'color-fills');
        this.nextPage = docsService.getNextPage('styling', 'color-fills');
    }
}
