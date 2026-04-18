import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DocsService, DocsPage } from '../../../../services/docs.service';
import { DocsPageNavComponent } from '../../docs-page-nav.component';
import { CodeBlockComponent } from '../../../code-block/code-block.component';

@Component({
    imports: [CommonModule, RouterModule, DocsPageNavComponent, CodeBlockComponent],
    template: `
        <h1>Text Editing</h1>
        <p class="lead">
            The design surface supports in-place text editing by overlaying an HTML textarea
            directly over a TextElement for inline content entry and modification.
        </p>

        <h2>Entering Text Edit Mode</h2>
        <p>
            Double-click a <code>TextElement</code> to enter text editing mode. An HTML
            <code>&lt;textarea&gt;</code> overlay appears positioned and sized to match the
            element's bounding box. The overlay accepts direct keyboard input, including
            multi-line text via the <kbd>Enter</kbd> key.
        </p>

        <h2>The TextEditService</h2>
        <p>
            The <code>TextEditService</code> manages the editing lifecycle — creating the overlay,
            synchronizing text between the overlay and the element, and cleaning up when editing
            ends. It tracks the currently edited element and ensures only one element can be
            in text editing mode at a time.
        </p>

        <h2>Text Properties During Editing</h2>
        <p>
            Text formatting properties can be changed while the element is being edited.
            Changes are reflected immediately in both the overlay and the underlying element:
        </p>
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
                    <td><code>typeface</code></td>
                    <td><code>string</code></td>
                    <td>Font family name (e.g., 'Arial', 'Times New Roman').</td>
                </tr>
                <tr>
                    <td><code>typesize</code></td>
                    <td><code>number</code></td>
                    <td>Font size in pixels.</td>
                </tr>
                <tr>
                    <td><code>typestyle</code></td>
                    <td><code>string</code></td>
                    <td>Font style — Normal, Bold, Italic, or Bold Italic.</td>
                </tr>
                <tr>
                    <td><code>alignment</code></td>
                    <td><code>string</code></td>
                    <td>Text alignment — Near (left), Center, or Far (right).</td>
                </tr>
            </tbody>
        </table>

        <h2>Exiting Text Edit Mode</h2>
        <p>
            Text editing ends when the user clicks outside the element or presses <kbd>Escape</kbd>.
            The overlay is removed and the element's text content is updated with the final value.
            An undo snapshot is pushed so the text change can be reverted.
        </p>

        <h2>Keyboard Shortcuts</h2>
        <table class="docs-table">
            <thead>
                <tr>
                    <th>Key</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><kbd>Enter</kbd></td>
                    <td>Insert a new line in the text</td>
                </tr>
                <tr>
                    <td><kbd>Escape</kbd></td>
                    <td>Finish editing and commit the text</td>
                </tr>
            </tbody>
        </table>

        <h2>Programmatic Text Editing</h2>
        <app-code-block [code]="editCode" language="javascript" label="JavaScript"></app-code-block>

        <h2>Changing Text Properties</h2>
        <app-code-block [code]="propertiesCode" language="javascript" label="JavaScript"></app-code-block>

        <app-docs-page-nav [previousPage]="previousPage" [nextPage]="nextPage"></app-docs-page-nav>
    `
})
export class TextEditingPageComponent {
    previousPage: DocsPage | undefined;
    nextPage: DocsPage | undefined;

    editCode = `// Create a text element and set its content
var textEl = TextElement.create(50, 50, 200, 40);
textEl.text = 'Hello, World!';
textEl.typeface = 'Arial';
textEl.typesize = 16;
model.add(textEl);

// Double-click on the element in the surface to edit inline
// Or set the text property directly:
textEl.text = 'Updated text content';

// Multi-line text
textEl.text = 'Line one\\nLine two\\nLine three';`;

    propertiesCode = `// Change typeface
textEl.typeface = 'Georgia';

// Change font size
textEl.typesize = 24;

// Change style to bold italic
textEl.typestyle = 'Bold Italic';

// Change alignment
textEl.alignment = 'Center';

// These changes apply immediately whether the element
// is currently being edited or not`;

    constructor(private docsService: DocsService) {
        this.previousPage = docsService.getPreviousPage('design-surface', 'text-editing');
        this.nextPage = docsService.getNextPage('design-surface', 'text-editing');
    }
}
