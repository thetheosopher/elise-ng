import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DocsService, DocsPage } from '../../../../services/docs.service';
import { DocsPageNavComponent } from '../../docs-page-nav.component';

@Component({
    imports: [CommonModule, RouterModule, DocsPageNavComponent],
    template: `
        <h1>Canvas Rendering</h1>
        <p class="lead">
            Elise uses HTML5 Canvas 2D as its default rendering target, providing fast pixel-based output
            with full support for blend modes, filters, shadows, and image manipulation.
        </p>

        <h2>How It Works</h2>
        <p>
            The ViewController creates a <code>&lt;canvas&gt;</code> element and obtains a
            <code>CanvasRenderingContext2D</code>. During each render pass, it iterates the model's element list
            and calls each element's canvas draw method. The context's transform stack is used to apply element
            positioning, rotation, and scaling.
        </p>

        <h2>Coordinate System and Transforms</h2>
        <p>
            Canvas rendering uses a standard 2D coordinate system with the origin at the top-left corner.
            X increases to the right and Y increases downward. The controller applies a base transform for
            the view scale and then each element applies its own transform via <code>context.save()</code>,
            <code>context.translate()</code>, <code>context.rotate()</code>, and <code>context.restore()</code>.
        </p>
        <ol>
            <li>Controller sets the canvas dimensions and clears the background</li>
            <li>Base scale transform is applied: <code>context.scale(scale, scale)</code></li>
            <li>Each element saves context state, applies its position/rotation transform</li>
            <li>Element renders using Canvas 2D drawing commands</li>
            <li>Context state is restored for the next element</li>
        </ol>

        <h2>Element Property Mapping</h2>
        <p>
            Each Elise element property maps directly to Canvas 2D API calls:
        </p>
        <table class="docs-table">
            <thead><tr><th>Element Property</th><th>Canvas API</th><th>Notes</th></tr></thead>
            <tbody>
                <tr><td><code>fill</code> (solid)</td><td><code>fillStyle</code></td><td>CSS color string</td></tr>
                <tr><td><code>fill</code> (linear gradient)</td><td><code>createLinearGradient()</code></td><td>Native canvas gradient object</td></tr>
                <tr><td><code>fill</code> (radial gradient)</td><td><code>createRadialGradient()</code></td><td>Native canvas gradient object</td></tr>
                <tr><td><code>fill</code> (pattern/image)</td><td><code>createPattern()</code></td><td>Tiled or stretched image fill</td></tr>
                <tr><td><code>stroke</code></td><td><code>strokeStyle</code>, <code>lineWidth</code></td><td>Color and width from stroke descriptor</td></tr>
                <tr><td><code>opacity</code></td><td><code>globalAlpha</code></td><td>Applied before drawing</td></tr>
                <tr><td><code>transform</code></td><td><code>translate()</code>, <code>rotate()</code></td><td>Applied via context transform stack</td></tr>
                <tr><td>Text content</td><td><code>fillText()</code>, <code>strokeText()</code></td><td>Font set via <code>context.font</code></td></tr>
                <tr><td>Image source</td><td><code>drawImage()</code></td><td>From preloaded resource</td></tr>
                <tr><td><code>shadow</code></td><td><code>shadowColor</code>, <code>shadowBlur</code>, <code>shadowOffsetX/Y</code></td><td>Applied before fill/stroke</td></tr>
            </tbody>
        </table>

        <h2>Fill Rendering</h2>
        <p>
            Canvas fill rendering supports multiple fill types natively:
        </p>
        <ul>
            <li><strong>Solid colors</strong> — Set directly as <code>fillStyle</code> string</li>
            <li><strong>Linear gradients</strong> — Created with <code>createLinearGradient()</code> using the
                element's gradient stops and direction</li>
            <li><strong>Radial gradients</strong> — Created with <code>createRadialGradient()</code> using
                center point and radius</li>
            <li><strong>Pattern fills</strong> — Created with <code>createPattern()</code> from a loaded image resource</li>
        </ul>

        <h2>Anti-aliasing</h2>
        <p>
            Canvas 2D rendering applies anti-aliasing automatically for most drawing operations. Line rendering
            uses sub-pixel positioning, which can cause blurry single-pixel lines. For crisp lines, coordinates
            should be offset by 0.5 pixels. The <code>imageSmoothingEnabled</code> property controls image
            interpolation quality when scaling images.
        </p>

        <h2>Performance Considerations</h2>
        <ul>
            <li><strong>Redraw cost</strong> — Canvas clears and redraws all elements each frame. Keep element count
                reasonable for smooth animation (hundreds, not thousands).</li>
            <li><strong>Image caching</strong> — Resources are loaded once and cached. The same image resource
                renders efficiently across multiple elements.</li>
            <li><strong>Pixel ratio</strong> — The controller handles device pixel ratio scaling automatically,
                rendering at native resolution for crisp output on high-DPI displays.</li>
            <li><strong>Blend modes</strong> — <code>globalCompositeOperation</code> supports all standard blend
                modes (multiply, screen, overlay, etc.) with hardware acceleration.</li>
            <li><strong>Filters</strong> — Canvas filters (blur, brightness, contrast) are applied per-element
                and can impact performance on complex scenes.</li>
        </ul>

        <app-docs-page-nav [previousPage]="previousPage" [nextPage]="nextPage"></app-docs-page-nav>
    `
})
export class CanvasRenderingPageComponent {
    previousPage: DocsPage | undefined;
    nextPage: DocsPage | undefined;

    constructor(docsService: DocsService) {
        this.previousPage = docsService.getPreviousPage('rendering', 'canvas-rendering');
        this.nextPage = docsService.getNextPage('rendering', 'canvas-rendering');
    }
}
