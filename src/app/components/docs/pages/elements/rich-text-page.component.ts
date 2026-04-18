import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocsService, DocsPage } from '../../../../services/docs.service';
import { DocsPageNavComponent } from '../../docs-page-nav.component';
import { CodeBlockComponent } from '../../../code-block/code-block.component';
import { DocsCodeSampleComponent } from '../../docs-code-sample.component';

@Component({
  selector: 'app-rich-text-page',
  standalone: true,
  imports: [CommonModule, DocsPageNavComponent, CodeBlockComponent, DocsCodeSampleComponent],
  template: `
    <h1>Rich Text</h1>
    <p class="lead">
      Rich text uses one <code>TextElement</code> with multiple styled runs, allowing a single
      layout region to mix typefaces, sizes, emphasis, spacing, and decoration while still
      behaving like one element for alignment, wrapping, transforms, and shadows.
    </p>

    <h2>Factory Pattern</h2>
    <p>
      Start with <code>elise.text()</code>, then apply <code>setRichText(runs)</code> to provide
      the styled runs. Element-level fill, alignment, and shadow still belong on the text element itself.
    </p>
    <app-code-block
      code="elise.text(' ', x, y, width, height).setRichText([{ text: 'Hello', typesize: 24 }])"
      language="javascript"
      label="JavaScript"></app-code-block>

    <h2>Text Run Fields</h2>
    <table class="docs-table">
      <thead>
        <tr>
          <th>Field</th>
          <th>Type</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code>text</code></td>
          <td>string</td>
          <td>Literal text content for the run.</td>
        </tr>
        <tr>
          <td><code>typeface</code></td>
          <td>string</td>
          <td>Overrides the element font family for that run.</td>
        </tr>
        <tr>
          <td><code>typesize</code></td>
          <td>number</td>
          <td>Overrides the element font size for that run.</td>
        </tr>
        <tr>
          <td><code>typestyle</code></td>
          <td>string</td>
          <td>Run-level font style such as <code>Bold</code>, <code>Italic</code>, or <code>Bold,Italic</code>.</td>
        </tr>
        <tr>
          <td><code>letterSpacing</code></td>
          <td>number</td>
          <td>Additional character spacing applied only to that run.</td>
        </tr>
        <tr>
          <td><code>decoration</code></td>
          <td>string</td>
          <td>Run-level decoration such as <code>underline</code> or <code>underline line-through</code>.</td>
        </tr>
      </tbody>
    </table>

    <p>
      Run objects control typography only. Fill, stroke, alignment, line height, opacity, transforms,
      and <code>setShadow(...)</code> remain element-level settings applied to the entire rich text block.
    </p>

    <h2>Examples</h2>

    <h3>Mixed Heading Runs</h3>
    <p>
      This heading mixes three typefaces, multiple sizes, bold emphasis, italics, and an underlined run
      while staying centered inside one bounding box.
    </p>
    <app-docs-code-sample [code]="headingCode" language="javascript" label="JavaScript"></app-docs-code-sample>

    <h3>Editorial Callout With Drop Shadow</h3>
    <p>
      The text runs vary font treatment inside the paragraph, while one soft shadow gives the full text block
      depth against the card background.
    </p>
    <app-docs-code-sample [code]="shadowCode" language="javascript" label="JavaScript"></app-docs-code-sample>

    <h3>Wrapped Notes With Emphasis</h3>
    <p>
      Rich text still wraps as one paragraph, so you can highlight key phrases without breaking the shared layout region.
    </p>
    <app-docs-code-sample [code]="wrappedCode" language="javascript" label="JavaScript"></app-docs-code-sample>

    <app-docs-page-nav [previousPage]="previousPage" [nextPage]="nextPage"></app-docs-page-nav>
  `
})
export class RichTextPageComponent {
  previousPage: DocsPage | undefined;
  nextPage: DocsPage | undefined;

  headingCode = `const m = elise.model(340, 180);
m.setFill('#f3f4f6');

elise.rectangle(18, 20, 304, 136)
  .setCornerRadius(24)
  .setFill('#ffffff')
  .setStroke('#cbd5e1,2')
  .addTo(m);

elise.text(' ', 34, 42, 272, 92)
  .setFill('#0f172a')
  .setAlignment('Center,Middle')
  .setRichText([
    { text: 'Elise ', typeface: 'Coda Caption', typesize: 26 },
    { text: 'Rich', typeface: 'Georgia', typesize: 32, typestyle: 'Bold', decoration: 'underline' },
    { text: ' Text', typeface: 'Trebuchet MS', typesize: 28, typestyle: 'Italic' }
  ])
  .addTo(m);`;

  shadowCode = `const m = elise.model(360, 220);
m.setFill('#e2e8f0');

elise.rectangle(24, 24, 312, 172)
  .setCornerRadius(22)
  .setFill('#fff7ed')
  .setStroke('#fdba74,2')
  .addTo(m);

elise.text(' ', 44, 48, 272, 124)
  .setFill('#7c2d12')
  .setAlignment('Left,Top')
  .setLineHeight(1.3)
  .setShadow({ color: 'rgba(124,45,18,0.24)', blur: 12, offsetX: 6, offsetY: 8 })
  .setRichText([
    { text: 'Launch ', typeface: 'Coda Caption', typesize: 24 },
    { text: 'status', typesize: 24, typestyle: 'Bold', decoration: 'underline' },
    { text: ': all renderers passed layout validation with ', typesize: 18 },
    { text: 'mixed typography', typesize: 20, typestyle: 'Italic' },
    { text: ' and ', typesize: 18 },
    { text: 'spaced labels', typesize: 18, letterSpacing: 1.5 },
    { text: '.', typesize: 18 }
  ])
  .addTo(m);`;

  wrappedCode = `const m = elise.model(360, 240);
m.setFill('#f8fafc');

elise.rectangle(26, 26, 308, 188)
  .setCornerRadius(18)
  .setFill('#ecfeff')
  .setStroke('#67e8f9,2')
  .addTo(m);

elise.text(' ', 44, 48, 272, 144)
  .setFill('#164e63')
  .setAlignment('Left,Top')
  .setLineHeight(1.35)
  .setRichText([
    { text: 'Use one text element for ', typesize: 18 },
    { text: 'headlines', typesize: 22, typestyle: 'Bold' },
    { text: ', ', typesize: 18 },
    { text: 'side notes', typesize: 18, typestyle: 'Italic' },
    { text: ', ', typesize: 18 },
    { text: 'underlined cues', typesize: 18, decoration: 'underline' },
    { text: ', and ', typesize: 18 },
    { text: 'tracking', typesize: 18, letterSpacing: 1.2 },
    { text: ' adjustments without splitting the paragraph into separate elements.', typesize: 18 }
  ])
  .addTo(m);`;

  constructor(private docsService: DocsService) {
    this.previousPage = docsService.getPreviousPage('elements', 'rich-text');
    this.nextPage = docsService.getNextPage('elements', 'rich-text');
  }
}
