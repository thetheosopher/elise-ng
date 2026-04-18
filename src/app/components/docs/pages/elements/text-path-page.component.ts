import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocsService, DocsPage } from '../../../../services/docs.service';
import { DocsPageNavComponent } from '../../docs-page-nav.component';
import { CodeBlockComponent } from '../../../code-block/code-block.component';
import { DocsCodeSampleComponent } from '../../docs-code-sample.component';

@Component({
  selector: 'app-text-path-page',
  standalone: true,
  imports: [CommonModule, DocsPageNavComponent, CodeBlockComponent, DocsCodeSampleComponent],
  template: `
    <h1>Text Path</h1>
    <p class="lead">
      The text path element renders text positioned and rotated along a guide path defined by
      SVG path commands, supporting the same typography controls as the standard text element.
    </p>

    <h2>Factory Method</h2>
    <p>
      Create a text path element using the <code>elise.textPath()</code> factory method.
    </p>
    <app-code-block code="elise.textPath(text, pathData)" language="javascript" label="JavaScript"></app-code-block>

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
          <td>Text content to display along the path</td>
        </tr>
        <tr>
          <td><code>pathCommands</code></td>
          <td>string</td>
          <td></td>
          <td>SVG path data defining the guide curve</td>
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
          <td>Text positioning along the path: 'left', 'center', or 'right'</td>
        </tr>
        <tr>
          <td><code>startOffset</code></td>
          <td>number</td>
          <td>0</td>
          <td>Distance along the path where text begins</td>
        </tr>
        <tr>
          <td><code>startOffsetPercent</code></td>
          <td>boolean</td>
          <td>false</td>
          <td>When true, startOffset is treated as a percentage of the path length</td>
        </tr>
        <tr>
          <td><code>showPath</code></td>
          <td>boolean</td>
          <td>false</td>
          <td>Render the guide path itself as a visible stroke</td>
        </tr>
        <tr>
          <td><code>side</code></td>
          <td>'left' | 'right'</td>
          <td>'left'</td>
          <td>Which side of the path to place the text</td>
        </tr>
        <tr>
          <td><code>letterSpacing</code></td>
          <td>number</td>
          <td>0</td>
          <td>Additional spacing between characters</td>
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
      Fill sets the text color. Stroke defines an outline effect on the text glyphs. Both are optional.
      When <code>showPath</code> is enabled, the path stroke is drawn using the element stroke settings.
    </p>

    <h2>Examples</h2>

    <h3>Curved Text</h3>
    <p>Text rendered along a cubic Bezier curve.</p>
    <app-docs-code-sample [code]="curvedCode" language="javascript" label="JavaScript"></app-docs-code-sample>

    <h3>Arc Text</h3>
    <p>Text following a circular arc with center alignment.</p>
    <app-docs-code-sample [code]="arcCode" language="javascript" label="JavaScript"></app-docs-code-sample>

    <h3>Offset and Side</h3>
    <p>Text offset along the path and rendered on the opposite side.</p>
    <app-docs-code-sample [code]="offsetCode" language="javascript" label="JavaScript"></app-docs-code-sample>

    <h3>Text Path with Rich Text Runs</h3>
    <p>Mixed typography along a path using rich text runs.</p>
    <app-docs-code-sample [code]="richCode" language="javascript" label="JavaScript"></app-docs-code-sample>

    <app-docs-page-nav [previousPage]="previousPage" [nextPage]="nextPage"></app-docs-page-nav>
  `
})
export class TextPathPageComponent {
  previousPage: DocsPage | undefined;
  nextPage: DocsPage | undefined;

  curvedCode = "const m = elise.model(300, 200);\nelise.textPath('Hello, Curved World!', 'M 20 150 C 20 30, 280 30, 280 150')\n  .setTypeface('Coda Caption')\n  .setTypesize(20)\n  .setFill('#1e40af')\n  .setShowPath(true)\n  .addTo(m);";

  arcCode = "const m = elise.model(300, 200);\nelise.textPath('Arc Text Path', 'M 30 160 A 120 120 0 0 1 270 160')\n  .setTypeface('Georgia')\n  .setTypesize(22)\n  .setFill('#059669')\n  .setAlignment('center')\n  .setShowPath(true)\n  .addTo(m);";

  offsetCode = "const m = elise.model(300, 200);\nelise.textPath('Offset Right Side', 'M 20 100 C 70 20, 230 20, 280 100')\n  .setTypeface('sans-serif')\n  .setTypesize(18)\n  .setFill('#9333ea')\n  .setStartOffset(20)\n  .setSide('right')\n  .setShowPath(true)\n  .addTo(m);";

  richCode = "const m = elise.model(400, 200);\nconst tp = elise.textPath(' ', 'M 20 160 C 20 30, 380 30, 380 160');\ntp.fill = '#1f2937';\ntp.setShowPath(true);\ntp.setRichText([\n  { text: 'Bold ', typeface: 'Coda Caption', typesize: 22, typestyle: 'Bold' },\n  { text: 'and ', typesize: 18 },\n  { text: 'Italic', typeface: 'Georgia', typesize: 22, typestyle: 'Italic' },\n  { text: ' along a curve', typesize: 18 }\n]);\nm.add(tp);";

  constructor(private docsService: DocsService) {
    this.previousPage = docsService.getPreviousPage('elements', 'text-path');
    this.nextPage = docsService.getNextPage('elements', 'text-path');
  }
}
