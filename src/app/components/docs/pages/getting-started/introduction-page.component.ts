import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DocsService, DocsPage } from '../../../../services/docs.service';
import { DocsPageNavComponent } from '../../docs-page-nav.component';
import { DocsCodeSampleComponent } from '../../docs-code-sample.component';

@Component({
    imports: [CommonModule, RouterModule, DocsPageNavComponent, DocsCodeSampleComponent],
    template: `
        <h1>Introduction to Elise</h1>
        <p class="lead">
            Elise is a retained-mode 2D graphics engine for the web, built on HTML5 Canvas, with a built-in design
            surface, dual canvas &amp; SVG renderers, animation-ready primitives, and a Surface framework for building
            kiosks, signage, and interactive presentations.
        </p>

        <h2>What is Elise?</h2>
        <p>
            Unlike immediate-mode canvas drawing libraries that require you to issue rendering commands each frame,
            Elise uses a <strong>retained scene graph</strong> model. You build a <code>Model</code> object containing
            elements — rectangles, ellipses, paths, text, images, and more — then attach it to a controller that
            manages rendering, interaction, and animation automatically.
        </p>

        <p>
            This retained approach means you can mutate element properties (position, fill, opacity, transform) at any
            time and simply call <code>draw()</code> to see the result. The scene graph owns the state, and the renderer
            traverses it to produce output.
        </p>

        <h2>Key Capabilities</h2>

        <div class="feature-grid">
            <div class="feature-item">
                <h4><span class="fas fa-shapes me-2"></span>Rich Primitives</h4>
                <p>
                    16 element types including rectangles, ellipses, arcs, arrows, rings, wedges, regular polygons,
                    paths, polylines, polygons, text, images, model elements, and sprites — each with element-specific
                    properties and full styling support.
                </p>
            </div>
            <div class="feature-item">
                <h4><span class="fas fa-palette me-2"></span>Advanced Styling</h4>
                <p>
                    Solid color fills, linear and radial gradients with multi-stop support, image pattern fills, model
                    pattern fills, strokes with dash patterns, shadows, blend modes, CSS filters, clip paths, and
                    affine transforms.
                </p>
            </div>
            <div class="feature-item">
                <h4><span class="fas fa-film me-2"></span>Animation Engine</h4>
                <p>
                    Property tweens with 31 easing curves, timer-driven frame-by-frame animation, sprite frame
                    timelines with 38+ built-in frame transitions, and command-based event routing on interactive
                    elements.
                </p>
            </div>
            <div class="feature-item">
                <h4><span class="fas fa-drafting-compass me-2"></span>Design Surface</h4>
                <p>
                    A full browser-based authoring surface with 16 creation tools, selection, rubber-band,
                    drag/resize/rotate, grid snapping, smart alignment guides, clipboard, undo/redo, and inline
                    caret-based rich-text editing.
                </p>
            </div>
            <div class="feature-item">
                <h4><span class="fas fa-desktop me-2"></span>Dual Renderers</h4>
                <p>
                    Render the same retained model to an HTML5 Canvas for performance or to SVG for DOM inspection,
                    printing, or accessibility — all from the same scene graph.
                </p>
            </div>
            <div class="feature-item">
                <h4><span class="fas fa-layer-group me-2"></span>Surface Framework</h4>
                <p>
                    Build kiosks, signage, and interactive presentations with a multi-pane application container
                    supporting canvas layers, HTML layers, image layers, video layers, buttons, text elements, radio
                    strips, and animated pane transitions.
                </p>
            </div>
        </div>

        <h2>How Models Work</h2>
        <p>
            At the heart of Elise is the <code>Model</code> class. A model defines a rectangular coordinate space with
            a width and height, contains an ordered array of elements that are rendered from bottom to top, and
            optionally holds shared resources (bitmaps, embedded models, text strings) that elements reference by key.
        </p>

        <app-docs-code-sample
            [code]="basicModelCode"
            language="javascript"
            label="JavaScript"
            [returnVar]="'model'">
        </app-docs-code-sample>

        <p>
            Models can be serialized to JSON for storage and transport, rendered to a canvas or SVG, exported as
            PNG/JPEG/WebP images, or attached to a <code>DesignController</code> for interactive editing.
        </p>

        <h2>Library Organization</h2>
        <table class="docs-table">
            <thead>
                <tr>
                    <th>Module</th>
                    <th>Purpose</th>
                </tr>
            </thead>
            <tbody>
                <tr><td><code>core</code></td><td>Model, Point, Size, Region, Color, Matrix2D, GridType, WindingMode</td></tr>
                <tr><td><code>elements</code></td><td>All element types (Rectangle, Ellipse, Line, Path, Text, Image, etc.)</td></tr>
                <tr><td><code>fill</code></td><td>LinearGradientFill, RadialGradientFill, GradientFillStop, FillInfo</td></tr>
                <tr><td><code>resource</code></td><td>BitmapResource, ModelResource, TextResource, ResourceManager</td></tr>
                <tr><td><code>animation</code></td><td>ElementTween, AnimationEasing (31 curves)</td></tr>
                <tr><td><code>view</code></td><td>ViewController, ViewRenderer, SvgViewController</td></tr>
                <tr><td><code>design</code></td><td>DesignController, 16 design tools, 13 service classes, component system</td></tr>
                <tr><td><code>surface</code></td><td>Surface, SurfaceViewController, layers, buttons, radio strips, transitions</td></tr>
                <tr><td><code>svg</code></td><td>SVGImporter, SVGExporter</td></tr>
                <tr><td><code>wmf</code></td><td>WmfImporter (Windows Metafile)</td></tr>
                <tr><td><code>sketcher</code></td><td>Progressive drawing engine</td></tr>
                <tr><td><code>command</code></td><td>Element commands, UndoManager</td></tr>
                <tr><td><code>transitions</code></td><td>TransitionRenderer with 38+ pane/sprite transitions</td></tr>
            </tbody>
        </table>

        <h2>Next Steps</h2>
        <p>
            Continue with the <a routerLink="/docs/getting-started/quick-start">Quick Start</a> guide to create your
            first model, or explore <a routerLink="/docs/getting-started/core-concepts">Core Concepts</a> for a deeper
            understanding of the type system and rendering pipeline.
        </p>

        <app-docs-page-nav [nextPage]="nextPage"></app-docs-page-nav>
    `,
    styles: [`
        .feature-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; margin: 24px 0; }
        .feature-item { padding: 16px; border: 1px solid var(--docs-border, #dee2e6); border-radius: 8px; }
        .feature-item h4 { font-size: 1rem; margin-bottom: 8px; }
        .feature-item p { font-size: 0.9rem; margin: 0; color: var(--bs-secondary-color); }
        :host-context(.dark-theme) .feature-item { border-color: #2d3139; }
    `]
})
export class IntroductionPageComponent {
    nextPage: DocsPage | undefined;

    basicModelCode = `// Create a 640×360 model with a dark fill
var model = elise.model(640, 360);
model.setFill('#0f172a');

// Add a styled rectangle
elise.rectangle(32, 32, 200, 120)
    .setFill('#1e293b')
    .setStroke('#38bdf8,2')
    .addTo(model);

// Add an ellipse with transparency
elise.ellipse(400, 180, 120, 80)
    .setFill('0.7;#f472b6')
    .addTo(model);

// Add text
elise.text('Hello Elise', 32, 180, 300, 40)
    .setFill('White')
    .addTo(model);

return model;`;

    constructor(docsService: DocsService) {
        this.nextPage = docsService.getNextPage('getting-started', 'introduction');
    }
}
