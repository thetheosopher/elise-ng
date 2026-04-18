import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DocsService, DocsPage } from '../../../../services/docs.service';
import { DocsPageNavComponent } from '../../docs-page-nav.component';
import { CodeBlockComponent } from '../../../code-block/code-block.component';

@Component({
    imports: [CommonModule, RouterModule, DocsPageNavComponent, CodeBlockComponent],
    template: `
        <h1>Design Controller</h1>
        <p class="lead">
            The <code>DesignController</code> is the central API for the design surface, providing properties
            and methods for model editing, selection, z-ordering, clipboard, and undo/redo.
        </p>

        <h2>Properties</h2>
        <table class="docs-table">
            <thead>
                <tr>
                    <th>Property</th>
                    <th>Type</th>
                    <th>Description</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><code>model</code></td>
                    <td><code>Model</code></td>
                    <td>The current model being edited.</td>
                </tr>
                <tr>
                    <td><code>canvas</code></td>
                    <td><code>HTMLCanvasElement</code></td>
                    <td>The underlying canvas element.</td>
                </tr>
                <tr>
                    <td><code>scale</code></td>
                    <td><code>number</code></td>
                    <td>Current zoom scale factor (1.0 = 100%).</td>
                </tr>
                <tr>
                    <td><code>background</code></td>
                    <td><code>string</code></td>
                    <td>Background fill string for the design surface.</td>
                </tr>
                <tr>
                    <td><code>gridType</code></td>
                    <td><code>GridType</code></td>
                    <td>Grid display mode: <code>GridType.None</code>, <code>GridType.Lines</code>, <code>GridType.Dots</code>, or <code>GridType.Crosses</code>.</td>
                </tr>
                <tr>
                    <td><code>gridSize</code></td>
                    <td><code>number</code></td>
                    <td>Grid spacing in logical pixels.</td>
                </tr>
                <tr>
                    <td><code>snapEnabled</code></td>
                    <td><code>boolean</code></td>
                    <td>Whether element positions and sizes snap to grid.</td>
                </tr>
                <tr>
                    <td><code>selectedElements</code></td>
                    <td><code>ElementBase[]</code></td>
                    <td>Array of currently selected elements.</td>
                </tr>
                <tr>
                    <td><code>activeTool</code></td>
                    <td><code>ToolType</code></td>
                    <td>The currently active creation/editing tool.</td>
                </tr>
                <tr>
                    <td><code>canUndo</code></td>
                    <td><code>boolean</code></td>
                    <td>True if the undo stack has entries.</td>
                </tr>
                <tr>
                    <td><code>canRedo</code></td>
                    <td><code>boolean</code></td>
                    <td>True if the redo stack has entries.</td>
                </tr>
            </tbody>
        </table>

        <h2>Methods</h2>
        <table class="docs-table">
            <thead>
                <tr>
                    <th>Method</th>
                    <th>Parameters</th>
                    <th>Description</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><code>setModel(model)</code></td>
                    <td><code>model: Model</code></td>
                    <td>Replaces the current model and resets the undo stack.</td>
                </tr>
                <tr>
                    <td><code>setScale(scale)</code></td>
                    <td><code>scale: number</code></td>
                    <td>Sets the zoom scale factor and redraws.</td>
                </tr>
                <tr>
                    <td><code>setBackground(fill)</code></td>
                    <td><code>fill: string</code></td>
                    <td>Sets the background fill of the design surface.</td>
                </tr>
                <tr>
                    <td><code>setGridType(type)</code></td>
                    <td><code>type: GridType</code></td>
                    <td>Sets the grid display mode.</td>
                </tr>
                <tr>
                    <td><code>setGridSize(size)</code></td>
                    <td><code>size: number</code></td>
                    <td>Sets the grid spacing in logical pixels.</td>
                </tr>
                <tr>
                    <td><code>setSnapEnabled(enabled)</code></td>
                    <td><code>enabled: boolean</code></td>
                    <td>Enables or disables grid snapping.</td>
                </tr>
                <tr>
                    <td><code>selectAll()</code></td>
                    <td>—</td>
                    <td>Selects all elements in the model.</td>
                </tr>
                <tr>
                    <td><code>deselectAll()</code></td>
                    <td>—</td>
                    <td>Clears the selection.</td>
                </tr>
                <tr>
                    <td><code>deleteSelected()</code></td>
                    <td>—</td>
                    <td>Deletes all selected elements.</td>
                </tr>
                <tr>
                    <td><code>bringToFront()</code></td>
                    <td>—</td>
                    <td>Moves selected elements to the top of the z-order.</td>
                </tr>
                <tr>
                    <td><code>sendToBack()</code></td>
                    <td>—</td>
                    <td>Moves selected elements to the bottom of the z-order.</td>
                </tr>
                <tr>
                    <td><code>bringForward()</code></td>
                    <td>—</td>
                    <td>Moves selected elements one step forward in z-order.</td>
                </tr>
                <tr>
                    <td><code>sendBackward()</code></td>
                    <td>—</td>
                    <td>Moves selected elements one step backward in z-order.</td>
                </tr>
                <tr>
                    <td><code>undo()</code></td>
                    <td>—</td>
                    <td>Reverts to the previous model snapshot.</td>
                </tr>
                <tr>
                    <td><code>redo()</code></td>
                    <td>—</td>
                    <td>Re-applies the next snapshot on the redo stack.</td>
                </tr>
                <tr>
                    <td><code>copy()</code></td>
                    <td>—</td>
                    <td>Copies selected elements to the internal clipboard.</td>
                </tr>
                <tr>
                    <td><code>cut()</code></td>
                    <td>—</td>
                    <td>Copies selected elements to clipboard and deletes them.</td>
                </tr>
                <tr>
                    <td><code>paste()</code></td>
                    <td>—</td>
                    <td>Pastes clipboard contents into the model with a small offset.</td>
                </tr>
                <tr>
                    <td><code>nudge(dx, dy)</code></td>
                    <td><code>dx: number, dy: number</code></td>
                    <td>Moves selected elements by the given pixel offset.</td>
                </tr>
                <tr>
                    <td><code>getModelJson()</code></td>
                    <td>—</td>
                    <td>Serializes the current model to JSON string.</td>
                </tr>
            </tbody>
        </table>

        <h2>Events</h2>
        <table class="docs-table">
            <thead>
                <tr>
                    <th>Event</th>
                    <th>Callback Signature</th>
                    <th>Description</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><code>selectionChanged</code></td>
                    <td><code>(elements: ElementBase[]) =&gt; void</code></td>
                    <td>Fired when elements are selected or deselected.</td>
                </tr>
                <tr>
                    <td><code>modelUpdated</code></td>
                    <td><code>() =&gt; void</code></td>
                    <td>Fired when the model is modified.</td>
                </tr>
                <tr>
                    <td><code>undoStackChanged</code></td>
                    <td><code>(canUndo: boolean, canRedo: boolean) =&gt; void</code></td>
                    <td>Fired when the undo/redo stack state changes.</td>
                </tr>
            </tbody>
        </table>

        <h2>Controller Configuration</h2>
        <app-code-block [code]="configCode" language="javascript" label="JavaScript"></app-code-block>

        <h2>Controller Usage</h2>
        <app-code-block [code]="usageCode" language="javascript" label="JavaScript"></app-code-block>

        <app-docs-page-nav [previousPage]="previousPage" [nextPage]="nextPage"></app-docs-page-nav>
    `
})
export class DesignControllerPageComponent {
    previousPage: DocsPage | undefined;
    nextPage: DocsPage | undefined;

    configCode = `// Configure the design controller after initialization
function onControllerSet(controller) {
    // Set zoom to 150%
    controller.setScale(1.5);

    // Set a light background
    controller.setBackground('#f0f0f0');

    // Enable grid with 20px spacing
    controller.setGridType(GridType.Lines);
    controller.setGridSize(20);

    // Enable snap to grid
    controller.setSnapEnabled(true);
}`;

    usageCode = `// Working with the design controller
function onControllerSet(controller) {
    // Selection operations
    controller.selectAll();
    console.log('Selected:', controller.selectedElements.length);
    controller.deselectAll();

    // Z-order operations
    controller.bringToFront();
    controller.sendToBack();
    controller.bringForward();
    controller.sendBackward();

    // Clipboard operations
    controller.copy();
    controller.paste();
    controller.cut();

    // Nudge selected elements
    controller.nudge(10, 0);   // Move right 10px
    controller.nudge(0, -5);   // Move up 5px

    // Undo/redo
    if (controller.canUndo) {
        controller.undo();
    }
    if (controller.canRedo) {
        controller.redo();
    }

    // Delete selected elements
    controller.deleteSelected();

    // Export model as JSON
    var json = controller.getModelJson();
    console.log(json);
}`;

    constructor(private docsService: DocsService) {
        this.previousPage = docsService.getPreviousPage('design-surface', 'design-controller');
        this.nextPage = docsService.getNextPage('design-surface', 'design-controller');
    }
}
