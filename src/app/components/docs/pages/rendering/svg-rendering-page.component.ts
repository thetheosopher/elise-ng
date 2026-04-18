import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DocsService, DocsPage } from '../../../../services/docs.service';
import { DocsPageNavComponent } from '../../docs-page-nav.component';

@Component({
    imports: [CommonModule, RouterModule, DocsPageNavComponent],
    template: `
        <h1>SVG Rendering</h1>
        <p class="lead">
            Elise can render models as SVG DOM elements, producing resolution-independent, CSS-stylable,
            accessible, and print-ready vector output.
        </p>

        <h2>How It Works</h2>
        <p>
            The SVG renderer traverses the model's element list and creates corresponding SVG DOM elements
            inside an <code>&lt;svg&gt;</code> container. Each Elise element type maps to one or more SVG
            elements. Gradient fills generate <code>&lt;defs&gt;</code> entries that are referenced by
            element fill attributes.
        </p>

        <h2>Element Mapping</h2>
        <p>
            Each Elise element type produces a specific SVG element:
        </p>
        <table class="docs-table">
            <thead><tr><th>Elise Element</th><th>SVG Element</th><th>Notes</th></tr></thead>
            <tbody>
                <tr><td>Rectangle</td><td><code>&lt;rect&gt;</code></td><td>x, y, width, height, rx/ry for rounded corners</td></tr>
                <tr><td>Ellipse</td><td><code>&lt;ellipse&gt;</code></td><td>cx, cy, rx, ry</td></tr>
                <tr><td>Line</td><td><code>&lt;line&gt;</code></td><td>x1, y1, x2, y2</td></tr>
                <tr><td>Polyline</td><td><code>&lt;polyline&gt;</code></td><td>points attribute</td></tr>
                <tr><td>Polygon</td><td><code>&lt;polygon&gt;</code></td><td>points attribute, auto-closed</td></tr>
                <tr><td>Path</td><td><code>&lt;path&gt;</code></td><td>d attribute with SVG path commands</td></tr>
                <tr><td>Text</td><td><code>&lt;text&gt;</code></td><td>Font properties mapped to SVG text attributes</td></tr>
                <tr><td>Image</td><td><code>&lt;image&gt;</code></td><td>href attribute with image source URL</td></tr>
                <tr><td>Model (nested)</td><td><code>&lt;g&gt;</code></td><td>Group containing recursively rendered child elements</td></tr>
            </tbody>
        </table>

        <h2>Fill and Stroke Translation</h2>
        <p>
            Elise fill and stroke properties translate to SVG attributes:
        </p>
        <table class="docs-table">
            <thead><tr><th>Elise Property</th><th>SVG Attribute</th><th>Notes</th></tr></thead>
            <tbody>
                <tr><td>Solid fill</td><td><code>fill="color"</code></td><td>Direct CSS color value</td></tr>
                <tr><td>Linear gradient</td><td><code>fill="url(#gradientId)"</code></td><td>References generated <code>&lt;linearGradient&gt;</code> def</td></tr>
                <tr><td>Radial gradient</td><td><code>fill="url(#gradientId)"</code></td><td>References generated <code>&lt;radialGradient&gt;</code> def</td></tr>
                <tr><td>No fill</td><td><code>fill="none"</code></td><td></td></tr>
                <tr><td>Stroke color</td><td><code>stroke="color"</code></td><td>From stroke descriptor</td></tr>
                <tr><td>Stroke width</td><td><code>stroke-width="n"</code></td><td>From stroke descriptor</td></tr>
                <tr><td>Opacity</td><td><code>opacity="n"</code></td><td>Element-level opacity</td></tr>
                <tr><td>Transform</td><td><code>transform="..."</code></td><td>translate, rotate, scale as SVG transform string</td></tr>
            </tbody>
        </table>

        <h2>Gradient Def Generation</h2>
        <p>
            When an element uses a gradient fill, the SVG renderer creates a gradient definition in
            the <code>&lt;defs&gt;</code> section of the SVG document. Each gradient receives a unique ID
            and the element's fill attribute references it via <code>url(#id)</code>. Gradient stops,
            direction (for linear), and center/radius (for radial) are mapped to the corresponding
            SVG gradient attributes.
        </p>

        <h2>When to Prefer SVG</h2>
        <p>
            SVG rendering is the better choice in specific scenarios:
        </p>
        <ul>
            <li><strong>Export</strong> — SVG files are the standard vector export format</li>
            <li><strong>Printing</strong> — Resolution-independent output scales to any print resolution</li>
            <li><strong>Accessibility</strong> — SVG elements are part of the DOM and accessible to screen readers</li>
            <li><strong>CSS integration</strong> — SVG elements can be styled with external CSS</li>
            <li><strong>Embedding</strong> — SVG can be embedded directly in HTML documents</li>
        </ul>
        <p>
            For interactive editing, animations, and real-time rendering, Canvas is preferred due to its
            superior performance and support for pixel-level operations.
        </p>

        <app-docs-page-nav [previousPage]="previousPage" [nextPage]="nextPage"></app-docs-page-nav>
    `
})
export class SvgRenderingPageComponent {
    previousPage: DocsPage | undefined;
    nextPage: DocsPage | undefined;

    constructor(docsService: DocsService) {
        this.previousPage = docsService.getPreviousPage('rendering', 'svg-rendering');
        this.nextPage = docsService.getNextPage('rendering', 'svg-rendering');
    }
}
