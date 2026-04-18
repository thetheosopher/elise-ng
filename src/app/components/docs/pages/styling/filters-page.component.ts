import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DocsService, DocsPage } from '../../../../services/docs.service';
import { DocsPageNavComponent } from '../../docs-page-nav.component';
import { DocsCodeSampleComponent } from '../../docs-code-sample.component';

@Component({
    selector: 'app-filters-page',
    standalone: true,
    imports: [CommonModule, RouterModule, DocsPageNavComponent, DocsCodeSampleComponent],
    template: `
        <h1>Filters</h1>
        <p class="lead">
            CSS filters apply visual effects like blur, color shifts, and contrast adjustments
            to elements. Set via <code>element.setFilter(filter)</code> or
            <code>element.filter = filterString</code>. Filters use standard CSS filter syntax
            and can be chained together for combined effects.
        </p>

        <h2>Supported Filters</h2>
        <table class="docs-table">
            <thead>
                <tr>
                    <th>Filter</th>
                    <th>Syntax</th>
                    <th>Description</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><code>blur()</code></td>
                    <td>blur(radius)</td>
                    <td>Applies a Gaussian blur; radius in pixels</td>
                </tr>
                <tr>
                    <td><code>brightness()</code></td>
                    <td>brightness(amount)</td>
                    <td>Adjusts brightness; 1 is normal, &gt;1 brighter, &lt;1 darker</td>
                </tr>
                <tr>
                    <td><code>contrast()</code></td>
                    <td>contrast(amount)</td>
                    <td>Adjusts contrast; 1 is normal</td>
                </tr>
                <tr>
                    <td><code>grayscale()</code></td>
                    <td>grayscale(amount)</td>
                    <td>Converts to grayscale; 0% is unchanged, 100% is fully gray</td>
                </tr>
                <tr>
                    <td><code>hue-rotate()</code></td>
                    <td>hue-rotate(angle)</td>
                    <td>Rotates hue by the given angle in degrees</td>
                </tr>
                <tr>
                    <td><code>invert()</code></td>
                    <td>invert(amount)</td>
                    <td>Inverts colors; 0% unchanged, 100% fully inverted</td>
                </tr>
                <tr>
                    <td><code>opacity()</code></td>
                    <td>opacity(amount)</td>
                    <td>Adjusts opacity; 1 is fully opaque, 0 is transparent</td>
                </tr>
                <tr>
                    <td><code>saturate()</code></td>
                    <td>saturate(amount)</td>
                    <td>Adjusts saturation; 1 is normal, &gt;1 more vivid</td>
                </tr>
                <tr>
                    <td><code>sepia()</code></td>
                    <td>sepia(amount)</td>
                    <td>Applies a sepia tone; 0% unchanged, 100% fully sepia</td>
                </tr>
                <tr>
                    <td><code>drop-shadow()</code></td>
                    <td>drop-shadow(x y blur color)</td>
                    <td>Adds a drop shadow following the element's alpha shape</td>
                </tr>
            </tbody>
        </table>

        <h2>Blur</h2>
        <p>
            A Gaussian blur softens the element. Higher pixel values produce a stronger blur effect.
        </p>
        <app-docs-code-sample [code]="blurCode" language="javascript" label="JavaScript"></app-docs-code-sample>

        <h2>Grayscale</h2>
        <p>
            Converts the element to grayscale. A value of <code>100%</code> fully desaturates the colors.
        </p>
        <app-docs-code-sample [code]="grayscaleCode" language="javascript" label="JavaScript"></app-docs-code-sample>

        <h2>Hue Rotate</h2>
        <p>
            Shifts the hue of the element by a given angle. Useful for creating color variations
            from a single source element.
        </p>
        <app-docs-code-sample [code]="hueRotateCode" language="javascript" label="JavaScript"></app-docs-code-sample>

        <h2>Combined Filters</h2>
        <p>
            Multiple filters can be chained in a single string, separated by spaces. They are
            applied in the order specified.
        </p>
        <app-docs-code-sample [code]="combinedCode" language="javascript" label="JavaScript"></app-docs-code-sample>

        <app-docs-page-nav [previousPage]="previousPage" [nextPage]="nextPage"></app-docs-page-nav>
    `
})
export class FiltersPageComponent {
    previousPage?: DocsPage;
    nextPage?: DocsPage;

    blurCode = `const m = elise.model(300, 200);

// Sharp rectangle for comparison
elise.rectangle(20, 40, 100, 100)
    .setFill('CornflowerBlue')
    .addTo(m);

// Blurred rectangle
elise.rectangle(160, 40, 100, 100)
    .setFill('CornflowerBlue')
    .setFilter('blur(4px)')
    .addTo(m);`;

    grayscaleCode = `const m = elise.model(300, 200);

// Original color
elise.ellipse(80, 100, 60, 60)
    .setFill('Crimson')
    .addTo(m);

// Grayscale version
elise.ellipse(220, 100, 60, 60)
    .setFill('Crimson')
    .setFilter('grayscale(100%)')
    .addTo(m);`;

    combinedCode = `const m = elise.model(300, 200);

// Chained filters: brighter, higher contrast, more vivid
elise.rectangle(60, 30, 180, 140)
    .setFill('MediumSeaGreen')
    .setFilter('brightness(1.2) contrast(1.1) saturate(1.3)')
    .addTo(m);`;

    hueRotateCode = `const m = elise.model(400, 160);

// Original
elise.ellipse(60, 80, 50, 50)
    .setFill('Coral')
    .addTo(m);

// Hue rotated 90 degrees
elise.ellipse(180, 80, 50, 50)
    .setFill('Coral')
    .setFilter('hue-rotate(90deg)')
    .addTo(m);

// Hue rotated 180 degrees
elise.ellipse(300, 80, 50, 50)
    .setFill('Coral')
    .setFilter('hue-rotate(180deg)')
    .addTo(m);`;

    constructor(private docsService: DocsService) {
        this.previousPage = docsService.getPreviousPage('styling', 'filters');
        this.nextPage = docsService.getNextPage('styling', 'filters');
    }
}
