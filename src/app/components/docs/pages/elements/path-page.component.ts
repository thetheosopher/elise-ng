import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocsService, DocsPage } from '../../../../services/docs.service';
import { DocsPageNavComponent } from '../../docs-page-nav.component';
import { DocsCodeSampleComponent } from '../../docs-code-sample.component';

@Component({
    selector: 'app-path-page',
    standalone: true,
    imports: [CommonModule, DocsPageNavComponent, DocsCodeSampleComponent],
    template: `
        <h1>Path</h1>
        <p class="lead">
            The path element is the most powerful shape element in Elise, supporting SVG-like path commands
            for creating arbitrary shapes and curves. It provides full control over complex geometry using
            a compact string-based command syntax.
        </p>

        <h2>Factory</h2>
        <p>
            Create a path element using <code>elise.path()</code> and then set its commands using
            <code>.setCommands(pathString)</code>.
        </p>

        <h2>Path Commands</h2>
        <p>
            Path commands follow the SVG path data specification. Uppercase commands use absolute coordinates,
            while lowercase commands use relative coordinates.
        </p>
        <table class="docs-table">
            <thead>
                <tr>
                    <th>Command</th>
                    <th>Name</th>
                    <th>Description</th>
                </tr>
            </thead>
            <tbody>
                <tr><td>M / m</td><td>moveTo</td><td>Move to a new point without drawing</td></tr>
                <tr><td>L / l</td><td>lineTo</td><td>Draw a straight line to a point</td></tr>
                <tr><td>H / h</td><td>horizontal</td><td>Draw a horizontal line</td></tr>
                <tr><td>V / v</td><td>vertical</td><td>Draw a vertical line</td></tr>
                <tr><td>C / c</td><td>cubic bezier</td><td>Draw a cubic bezier curve (two control points)</td></tr>
                <tr><td>S / s</td><td>smooth cubic</td><td>Draw a smooth cubic bezier curve (one control point, reflected)</td></tr>
                <tr><td>Q / q</td><td>quadratic bezier</td><td>Draw a quadratic bezier curve (one control point)</td></tr>
                <tr><td>T / t</td><td>smooth quad</td><td>Draw a smooth quadratic bezier curve (reflected control point)</td></tr>
                <tr><td>A / a</td><td>arc</td><td>Draw an elliptical arc</td></tr>
                <tr><td>Z / z</td><td>close</td><td>Close the current subpath</td></tr>
            </tbody>
        </table>

        <h2>Properties</h2>
        <table class="docs-table">
            <thead>
                <tr>
                    <th>Property</th>
                    <th>Type</th>
                    <th>Default</th>
                    <th>Description</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>commands</td>
                    <td>string</td>
                    <td></td>
                    <td>SVG path data string defining the shape geometry</td>
                </tr>
                <tr>
                    <td>pathData</td>
                    <td>PathData</td>
                    <td></td>
                    <td>Compiled path segments (read-only, generated from commands)</td>
                </tr>
                <tr>
                    <td>winding</td>
                    <td>WindingMode</td>
                    <td>WindingMode.NonZero</td>
                    <td>Fill winding rule: <code>elise.WindingMode.NonZero</code> or <code>elise.WindingMode.EvenOdd</code></td>
                </tr>
            </tbody>
        </table>
        <p>
            Path elements also support fill and stroke properties, as well as point editing for interactive
            manipulation of path control points.
        </p>

        <h2>Basic Triangle</h2>
        <p>
            A simple triangle created using moveTo, lineTo, and close commands.
        </p>
        <app-docs-code-sample [code]="basicCode" language="javascript" label="JavaScript"></app-docs-code-sample>

        <h2>Bezier Curve</h2>
        <p>
            A smooth curve created using cubic bezier commands.
        </p>
        <app-docs-code-sample [code]="curveCode" language="javascript" label="JavaScript"></app-docs-code-sample>

        <h2>Complex Shape</h2>
        <p>
            A heart shape demonstrating complex path construction with curves and fill.
        </p>
        <app-docs-code-sample [code]="complexCode" language="javascript" label="JavaScript"></app-docs-code-sample>

        <h2>Winding Mode</h2>
        <p>
            Use a nested inner subpath with <code>elise.WindingMode.EvenOdd</code> to punch a true hole through the filled shape.
        </p>
        <app-docs-code-sample [code]="windingCode" language="javascript" label="JavaScript"></app-docs-code-sample>

        <app-docs-page-nav [previousPage]="previousPage" [nextPage]="nextPage"></app-docs-page-nav>
    `
})
export class PathPageComponent {
    previousPage: DocsPage | undefined;
    nextPage: DocsPage | undefined;

    basicCode = `const m = elise.model(200, 200);
elise.path()
    .setCommands('M 100,20 L 180,180 L 20,180 Z')
    .setFill('Blue')
    .setStroke('Navy,2')
    .addTo(m);`;

    curveCode = `const m = elise.model(200, 200);
elise.path()
    .setCommands('M 20,100 C 20,20 180,20 180,100 C 180,180 20,180 20,100')
    .setFill('LightGreen')
    .setStroke('Green,2')
    .addTo(m);`;

    complexCode = `const m = elise.model(200, 200);
elise.path()
    .setCommands('M 100,180 C 100,180 20,130 20,80 C 20,30 60,10 100,50 C 140,10 180,30 180,80 C 180,130 100,180 100,180 Z')
    .setFill('Red')
    .setStroke('DarkRed,2')
    .addTo(m);`;

    windingCode = `const m = elise.model(200, 200);
elise.path()
    .setCommands('M 20,20 L 180,20 L 180,180 L 20,180 Z M 70,70 L 130,70 L 130,130 L 70,130 Z')
    .setFill('Purple')
    .setStroke('#6b21a8,2')
    .setWinding(elise.WindingMode.EvenOdd)
    .addTo(m);`;

    constructor(private docsService: DocsService) {
        this.previousPage = docsService.getPreviousPage('elements', 'path');
        this.nextPage = docsService.getNextPage('elements', 'path');
    }
}
