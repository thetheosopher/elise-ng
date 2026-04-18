import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DocsService, DocsPage } from '../../../../services/docs.service';
import { DocsPageNavComponent } from '../../docs-page-nav.component';
import { CodeBlockComponent } from '../../../code-block/code-block.component';

@Component({
    imports: [CommonModule, RouterModule, DocsPageNavComponent, CodeBlockComponent],
    template: `
        <h1>Element Overview</h1>
        <p class="lead">
            Every visible object in an Elise model is an <strong>element</strong>. All elements share a common base
            class with properties for styling, interaction, and transforms, while each element type adds its own
            geometry and behavior.
        </p>

        <h2>Element Hierarchy</h2>
        <p>
            All elements inherit from <code>ElementBase</code>:
        </p>
        <app-code-block [code]="hierarchyCode" language="typescript" label="Type Hierarchy"></app-code-block>

        <h2>Element Types at a Glance</h2>
        <table class="docs-table">
            <thead><tr><th>Type</th><th>Factory</th><th>Fills</th><th>Strokes</th><th>Point Edit</th><th>Description</th></tr></thead>
            <tbody>
                <tr><td><a routerLink="/docs/elements/rectangle">Rectangle</a></td><td><code>elise.rectangle(x,y,w,h)</code></td><td>Yes</td><td>Yes</td><td>No</td><td>Rounded or square box</td></tr>
                <tr><td><a routerLink="/docs/elements/ellipse">Ellipse</a></td><td><code>elise.ellipse(cx,cy,rx,ry)</code></td><td>Yes</td><td>Yes</td><td>No</td><td>Circle or oval</td></tr>
                <tr><td><a routerLink="/docs/elements/line">Line</a></td><td><code>elise.line(x1,y1,x2,y2)</code></td><td>No</td><td>Yes</td><td>Yes</td><td>Straight line segment</td></tr>
                <tr><td><a routerLink="/docs/elements/polyline">Polyline</a></td><td><code>elise.polyline()</code></td><td>No</td><td>Yes</td><td>Yes</td><td>Connected line segments</td></tr>
                <tr><td><a routerLink="/docs/elements/polygon">Polygon</a></td><td><code>elise.polygon()</code></td><td>Yes</td><td>Yes</td><td>Yes</td><td>Closed filled shape with vertices</td></tr>
                <tr><td><a routerLink="/docs/elements/path">Path</a></td><td><code>elise.path()</code></td><td>Yes</td><td>Yes</td><td>Yes</td><td>SVG-like path commands</td></tr>
                <tr><td><a routerLink="/docs/elements/arc">Arc</a></td><td><code>elise.arc(x,y,w,h)</code></td><td>No</td><td>Yes</td><td>No</td><td>Open elliptical arc</td></tr>
                <tr><td><a routerLink="/docs/elements/arrow">Arrow</a></td><td><code>elise.arrow(x,y,w,h)</code></td><td>Yes</td><td>Yes</td><td>No</td><td>Parameterized arrow shape</td></tr>
                <tr><td><a routerLink="/docs/elements/wedge">Wedge</a></td><td><code>elise.wedge(x,y,w,h)</code></td><td>Yes</td><td>Yes</td><td>No</td><td>Pie/sector slice</td></tr>
                <tr><td><a routerLink="/docs/elements/ring">Ring</a></td><td><code>elise.ring(x,y,w,h)</code></td><td>Yes</td><td>Yes</td><td>No</td><td>Donut/annulus shape</td></tr>
                <tr><td><a routerLink="/docs/elements/regular-polygon">Regular Polygon</a></td><td><code>elise.regularPolygon(x,y,w,h)</code></td><td>Yes</td><td>Yes</td><td>No</td><td>Star or regular polygon</td></tr>
                <tr><td><a routerLink="/docs/elements/text">Text</a></td><td><code>elise.text(text,x,y,w,h)</code></td><td>Yes</td><td>Yes</td><td>No</td><td>Single or multi-line text</td></tr>
                <tr><td><a routerLink="/docs/elements/image">Image</a></td><td><code>elise.image(src,x,y,w,h)</code></td><td>No</td><td>No</td><td>No</td><td>Bitmap display from resource</td></tr>
                <tr><td><a routerLink="/docs/elements/model-element">Model Element</a></td><td><code>elise.modelElement(src,x,y,w,h)</code></td><td>No</td><td>No</td><td>No</td><td>Nested model reference</td></tr>
                <tr><td><a routerLink="/docs/elements/sprite">Sprite</a></td><td><code>elise.sprite(x,y,w,h)</code></td><td>No</td><td>No</td><td>No</td><td>Animated frame sequence</td></tr>
            </tbody>
        </table>

        <h2>Common Properties</h2>
        <p>
            These properties are available on every element type through <code>ElementBase</code>:
        </p>
        <app-code-block [code]="commonPropsCode" language="javascript" label="JavaScript"></app-code-block>

        <h2>Common Methods</h2>
        <table class="docs-table">
            <thead><tr><th>Method</th><th>Returns</th><th>Description</th></tr></thead>
            <tbody>
                <tr><td><code>setFill(fill)</code></td><td>this</td><td>Set fill (color string, gradient, or resource key)</td></tr>
                <tr><td><code>setStroke(stroke)</code></td><td>this</td><td>Set stroke in "Color,Width" format</td></tr>
                <tr><td><code>setOpacity(opacity)</code></td><td>this</td><td>Set element opacity (0–1)</td></tr>
                <tr><td><code>setTransform(transform)</code></td><td>this</td><td>Set affine transform string</td></tr>
                <tr><td><code>setShadow(shadow)</code></td><td>this</td><td>Set drop shadow configuration</td></tr>
                <tr><td><code>setBlendMode(mode)</code></td><td>this</td><td>Set canvas composite operation</td></tr>
                <tr><td><code>setFilter(filter)</code></td><td>this</td><td>Set CSS filter string</td></tr>
                <tr><td><code>setClipPath(clipPath)</code></td><td>this</td><td>Set clip path configuration</td></tr>
                <tr><td><code>setInteractive(flag)</code></td><td>this</td><td>Enable/disable hit testing</td></tr>
                <tr><td><code>setVisible(flag)</code></td><td>this</td><td>Show or hide element</td></tr>
                <tr><td><code>addTo(model)</code></td><td>this</td><td>Add element to a model</td></tr>
                <tr><td><code>animate(target, options)</code></td><td>ElementAnimator</td><td>Start a property tween animation</td></tr>
                <tr><td><code>getBounds()</code></td><td>Region</td><td>Get element bounding rectangle</td></tr>
                <tr><td><code>hitTest(ctx, x, y)</code></td><td>boolean</td><td>Test if point is inside element</td></tr>
                <tr><td><code>clone()</code></td><td>ElementBase</td><td>Deep copy the element</td></tr>
                <tr><td><code>serialize()</code></td><td>object</td><td>Serialize to JSON-friendly object</td></tr>
            </tbody>
        </table>

        <h2>Rendering Order</h2>
        <p>
            Elements render in array order — <code>model.elements[0]</code> is drawn first (bottommost) and the last
            element renders on top. Use <code>model.add(el)</code> to append to the top and
            <code>model.addBottom(el)</code> to insert at the bottom. The DesignController provides
            <code>bringToFront()</code>, <code>sendToBack()</code>, <code>bringForward()</code>, and
            <code>sendBackward()</code> for z-order management.
        </p>

        <app-docs-page-nav [previousPage]="previousPage" [nextPage]="nextPage"></app-docs-page-nav>
    `
})
export class ElementOverviewPageComponent {
    previousPage: DocsPage | undefined;
    nextPage: DocsPage | undefined;

    hierarchyCode = `ElementBase
├── RectangleElement      // Rounded or square box
├── EllipseElement        // Circle or oval
├── LineElement           // Straight line segment
├── PolylineElement       // Connected line segments (open)
├── PolygonElement        // Closed shape with vertices
├── PathElement           // Arbitrary SVG-like path
├── ArcElement            // Open elliptical arc
├── ArrowElement          // Parameterized arrow
├── WedgeElement          // Pie/sector slice
├── RingElement           // Donut/annulus
├── RegularPolygonElement // Star or regular polygon
├── TextElement           // Styled text
├── ImageElement          // Bitmap display
├── ModelElement          // Nested model
└── SpriteElement         // Animated frame sequence`;

    commonPropsCode = `// Every element inherits these from ElementBase:
element.id = 'my-element';           // Optional identifier
element.fill = '#3b82f6';            // Fill (color, gradient, or resource key)
element.stroke = 'Black,2';          // Stroke string
element.opacity = 0.8;               // Transparency (0–1)
element.transform = 'rotate(30)';    // Affine transform
element.visible = true;              // Show/hide
element.locked = false;              // Lock in design mode
element.aspectLocked = false;        // Maintain aspect ratio on resize
element.interactive = false;         // Enable hit testing

// Event handler command tags
element.mouseDown = 'onPress';
element.mouseUp = 'onRelease';
element.mouseEnter = 'onHover';
element.mouseLeave = 'onLeave';
element.click = 'onClick';
element.timer = 'onTick';

// Advanced styling
element.shadow = { color: '#00000066', blur: 8, offsetX: 2, offsetY: 4 };
element.blendMode = 'multiply';
element.filter = 'blur(2px)';
element.clipPath = { commands: 'm0,0 l100,0 l100,100 l0,100 z' };

// Fill pattern properties
element.fillScale = 1.0;
element.fillOffsetX = 0;
element.fillOffsetY = 0;`;

    constructor(docsService: DocsService) {
        this.previousPage = docsService.getPreviousPage('elements', 'element-overview');
        this.nextPage = docsService.getNextPage('elements', 'element-overview');
    }
}
