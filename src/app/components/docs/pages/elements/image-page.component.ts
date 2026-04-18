import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DocsService, DocsPage } from '../../../../services/docs.service';
import { DocsPageNavComponent } from '../../docs-page-nav.component';
import { CodeBlockComponent } from '../../../code-block/code-block.component';
import { DocsCodeSampleComponent } from '../../docs-code-sample.component';

@Component({
  selector: 'app-image-page',
  standalone: true,
  imports: [CommonModule, RouterModule, DocsPageNavComponent, CodeBlockComponent, DocsCodeSampleComponent],
  template: `
    <h1>Image</h1>
    <p class="lead">
      The image element displays a bitmap image from a registered resource within a model.
      Images are loaded asynchronously and rendered at the specified position and size.
    </p>

    <h2>Factory Method</h2>
    <p>
      Create an image element using the <code>elise.image()</code> factory method.
    </p>
    <app-code-block code="elise.image(source, x, y, width, height)" language="javascript" label="JavaScript"></app-code-block>

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
          <td>Bitmap resource key registered in the model's resource manager</td>
        </tr>
        <tr>
          <td><code>x</code></td>
          <td>number</td>
          <td>0</td>
          <td>X coordinate of the image</td>
        </tr>
        <tr>
          <td><code>y</code></td>
          <td>number</td>
          <td>0</td>
          <td>Y coordinate of the image</td>
        </tr>
        <tr>
          <td><code>width</code></td>
          <td>number</td>
          <td>0</td>
          <td>Rendered width of the image</td>
        </tr>
        <tr>
          <td><code>height</code></td>
          <td>number</td>
          <td>0</td>
          <td>Rendered height of the image</td>
        </tr>
        <tr>
          <td><code>opacity</code></td>
          <td>number</td>
          <td>1</td>
          <td>Opacity of the image (inherited from base element)</td>
        </tr>
      </tbody>
    </table>

    <h2>Fill and Stroke</h2>
    <p>
      Image elements do <strong>not</strong> support fill or stroke styling. The image content
      is rendered directly from the bitmap resource.
    </p>

    <h2>Resource System</h2>
    <p>
      Images rely on the model's resource system. Before an image element can display content,
      the bitmap resource must be registered with the model's resource manager.
    </p>
    <ol>
      <li>Set the base path for resource loading using <code>model.setBasePath(url)</code>.</li>
      <li>Register the image resource using <code>elise.bitmapResource('key', '/images/file.ext').addTo(model)</code>.</li>
      <li>Reference the resource key in the image element using <code>elise.image('key', ...)</code>.</li>
    </ol>
    <p>
      Images are loaded asynchronously. The view controller manages the loading process,
      and the image will render once the resource has been fully loaded.
    </p>
    <p>
      The live previews below use a bundled local asset so the examples render reliably inside the docs site.
    </p>

    <h2>Examples</h2>

    <h3>Basic Image</h3>
    <p>A model with a registered bitmap resource displayed as an image element.</p>
    <app-docs-code-sample [code]="basicCode" language="javascript" label="JavaScript"></app-docs-code-sample>

    <h3>Scaled Images</h3>
    <p>The same image resource displayed at different sizes.</p>
    <app-docs-code-sample [code]="scaledCode" language="javascript" label="JavaScript"></app-docs-code-sample>

    <app-docs-page-nav [previousPage]="previousPage" [nextPage]="nextPage"></app-docs-page-nav>
  `
})
export class ImagePageComponent {
  previousPage: DocsPage | undefined;
  nextPage: DocsPage | undefined;

  basicCode = `const m = elise.model(200, 200);
m.setBasePath('/assets/models/primitives');
elise.bitmapResource('bulb', '/images/bulb.png').addTo(m);
elise.image('bulb', 10, 10, 180, 180)
  .addTo(m);`;

  scaledCode = `const m = elise.model(200, 200);
m.setBasePath('/assets/models/primitives');
elise.bitmapResource('bulb', '/images/bulb.png').addTo(m);

// Small
elise.image('bulb', 12, 12, 40, 40)
  .addTo(m);

// Medium
elise.image('bulb', 62, 10, 80, 80)
  .addTo(m);

// Large
elise.image('bulb', 10, 102, 180, 90)
  .addTo(m);`;

  constructor(private docsService: DocsService) {
    this.previousPage = docsService.getPreviousPage('elements', 'image');
    this.nextPage = docsService.getNextPage('elements', 'image');
  }
}
