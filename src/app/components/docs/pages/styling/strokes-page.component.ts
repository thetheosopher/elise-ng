import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DocsService, DocsPage } from '../../../../services/docs.service';
import { DocsPageNavComponent } from '../../docs-page-nav.component';
import { DocsCodeSampleComponent } from '../../docs-code-sample.component';

@Component({
    selector: 'app-strokes-page',
    standalone: true,
    imports: [CommonModule, RouterModule, DocsPageNavComponent, DocsCodeSampleComponent],
    template: `
        <h1>Strokes</h1>
        <p class="lead">
            Strokes define the outline drawn around elements. A stroke is specified as a
            <code>"Color,Width"</code> string (e.g. <code>'Black,2'</code>, <code>'#3b82f6,3'</code>).
            Set a stroke via <code>element.setStroke(stroke)</code> or <code>element.stroke = stroke</code>.
            Width is in logical pixels and the stroke is always center-aligned on the element boundary.
        </p>

        <h2>Stroke Format</h2>
        <p>
            The basic stroke format is <code>"Color,Width"</code>. Dash patterns are configured
            separately with <code>setStrokeDash([dashLength, gapLength])</code>.
        </p>

        <h2>Stroke Properties</h2>
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
                    <td><code>stroke</code></td>
                    <td>string</td>
                    <td><code>"Color,Width"</code> — stroke color and width</td>
                </tr>
                <tr>
                    <td><code>strokeDash</code></td>
                    <td>number[]</td>
                    <td>Dash pattern array such as <code>[8, 4]</code></td>
                </tr>
            </tbody>
        </table>

        <h2>Solid Strokes</h2>
        <p>
            Basic solid strokes with different widths. The stroke width is specified after the color,
            separated by a comma.
        </p>
        <app-docs-code-sample [code]="basicCode" language="javascript" label="JavaScript"></app-docs-code-sample>

        <h2>Colored Strokes</h2>
        <p>
            Strokes accept any color format — named colors, hex codes, or hex with alpha.
        </p>
        <app-docs-code-sample [code]="colorCode" language="javascript" label="JavaScript"></app-docs-code-sample>

        <h2>Dashed Strokes</h2>
        <p>
            Add dash and gap lengths with <code>setStrokeDash()</code> to create dashed stroke
            patterns. The array repeats across the stroke path.
        </p>
        <app-docs-code-sample [code]="dashedCode" language="javascript" label="JavaScript"></app-docs-code-sample>

        <h2>Fill and Stroke Combined</h2>
        <p>
            Elements can have both a fill and a stroke. The stroke draws on top of the fill,
            centered on the element boundary.
        </p>
        <app-docs-code-sample [code]="combinedCode" language="javascript" label="JavaScript"></app-docs-code-sample>

        <app-docs-page-nav [previousPage]="previousPage" [nextPage]="nextPage"></app-docs-page-nav>
    `
})
export class StrokesPageComponent {
    previousPage?: DocsPage;
    nextPage?: DocsPage;

    basicCode = `const m = elise.model(400, 120);
elise.rectangle(10, 10, 80, 100).setStroke('Black,1').addTo(m);
elise.rectangle(110, 10, 80, 100).setStroke('Black,2').addTo(m);
elise.rectangle(210, 10, 80, 100).setStroke('Black,4').addTo(m);
elise.rectangle(310, 10, 80, 100).setStroke('Black,8').addTo(m);`;

    colorCode = `const m = elise.model(400, 120);
elise.rectangle(10, 10, 80, 100).setStroke('#3b82f6,3').addTo(m);
elise.rectangle(110, 10, 80, 100).setStroke('#ef4444,3').addTo(m);
elise.rectangle(210, 10, 80, 100).setStroke('#10b981,3').addTo(m);
elise.ellipse(350, 60, 40, 50).setStroke('Gold,3').addTo(m);`;

    dashedCode = `const m = elise.model(400, 120);

// Short dashes
elise.line(20, 28, 180, 28)
    .setStroke('Navy,4')
    .setStrokeDash([8, 6])
    .addTo(m);

// Long dashes
elise.line(220, 28, 380, 28)
    .setStroke('Crimson,4')
    .setStrokeDash([18, 8])
    .addTo(m);

// Dashed shape outline
elise.rectangle(24, 52, 140, 48)
    .setStroke('ForestGreen,4')
    .setStrokeDash([10, 6])
    .setCornerRadius(10)
    .addTo(m);

// Dash pattern with round caps
elise.line(220, 76, 380, 76)
    .setStroke('Purple,6')
    .setLineCap('round')
    .setStrokeDash([2, 12])
    .addTo(m);`;

    combinedCode = `const m = elise.model(300, 160);
elise.rectangle(20, 20, 260, 120)
    .setFill('LightCyan')
    .setStroke('SteelBlue,3')
    .addTo(m);

elise.ellipse(150, 80, 80, 50)
    .setFill('0.5;Gold')
    .setStroke('DarkGoldenRod,2')
    .addTo(m);`;

    constructor(docsService: DocsService) {
        this.previousPage = docsService.getPreviousPage('styling', 'strokes');
        this.nextPage = docsService.getNextPage('styling', 'strokes');
    }
}
