import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DocsService, DocsPage } from '../../../../services/docs.service';
import { DocsPageNavComponent } from '../../docs-page-nav.component';
import { CodeBlockComponent } from '../../../code-block/code-block.component';

@Component({
    selector: 'app-svg-import-page',
    standalone: true,
    imports: [CommonModule, RouterModule, DocsPageNavComponent, CodeBlockComponent],
    template: `
        <h1>SVG Import</h1>
        <p class="lead">
            Convert SVG content to Elise models using the SVGImporter. Parse SVG markup and
            create corresponding Elise elements with support for shapes, fills, strokes,
            gradients, and transforms.
        </p>

        <h2>Overview</h2>
        <p>
            The <code>SVGImporter</code> parses SVG markup strings and generates equivalent
            Elise model elements. This enables importing existing vector graphics into
            the Elise framework for further editing, animation, or rendering.
        </p>

        <h2>Supported SVG Elements</h2>
        <table class="docs-table">
            <thead>
                <tr>
                    <th>SVG Element</th>
                    <th>Elise Element</th>
                    <th>Notes</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>rect</td>
                    <td>Rectangle</td>
                    <td>Supports x, y, width, height, rx, ry</td>
                </tr>
                <tr>
                    <td>circle</td>
                    <td>Ellipse</td>
                    <td>Mapped to ellipse with equal radii</td>
                </tr>
                <tr>
                    <td>ellipse</td>
                    <td>Ellipse</td>
                    <td>Supports cx, cy, rx, ry</td>
                </tr>
                <tr>
                    <td>line</td>
                    <td>Line</td>
                    <td>Supports x1, y1, x2, y2</td>
                </tr>
                <tr>
                    <td>polyline</td>
                    <td>Polyline</td>
                    <td>Supports points attribute</td>
                </tr>
                <tr>
                    <td>polygon</td>
                    <td>Polygon</td>
                    <td>Supports points attribute</td>
                </tr>
                <tr>
                    <td>path</td>
                    <td>Path</td>
                    <td>Supports d attribute with path commands</td>
                </tr>
                <tr>
                    <td>text</td>
                    <td>Text</td>
                    <td>Supports basic text content and positioning</td>
                </tr>
                <tr>
                    <td>g</td>
                    <td>Group</td>
                    <td>Nested groups with inherited transforms</td>
                </tr>
            </tbody>
        </table>

        <h2>Supported Styling</h2>
        <table class="docs-table">
            <thead>
                <tr>
                    <th>Feature</th>
                    <th>Support</th>
                    <th>Notes</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Solid fills</td>
                    <td>Full</td>
                    <td>Named colors, hex, rgb()</td>
                </tr>
                <tr>
                    <td>Linear gradients</td>
                    <td>Full</td>
                    <td>Via linearGradient defs</td>
                </tr>
                <tr>
                    <td>Radial gradients</td>
                    <td>Full</td>
                    <td>Via radialGradient defs</td>
                </tr>
                <tr>
                    <td>Strokes</td>
                    <td>Full</td>
                    <td>Color, width, dash patterns</td>
                </tr>
                <tr>
                    <td>Transforms</td>
                    <td>Full</td>
                    <td>translate, rotate, scale, matrix</td>
                </tr>
                <tr>
                    <td>CSS styling</td>
                    <td>Partial</td>
                    <td>Inline styles supported; external stylesheets not supported</td>
                </tr>
                <tr>
                    <td>Filters</td>
                    <td>Partial</td>
                    <td>Limited support</td>
                </tr>
                <tr>
                    <td>Masks/Clips</td>
                    <td>Partial</td>
                    <td>Limited support</td>
                </tr>
            </tbody>
        </table>

        <h2>Basic Import</h2>
        <p>
            Import a simple SVG string containing basic shapes into an Elise model.
        </p>
        <app-code-block [code]="basicCode" language="javascript" label="JavaScript"></app-code-block>

        <h2>Import with Gradients and Transforms</h2>
        <p>
            Import more complex SVG content that includes gradient definitions and transform attributes.
        </p>
        <app-code-block [code]="complexCode" language="javascript" label="JavaScript"></app-code-block>

        <h2>Limitations</h2>
        <p>
            Complex CSS styling applied via external stylesheets, advanced filters, masks, and
            clip paths may have partial or no support. For best results, use inline styling
            and standard SVG elements. Embedded images within SVG are not imported.
        </p>

        <app-docs-page-nav [previousPage]="previousPage" [nextPage]="nextPage"></app-docs-page-nav>
    `
})
export class SvgImportPageComponent {
    previousPage: DocsPage | undefined;
    nextPage: DocsPage | undefined;

    basicCode = `// Simple SVG with basic shapes
const svgString = \`
<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">
    <rect x="10" y="10" width="80" height="60" fill="blue" stroke="black" stroke-width="2"/>
    <circle cx="150" cy="40" r="30" fill="red"/>
    <line x1="10" y1="150" x2="190" y2="150" stroke="green" stroke-width="3"/>
</svg>\`;

// Convert SVG to an Elise model
const model = SVGImporter.toModel(svgString);`;

    complexCode = `// SVG with gradients and transforms
const svgString = \`
<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300">
    <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:rgb(255,255,0);stop-opacity:1"/>
            <stop offset="100%" style="stop-color:rgb(255,0,0);stop-opacity:1"/>
        </linearGradient>
        <radialGradient id="grad2" cx="50%" cy="50%" r="50%">
            <stop offset="0%" style="stop-color:white;stop-opacity:1"/>
            <stop offset="100%" style="stop-color:blue;stop-opacity:1"/>
        </radialGradient>
    </defs>
    <rect x="10" y="10" width="120" height="80" fill="url(#grad1)"
        transform="rotate(15, 70, 50)"/>
    <circle cx="220" cy="100" r="60" fill="url(#grad2)"/>
    <polygon points="150,200 100,280 200,280" fill="green"
        transform="translate(10, -20)"/>
</svg>\`;

const model = SVGImporter.toModel(svgString);`;

    constructor(private docsService: DocsService) {
        this.previousPage = docsService.getPreviousPage('import-export', 'svg-import');
        this.nextPage = docsService.getNextPage('import-export', 'svg-import');
    }
}
