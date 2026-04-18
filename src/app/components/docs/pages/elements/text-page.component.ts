import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocsService, DocsPage } from '../../../../services/docs.service';
import { DocsPageNavComponent } from '../../docs-page-nav.component';
import { CodeBlockComponent } from '../../../code-block/code-block.component';
import { DocsCodeSampleComponent } from '../../docs-code-sample.component';

@Component({
  selector: 'app-text-page',
  standalone: true,
  imports: [CommonModule, DocsPageNavComponent, CodeBlockComponent, DocsCodeSampleComponent],
  template: `
    <h1>Text</h1>
    <p class="lead">
      The text element renders single or multi-line text within a bounding box with rich
      typography control including font family, size, style, alignment, and decoration.
    </p>

    <h2>Factory Method</h2>
    <p>
      Create a text element using the <code>elise.text()</code> factory method.
    </p>
    <app-code-block code="elise.text(text, x, y, width, height)" language="javascript" label="JavaScript"></app-code-block>

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
          <td><code>text</code></td>
          <td>string</td>
          <td></td>
          <td>Text content to display</td>
        </tr>
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
          <td><code>typeface</code></td>
          <td>string</td>
          <td>'sans-serif'</td>
          <td>Font family name</td>
        </tr>
        <tr>
          <td><code>typesize</code></td>
          <td>number</td>
          <td>12</td>
          <td>Font size in pixels</td>
        </tr>
        <tr>
          <td><code>typestyle</code></td>
          <td>string</td>
          <td>'Normal'</td>
          <td>Font style: 'Normal', 'Bold', 'Italic', 'Bold,Italic'</td>
        </tr>
        <tr>
          <td><code>alignment</code></td>
          <td>string</td>
          <td>'left'</td>
          <td>Combined alignment directives such as 'left', 'center', 'right', 'top', 'middle', or 'bottom'. Combine values like 'Center,Middle'.</td>
        </tr>
        <tr>
          <td><code>letterSpacing</code></td>
          <td>number</td>
          <td></td>
          <td>Additional spacing between characters</td>
        </tr>
        <tr>
          <td><code>lineHeight</code></td>
          <td>number</td>
          <td></td>
          <td>Line height for multi-line text</td>
        </tr>
        <tr>
          <td><code>textDecoration</code></td>
          <td>string</td>
          <td>'None'</td>
          <td>Text decoration: 'None', 'Underline', 'Overline', 'Strikethrough'</td>
        </tr>
      </tbody>
    </table>

    <h2>Fill and Stroke</h2>
    <p>
      Fill sets the text color. Stroke defines a text outline effect. Both are optional.
    </p>

    <h2>Examples</h2>

    <h3>Basic Text</h3>
    <p>Simple text with a specified font family and size.</p>
    <app-docs-code-sample [code]="basicCode" language="javascript" label="JavaScript"></app-docs-code-sample>

    <h3>Styled Text</h3>
    <p>Bold, centered text with a color fill.</p>
    <app-docs-code-sample [code]="styledCode" language="javascript" label="JavaScript"></app-docs-code-sample>

    <h3>Multi-line Text</h3>
    <p>Text that wraps across multiple lines with a custom line height.</p>
    <app-docs-code-sample [code]="multilineCode" language="javascript" label="JavaScript"></app-docs-code-sample>

    <h3>Decorated Text</h3>
    <p>Text with an underline decoration and letter spacing.</p>
    <app-docs-code-sample [code]="decoratedCode" language="javascript" label="JavaScript"></app-docs-code-sample>

    <app-docs-page-nav [previousPage]="previousPage" [nextPage]="nextPage"></app-docs-page-nav>
  `
})
export class TextPageComponent {
  previousPage: DocsPage | undefined;
  nextPage: DocsPage | undefined;

  basicCode = `const m = elise.model(200, 120);
elise.text('Hello, Elise!', 10, 10, 180, 100)
  .setTypeface('Arial')
  .setTypesize(24)
  .setFill('#3b82f6')
  .addTo(m);`;

  styledCode = `const m = elise.model(200, 120);
elise.text('Bold Title', 10, 10, 180, 100)
  .setTypeface('Georgia')
  .setTypesize(28)
  .setTypestyle('Bold')
  .setAlignment('Center,Middle')
  .setFill('#ef4444')
  .addTo(m);`;

  multilineCode = `const m = elise.model(200, 200);
elise.text('This is a longer text that will wrap across multiple lines within the bounding box.', 10, 10, 180, 180)
  .setTypeface('sans-serif')
  .setTypesize(16)
  .setLineHeight(1.5)
  .setFill('#10b981')
  .addTo(m);`;

  decoratedCode = `const m = elise.model(200, 120);
elise.text('Underlined Text', 10, 10, 180, 100)
  .setTypeface('sans-serif')
  .setTypesize(20)
  .setTextDecoration('Underline')
  .setLetterSpacing(2)
  .setFill('#8b5cf6')
  .addTo(m);`;

  constructor(private docsService: DocsService) {
    this.previousPage = docsService.getPreviousPage('elements', 'text');
    this.nextPage = docsService.getNextPage('elements', 'text');
  }
}
