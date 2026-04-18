import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DocsService, DocsPage } from '../../../../services/docs.service';
import { DocsPageNavComponent } from '../../docs-page-nav.component';
import { CodeBlockComponent } from '../../../code-block/code-block.component';

@Component({
    imports: [CommonModule, RouterModule, DocsPageNavComponent, CodeBlockComponent],
    template: `
        <h1>Undo &amp; Redo</h1>
        <p class="lead">
            The design surface uses a snapshot-based undo system built on model serialization.
            Every state change pushes a complete model snapshot onto the undo stack, allowing
            any operation to be reversed.
        </p>

        <h2>How It Works</h2>
        <p>
            Before each mutating operation, the <code>UndoService</code> serializes the current
            model state into a JSON snapshot and pushes it onto the undo stack. When undo is
            triggered, the current model is replaced with the previous snapshot. The replaced
            state is pushed onto the redo stack so the operation can be re-applied.
        </p>

        <h2>Operations That Generate Snapshots</h2>
        <p>
            The following operations automatically push an undo snapshot:
        </p>
        <ul>
            <li>Create element (via any creation tool)</li>
            <li>Delete element</li>
            <li>Move element (drag or nudge)</li>
            <li>Resize element (via handles)</li>
            <li>Property change (fill, stroke, opacity, etc.)</li>
            <li>Z-order change (bring to front, send to back, etc.)</li>
            <li>Paste from clipboard</li>
            <li>Inline text editing</li>
            <li>Point editing (path/polygon/polyline vertex changes)</li>
        </ul>

        <h2>API</h2>
        <table class="docs-table">
            <thead>
                <tr>
                    <th>Member</th>
                    <th>Type</th>
                    <th>Description</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><code>undo()</code></td>
                    <td>method</td>
                    <td>Reverts the model to the previous snapshot. No-op if undo stack is empty.</td>
                </tr>
                <tr>
                    <td><code>redo()</code></td>
                    <td>method</td>
                    <td>Re-applies the next snapshot from the redo stack. No-op if redo stack is empty.</td>
                </tr>
                <tr>
                    <td><code>canUndo</code></td>
                    <td><code>boolean</code></td>
                    <td>True if the undo stack has at least one entry.</td>
                </tr>
                <tr>
                    <td><code>canRedo</code></td>
                    <td><code>boolean</code></td>
                    <td>True if the redo stack has at least one entry.</td>
                </tr>
                <tr>
                    <td><code>undoStackChanged</code></td>
                    <td>event</td>
                    <td>Fired when the undo or redo stack state changes. Callback receives <code>(canUndo, canRedo)</code>.</td>
                </tr>
            </tbody>
        </table>

        <h2>Keyboard Shortcuts</h2>
        <table class="docs-table">
            <thead>
                <tr>
                    <th>Shortcut</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><kbd>Ctrl+Z</kbd></td>
                    <td>Undo</td>
                </tr>
                <tr>
                    <td><kbd>Ctrl+Y</kbd></td>
                    <td>Redo</td>
                </tr>
                <tr>
                    <td><kbd>Ctrl+Shift+Z</kbd></td>
                    <td>Redo (alternate)</td>
                </tr>
            </tbody>
        </table>

        <h2>Stack Depth</h2>
        <p>
            The undo stack has a configurable depth limit. When the stack exceeds the limit,
            the oldest snapshots are discarded. The redo stack is cleared whenever a new
            mutating operation occurs (you cannot redo after making a new change).
        </p>

        <h2>Checking and Triggering Undo/Redo</h2>
        <app-code-block [code]="usageCode" language="javascript" label="JavaScript"></app-code-block>

        <h2>Listening for Undo State Changes</h2>
        <app-code-block [code]="listenCode" language="javascript" label="JavaScript"></app-code-block>

        <app-docs-page-nav [previousPage]="previousPage" [nextPage]="nextPage"></app-docs-page-nav>
    `
})
export class UndoRedoPageComponent {
    previousPage: DocsPage | undefined;
    nextPage: DocsPage | undefined;

    usageCode = `// Check if undo is available before triggering
if (controller.canUndo) {
    controller.undo();
    console.log('Undone. Can undo again:', controller.canUndo);
}

// Check if redo is available before triggering
if (controller.canRedo) {
    controller.redo();
    console.log('Redone. Can redo again:', controller.canRedo);
}

// Example: undo all operations back to initial state
while (controller.canUndo) {
    controller.undo();
}
console.log('Reverted to initial state');`;

    listenCode = `// Listen for undo stack changes to update UI buttons
controller.undoStackChanged.add(function(canUndo, canRedo) {
    // Update toolbar button states
    undoButton.disabled = !canUndo;
    redoButton.disabled = !canRedo;

    // Show status
    console.log('Undo available:', canUndo, 'Redo available:', canRedo);
});

// In Angular, bind to component properties
function onControllerSet(controller) {
    controller.undoStackChanged.add(function(canUndo, canRedo) {
        this.canUndo = canUndo;
        this.canRedo = canRedo;
    }.bind(this));
}`;

    constructor(private docsService: DocsService) {
        this.previousPage = docsService.getPreviousPage('design-surface', 'undo-redo');
        this.nextPage = docsService.getNextPage('design-surface', 'undo-redo');
    }
}
