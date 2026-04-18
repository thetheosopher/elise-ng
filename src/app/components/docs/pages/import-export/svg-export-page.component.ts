import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DocsService, DocsPage } from '../../../../services/docs.service';
import { DocsPageNavComponent } from '../../docs-page-nav.component';
import { CodeBlockComponent } from '../../../code-block/code-block.component';

@Component({
    selector: 'app-svg-export-page',
    standalone: true,
    imports: [CommonModule, RouterModule, DocsPageNavComponent, CodeBlockComponent],
    template: `
        <h1>SVG Export</h1>
        <p class="lead">
            Convert Elise models to standards-compliant SVG markup using the SVGExporter.
            Generate SVG strings suitable for embedding in web pages, saving as files,
            or further processing.
        </p>

        <h2>Overview</h2>
        <p>
            The <code>SVGExporter</code> takes an Elise model and generates an SVG string
            that faithfully represents all elements, fills, strokes, gradients, and transforms.
            Gradient definitions are automatically collected and emitted in an SVG
            <code>&lt;defs&gt;</code> block.
        </p>

        <h2>Element Mapping</h2>
        <table class="docs-table">
            <thead>
                <tr>
                    <th>Elise Element</th>
                    <th>SVG Element</th>
                    <th>Notes</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Rectangle</td>
                    <td>rect</td>
                    <td>Includes x, y, width, height</td>
                </tr>
                <tr>
                    <td>Ellipse</td>
                    <td>ellipse</td>
                    <td>Includes cx, cy, rx, ry</td>
                </tr>
                <tr>
                    <td>Line</td>
                    <td>line</td>
                    <td>Includes x1, y1, x2, y2</td>
                </tr>
                <tr>
                    <td>Polyline</td>
                    <td>polyline</td>
                    <td>Points formatted as coordinate pairs</td>
                </tr>
                <tr>
                    <td>Polygon</td>
                    <td>polygon</td>
                    <td>Points formatted as coordinate pairs</td>
                </tr>
                <tr>
                    <td>Path</td>
                    <td>path</td>
                    <td>Path commands in d attribute</td>
                </tr>
                <tr>
                    <td>Text</td>
                    <td>text</td>
                    <td>Includes font properties and positioning</td>
                </tr>
            </tbody>
        </table>

        <h2>Export Options</h2>
        <table class="docs-table">
            <thead>
                <tr>
                    <th>Option</th>
                    <th>Type</th>
                    <th>Default</th>
                    <th>Description</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>precision</td>
                    <td>number</td>
                    <td>2</td>
                    <td>Decimal precision for numeric values</td>
                </tr>
                <tr>
                    <td>indent</td>
                    <td>boolean</td>
                    <td>true</td>
                    <td>Pretty-print with indentation</td>
                </tr>
                <tr>
                    <td>includeXmlDeclaration</td>
                    <td>boolean</td>
                    <td>false</td>
                    <td>Include XML declaration header</td>
                </tr>
            </tbody>
        </table>

        <h2>Basic Export</h2>
        <p>
            Export an Elise model to an SVG string with default settings.
        </p>
        <app-code-block [code]="basicCode" language="javascript" label="JavaScript"></app-code-block>

        <h2>Export with Options</h2>
        <p>
            Customize the SVG output with formatting and precision options.
        </p>
        <app-code-block [code]="customCode" language="javascript" label="JavaScript"></app-code-block>

        <app-docs-page-nav [previousPage]="previousPage" [nextPage]="nextPage"></app-docs-page-nav>
    `
})
export class SvgExportPageComponent {
    previousPage: DocsPage | undefined;
    nextPage: DocsPage | undefined;

    basicCode = `// Create a model with some elements
const m = elise.model(200, 200);
elise.rectangle(10, 10, 80, 60)
    .setFill('Blue')
    .setStroke('Black', 2)
    .addTo(m);
elise.ellipse(150, 100, 40, 30)
    .setFill('Red')
    .addTo(m);

// Export to SVG string
const svgString = SVGExporter.toSvg(m);
console.log(svgString);`;

    customCode = `// Create a model
const m = elise.model(300, 300);
elise.rectangle(10, 10, 120, 80)
    .setFill('Gold')
    .setStroke('DarkGoldenrod', 2)
    .addTo(m);
elise.polygon('150,20 250,80 200,150')
    .setFill('ForestGreen')
    .addTo(m);

// Export with custom options
const svgString = SVGExporter.toSvg(m, {
    precision: 4,
    indent: true,
    includeXmlDeclaration: true
});`;

    constructor(private docsService: DocsService) {
        this.previousPage = docsService.getPreviousPage('import-export', 'svg-export');
        this.nextPage = docsService.getNextPage('import-export', 'svg-export');
    }
}
