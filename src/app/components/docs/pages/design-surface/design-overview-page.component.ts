import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DocsService, DocsPage } from '../../../../services/docs.service';
import { DocsPageNavComponent } from '../../docs-page-nav.component';
import { CodeBlockComponent } from '../../../code-block/code-block.component';

@Component({
    imports: [CommonModule, RouterModule, DocsPageNavComponent, CodeBlockComponent],
    template: `
        <h1>Design Surface Overview</h1>
        <p class="lead">
            The Elise design surface extends the view surface with full interactive editing — selection,
            manipulation, creation tools, undo/redo, clipboard operations, grid/snapping, and more.
        </p>

        <h2>DesignController</h2>
        <p>
            The <code>DesignController</code> extends <code>ViewController</code> to add interactive editing
            capabilities. While the view controller handles rendering, hit testing, and mouse/touch events,
            the design controller layers on a comprehensive editing toolkit composed of 13 internal services.
        </p>

        <h2>Internal Services</h2>
        <p>
            The design controller manages 13 specialized services that collaborate to provide the editing experience:
        </p>
        <table class="docs-table">
            <thead>
                <tr>
                    <th>Service</th>
                    <th>Description</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><code>SelectionService</code></td>
                    <td>Tracks selected elements, manages selection state, and emits selection change events.</td>
                </tr>
                <tr>
                    <td><code>UndoService</code></td>
                    <td>Snapshot-based undo/redo stack. Captures model state before each mutation.</td>
                </tr>
                <tr>
                    <td><code>ToolService</code></td>
                    <td>Manages active creation tool, tool activation/deactivation, and default tool properties.</td>
                </tr>
                <tr>
                    <td><code>HandleService</code></td>
                    <td>Renders and manages resize/rotation handles on selected elements.</td>
                </tr>
                <tr>
                    <td><code>GridService</code></td>
                    <td>Renders grid lines, dots, or crosses on the design surface at configurable intervals.</td>
                </tr>
                <tr>
                    <td><code>SnapService</code></td>
                    <td>Snaps element positions and sizes to grid increments or other element edges.</td>
                </tr>
                <tr>
                    <td><code>ClipboardService</code></td>
                    <td>Copy, cut, and paste operations for selected elements via internal clipboard.</td>
                </tr>
                <tr>
                    <td><code>TextEditService</code></td>
                    <td>Inline text editing for text elements directly on the design surface.</td>
                </tr>
                <tr>
                    <td><code>PointEditService</code></td>
                    <td>Point-level editing for path, polygon, and polyline elements.</td>
                </tr>
                <tr>
                    <td><code>ComponentService</code></td>
                    <td>Manages compound component grouping and ungrouping operations.</td>
                </tr>
                <tr>
                    <td><code>RubberBandService</code></td>
                    <td>Click-drag rubber band rectangle for area-based element selection.</td>
                </tr>
                <tr>
                    <td><code>DragDropService</code></td>
                    <td>Handles drag movement of selected elements with optional constraint and snap.</td>
                </tr>
                <tr>
                    <td><code>InteractionService</code></td>
                    <td>Routes mouse/touch/keyboard events to the appropriate service based on context.</td>
                </tr>
            </tbody>
        </table>

        <h2>Rendering Layers</h2>
        <p>
            The design surface renders multiple visual layers on top of the model elements:
        </p>
        <ul>
            <li><strong>Grid layer</strong> — Grid lines, dots, or crosses drawn behind elements.</li>
            <li><strong>Element layer</strong> — The model elements themselves.</li>
            <li><strong>Handle layer</strong> — Resize and rotation handles for selected elements.</li>
            <li><strong>Tool overlay</strong> — Visual preview while a creation tool is active (e.g., outline of element being created).</li>
            <li><strong>Snap guides</strong> — Alignment guides that appear when snapping triggers.</li>
            <li><strong>Rubber band</strong> — Selection rectangle drawn during area selection.</li>
        </ul>

        <h2>Angular Integration</h2>
        <p>
            In Angular, use the <code>&lt;app-elise-design&gt;</code> component to host a design surface:
        </p>
        <app-code-block [code]="angularCode" language="javascript" label="JavaScript"></app-code-block>

        <h2>Events</h2>
        <p>
            The design surface exposes several key events for integrating with application UI:
        </p>
        <table class="docs-table">
            <thead>
                <tr>
                    <th>Event</th>
                    <th>Description</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><code>controllerSet</code></td>
                    <td>Fired when the DesignController is initialized and ready for use.</td>
                </tr>
                <tr>
                    <td><code>selectionChanged</code></td>
                    <td>Fired when the selection state changes (elements selected or deselected).</td>
                </tr>
                <tr>
                    <td><code>modelChanged</code></td>
                    <td>Fired when the model is modified (element added, removed, or property changed).</td>
                </tr>
                <tr>
                    <td><code>undoChanged</code></td>
                    <td>Fired when the undo/redo stack state changes.</td>
                </tr>
            </tbody>
        </table>

        <h2>Setting Up a Design Surface</h2>
        <app-code-block [code]="setupCode" language="javascript" label="JavaScript"></app-code-block>

        <app-docs-page-nav [previousPage]="previousPage" [nextPage]="nextPage"></app-docs-page-nav>
    `
})
export class DesignOverviewPageComponent {
    previousPage: DocsPage | undefined;
    nextPage: DocsPage | undefined;

    angularCode = `// In your Angular template
<app-elise-design
    [model]="model"
    (controllerSet)="onControllerSet($event)"
    (selectionChanged)="onSelectionChanged($event)"
    (modelChanged)="onModelChanged($event)"
    (undoChanged)="onUndoChanged($event)">
</app-elise-design>`;

    setupCode = `// Create a model for the design surface
var model = elise.model(800, 600);
model.setFill('#f8f9fa');

// Add some initial elements
elise.rectangle(100, 100, 200, 150)
    .setFill('SteelBlue')
    .setStroke('White,2')
    .addTo(model);

elise.ellipse(500, 300, 120, 80)
    .setFill('Coral')
    .setStroke('DarkRed,1')
    .addTo(model);

// When the controller is set, configure the design surface
function onControllerSet(controller) {
    // Enable grid
    controller.setGridType(GridType.Lines);
    controller.setGridSize(20);

    // Enable snapping
    controller.setSnapEnabled(true);

    // Listen for selection changes
    controller.selectionChanged.add(function(elements) {
        console.log('Selected:', elements.length, 'elements');
    });

    // Listen for model changes
    controller.modelUpdated.add(function() {
        console.log('Model was modified');
    });
}`;

    constructor(private docsService: DocsService) {
        this.previousPage = docsService.getPreviousPage('design-surface', 'design-overview');
        this.nextPage = docsService.getNextPage('design-surface', 'design-overview');
    }
}
