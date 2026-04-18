import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DocsService, DocsPage } from '../../../../services/docs.service';
import { DocsPageNavComponent } from '../../docs-page-nav.component';
import { CodeBlockComponent } from '../../../code-block/code-block.component';
import { DocsCodeSampleComponent } from '../../docs-code-sample.component';

@Component({
    imports: [CommonModule, RouterModule, DocsPageNavComponent, CodeBlockComponent, DocsCodeSampleComponent],
    template: `
        <h1>Core Concepts</h1>
        <p class="lead">
            Understanding the foundational type system and patterns that underpin every Elise operation.
        </p>

        <h2>The Retained Scene Graph</h2>
        <p>
            Elise is a <strong>retained-mode</strong> graphics system. Instead of issuing drawing commands directly to
            a canvas context each frame, you build a tree of objects (elements) inside a <code>Model</code>. The model
            <em>retains</em> this scene graph in memory. When you want to update the display, you mutate element
            properties and call <code>controller.draw()</code> — the framework traverses the graph and renders every
            visible element.
        </p>
        <p>
            This is fundamentally different from immediate-mode libraries like raw Canvas 2D, where the application
            must manually redraw everything each frame. Retained mode gives you:
        </p>
        <ul>
            <li>Persistent element identity — each object has properties you can read, write, and animate</li>
            <li>Automatic hit testing — the framework knows which element is under the cursor</li>
            <li>Built-in serialization — the entire scene can be saved to JSON and restored</li>
            <li>Design-surface readiness — selection, drag, resize, undo/redo all operate on the graph</li>
        </ul>

        <h2>Models</h2>
        <p>
            A <code>Model</code> is the root container. It defines:
        </p>
        <ul>
            <li><strong>Coordinate space</strong> — a fixed width and height in logical pixels</li>
            <li><strong>Element array</strong> — ordered bottom-to-top; first element renders behind the last</li>
            <li><strong>Resource collection</strong> — shared bitmaps, models, and text strings indexed by key</li>
            <li><strong>Background fill</strong> — optional fill for the model rectangle itself</li>
        </ul>
        <app-docs-code-sample [code]="modelCode" language="javascript" label="JavaScript" [returnVar]="'model'"></app-docs-code-sample>

        <h2>Elements</h2>
        <p>
            Elements are the visible objects in a model. All elements inherit from <code>ElementBase</code>, which
            provides common properties:
        </p>
        <table class="docs-table">
            <thead><tr><th>Property</th><th>Type</th><th>Description</th></tr></thead>
            <tbody>
                <tr><td><code>type</code></td><td>string</td><td>Type discriminator (e.g. "rectangle", "ellipse")</td></tr>
                <tr><td><code>id</code></td><td>string?</td><td>Optional identifier for lookup</td></tr>
                <tr><td><code>fill</code></td><td>string | gradient</td><td>Fill color, gradient, or pattern key</td></tr>
                <tr><td><code>stroke</code></td><td>string?</td><td>Stroke in "Color,Width" format</td></tr>
                <tr><td><code>opacity</code></td><td>number</td><td>Element opacity (0–1)</td></tr>
                <tr><td><code>transform</code></td><td>string?</td><td>Affine transform string</td></tr>
                <tr><td><code>interactive</code></td><td>boolean</td><td>Enable hit testing</td></tr>
                <tr><td><code>visible</code></td><td>boolean</td><td>Show/hide element</td></tr>
                <tr><td><code>locked</code></td><td>boolean</td><td>Prevent move/resize in design mode</td></tr>
                <tr><td><code>shadow</code></td><td>object?</td><td>Drop shadow configuration</td></tr>
                <tr><td><code>blendMode</code></td><td>string?</td><td>Canvas composite operation</td></tr>
                <tr><td><code>filter</code></td><td>string?</td><td>CSS filter string</td></tr>
                <tr><td><code>clipPath</code></td><td>object?</td><td>Clip path configuration</td></tr>
            </tbody>
        </table>

        <h2>The Fluent API</h2>
        <p>
            Most element methods return <code>this</code>, enabling chained construction:
        </p>
        <app-code-block [code]="fluentCode" language="javascript" label="JavaScript"></app-code-block>

        <h2>Points, Sizes, and Regions</h2>
        <p>
            Elise uses immutable value types for geometry:
        </p>
        <ul>
            <li><code>Point</code> — <code>Point.create(x, y)</code> with <code>x</code> and <code>y</code> properties</li>
            <li><code>Size</code> — <code>Size.create(width, height)</code></li>
            <li><code>Region</code> — <code>Region.create(x, y, width, height)</code> with containment and intersection tests</li>
        </ul>
        <p>
            In serialized form, points are stored as <code>"x,y"</code> strings and sizes as <code>"widthxheight"</code>
            strings. The library parses both formats automatically.
        </p>

        <h2>Colors</h2>
        <p>
            The <code>Color</code> class supports multiple input formats:
        </p>
        <app-code-block [code]="colorCode" language="javascript" label="JavaScript"></app-code-block>
        <p>
            Over 140 named colors are built in (CSS standard names). Color values include an alpha channel — the
            <code>a</code> property — ranging from 0 (fully transparent) to 255 (fully opaque).
        </p>

        <h2>Controllers</h2>
        <p>
            A model alone is just data. To render and interact with it, you attach it to a <strong>controller</strong>:
        </p>
        <ul>
            <li><strong>ViewController</strong> — read-only rendering with mouse/touch events and timer support</li>
            <li><strong>DesignController</strong> — full editing with tools, selection, undo/redo, clipboard, grid</li>
            <li><strong>SurfaceViewController</strong> — multi-layer surface rendering with pane transitions</li>
        </ul>

        <h2>Resources</h2>
        <p>
            When elements reference external assets — images, nested models, or localized text — those assets are
            stored as <strong>resources</strong> in the model's resource collection. Each resource has a
            <code>key</code> that elements reference by name:
        </p>
        <app-docs-code-sample [code]="resourceCode" language="javascript" label="JavaScript" [returnVar]="'model'"></app-docs-code-sample>

        <h2>Commands and Events</h2>
        <p>
            Elements can have command handler tags for mouse events (<code>mouseDown</code>, <code>mouseUp</code>,
            <code>mouseEnter</code>, <code>mouseLeave</code>, <code>click</code>) and timer callbacks
            (<code>timer</code>). These tags are strings that the controller dispatches to registered command handlers,
            enabling event-driven interaction without direct DOM manipulation.
        </p>

        <app-docs-page-nav [previousPage]="previousPage" [nextPage]="nextPage"></app-docs-page-nav>
    `
})
export class CoreConceptsPageComponent {
    previousPage: DocsPage | undefined;
    nextPage: DocsPage | undefined;

    modelCode = `// Create a 640×480 model
var model = elise.model(640, 480);

// The model itself can have a fill
model.setFill('#1a1a2e');

// Elements are stored in order
model.add(elise.rectangle(10, 10, 100, 80).setFill('Blue'));   // index 0, drawn first
model.add(elise.ellipse(80, 60, 50, 40).setFill('Red'));       // index 1, drawn on top

// Access elements by index or id
var rect = model.elements[0];
var byId = model.elementWithId('my-rect');`;

    fluentCode = `elise.rectangle(20, 20, 200, 120)
    .setFill('#3b82f6')
    .setStroke('#1d4ed8,2')
    .setOpacity(0.9)
    .setShadow({ color: 'rgba(0,0,0,0.3)', blur: 12, offsetX: 4, offsetY: 6 })
    .setTransform('rotate(5)(120,80)')
    .setInteractive(true)
    .addTo(model);`;

    colorCode = `// Named colors
Color.parse('Red');
Color.parse('SteelBlue');

// Hex formats
Color.parse('#FF0000');           // #RRGGBB
Color.parse('#FF000080');         // #RRGGBBAA (50% transparent red)
Color.parse('#F00');              // #RGB shorthand

// Function formats
Color.parse('rgb(255, 0, 0)');
Color.parse('rgba(255, 0, 0, 0.5)');
Color.parse('hsl(0, 100%, 50%)');

// Elise opacity; color format
// "0.5;Red" means Red at 50% opacity
element.setFill('0.5;Red');`;

    resourceCode = `var model = elise.model(400, 300);

// Register a bitmap resource
model.resourceManager.add(
    BitmapResource.create('bg-image', 'images/background.png')
);

// Use the resource key in an image element
elise.image('bg-image', 0, 0, 400, 300).addTo(model);

// Prepare resources (load all pending) before rendering
model.prepareResources(null, function(success) {
    if (success) {
        controller.draw();
    }
});`;

    constructor(docsService: DocsService) {
        this.previousPage = docsService.getPreviousPage('getting-started', 'core-concepts');
        this.nextPage = docsService.getNextPage('getting-started', 'core-concepts');
    }
}
