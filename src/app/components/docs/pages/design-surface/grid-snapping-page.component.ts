import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DocsService, DocsPage } from '../../../../services/docs.service';
import { DocsPageNavComponent } from '../../docs-page-nav.component';
import { CodeBlockComponent } from '../../../code-block/code-block.component';

@Component({
    imports: [CommonModule, RouterModule, DocsPageNavComponent, CodeBlockComponent],
    template: `
        <h1>Grid &amp; Snapping</h1>
        <p class="lead">
            The design surface supports configurable grid display and element snapping to help
            align elements precisely during creation and manipulation.
        </p>

        <h2>Grid Types</h2>
        <p>
            The grid overlay is controlled by the <code>GridType</code> enumeration. Four grid
            display modes are available:
        </p>
        <table class="docs-table">
            <thead>
                <tr>
                    <th>GridType</th>
                    <th>Description</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><code>GridType.None</code></td>
                    <td>No grid is displayed. The canvas is blank.</td>
                </tr>
                <tr>
                    <td><code>GridType.Lines</code></td>
                    <td>Full horizontal and vertical grid lines at each grid interval.</td>
                </tr>
                <tr>
                    <td><code>GridType.Dots</code></td>
                    <td>Small dots rendered at each grid intersection point.</td>
                </tr>
                <tr>
                    <td><code>GridType.Crosses</code></td>
                    <td>Small cross marks rendered at each grid intersection point.</td>
                </tr>
            </tbody>
        </table>

        <h2>Grid Properties</h2>
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
                    <td><code>gridType</code></td>
                    <td><code>GridType</code></td>
                    <td>The current grid display mode.</td>
                </tr>
                <tr>
                    <td><code>gridSize</code></td>
                    <td><code>number</code></td>
                    <td>Pixel spacing between grid points/lines.</td>
                </tr>
                <tr>
                    <td><code>gridColor</code></td>
                    <td><code>string</code></td>
                    <td>Color used to render the grid overlay.</td>
                </tr>
            </tbody>
        </table>

        <h2>Snapping</h2>
        <p>
            When <code>snapEnabled</code> is true, elements snap to the nearest grid point during
            move and resize operations. Snapping also applies during element creation with any
            drawing tool — the start and end points of the created element align to the grid.
        </p>

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
                    <td><code>setGridType(type)</code></td>
                    <td>method</td>
                    <td>Sets the grid display mode to the specified <code>GridType</code>.</td>
                </tr>
                <tr>
                    <td><code>setGridSize(size)</code></td>
                    <td>method</td>
                    <td>Sets the grid spacing in pixels.</td>
                </tr>
                <tr>
                    <td><code>setSnapEnabled(enabled)</code></td>
                    <td>method</td>
                    <td>Enables or disables element snapping to grid points.</td>
                </tr>
            </tbody>
        </table>

        <h2>Configuring Grid Types</h2>
        <app-code-block [code]="gridCode" language="javascript" label="JavaScript"></app-code-block>

        <h2>Enabling and Disabling Snapping</h2>
        <app-code-block [code]="snapCode" language="javascript" label="JavaScript"></app-code-block>

        <app-docs-page-nav [previousPage]="previousPage" [nextPage]="nextPage"></app-docs-page-nav>
    `
})
export class GridSnappingPageComponent {
    previousPage: DocsPage | undefined;
    nextPage: DocsPage | undefined;

    gridCode = `// No grid
controller.setGridType(GridType.None);

// Full grid lines with 20px spacing
controller.setGridType(GridType.Lines);
controller.setGridSize(20);

// Dot grid with 10px spacing
controller.setGridType(GridType.Dots);
controller.setGridSize(10);

// Cross marks at intersections
controller.setGridType(GridType.Crosses);
controller.setGridSize(25);`;

    snapCode = `// Enable snapping to grid points
controller.setSnapEnabled(true);
controller.setGridSize(20);

// Elements now snap to 20px increments during move/resize
// Tool creation also snaps start and end points

// Disable snapping for freeform placement
controller.setSnapEnabled(false);`;

    constructor(private docsService: DocsService) {
        this.previousPage = docsService.getPreviousPage('design-surface', 'grid-snapping');
        this.nextPage = docsService.getNextPage('design-surface', 'grid-snapping');
    }
}
