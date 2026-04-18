import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DocsService, DocsPage } from '../../../../services/docs.service';
import { DocsPageNavComponent } from '../../docs-page-nav.component';
import { CodeBlockComponent } from '../../../code-block/code-block.component';

@Component({
    imports: [CommonModule, RouterModule, DocsPageNavComponent, CodeBlockComponent],
    template: `
        <h1>Architecture</h1>
        <p class="lead">
            How the Elise library is organized — from the core type system through rendering, design, and surfaces.
        </p>

        <h2>Layered Architecture</h2>
        <p>
            Elise is organized in layers, each building on the one below:
        </p>
        <table class="docs-table">
            <thead><tr><th>Layer</th><th>Modules</th><th>Responsibility</th></tr></thead>
            <tbody>
                <tr><td><strong>Core</strong></td><td>core, fill, resource</td><td>Type system, model graph, resource management</td></tr>
                <tr><td><strong>Elements</strong></td><td>elements</td><td>16 element types with geometry, styling, hit testing</td></tr>
                <tr><td><strong>Animation</strong></td><td>animation, transitions</td><td>Property tweens, easing, sprite transitions</td></tr>
                <tr><td><strong>Rendering</strong></td><td>view, svg</td><td>Canvas and SVG output from the retained graph</td></tr>
                <tr><td><strong>Design</strong></td><td>design (tools, services, components)</td><td>Interactive editing surface</td></tr>
                <tr><td><strong>Surface</strong></td><td>surface</td><td>Application framework for kiosks and presentations</td></tr>
                <tr><td><strong>Import</strong></td><td>svg, wmf</td><td>SVG and WMF file import to model graph</td></tr>
                <tr><td><strong>Sketcher</strong></td><td>sketcher</td><td>Progressive drawing engine</td></tr>
                <tr><td><strong>Command</strong></td><td>command</td><td>Element event dispatch and undo management</td></tr>
            </tbody>
        </table>

        <h2>Controller Pattern</h2>
        <p>
            The controller is the bridge between a model and the DOM. Three controller types serve different use cases:
        </p>

        <h3>ViewController</h3>
        <p>
            The lightweight read-only controller. It attaches a <code>Model</code> to a <code>&lt;canvas&gt;</code>
            element, renders the scene graph, and fires event callbacks for mouse/touch interaction and animation timers.
            The view controller is ideal for displaying models, playing animations, and handling element clicks.
        </p>

        <h3>DesignController</h3>
        <p>
            Extends the rendering pipeline with a full editing surface. Adds selection handles, rubber-band selection,
            drag/resize/rotate manipulation, 16 creation tools, undo/redo history, clipboard operations, grid/snap
            support, smart alignment guides, and inline text editing. The design controller coordinates 13 specialized
            service classes for each concern.
        </p>

        <h3>SurfaceViewController</h3>
        <p>
            Manages multi-layer surface rendering. A <code>Surface</code> contains both canvas-rendered elements
            (buttons, text) and HTML-based layers (images, video, iframes). The surface controller orchestrates
            rendering across these mixed-mode layers with opacity, transitions, and independent hit testing.
        </p>

        <h2>Design Service Architecture</h2>
        <p>
            The DesignController delegates specific responsibilities to 13 service classes:
        </p>
        <table class="docs-table">
            <thead><tr><th>Service</th><th>Responsibility</th></tr></thead>
            <tbody>
                <tr><td>SelectionService</td><td>Element selection, rubber-band, multi-select</td></tr>
                <tr><td>ClipboardService</td><td>Copy, cut, paste with resource merging</td></tr>
                <tr><td>MovementService</td><td>Drag movement with smart alignment guides</td></tr>
                <tr><td>TransformService</td><td>Resize with handle constraints and aspect locking</td></tr>
                <tr><td>UndoService</td><td>Snapshot-based undo/redo history</td></tr>
                <tr><td>TextEditingService</td><td>Inline caret-based text editing with style application</td></tr>
                <tr><td>CanvasInteractionService</td><td>Canvas-level mouse/touch coordination</td></tr>
                <tr><td>MouseInteractionService</td><td>Mouse event processing and routing</td></tr>
                <tr><td>KeyboardInteractionService</td><td>Keyboard shortcut handling</td></tr>
                <tr><td>TouchInteractionService</td><td>Touch gesture processing (pinch zoom, pan)</td></tr>
                <tr><td>ArrangementService</td><td>Z-order, alignment, distribution</td></tr>
                <tr><td>OverlayRenderService</td><td>Selection handles, guides, grid rendering</td></tr>
                <tr><td>CanvasLifecycleService</td><td>Canvas creation, scaling, pixel ratio</td></tr>
            </tbody>
        </table>

        <h2>Resource Loading Pipeline</h2>
        <p>
            When a model references external assets, resources must be loaded before rendering:
        </p>
        <ol>
            <li>Resources are added to the model's <code>ResourceManager</code> with unique keys</li>
            <li>Calling <code>model.prepareResources(localeId, callback)</code> triggers loading</li>
            <li>The manager loads each pending resource (images via <code>&lt;img&gt;</code>, models via fetch/parse)</li>
            <li>A <code>UrlProxy</code> can intercept URLs for signed URL generation (cloud storage)</li>
            <li>The completion callback fires when all resources are loaded (or any have failed)</li>
            <li>Elements can then render using their loaded resource data</li>
        </ol>

        <h2>Serialization Format</h2>
        <p>
            Models serialize to a JSON format that captures the complete scene graph:
        </p>
        <app-code-block [code]="serializationCode" language="json" label="JSON"></app-code-block>
        <p>
            The serializer handles all element types, gradient fills, resources, and nested model references. Models
            can round-trip through <code>model.serialize()</code> and <code>Model.parse(json)</code> without loss.
        </p>

        <app-docs-page-nav [previousPage]="previousPage" [nextPage]="nextPage"></app-docs-page-nav>
    `
})
export class ArchitecturePageComponent {
    previousPage: DocsPage | undefined;
    nextPage: DocsPage | undefined;

    serializationCode = `{
  "type": "model",
  "width": 640,
  "height": 480,
  "fill": "#1a1a2e",
  "elements": [
    {
      "type": "rectangle",
      "x": 20,
      "y": 20,
      "width": 200,
      "height": 120,
      "fill": "#3b82f6",
      "stroke": "#1d4ed8,2"
    },
    {
      "type": "ellipse",
      "centerX": 400,
      "centerY": 200,
      "radiusX": 80,
      "radiusY": 60,
      "fill": "0.7;Coral"
    }
  ],
  "resources": []
}`;

    constructor(docsService: DocsService) {
        this.previousPage = docsService.getPreviousPage('getting-started', 'architecture');
        this.nextPage = docsService.getNextPage('getting-started', 'architecture');
    }
}
