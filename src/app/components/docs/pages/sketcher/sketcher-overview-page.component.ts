import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DocsService, DocsPage } from '../../../../services/docs.service';
import { DocsPageNavComponent } from '../../docs-page-nav.component';
import { CodeBlockComponent } from '../../../code-block/code-block.component';

@Component({
    selector: 'app-sketcher-overview-page',
    standalone: true,
    imports: [CommonModule, RouterModule, DocsPageNavComponent, CodeBlockComponent],
    template: `
        <h1>Sketcher Engine</h1>
        <p class="lead">
            The Sketcher is a progressive drawing and animation engine that renders Elise models
            with animated drawing effects, as if each element is being drawn in real-time by a pen.
        </p>

        <h2>Overview</h2>
        <p>
            The Sketcher takes an Elise model and animates its construction, drawing each element
            progressively over time. Lines are drawn point-to-point, shape borders appear
            with animated outlines, and fills fade in on completion. This creates compelling
            visual effects for presentations, tutorials, loading screens, and decorative animations.
        </p>
        <p>
            The Sketcher is used throughout the application's Sketches section to showcase
            progressive drawing of various models with different themes and complexities.
        </p>

        <h2>How It Works</h2>
        <p>
            Internally, the Sketcher decomposes each model element into a sequence of discrete
            draw steps:
        </p>
        <ul>
            <li><strong>Lines</strong> are drawn progressively from start to end point</li>
            <li><strong>Rectangles</strong> are drawn as four sequential line segments forming the border</li>
            <li><strong>Ellipses</strong> are drawn as progressive arc sweeps</li>
            <li><strong>Polygons and polylines</strong> are drawn segment by segment</li>
            <li><strong>Paths</strong> are drawn command by command along the path data</li>
            <li><strong>Fills</strong> fade in after the element's outline is complete</li>
            <li><strong>Text</strong> appears character by character or word by word</li>
        </ul>
        <p>
            The total animation duration is distributed across all elements proportionally
            based on their visual complexity (number of draw steps).
        </p>

        <h2>SketcherController</h2>
        <p>
            The <code>SketcherController</code> extends <code>ViewController</code> and adds
            sketch playback capabilities. Attach it to a canvas or view to control the
            sketching animation.
        </p>

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
                    <td>duration</td>
                    <td>number</td>
                    <td>5000</td>
                    <td>Total animation duration in milliseconds</td>
                </tr>
                <tr>
                    <td>speed</td>
                    <td>number</td>
                    <td>1</td>
                    <td>Playback speed multiplier (2 = twice as fast)</td>
                </tr>
                <tr>
                    <td>autoPlay</td>
                    <td>boolean</td>
                    <td>false</td>
                    <td>Start playing automatically when the model loads</td>
                </tr>
                <tr>
                    <td>loop</td>
                    <td>boolean</td>
                    <td>false</td>
                    <td>Restart the animation when it completes</td>
                </tr>
            </tbody>
        </table>

        <h2>API Methods</h2>
        <table class="docs-table">
            <thead>
                <tr>
                    <th>Method</th>
                    <th>Returns</th>
                    <th>Description</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>play()</td>
                    <td>void</td>
                    <td>Start or resume sketching playback</td>
                </tr>
                <tr>
                    <td>pause()</td>
                    <td>void</td>
                    <td>Pause the current playback</td>
                </tr>
                <tr>
                    <td>reset()</td>
                    <td>void</td>
                    <td>Reset to the beginning (canvas cleared)</td>
                </tr>
                <tr>
                    <td>seek(time)</td>
                    <td>void</td>
                    <td>Jump to a specific time in the animation (ms)</td>
                </tr>
            </tbody>
        </table>

        <h2>Features</h2>
        <ul>
            <li><strong>Progressive rendering</strong> - elements draw incrementally over time</li>
            <li><strong>Speed control</strong> - adjust playback speed for faster or slower effects</li>
            <li><strong>Looping</strong> - continuous replay for decorative or ambient animations</li>
            <li><strong>Seekable</strong> - jump to any point in the animation timeline</li>
            <li><strong>Element ordering</strong> - elements draw in model order; reorder elements to change draw sequence</li>
            <li><strong>Automatic timing</strong> - duration is distributed proportionally across element complexity</li>
        </ul>

        <h2>Basic Setup</h2>
        <p>
            Create a sketcher controller, set a model, and start playback.
        </p>
        <app-code-block [code]="basicCode" language="javascript" label="JavaScript"></app-code-block>

        <h2>Configuring Speed and Looping</h2>
        <p>
            Adjust the playback speed and enable looping for continuous animation.
        </p>
        <app-code-block [code]="configCode" language="javascript" label="JavaScript"></app-code-block>

        <app-docs-page-nav [previousPage]="previousPage" [nextPage]="nextPage"></app-docs-page-nav>
    `
})
export class SketcherOverviewPageComponent {
    previousPage: DocsPage | undefined;
    nextPage: DocsPage | undefined;

    basicCode = `// Create a model to sketch
const m = elise.model(400, 300);
elise.rectangle(20, 20, 160, 120)
    .setFill('SteelBlue')
    .setStroke('Navy', 2)
    .addTo(m);
elise.ellipse(300, 150, 80, 60)
    .setFill('Coral')
    .setStroke('DarkRed', 2)
    .addTo(m);
elise.line(100, 200, 300, 250)
    .setStroke('ForestGreen', 3)
    .addTo(m);

// Create a sketcher controller and attach to a canvas
const controller = new SketcherController();
controller.setModel(m);
controller.duration = 5000; // 5 seconds total
controller.play();`;

    configCode = `const controller = new SketcherController();
controller.setModel(model);

// Speed up playback to 2x
controller.speed = 2;

// Loop continuously
controller.loop = true;

// Start automatically when ready
controller.autoPlay = true;

// Or control manually
controller.play();

// Pause at any time
controller.pause();

// Jump to 50% through the animation
controller.seek(controller.duration / 2);

// Reset to beginning
controller.reset();`;

    constructor(private docsService: DocsService) {
        this.previousPage = docsService.getPreviousPage('sketcher', 'sketcher-overview');
        this.nextPage = docsService.getNextPage('sketcher', 'sketcher-overview');
    }
}
