import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DocsService, DocsPage } from '../../../../services/docs.service';
import { DocsPageNavComponent } from '../../docs-page-nav.component';
import { CodeBlockComponent } from '../../../code-block/code-block.component';

@Component({
    imports: [CommonModule, RouterModule, DocsPageNavComponent, CodeBlockComponent],
    template: `
        <h1>Selection &amp; Manipulation</h1>
        <p class="lead">
            The design surface provides interactive selection and manipulation of elements through
            mouse/touch gestures and a comprehensive programmatic API.
        </p>

        <h2>Mouse Selection</h2>
        <p>
            Click an element to select it. The previously selected element is deselected unless
            <kbd>Shift</kbd> is held. <kbd>Shift</kbd>+click toggles an element in or out of the
            current selection. Click-drag on an empty area draws a rubber band selection rectangle —
            all elements intersecting the rectangle are selected on release.
        </p>

        <h2>Resize Handles</h2>
        <p>
            Selected elements display 8 resize handles — one at each corner and one on each edge
            of the bounding box. Drag a handle to resize the element.
        </p>
        <table class="docs-table">
            <thead>
                <tr>
                    <th>Handle</th>
                    <th>Position</th>
                    <th>Resize Behavior</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><code>nw</code></td>
                    <td>Top-left corner</td>
                    <td>Resizes from the top-left. Moves origin and adjusts width/height.</td>
                </tr>
                <tr>
                    <td><code>ne</code></td>
                    <td>Top-right corner</td>
                    <td>Resizes from the top-right. Adjusts width and moves top edge.</td>
                </tr>
                <tr>
                    <td><code>sw</code></td>
                    <td>Bottom-left corner</td>
                    <td>Resizes from the bottom-left. Moves left edge and adjusts height.</td>
                </tr>
                <tr>
                    <td><code>se</code></td>
                    <td>Bottom-right corner</td>
                    <td>Resizes from the bottom-right. Adjusts width and height.</td>
                </tr>
                <tr>
                    <td><code>n</code></td>
                    <td>Top edge center</td>
                    <td>Moves the top edge vertically. Adjusts height only.</td>
                </tr>
                <tr>
                    <td><code>s</code></td>
                    <td>Bottom edge center</td>
                    <td>Moves the bottom edge vertically. Adjusts height only.</td>
                </tr>
                <tr>
                    <td><code>e</code></td>
                    <td>Right edge center</td>
                    <td>Moves the right edge horizontally. Adjusts width only.</td>
                </tr>
                <tr>
                    <td><code>w</code></td>
                    <td>Left edge center</td>
                    <td>Moves the left edge horizontally. Adjusts width only.</td>
                </tr>
            </tbody>
        </table>

        <h2>Move Behavior</h2>
        <p>
            Click and drag a selected element to move it. All selected elements move together,
            maintaining their relative positions. If snapping is enabled, the primary element
            snaps to grid increments. Hold <kbd>Shift</kbd> while dragging to constrain movement
            to the horizontal or vertical axis.
        </p>

        <h2>Resize Behavior</h2>
        <p>
            Drag a resize handle to change the element's dimensions. If <code>aspectLocked</code>
            is set on the element, the aspect ratio is maintained during resize — dragging a corner
            handle scales proportionally, and edge handles are constrained accordingly.
        </p>

        <h2>Multi-Selection</h2>
        <p>
            When multiple elements are selected, a group bounding box is displayed encompassing
            all selected elements. Moving the group moves all elements together. Resize handles
            on the group bounding box scale all selected elements proportionally.
        </p>

        <h2>Selection API</h2>
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
                    <td><code>selectedElements</code></td>
                    <td><code>ElementBase[]</code></td>
                    <td>Array of currently selected elements.</td>
                </tr>
                <tr>
                    <td><code>selectAll()</code></td>
                    <td>method</td>
                    <td>Selects all elements in the model.</td>
                </tr>
                <tr>
                    <td><code>deselectAll()</code></td>
                    <td>method</td>
                    <td>Clears the current selection.</td>
                </tr>
                <tr>
                    <td><code>selectElement(el)</code></td>
                    <td>method</td>
                    <td>Adds the specified element to the selection.</td>
                </tr>
                <tr>
                    <td><code>isSelected(el)</code></td>
                    <td>method</td>
                    <td>Returns true if the specified element is currently selected.</td>
                </tr>
            </tbody>
        </table>

        <h2>Programmatic Selection</h2>
        <app-code-block [code]="selectCode" language="javascript" label="JavaScript"></app-code-block>

        <h2>Moving Elements</h2>
        <app-code-block [code]="moveCode" language="javascript" label="JavaScript"></app-code-block>

        <h2>Querying Selection State</h2>
        <app-code-block [code]="queryCode" language="javascript" label="JavaScript"></app-code-block>

        <app-docs-page-nav [previousPage]="previousPage" [nextPage]="nextPage"></app-docs-page-nav>
    `
})
export class SelectionPageComponent {
    previousPage: DocsPage | undefined;
    nextPage: DocsPage | undefined;

    selectCode = `// Select all elements
controller.selectAll();

// Deselect all
controller.deselectAll();

// Select a specific element
var rect = model.elements[0];
controller.selectElement(rect);

// Add another element to the selection
var ellipse = model.elements[1];
controller.selectElement(ellipse);

// Check if an element is selected
if (controller.isSelected(rect)) {
    console.log('Rectangle is selected');
}`;

    moveCode = `// Nudge selected elements by pixel offset
controller.nudge(10, 0);    // Move right 10px
controller.nudge(-10, 0);   // Move left 10px
controller.nudge(0, 10);    // Move down 10px
controller.nudge(0, -10);   // Move up 10px

// With snapping enabled, nudge snaps to grid increments
controller.setSnapEnabled(true);
controller.setGridSize(20);
controller.nudge(1, 0);     // Snaps to next grid line (20px right)`;

    queryCode = `// Get the number of selected elements
var count = controller.selectedElements.length;
console.log('Selected:', count, 'elements');

// Iterate over selected elements
controller.selectedElements.forEach(function(el) {
    console.log('Element type:', el.type, 'ID:', el.id);
});

// Listen for selection changes
controller.selectionChanged.add(function(elements) {
    if (elements.length === 0) {
        console.log('Nothing selected');
    } else if (elements.length === 1) {
        console.log('Single element:', elements[0].type);
    } else {
        console.log('Multi-selection:', elements.length, 'elements');
    }
});`;

    constructor(private docsService: DocsService) {
        this.previousPage = docsService.getPreviousPage('design-surface', 'selection');
        this.nextPage = docsService.getNextPage('design-surface', 'selection');
    }
}
