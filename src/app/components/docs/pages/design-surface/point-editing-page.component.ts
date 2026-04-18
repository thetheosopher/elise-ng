import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DocsService, DocsPage } from '../../../../services/docs.service';
import { DocsPageNavComponent } from '../../docs-page-nav.component';
import { CodeBlockComponent } from '../../../code-block/code-block.component';

@Component({
    imports: [CommonModule, RouterModule, DocsPageNavComponent, CodeBlockComponent],
    template: `
        <h1>Point Editing</h1>
        <p class="lead">
            Point editing mode allows direct manipulation of individual vertices and control
            points on Line, Polyline, Polygon, and Path elements.
        </p>

        <h2>Entering Point Edit Mode</h2>
        <p>
            Double-click a compatible element (Line, Polyline, Polygon, or Path) to enter point
            editing mode. The element's individual points are displayed as draggable handles
            overlaid on the canvas. The <code>PointEditService</code> manages the editing state
            and handle rendering.
        </p>

        <h2>Compatible Elements</h2>
        <table class="docs-table">
            <thead>
                <tr>
                    <th>Element Type</th>
                    <th>Point Behavior</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><code>Line</code></td>
                    <td>Two endpoint handles (start and end).</td>
                </tr>
                <tr>
                    <td><code>Polyline</code></td>
                    <td>One handle per vertex. Open path — first and last points are not connected.</td>
                </tr>
                <tr>
                    <td><code>Polygon</code></td>
                    <td>One handle per vertex. Closed path — last point connects back to first.</td>
                </tr>
                <tr>
                    <td><code>Path</code></td>
                    <td>Anchor point handles plus bezier control point handles for curve segments.</td>
                </tr>
            </tbody>
        </table>

        <h2>Point Handle Operations</h2>
        <p>The following operations are available while in point editing mode:</p>
        <ul>
            <li><strong>Move point</strong> — Drag a point handle to reposition it.</li>
            <li><strong>Add point</strong> — Click on a segment between two existing points to insert a new vertex.</li>
            <li><strong>Delete point</strong> — Select a point handle and press the <kbd>Delete</kbd> key to remove it.</li>
        </ul>

        <h2>Path Control Points</h2>
        <p>
            For <code>Path</code> elements, bezier curve segments display additional control point
            handles connected to their anchor points by thin lines. Dragging a control point
            adjusts the curve's tangent at that anchor. Cubic bezier segments have two control
            points per segment; quadratic segments have one.
        </p>

        <h2>Point Handle Types</h2>
        <table class="docs-table">
            <thead>
                <tr>
                    <th>Handle Type</th>
                    <th>Appearance</th>
                    <th>Description</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Vertex handle</td>
                    <td>Solid square</td>
                    <td>Represents a point/vertex on the element's path.</td>
                </tr>
                <tr>
                    <td>Control point handle</td>
                    <td>Hollow circle</td>
                    <td>Represents a bezier control point. Connected to its anchor by a thin line.</td>
                </tr>
            </tbody>
        </table>

        <h2>Exiting Point Edit Mode</h2>
        <p>
            Click outside the element being edited or press <kbd>Escape</kbd> to exit point
            editing mode. The element returns to normal selection mode with the standard
            bounding box and resize handles. An undo snapshot captures all point changes.
        </p>

        <h2>Working with Polyline Points</h2>
        <app-code-block [code]="polylineCode" language="javascript" label="JavaScript"></app-code-block>

        <h2>Working with Path Points</h2>
        <app-code-block [code]="pathCode" language="javascript" label="JavaScript"></app-code-block>

        <app-docs-page-nav [previousPage]="previousPage" [nextPage]="nextPage"></app-docs-page-nav>
    `
})
export class PointEditingPageComponent {
    previousPage: DocsPage | undefined;
    nextPage: DocsPage | undefined;

    polylineCode = `// Create a polyline with initial points
var polyline = PolylineElement.create(
    '10,10 50,80 100,30 150,90 200,20'
);
model.add(polyline);

// Access individual points programmatically
var points = polyline.getPoints();
console.log('Point count:', points.length);

// Modify a point
points[2] = { x: 120, y: 50 };
polyline.setPoints(points);`;

    pathCode = `// Create a path with bezier curves
var path = PathElement.create(
    'M 10 80 C 40 10, 65 10, 95 80 S 150 150, 180 80'
);
model.add(path);

// Double-click the path in the surface to enter point edit mode
// Anchor points appear as solid squares
// Bezier control points appear as hollow circles
// Drag control points to reshape the curve`;

    constructor(private docsService: DocsService) {
        this.previousPage = docsService.getPreviousPage('design-surface', 'point-editing');
        this.nextPage = docsService.getNextPage('design-surface', 'point-editing');
    }
}
