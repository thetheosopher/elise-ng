import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DocsService, DocsPage } from '../../../../services/docs.service';
import { DocsPageNavComponent } from '../../docs-page-nav.component';

@Component({
    selector: 'app-model-designer-guide-page',
    standalone: true,
    imports: [CommonModule, RouterModule, DocsPageNavComponent],
    template: `
        <h1>Model Designer Guide</h1>
        <p class="lead">
            The Model Designer is the visual editor for creating and editing Elise models.
            It provides a full set of drawing tools, property panels, and editing capabilities
            for building vector graphics interactively.
        </p>

        <h2>Overview</h2>
        <p>
            The Model Designer provides a canvas-based editing environment with a toolbar
            for element creation, property panels for styling, a model tree for element
            management, and support for grid snapping, zoom, undo/redo, and import/export.
        </p>

        <h2>1. Creating a New Model</h2>
        <p>
            To create a new model, use the <strong>New Model</strong> dialog. Specify the
            model name, width, and height in pixels. The model dimensions define the canvas
            coordinate space for all elements.
        </p>

        <h2>2. Adding Elements</h2>
        <p>
            Select a creation tool from the toolbar, then click and drag on the canvas
            to create the element. The element is sized based on the drag rectangle.
            Available element types:
        </p>
        <table class="docs-table">
            <thead>
                <tr>
                    <th>Tool</th>
                    <th>Element</th>
                    <th>Description</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Rectangle</td>
                    <td>Rectangle</td>
                    <td>Drag to set position and size</td>
                </tr>
                <tr>
                    <td>Ellipse</td>
                    <td>Ellipse</td>
                    <td>Drag to set bounding box</td>
                </tr>
                <tr>
                    <td>Line</td>
                    <td>Line</td>
                    <td>Drag from start to end point</td>
                </tr>
                <tr>
                    <td>Polyline</td>
                    <td>Polyline</td>
                    <td>Click to add points, double-click to finish</td>
                </tr>
                <tr>
                    <td>Polygon</td>
                    <td>Polygon</td>
                    <td>Click to add points, double-click to close</td>
                </tr>
                <tr>
                    <td>Path</td>
                    <td>Path</td>
                    <td>Draw freeform paths with move/line/curve commands</td>
                </tr>
                <tr>
                    <td>Text</td>
                    <td>Text</td>
                    <td>Click to place, then type text content</td>
                </tr>
                <tr>
                    <td>Image</td>
                    <td>Image</td>
                    <td>Drag to set position and size, select image source</td>
                </tr>
            </tbody>
        </table>

        <h2>3. Selecting and Moving Elements</h2>
        <p>
            Use the <strong>Select</strong> tool (arrow) to click on elements. Selected elements
            show resize handles at corners and edges. Drag to move, drag handles to resize.
            Hold <kbd>Shift</kbd> to add to selection. Click empty canvas to deselect all.
        </p>

        <h2>4. Editing Properties</h2>
        <p>
            With an element selected, use the property panels to edit its appearance:
        </p>
        <ul>
            <li><strong>Appearance Modal</strong> - fill color, opacity, shadow, transforms</li>
            <li><strong>Fill Modal</strong> - solid color, linear gradient, or radial gradient fills</li>
            <li><strong>Stroke Modal</strong> - stroke color, width, dash pattern, line cap, line join</li>
            <li><strong>Geometry Modal</strong> - precise numeric position, size, and rotation values</li>
            <li><strong>Size Modal</strong> - width and height adjustments</li>
        </ul>

        <h2>5. Working with Text Elements</h2>
        <p>
            Text elements support font family, size, weight, style, and alignment.
            Double-click a text element to enter inline editing mode. Use the property
            panels to adjust font properties and text alignment.
        </p>

        <h2>6. Point Editing</h2>
        <p>
            For paths, polylines, and polygons, enter <strong>Point Edit</strong> mode to
            manipulate individual vertices. Click and drag points to move them. Right-click
            a point for options such as delete, add point before/after, or convert curve type.
        </p>

        <h2>7. Grid and Snapping</h2>
        <p>
            Use the <strong>Grid Settings</strong> dialog to configure grid display and snapping.
            Set grid spacing, enable snap-to-grid for precise alignment, and toggle grid
            visibility. Grid spacing can be set independently for X and Y axes.
        </p>

        <h2>8. Importing SVG/WMF Files</h2>
        <p>
            Import existing vector graphics using <strong>Import</strong> from the menu.
            Supported formats include SVG and WMF. Imported elements are added to the
            current model and can be edited like any other elements.
        </p>

        <h2>9. Exporting Models</h2>
        <p>
            Export models in multiple formats:
        </p>
        <ul>
            <li><strong>JSON</strong> - native Elise model format for saving and loading</li>
            <li><strong>SVG</strong> - standards-compliant SVG for use in web pages and other tools</li>
        </ul>

        <h2>10. Keyboard Shortcuts</h2>
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
                    <td><kbd>Ctrl+A</kbd></td>
                    <td>Select all elements</td>
                </tr>
                <tr>
                    <td><kbd>Delete</kbd></td>
                    <td>Delete selected elements</td>
                </tr>
                <tr>
                    <td><kbd>Ctrl+C</kbd></td>
                    <td>Copy selected elements</td>
                </tr>
                <tr>
                    <td><kbd>Ctrl+V</kbd></td>
                    <td>Paste copied elements</td>
                </tr>
                <tr>
                    <td><kbd>Ctrl+X</kbd></td>
                    <td>Cut selected elements</td>
                </tr>
                <tr>
                    <td><kbd>Ctrl+D</kbd></td>
                    <td>Duplicate selected elements</td>
                </tr>
                <tr>
                    <td><kbd>Escape</kbd></td>
                    <td>Cancel current operation / Deselect</td>
                </tr>
                <tr>
                    <td><kbd>Shift+Click</kbd></td>
                    <td>Add to selection</td>
                </tr>
                <tr>
                    <td><kbd>Ctrl+G</kbd></td>
                    <td>Toggle grid visibility</td>
                </tr>
                <tr>
                    <td><kbd>Ctrl+Shift+G</kbd></td>
                    <td>Toggle snap to grid</td>
                </tr>
                <tr>
                    <td><kbd>+</kbd> / <kbd>-</kbd></td>
                    <td>Zoom in / Zoom out</td>
                </tr>
                <tr>
                    <td><kbd>Ctrl+0</kbd></td>
                    <td>Reset zoom to 100%</td>
                </tr>
                <tr>
                    <td><kbd>Ctrl+Shift+F</kbd></td>
                    <td>Fit model in view</td>
                </tr>
                <tr>
                    <td><kbd>Arrow keys</kbd></td>
                    <td>Nudge selected elements by 1 pixel</td>
                </tr>
                <tr>
                    <td><kbd>Shift+Arrow keys</kbd></td>
                    <td>Nudge selected elements by 10 pixels</td>
                </tr>
                <tr>
                    <td><kbd>Page Up</kbd></td>
                    <td>Bring selected element forward</td>
                </tr>
                <tr>
                    <td><kbd>Page Down</kbd></td>
                    <td>Send selected element backward</td>
                </tr>
                <tr>
                    <td><kbd>Home</kbd></td>
                    <td>Bring selected element to front</td>
                </tr>
                <tr>
                    <td><kbd>End</kbd></td>
                    <td>Send selected element to back</td>
                </tr>
            </tbody>
        </table>

        <app-docs-page-nav [previousPage]="previousPage" [nextPage]="nextPage"></app-docs-page-nav>
    `
})
export class ModelDesignerGuidePageComponent {
    previousPage: DocsPage | undefined;
    nextPage: DocsPage | undefined;

    constructor(private docsService: DocsService) {
        this.previousPage = docsService.getPreviousPage('tools', 'model-designer-guide');
        this.nextPage = docsService.getNextPage('tools', 'model-designer-guide');
    }
}
