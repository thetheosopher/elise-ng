import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DocsService, DocsPage } from '../../../../services/docs.service';
import { DocsPageNavComponent } from '../../docs-page-nav.component';
import { DocsCodeSampleComponent } from '../../docs-code-sample.component';

@Component({
    selector: 'app-text-resources-page',
    standalone: true,
    imports: [CommonModule, RouterModule, DocsPageNavComponent, DocsCodeSampleComponent],
    template: `
        <h1>Text Resources</h1>
        <p class="lead">
            Text resources store text content as named assets that TextElement can reference. They are
            useful for localization, dynamic content, and separating text data from model structure.
        </p>

        <h2>Serialized Format</h2>
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
                    <td>key</td>
                    <td>string</td>
                    <td>Unique identifier for the text resource</td>
                </tr>
                <tr>
                    <td>type</td>
                    <td>string</td>
                    <td>Always <code>'text'</code> for text resources</td>
                </tr>
                <tr>
                    <td>text</td>
                    <td>string</td>
                    <td>Embedded text content stored directly on the resource</td>
                </tr>
                <tr>
                    <td>uri</td>
                    <td>string</td>
                    <td>Optional text file path used for deferred loading</td>
                </tr>
                <tr>
                    <td>locale</td>
                    <td>string</td>
                    <td>Optional locale tag such as <code>en-US</code> or <code>es</code></td>
                </tr>
            </tbody>
        </table>

        <h2>Embedded Text Resource</h2>
        <p>
            Register inline text with <code>embeddedTextResource()</code> and bind it to
            TextElement using the returned resource object or <code>setSource()</code>.
        </p>
        <app-docs-code-sample [code]="basicCode" language="javascript" label="JavaScript"></app-docs-code-sample>

        <h2>URI-Based Text Resource</h2>
        <p>
            Use <code>uriTextResource()</code> when text should be loaded from a file instead of being
            embedded directly in the model source. The text element still needs a resource source,
            not the raw key string passed as literal content.
        </p>
        <app-docs-code-sample [code]="uriCode" language="javascript" label="JavaScript"></app-docs-code-sample>

        <h2>Localized Text Resources</h2>
        <p>
            Register multiple resources with the same key and different locale tags. The resource manager
            selects the best match for the requested locale and falls back to a generic entry when needed.
        </p>
        <app-docs-code-sample [code]="localizedCode" language="javascript" label="JavaScript" [resourceLocale]="'es-ES'"></app-docs-code-sample>

        <app-docs-page-nav [previousPage]="previousPage" [nextPage]="nextPage"></app-docs-page-nav>
    `
})
export class TextResourcesPageComponent {
    previousPage?: DocsPage;
    nextPage?: DocsPage;

    basicCode = `const m = elise.model(320, 220);

// Register embedded text resources
const title = elise.embeddedTextResource('title', 'Welcome to Elise').addTo(m);
const subtitle = elise.embeddedTextResource('subtitle', 'Reusable text content for labels and UI copy.').addTo(m);

elise.text(title, 24, 26, 272, 42)
    .setFill('#1e293b')
    .setTypesize(28)
    .setTypeface('Segoe UI')
    .setAlignment('center,middle')
    .addTo(m);

elise.text(subtitle, 34, 86, 252, 76)
    .setFill('#64748b')
    .setTypesize(16)
    .setTypeface('Segoe UI')
    .setAlignment('center,middle')
    .addTo(m);

elise.text(' ', 92, 170, 136, 28)
    .setSource('title')
    .setFill('#2563eb')
    .setTypesize(14)
    .setTypeface('Segoe UI')
    .setAlignment('center,middle')
    .addTo(m);`;

    uriCode = `const m = elise.model(320, 220);

// Register text loaded from files
const baseCopy = elise.uriTextResource('baseCopy', '/assets/test/text/testbase.txt').addTo(m);
elise.uriTextResource('serverCopy', ':./assets/test/text/testserver.txt').addTo(m);

elise.rectangle(20, 24, 130, 160)
    .setFill('#f8fafc')
    .setStroke('#cbd5e1,1')
    .addTo(m);

elise.rectangle(170, 24, 130, 160)
    .setFill('#f8fafc')
    .setStroke('#cbd5e1,1')
    .addTo(m);

elise.text(baseCopy, 30, 36, 110, 136)
    .setFill('#0f172a')
    .setTypesize(14)
    .setTypeface('Segoe UI')
    .addTo(m);

elise.text(' ', 180, 36, 110, 136)
    .setSource('serverCopy')
    .setFill('#0f172a')
    .setTypesize(14)
    .setTypeface('Segoe UI')
    .addTo(m);

elise.text('File-backed resources', 60, 190, 200, 20)
    .setFill('#475569')
    .setTypesize(13)
    .setTypeface('Segoe UI')
    .addTo(m);`;

    localizedCode = `const m = elise.model(320, 220);

// Generic fallback plus locale-specific variants
elise.embeddedTextResource('headline', 'The sky is bright today.').addTo(m);
elise.embeddedTextResource('headline', 'The sky is blue.', 'en').addTo(m);
elise.embeddedTextResource('headline', 'El cielo es azul.', 'es').addTo(m);

const caption = elise.embeddedTextResource('caption', 'Requested locale: es-ES').addTo(m);

elise.rectangle(20, 20, 280, 180)
    .setFill('#fefce8')
    .setStroke('#f59e0b,1')
    .addTo(m);

elise.text(' ', 36, 52, 248, 72)
    .setSource('headline')
    .setFill('#111827')
    .setTypesize(24)
    .setTypeface('Segoe UI')
    .setAlignment('center,middle')
    .addTo(m);

elise.text(caption, 36, 142, 248, 24)
    .setFill('#92400e')
    .setTypesize(14)
    .setTypeface('Segoe UI')
    .setAlignment('center,middle')
    .addTo(m);`;

    constructor(docsService: DocsService) {
        this.previousPage = docsService.getPreviousPage('resources', 'text-resources');
        this.nextPage = docsService.getNextPage('resources', 'text-resources');
    }
}
