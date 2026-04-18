import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DocsService, DocsPage } from '../../../../services/docs.service';
import { DocsPageNavComponent } from '../../docs-page-nav.component';
import { DocsCodeSampleComponent } from '../../docs-code-sample.component';

@Component({
    selector: 'app-opacity-page',
    standalone: true,
    imports: [CommonModule, RouterModule, DocsPageNavComponent, DocsCodeSampleComponent],
    template: `
        <h1>Opacity</h1>
        <p class="lead">
            Opacity controls the overall transparency of an element. Values range from 0 (invisible)
            to 1 (fully opaque). Set via <code>element.setOpacity(value)</code> or
            <code>element.opacity = value</code>. Opacity affects the entire element including its
            fill, stroke, and shadow.
        </p>

        <h2>Opacity vs Fill Opacity</h2>
        <p>
            Element opacity affects everything — fill, stroke, and shadow are all uniformly
            transparent. This differs from fill opacity (the <code>'opacity;Color'</code> format),
            which only affects the fill color. The two can be combined for layered transparency
            effects.
        </p>

        <h2>Opacity Properties</h2>
        <table class="docs-table">
            <thead>
                <tr>
                    <th>Property</th>
                    <th>Type</th>
                    <th>Range</th>
                    <th>Description</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><code>opacity</code></td>
                    <td>number</td>
                    <td>0–1</td>
                    <td>Overall element transparency (0 = invisible, 1 = fully opaque)</td>
                </tr>
            </tbody>
        </table>

        <h2>Basic Opacity</h2>
        <p>
            Elements at different opacity levels. Lower values are more transparent.
        </p>
        <app-docs-code-sample [code]="basicCode" language="javascript" label="JavaScript"></app-docs-code-sample>

        <h2>Layered Transparency</h2>
        <p>
            Overlapping elements with opacity create transparency effects where underlying
            elements show through.
        </p>
        <app-docs-code-sample [code]="layeredCode" language="javascript" label="JavaScript"></app-docs-code-sample>

        <h2>Animated Opacity</h2>
        <p>
            Opacity can be animated using property tweens for fade-in, fade-out, and
            pulsing effects.
        </p>
        <app-docs-code-sample [code]="animatedCode" [timerEnabled]="true" language="javascript" label="JavaScript"></app-docs-code-sample>

        <app-docs-page-nav [previousPage]="previousPage" [nextPage]="nextPage"></app-docs-page-nav>
    `
})
export class OpacityPageComponent {
    previousPage?: DocsPage;
    nextPage?: DocsPage;

    basicCode = `const m = elise.model(400, 120);
elise.rectangle(10, 10, 80, 100).setFill('Blue').setOpacity(1.0).addTo(m);
elise.rectangle(110, 10, 80, 100).setFill('Blue').setOpacity(0.75).addTo(m);
elise.rectangle(210, 10, 80, 100).setFill('Blue').setOpacity(0.5).addTo(m);
elise.rectangle(310, 10, 80, 100).setFill('Blue').setOpacity(0.25).addTo(m);`;

    layeredCode = `const m = elise.model(300, 200);

// Background rectangle
elise.rectangle(20, 20, 200, 160).setFill('Navy').addTo(m);

// Overlapping semi-transparent circles
elise.ellipse(100, 80, 60, 60).setFill('Red').setOpacity(0.6).addTo(m);
elise.ellipse(140, 80, 60, 60).setFill('Green').setOpacity(0.6).addTo(m);
elise.ellipse(120, 110, 60, 60).setFill('Blue').setOpacity(0.6).addTo(m);`;

    animatedCode = `const m = elise.model(200, 200);
const rect = elise.rectangle(40, 40, 120, 120)
    .setFill('Crimson')
    .addTo(m);

let fadedOut = false;

function pulse() {
    rect.animate(
        { opacity: fadedOut ? 1 : 0.2 },
        {
            duration: 900,
            easing: 'easeInOutSine',
            onComplete: function() {
                fadedOut = !fadedOut;
                pulse();
            }
        }
    );
}

pulse();`;

    constructor(docsService: DocsService) {
        this.previousPage = docsService.getPreviousPage('styling', 'opacity');
        this.nextPage = docsService.getNextPage('styling', 'opacity');
    }
}
