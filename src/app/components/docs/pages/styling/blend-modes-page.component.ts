import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DocsService, DocsPage } from '../../../../services/docs.service';
import { DocsPageNavComponent } from '../../docs-page-nav.component';
import { DocsCodeSampleComponent } from '../../docs-code-sample.component';

@Component({
    selector: 'app-blend-modes-page',
    standalone: true,
    imports: [CommonModule, RouterModule, DocsPageNavComponent, DocsCodeSampleComponent],
    template: `
        <h1>Blend Modes</h1>
        <p class="lead">
            Blend modes control how an element's pixels combine with the pixels beneath it,
            using canvas composite operations. Set via <code>element.setBlendMode(mode)</code>
            or <code>element.blendMode = mode</code>. The default mode is
            <code>'source-over'</code>, which draws the element on top normally.
        </p>

        <h2>Supported Blend Modes</h2>
        <table class="docs-table">
            <thead>
                <tr>
                    <th>Mode</th>
                    <th>Description</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><code>source-over</code></td>
                    <td>Default — draws source over destination</td>
                </tr>
                <tr>
                    <td><code>multiply</code></td>
                    <td>Multiplies pixel values; result is always darker</td>
                </tr>
                <tr>
                    <td><code>screen</code></td>
                    <td>Inverse of multiply; result is always lighter</td>
                </tr>
                <tr>
                    <td><code>overlay</code></td>
                    <td>Combines multiply and screen; preserves highlights and shadows</td>
                </tr>
                <tr>
                    <td><code>darken</code></td>
                    <td>Keeps the darker pixel of source and destination</td>
                </tr>
                <tr>
                    <td><code>lighten</code></td>
                    <td>Keeps the lighter pixel of source and destination</td>
                </tr>
                <tr>
                    <td><code>color-dodge</code></td>
                    <td>Brightens destination by decreasing contrast</td>
                </tr>
                <tr>
                    <td><code>color-burn</code></td>
                    <td>Darkens destination by increasing contrast</td>
                </tr>
                <tr>
                    <td><code>hard-light</code></td>
                    <td>Like overlay but based on source brightness</td>
                </tr>
                <tr>
                    <td><code>soft-light</code></td>
                    <td>Softer version of hard-light; subtle contrast adjustment</td>
                </tr>
                <tr>
                    <td><code>difference</code></td>
                    <td>Absolute difference between source and destination</td>
                </tr>
                <tr>
                    <td><code>exclusion</code></td>
                    <td>Similar to difference but lower contrast</td>
                </tr>
                <tr>
                    <td><code>hue</code></td>
                    <td>Uses source hue with destination saturation and luminosity</td>
                </tr>
                <tr>
                    <td><code>saturation</code></td>
                    <td>Uses source saturation with destination hue and luminosity</td>
                </tr>
                <tr>
                    <td><code>color</code></td>
                    <td>Uses source hue and saturation with destination luminosity</td>
                </tr>
                <tr>
                    <td><code>luminosity</code></td>
                    <td>Uses source luminosity with destination hue and saturation</td>
                </tr>
            </tbody>
        </table>

        <h2>Multiply</h2>
        <p>
            Multiply darkens overlapping areas by multiplying pixel values. Useful for
            shadow effects and color mixing.
        </p>
        <app-docs-code-sample [code]="multiplyCode" language="javascript" label="JavaScript"></app-docs-code-sample>

        <h2>Screen</h2>
        <p>
            Screen lightens overlapping areas — the inverse of multiply. Useful for
            glow and light effects.
        </p>
        <app-docs-code-sample [code]="screenCode" language="javascript" label="JavaScript"></app-docs-code-sample>

        <h2>Overlay</h2>
        <p>
            Overlay combines multiply and screen, preserving the highlights and shadows
            of the destination while blending with the source color.
        </p>
        <app-docs-code-sample [code]="overlayCode" language="javascript" label="JavaScript"></app-docs-code-sample>

        <app-docs-page-nav [previousPage]="previousPage" [nextPage]="nextPage"></app-docs-page-nav>
    `
})
export class BlendModesPageComponent {
    previousPage?: DocsPage;
    nextPage?: DocsPage;

    multiplyCode = `const m = elise.model(300, 200);

// Background shapes
elise.rectangle(20, 20, 160, 160).setFill('Cyan').addTo(m);

// Multiply blend overlapping circle
elise.ellipse(160, 100, 80, 80)
    .setFill('Magenta')
    .setBlendMode('multiply')
    .addTo(m);

elise.ellipse(100, 140, 80, 80)
    .setFill('Yellow')
    .setBlendMode('multiply')
    .addTo(m);`;

    screenCode = `const m = elise.model(300, 200);

// Dark background
elise.rectangle(0, 0, 300, 200).setFill('#333').addTo(m);

// Screen blend creates light effects
elise.ellipse(100, 100, 70, 70)
    .setFill('Red')
    .setBlendMode('screen')
    .addTo(m);

elise.ellipse(160, 100, 70, 70)
    .setFill('Lime')
    .setBlendMode('screen')
    .addTo(m);

elise.ellipse(130, 60, 70, 70)
    .setFill('Blue')
    .setBlendMode('screen')
    .addTo(m);`;

    overlayCode = `const m = elise.model(300, 200);

// Textured background
elise.rectangle(0, 0, 150, 200).setFill('LightGray').addTo(m);
elise.rectangle(150, 0, 150, 200).setFill('DarkGray').addTo(m);

// Overlay preserves light/dark areas
elise.ellipse(150, 100, 100, 80)
    .setFill('CornflowerBlue')
    .setBlendMode('overlay')
    .addTo(m);`;

    constructor(docsService: DocsService) {
        this.previousPage = docsService.getPreviousPage('styling', 'blend-modes');
        this.nextPage = docsService.getNextPage('styling', 'blend-modes');
    }
}
