import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocsService, DocsPage } from '../../../../services/docs.service';
import { DocsPageNavComponent } from '../../docs-page-nav.component';
import { CodeBlockComponent } from '../../../code-block/code-block.component';
import { DocsCodeSampleComponent } from '../../docs-code-sample.component';

@Component({
  selector: 'app-regular-polygon-page',
  standalone: true,
  imports: [CommonModule, DocsPageNavComponent, CodeBlockComponent, DocsCodeSampleComponent],
  template: `
    <h1>Regular Polygon</h1>
    <p class="lead">
      The regular polygon element generates regular polygons and star shapes with configurable
      number of sides, rotation, and optional inner radius scaling for star patterns.
    </p>

    <h2>Factory Method</h2>
    <p>
      Create a regular polygon element using the <code>elise.regularPolygon()</code> factory method,
      then use <code>setSides()</code>, <code>setInnerRadiusScale()</code>, or <code>setShapeRotation()</code>
      to configure the returned element.
    </p>
    <app-code-block code="elise.regularPolygon(x, y, width, height).setSides(6).setShapeRotation(30)" language="javascript" label="JavaScript"></app-code-block>

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
          <td><code>x</code></td>
          <td>number</td>
          <td>0</td>
          <td>X coordinate of the bounding box</td>
        </tr>
        <tr>
          <td><code>y</code></td>
          <td>number</td>
          <td>0</td>
          <td>Y coordinate of the bounding box</td>
        </tr>
        <tr>
          <td><code>width</code></td>
          <td>number</td>
          <td>0</td>
          <td>Width of the bounding box</td>
        </tr>
        <tr>
          <td><code>height</code></td>
          <td>number</td>
          <td>0</td>
          <td>Height of the bounding box</td>
        </tr>
        <tr>
          <td><code>sides</code></td>
          <td>number</td>
          <td>5</td>
          <td>Number of polygon sides</td>
        </tr>
        <tr>
          <td><code>innerRadiusScale</code></td>
          <td>number</td>
          <td>1</td>
          <td>When set, creates a star shape by defining the inner radius ratio (0-1)</td>
        </tr>
        <tr>
          <td><code>rotation</code></td>
          <td>number</td>
          <td>-90</td>
          <td>Shape rotation angle in degrees. Use <code>setShapeRotation()</code> for the fluent API.</td>
        </tr>
      </tbody>
    </table>

    <h2>Fill and Stroke</h2>
    <p>
      Regular polygon elements support both fill and stroke styling. Use fill to set the interior
      color and stroke to define the outline appearance.
    </p>

    <h2>Examples</h2>

    <h3>Pentagon</h3>
    <p>A regular pentagon with 5 sides.</p>
    <app-docs-code-sample [code]="pentagonCode" language="javascript" label="JavaScript"></app-docs-code-sample>

    <h3>Hexagon</h3>
    <p>A regular hexagon with 6 sides.</p>
    <app-docs-code-sample [code]="hexagonCode" language="javascript" label="JavaScript"></app-docs-code-sample>

    <h3>Star</h3>
    <p>
      A 5-pointed star created by setting <code>innerRadiusScale</code> to define
      the ratio between the inner and outer radius.
    </p>
    <app-docs-code-sample [code]="starCode" language="javascript" label="JavaScript"></app-docs-code-sample>

    <h3>Rotated Triangle</h3>
    <p>A triangle with rotation applied.</p>
    <app-docs-code-sample [code]="rotatedCode" language="javascript" label="JavaScript"></app-docs-code-sample>

    <app-docs-page-nav [previousPage]="previousPage" [nextPage]="nextPage"></app-docs-page-nav>
  `
})
export class RegularPolygonPageComponent {
  previousPage: DocsPage | undefined;
  nextPage: DocsPage | undefined;

  pentagonCode = `const m = elise.model(200, 200);
elise.regularPolygon(20, 20, 160, 160)
  .setSides(5)
  .setFill('#3b82f6')
  .addTo(m);`;

  hexagonCode = `const m = elise.model(200, 200);
elise.regularPolygon(20, 20, 160, 160)
  .setSides(6)
  .setFill('#10b981')
  .setStroke('#000000,2')
  .addTo(m);`;

  starCode = `const m = elise.model(200, 200);
elise.regularPolygon(20, 20, 160, 160)
  .setSides(5)
  .setInnerRadiusScale(0.4)
  .setFill('#f59e0b')
  .addTo(m);`;

  rotatedCode = `const m = elise.model(200, 200);
elise.regularPolygon(20, 20, 160, 160)
  .setSides(3)
  .setShapeRotation(30)
  .setFill('#8b5cf6')
  .setStroke('#000000,2')
  .addTo(m);`;

  constructor(private docsService: DocsService) {
    this.previousPage = docsService.getPreviousPage('elements', 'regular-polygon');
    this.nextPage = docsService.getNextPage('elements', 'regular-polygon');
  }
}
