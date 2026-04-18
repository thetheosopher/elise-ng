import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DocsService, DocsPage } from '../../../../services/docs.service';
import { DocsPageNavComponent } from '../../docs-page-nav.component';
import { DocsCodeSampleComponent } from '../../docs-code-sample.component';

@Component({
    selector: 'app-styling-overview-page',
    standalone: true,
    imports: [CommonModule, RouterModule, DocsPageNavComponent, DocsCodeSampleComponent],
    template: `
        <h1>Styling Overview</h1>
        <p class="lead">
            Elise provides a comprehensive styling system for elements. Every visual property — from
            simple color fills to complex gradient patterns, image textures, strokes, shadows, blend modes,
            and transforms — is controlled through a consistent, fluent API.
        </p>

        <h2>Styling Capabilities</h2>
        <table class="docs-table">
            <thead>
                <tr>
                    <th>Feature</th>
                    <th>Description</th>
                    <th>Details</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><a routerLink="/docs/styling/color-fills">Color Fills</a></td>
                    <td>Solid color fills using named colors, hex, and alpha formats</td>
                    <td>All fillable elements</td>
                </tr>
                <tr>
                    <td><a routerLink="/docs/styling/linear-gradients">Linear Gradients</a></td>
                    <td>Smooth color transitions along a line</td>
                    <td>All fillable elements</td>
                </tr>
                <tr>
                    <td><a routerLink="/docs/styling/radial-gradients">Radial Gradients</a></td>
                    <td>Circular or elliptical color transitions from a center point</td>
                    <td>All fillable elements</td>
                </tr>
                <tr>
                    <td><a routerLink="/docs/styling/image-fills">Image Fills</a></td>
                    <td>Bitmap image patterns used as element fills</td>
                    <td>All fillable elements</td>
                </tr>
                <tr>
                    <td>Model Fills</td>
                    <td>Nested model resources rendered as fill patterns</td>
                    <td>All fillable elements</td>
                </tr>
                <tr>
                    <td>Strokes</td>
                    <td>Border outlines with color, width, and dash patterns</td>
                    <td>All shape elements</td>
                </tr>
                <tr>
                    <td>Opacity</td>
                    <td>Element transparency from 0 (invisible) to 1 (opaque)</td>
                    <td>All elements</td>
                </tr>
                <tr>
                    <td>Shadows</td>
                    <td>Drop shadows with color, offset, and blur</td>
                    <td>All elements</td>
                </tr>
                <tr>
                    <td>Blend Modes</td>
                    <td>Canvas composite operations (multiply, screen, overlay, etc.)</td>
                    <td>All elements</td>
                </tr>
                <tr>
                    <td>CSS Filters</td>
                    <td>Blur, brightness, contrast, grayscale, and other filter effects</td>
                    <td>All elements</td>
                </tr>
                <tr>
                    <td>Clip Paths</td>
                    <td>Clipping regions that mask element rendering</td>
                    <td>All elements</td>
                </tr>
                <tr>
                    <td>Transforms</td>
                    <td>Affine transforms: translate, rotate, scale, skew</td>
                    <td>All elements</td>
                </tr>
            </tbody>
        </table>

        <h2>Styling Property Support by Element Type</h2>
        <table class="docs-table">
            <thead>
                <tr>
                    <th>Element</th>
                    <th>Fill</th>
                    <th>Stroke</th>
                    <th>Opacity</th>
                    <th>Shadow</th>
                    <th>Transform</th>
                </tr>
            </thead>
            <tbody>
                <tr><td>Rectangle</td><td>Yes</td><td>Yes</td><td>Yes</td><td>Yes</td><td>Yes</td></tr>
                <tr><td>Ellipse</td><td>Yes</td><td>Yes</td><td>Yes</td><td>Yes</td><td>Yes</td></tr>
                <tr><td>Polygon</td><td>Yes</td><td>Yes</td><td>Yes</td><td>Yes</td><td>Yes</td></tr>
                <tr><td>Path</td><td>Yes</td><td>Yes</td><td>Yes</td><td>Yes</td><td>Yes</td></tr>
                <tr><td>Line</td><td>No</td><td>Yes</td><td>Yes</td><td>Yes</td><td>Yes</td></tr>
                <tr><td>Polyline</td><td>No</td><td>Yes</td><td>Yes</td><td>Yes</td><td>Yes</td></tr>
                <tr><td>Text</td><td>Yes</td><td>Yes</td><td>Yes</td><td>Yes</td><td>Yes</td></tr>
                <tr><td>Image</td><td>No</td><td>No</td><td>Yes</td><td>Yes</td><td>Yes</td></tr>
                <tr><td>Model Element</td><td>No</td><td>No</td><td>Yes</td><td>Yes</td><td>Yes</td></tr>
            </tbody>
        </table>

        <h2>Combined Styling Example</h2>
        <p>
            Multiple style properties can be applied to a single element using the fluent API.
        </p>
        <app-docs-code-sample [code]="combinedCode" language="javascript" label="JavaScript"></app-docs-code-sample>

        <app-docs-page-nav [previousPage]="previousPage" [nextPage]="nextPage"></app-docs-page-nav>
    `
})
export class StylingOverviewPageComponent {
    previousPage?: DocsPage;
    nextPage?: DocsPage;

    combinedCode = `const m = elise.model(320, 200);

// Rectangle with gradient fill, stroke, shadow, and opacity
const gradient = elise.linearGradientFill('40,30', '280,170');
gradient.addFillStop('#3b82f6', 0);
gradient.addFillStop('#8b5cf6', 1);

elise.rectangle(40, 30, 240, 140)
    .setFill(gradient)
    .setStroke('#1e3a5f,3')
    .setOpacity(0.9)
    .setShadow({ color: 'rgba(0,0,0,0.3)', blur: 8, offsetX: 4, offsetY: 4 })
    .setTransform('rotate(2)')
    .addTo(m);`;

    constructor(docsService: DocsService) {
        this.previousPage = docsService.getPreviousPage('styling', 'styling-overview');
        this.nextPage = docsService.getNextPage('styling', 'styling-overview');
    }
}
