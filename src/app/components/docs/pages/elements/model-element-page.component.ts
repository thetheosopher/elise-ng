import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DocsService, DocsPage } from '../../../../services/docs.service';
import { DocsPageNavComponent } from '../../docs-page-nav.component';
import { CodeBlockComponent } from '../../../code-block/code-block.component';
import { DocsCodeSampleComponent } from '../../docs-code-sample.component';

@Component({
  selector: 'app-model-element-page',
  standalone: true,
  imports: [CommonModule, RouterModule, DocsPageNavComponent, CodeBlockComponent, DocsCodeSampleComponent],
  template: `
    <h1>Model Element</h1>
    <p class="lead">
      The model element embeds a nested model within another model, enabling hierarchical
      composition. The nested model is rendered at the specified position and scaled to fit
      the given width and height.
    </p>

    <h2>Factory Method</h2>
    <p>
      Create a model element using the <code>elise.innerModel()</code> factory method.
    </p>
    <app-code-block code="elise.innerModel(source, x, y, width, height)" language="javascript" label="JavaScript"></app-code-block>

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
          <td><code>source</code></td>
          <td>string</td>
          <td></td>
          <td>Model resource key registered in the resource manager</td>
        </tr>
        <tr>
          <td><code>x</code></td>
          <td>number</td>
          <td>0</td>
          <td>X coordinate of the element</td>
        </tr>
        <tr>
          <td><code>y</code></td>
          <td>number</td>
          <td>0</td>
          <td>Y coordinate of the element</td>
        </tr>
        <tr>
          <td><code>width</code></td>
          <td>number</td>
          <td>0</td>
          <td>Rendered width of the nested model</td>
        </tr>
        <tr>
          <td><code>height</code></td>
          <td>number</td>
          <td>0</td>
          <td>Rendered height of the nested model</td>
        </tr>
      </tbody>
    </table>

    <h2>Model Resources</h2>
    <p>
      Model elements reference a model resource by key. The inner model must be registered with the
      outer model's resource manager before it can be used. You can register an inline model object
      directly or load it from a URL.
    </p>
    <ol>
      <li>Create the inner model using <code>elise.model(width, height)</code>.</li>
      <li>Register it with <code>elise.modelResource('key', innerModel).addTo(model)</code>.</li>
      <li>Display it using <code>elise.innerModel('key', x, y, width, height)</code>.</li>
    </ol>

    <h2>Model Fills</h2>
    <p>
      Model elements also support fill as "model fills" &mdash; using a model's rendering as a
      fill pattern for other shapes. This enables powerful visual effects such as tiling a complex
      pattern across a region.
    </p>

    <h2>Examples</h2>

    <h3>Basic Model Element</h3>
    <p>An inner model registered as a resource and displayed within an outer model.</p>
    <app-docs-code-sample [code]="basicCode" language="javascript" label="JavaScript"></app-docs-code-sample>

    <h3>Composition Layout</h3>
    <p>Multiple model elements arranged in a layout within a parent model.</p>
    <app-docs-code-sample [code]="compositionCode" language="javascript" label="JavaScript"></app-docs-code-sample>

    <app-docs-page-nav [previousPage]="previousPage" [nextPage]="nextPage"></app-docs-page-nav>
  `
})
export class ModelElementPageComponent {
  previousPage: DocsPage | undefined;
  nextPage: DocsPage | undefined;

  basicCode = `// Create the inner model
const inner = elise.model(100, 100);
elise.ellipse(10, 10, 80, 80)
  .setFill('#3b82f6')
  .addTo(inner);

// Create the outer model and register the inner model
const m = elise.model(200, 200);
elise.modelResource('circle', inner).addTo(m);

// Display the inner model as a model element
elise.innerModel('circle', 20, 20, 160, 160)
  .addTo(m);`;

  compositionCode = `// Create reusable inner models
const redBox = elise.model(50, 50);
elise.rectangle(5, 5, 40, 40)
  .setFill('#ef4444')
  .addTo(redBox);

const greenBox = elise.model(50, 50);
elise.rectangle(5, 5, 40, 40)
  .setFill('#10b981')
  .addTo(greenBox);

const blueBox = elise.model(50, 50);
elise.rectangle(5, 5, 40, 40)
  .setFill('#3b82f6')
  .addTo(blueBox);

// Compose into a layout
const m = elise.model(200, 120);
elise.modelResource('red', redBox).addTo(m);
elise.modelResource('green', greenBox).addTo(m);
elise.modelResource('blue', blueBox).addTo(m);

elise.innerModel('red', 10, 35, 50, 50).addTo(m);
elise.innerModel('green', 75, 35, 50, 50).addTo(m);
elise.innerModel('blue', 140, 35, 50, 50).addTo(m);`;

  constructor(private docsService: DocsService) {
    this.previousPage = docsService.getPreviousPage('elements', 'model-element');
    this.nextPage = docsService.getNextPage('elements', 'model-element');
  }
}
