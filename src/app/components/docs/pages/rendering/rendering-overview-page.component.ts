import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DocsService, DocsPage } from '../../../../services/docs.service';
import { DocsPageNavComponent } from '../../docs-page-nav.component';
import { CodeBlockComponent } from '../../../code-block/code-block.component';

@Component({
    imports: [CommonModule, RouterModule, DocsPageNavComponent, CodeBlockComponent],
    template: `
        <h1>Rendering Overview</h1>
        <p class="lead">
            Elise supports dual rendering targets — HTML5 Canvas and SVG — driven by a controller-based pipeline
            that transforms models into visual output.
        </p>

        <h2>Dual Rendering</h2>
        <p>
            Every model can be rendered to either Canvas or SVG. Canvas is the default and is used for interactive
            views, design surfaces, and animations. SVG rendering generates DOM elements and is used for export,
            printing, and resolution-independent output.
        </p>
        <table class="docs-table">
            <thead><tr><th>Feature</th><th>Canvas (Default)</th><th>SVG</th></tr></thead>
            <tbody>
                <tr><td><strong>Output</strong></td><td>Pixel bitmap</td><td>DOM elements</td></tr>
                <tr><td><strong>Performance</strong></td><td>Fast — single draw pass</td><td>Slower — DOM manipulation</td></tr>
                <tr><td><strong>Scalability</strong></td><td>Pixel-based (requires redraw at new size)</td><td>Resolution-independent</td></tr>
                <tr><td><strong>Interactivity</strong></td><td>Hit testing via math/pixel sampling</td><td>Native DOM events</td></tr>
                <tr><td><strong>Styling</strong></td><td>Blend modes, filters, shadows</td><td>CSS stylable</td></tr>
                <tr><td><strong>Export</strong></td><td>PNG/JPEG via toDataURL</td><td>SVG file, print-ready</td></tr>
                <tr><td><strong>Accessibility</strong></td><td>Opaque bitmap</td><td>DOM-accessible elements</td></tr>
                <tr><td><strong>Use Cases</strong></td><td>Views, design, animation, surfaces</td><td>Export, printing, embedding</td></tr>
            </tbody>
        </table>

        <h2>Rendering Pipeline</h2>
        <p>
            The rendering pipeline follows a consistent flow regardless of output target:
        </p>
        <ol>
            <li><strong>Model</strong> — The scene graph containing elements, resources, and styling</li>
            <li><strong>Controller</strong> — Manages the render loop, resource loading, and event handling</li>
            <li><strong>Renderer</strong> — Translates element properties into drawing commands</li>
            <li><strong>Output</strong> — Canvas 2D context or SVG DOM tree</li>
        </ol>

        <h2>Controllers</h2>
        <p>
            Three controller types drive rendering for different use cases:
        </p>
        <table class="docs-table">
            <thead><tr><th>Controller</th><th>Purpose</th><th>Rendering</th></tr></thead>
            <tbody>
                <tr>
                    <td><strong>ViewController</strong></td>
                    <td>Read-only model display</td>
                    <td>Canvas rendering with animation support, mouse/touch events, and element hit testing</td>
                </tr>
                <tr>
                    <td><strong>DesignController</strong></td>
                    <td>Interactive editing</td>
                    <td>Canvas rendering plus selection handles, guides, grid overlay, and tool feedback</td>
                </tr>
                <tr>
                    <td><strong>SurfaceController</strong></td>
                    <td>Multi-pane surfaces</td>
                    <td>Mixed canvas and HTML layer rendering with transitions and independent hit testing</td>
                </tr>
            </tbody>
        </table>

        <h2>Key Properties</h2>
        <table class="docs-table">
            <thead><tr><th>Property</th><th>Type</th><th>Description</th></tr></thead>
            <tbody>
                <tr><td><code>scale</code></td><td>number</td><td>Zoom level — 1 is 100%, 2 is 200%, 0.5 is 50%</td></tr>
                <tr><td><code>background</code></td><td>string</td><td>Canvas background color (CSS color value)</td></tr>
                <tr><td><code>model</code></td><td>Model</td><td>The scene graph to render</td></tr>
            </tbody>
        </table>

        <h2>Angular Component Usage</h2>
        <p>
            Elise provides Angular wrapper components for each controller type:
        </p>
        <app-code-block [code]="viewCode" language="html" label="View Component"></app-code-block>
        <app-code-block [code]="designCode" language="html" label="Design Component"></app-code-block>

        <app-docs-page-nav [previousPage]="previousPage" [nextPage]="nextPage"></app-docs-page-nav>
    `
})
export class RenderingOverviewPageComponent {
    previousPage: DocsPage | undefined;
    nextPage: DocsPage | undefined;

    viewCode = `<!-- Read-only view with zoom -->
<app-elise-view [model]="model" [scale]="1">
</app-elise-view>`;

    designCode = `<!-- Interactive design surface -->
<app-elise-design [model]="model">
</app-elise-design>`;

    constructor(docsService: DocsService) {
        this.previousPage = docsService.getPreviousPage('rendering', 'rendering-overview');
        this.nextPage = docsService.getNextPage('rendering', 'rendering-overview');
    }
}
