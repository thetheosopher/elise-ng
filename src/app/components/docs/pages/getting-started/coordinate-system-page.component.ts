import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DocsService, DocsPage } from '../../../../services/docs.service';
import { DocsPageNavComponent } from '../../docs-page-nav.component';
import { CodeBlockComponent } from '../../../code-block/code-block.component';

@Component({
    imports: [CommonModule, RouterModule, DocsPageNavComponent, CodeBlockComponent],
    template: `
        <h1>Coordinate System</h1>
        <p class="lead">
            How Elise measures positions, sizes, and transforms in logical pixel space.
        </p>

        <h2>Logical Pixels</h2>
        <p>
            An Elise model defines a coordinate space in <strong>logical pixels</strong>. When you create
            <code>elise.model(640, 480)</code>, the model's internal coordinate system runs from (0, 0) at the
            top-left to (640, 480) at the bottom-right, regardless of the actual canvas size on screen.
        </p>
        <p>
            The <code>scale</code> property on the controller maps logical pixels to physical canvas pixels.
            At scale 1.0, one logical pixel equals one CSS pixel. At scale 2.0, the model renders at double size.
            The coordinate values you use in element creation always refer to logical pixels.
        </p>

        <h2>Origin and Axes</h2>
        <p>
            The coordinate origin is at the <strong>top-left corner</strong> of the model:
        </p>
        <ul>
            <li><strong>X axis</strong> increases to the right</li>
            <li><strong>Y axis</strong> increases downward</li>
            <li>Angles are measured in <strong>degrees</strong>, with 0° at the 3 o'clock position, increasing clockwise</li>
        </ul>

        <h2>Position and Size Types</h2>
        <p>
            Geometry is expressed using three core value types:
        </p>
        <app-code-block [code]="typesCode" language="javascript" label="JavaScript"></app-code-block>

        <h2>Element Positioning</h2>
        <p>
            Different element types use different positioning models:
        </p>
        <table class="docs-table">
            <thead><tr><th>Element</th><th>Position Property</th><th>Meaning</th></tr></thead>
            <tbody>
                <tr><td>Rectangle, Image, Model, Sprite, Text</td><td><code>location</code> (x, y)</td><td>Top-left corner</td></tr>
                <tr><td>Ellipse</td><td><code>center</code> (cx, cy)</td><td>Center point with radiusX/radiusY</td></tr>
                <tr><td>Line</td><td><code>p1</code>, <code>p2</code></td><td>Two endpoints</td></tr>
                <tr><td>Polyline, Polygon</td><td><code>points</code></td><td>Array of vertices</td></tr>
                <tr><td>Path</td><td><code>commands</code></td><td>SVG-like path command string</td></tr>
                <tr><td>Arc, Arrow, Wedge, Ring, RegularPolygon</td><td><code>location</code> (x, y)</td><td>Bounding box top-left</td></tr>
            </tbody>
        </table>

        <h2>Transforms</h2>
        <p>
            Element transforms are applied in a local coordinate space relative to the element's own position. The
            transform string syntax supports:
        </p>
        <app-code-block [code]="transformCode" language="javascript" label="JavaScript"></app-code-block>
        <p>
            When a pivot point is specified as <code>(px, py)</code>, the transform is applied relative to that point
            in the model's coordinate space.
        </p>

        <h2>Scaling and High-DPI</h2>
        <p>
            The controller's <code>scale</code> property controls the mapping from logical to physical pixels.
            On high-DPI displays, the controller can automatically adjust the canvas backing store resolution
            via the <code>autoPixelRatio</code> property to produce crisp rendering without changing your
            logical coordinate values.
        </p>

        <app-docs-page-nav [previousPage]="previousPage" [nextPage]="nextPage"></app-docs-page-nav>
    `
})
export class CoordinateSystemPageComponent {
    previousPage: DocsPage | undefined;
    nextPage: DocsPage | undefined;

    typesCode = `// Point — a 2D coordinate
var p = Point.create(100, 200);
console.log(p.x, p.y);           // 100, 200
console.log(p.toString());       // "100,200"

// Size — width and height
var s = Size.create(320, 240);
console.log(s.width, s.height);  // 320, 240

// Region — rectangle defined by origin + size
var r = Region.create(10, 20, 300, 200);
console.log(r.x, r.y, r.width, r.height);  // 10, 20, 300, 200
r.containsPoint(Point.create(50, 50));      // true
r.containsCoordinate(500, 500);             // false`;

    transformCode = `// Rotate 45 degrees around the center of a 200×100 rect at (50, 50)
element.setTransform('rotate(45)(150,100)');

// Scale to 150% around the element center
element.setTransform('scale(1.5,1.5)(150,100)');

// Translate by (20, 30) pixels
element.setTransform('translate(20,30)');

// Chain multiple transforms
element.setTransform('rotate(30)(100,100) scale(1.2,1.2)(100,100)');

// Skew transforms
element.setTransform('skewX(15)');
element.setTransform('skewY(10)');`;

    constructor(docsService: DocsService) {
        this.previousPage = docsService.getPreviousPage('getting-started', 'coordinate-system');
        this.nextPage = docsService.getNextPage('getting-started', 'coordinate-system');
    }
}
