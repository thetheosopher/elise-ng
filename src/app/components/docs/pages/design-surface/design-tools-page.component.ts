import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DocsService, DocsPage } from '../../../../services/docs.service';
import { DocsPageNavComponent } from '../../docs-page-nav.component';
import { CodeBlockComponent } from '../../../code-block/code-block.component';

@Component({
    imports: [CommonModule, RouterModule, DocsPageNavComponent, CodeBlockComponent],
    template: `
        <h1>Design Tools</h1>
        <p class="lead">
            The design surface provides 16 creation tools, each corresponding to an element type.
            Tools are managed by the <code>ToolService</code> and activated via the controller.
        </p>

        <h2>Tool Activation</h2>
        <p>
            Tools are activated through the <code>ToolService</code>. When a creation tool is active,
            click-drag on the canvas creates a new element. The Pointer tool is the default and provides
            select/move functionality.
        </p>

        <h2>Available Tools</h2>
        <table class="docs-table">
            <thead>
                <tr>
                    <th>Tool</th>
                    <th>Element Created</th>
                    <th>Creation Behavior</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><code>Pointer</code></td>
                    <td>—</td>
                    <td>Default tool. Click to select, drag to move, rubber band to multi-select.</td>
                </tr>
                <tr>
                    <td><code>Rectangle</code></td>
                    <td>Rectangle</td>
                    <td>Click-drag to define bounding box.</td>
                </tr>
                <tr>
                    <td><code>Ellipse</code></td>
                    <td>Ellipse</td>
                    <td>Click-drag to define bounding box. Center and radii derived from bounds.</td>
                </tr>
                <tr>
                    <td><code>Line</code></td>
                    <td>Line</td>
                    <td>Click-drag from start point to end point.</td>
                </tr>
                <tr>
                    <td><code>Arc</code></td>
                    <td>Arc</td>
                    <td>Click-drag to define bounding box for the arc's ellipse.</td>
                </tr>
                <tr>
                    <td><code>Arrow</code></td>
                    <td>Arrow (Line)</td>
                    <td>Click-drag from start to end. Creates a line with an arrowhead.</td>
                </tr>
                <tr>
                    <td><code>Wedge</code></td>
                    <td>Wedge</td>
                    <td>Click-drag to define bounding box.</td>
                </tr>
                <tr>
                    <td><code>Ring</code></td>
                    <td>Ring</td>
                    <td>Click-drag to define outer bounding box.</td>
                </tr>
                <tr>
                    <td><code>RegularPolygon</code></td>
                    <td>Regular Polygon</td>
                    <td>Click-drag to define bounding box. Default sides configurable.</td>
                </tr>
                <tr>
                    <td><code>Pen</code></td>
                    <td>Path</td>
                    <td>Click-drag to draw a freeform path. Points captured during drag.</td>
                </tr>
                <tr>
                    <td><code>Polygon</code></td>
                    <td>Polygon</td>
                    <td>Click to place each vertex. Double-click or close to finish.</td>
                </tr>
                <tr>
                    <td><code>Polyline</code></td>
                    <td>Polyline</td>
                    <td>Click to place each vertex. Double-click to finish.</td>
                </tr>
                <tr>
                    <td><code>Text</code></td>
                    <td>Text</td>
                    <td>Click to place text insertion point. Opens inline text editor.</td>
                </tr>
                <tr>
                    <td><code>Image</code></td>
                    <td>Image</td>
                    <td>Click-drag to define bounding box for image placement.</td>
                </tr>
                <tr>
                    <td><code>ModelElement</code></td>
                    <td>Model Element</td>
                    <td>Click-drag to define bounding box for an embedded model reference.</td>
                </tr>
            </tbody>
        </table>

        <h2>Activating Tools</h2>
        <app-code-block [code]="activateCode" language="javascript" label="JavaScript"></app-code-block>

        <h2>Configuring Tool Defaults</h2>
        <p>
            When a creation tool creates a new element, the element is styled with the current
            default fill and stroke. Configure these defaults before activating the tool to
            control the appearance of newly created elements.
        </p>
        <app-code-block [code]="configCode" language="javascript" label="JavaScript"></app-code-block>

        <app-docs-page-nav [previousPage]="previousPage" [nextPage]="nextPage"></app-docs-page-nav>
    `
})
export class DesignToolsPageComponent {
    previousPage: DocsPage | undefined;
    nextPage: DocsPage | undefined;

    activateCode = `// Activate the pointer tool (default)
controller.toolService.setTool(ToolType.Pointer);

// Activate the rectangle creation tool
controller.toolService.setTool(ToolType.Rectangle);

// Activate the ellipse creation tool
controller.toolService.setTool(ToolType.Ellipse);

// Activate the line creation tool
controller.toolService.setTool(ToolType.Line);

// Activate the pen (freeform path) tool
controller.toolService.setTool(ToolType.Pen);

// Activate the polygon tool (click-click-click to place vertices)
controller.toolService.setTool(ToolType.Polygon);

// Activate the text tool
controller.toolService.setTool(ToolType.Text);

// Check which tool is currently active
var currentTool = controller.activeTool;`;

    configCode = `// Set default fill for new elements
controller.toolService.setDefaultFill('SteelBlue');

// Set default stroke for new elements
controller.toolService.setDefaultStroke('White,2');

// Activate rectangle tool - new rectangles will use these defaults
controller.toolService.setTool(ToolType.Rectangle);

// Change defaults for a different tool
controller.toolService.setDefaultFill('Coral');
controller.toolService.setDefaultStroke('DarkRed,1');
controller.toolService.setTool(ToolType.Ellipse);

// Configure regular polygon sides before activating
controller.toolService.setDefaultSides(6); // Hexagon
controller.toolService.setTool(ToolType.RegularPolygon);`;

    constructor(private docsService: DocsService) {
        this.previousPage = docsService.getPreviousPage('design-surface', 'design-tools');
        this.nextPage = docsService.getNextPage('design-surface', 'design-tools');
    }
}
