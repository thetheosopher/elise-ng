import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DocsService, DocsPage } from '../../../../services/docs.service';
import { DocsPageNavComponent } from '../../docs-page-nav.component';
import { DocsCodeSampleComponent } from '../../docs-code-sample.component';

@Component({
    selector: 'app-shadows-page',
    standalone: true,
    imports: [CommonModule, RouterModule, DocsPageNavComponent, DocsCodeSampleComponent],
    template: `
        <h1>Shadows</h1>
        <p class="lead">
            Drop shadows add depth to elements. Set via <code>element.setShadow(shadow)</code> or
            by assigning the <code>element.shadow</code> object. Shadows render behind the element
            and support color, blur radius, and directional offset.
        </p>

        <h2>Shadow Properties</h2>
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
                    <td><code>color</code></td>
                    <td>string</td>
                    <td>Shadow color (named color, hex, or hex with alpha)</td>
                </tr>
                <tr>
                    <td><code>blur</code></td>
                    <td>number</td>
                    <td>Blur radius — larger values produce softer shadows</td>
                </tr>
                <tr>
                    <td><code>offsetX</code></td>
                    <td>number</td>
                    <td>Horizontal offset in pixels (positive = right)</td>
                </tr>
                <tr>
                    <td><code>offsetY</code></td>
                    <td>number</td>
                    <td>Vertical offset in pixels (positive = down)</td>
                </tr>
            </tbody>
        </table>

        <h2>Basic Drop Shadow</h2>
        <p>
            A simple drop shadow with moderate blur and offset, casting down and to the right.
        </p>
        <app-docs-code-sample [code]="basicCode" language="javascript" label="JavaScript"></app-docs-code-sample>

        <h2>Soft Shadow</h2>
        <p>
            A large blur radius creates a soft, diffused shadow effect.
        </p>
        <app-docs-code-sample [code]="softCode" language="javascript" label="JavaScript"></app-docs-code-sample>

        <h2>Colored Shadows</h2>
        <p>
            Shadows can use any color, not just gray or black. Colored shadows can create
            glow effects or design accents.
        </p>
        <app-docs-code-sample [code]="coloredCode" language="javascript" label="JavaScript"></app-docs-code-sample>

        <h2>Multiple Shadow Styles</h2>
        <p>
            Different elements can have different shadow configurations to create varied
            depth and lighting effects.
        </p>
        <app-docs-code-sample [code]="multipleCode" language="javascript" label="JavaScript"></app-docs-code-sample>

        <app-docs-page-nav [previousPage]="previousPage" [nextPage]="nextPage"></app-docs-page-nav>
    `
})
export class ShadowsPageComponent {
    previousPage?: DocsPage;
    nextPage?: DocsPage;

    basicCode = `const m = elise.model(200, 200);
elise.rectangle(30, 30, 120, 120)
    .setFill('White')
    .setStroke('Gray,1')
    .setShadow({ color: 'rgba(0,0,0,0.3)', blur: 6, offsetX: 4, offsetY: 4 })
    .addTo(m);`;

    softCode = `const m = elise.model(200, 200);
elise.rectangle(40, 40, 120, 120)
    .setFill('White')
    .setShadow({ color: 'rgba(0,0,0,0.15)', blur: 24, offsetX: 0, offsetY: 8 })
    .addTo(m);`;

    coloredCode = `const m = elise.model(400, 160);

// Blue glow
elise.ellipse(80, 80, 50, 50)
    .setFill('CornflowerBlue')
    .setShadow({ color: '#3b82f680', blur: 16, offsetX: 0, offsetY: 0 })
    .addTo(m);

// Red accent shadow
elise.ellipse(200, 80, 50, 50)
    .setFill('Crimson')
    .setShadow({ color: '#ef444480', blur: 12, offsetX: 4, offsetY: 4 })
    .addTo(m);

// Green shadow
elise.ellipse(320, 80, 50, 50)
    .setFill('ForestGreen')
    .setShadow({ color: '#10b98180', blur: 10, offsetX: 2, offsetY: 6 })
    .addTo(m);`;

    multipleCode = `const m = elise.model(400, 200);

// Sharp close shadow
elise.rectangle(20, 30, 100, 140)
    .setFill('SteelBlue')
    .setShadow({ color: 'rgba(0,0,0,0.4)', blur: 2, offsetX: 2, offsetY: 2 })
    .addTo(m);

// Medium shadow
elise.rectangle(150, 30, 100, 140)
    .setFill('Coral')
    .setShadow({ color: 'rgba(0,0,0,0.3)', blur: 8, offsetX: 4, offsetY: 4 })
    .addTo(m);

// Distant soft shadow
elise.rectangle(280, 30, 100, 140)
    .setFill('MediumSeaGreen')
    .setShadow({ color: 'rgba(0,0,0,0.2)', blur: 20, offsetX: 8, offsetY: 12 })
    .addTo(m);`;

    constructor(docsService: DocsService) {
        this.previousPage = docsService.getPreviousPage('styling', 'shadows');
        this.nextPage = docsService.getNextPage('styling', 'shadows');
    }
}
