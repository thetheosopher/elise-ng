import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DocsService, DocsPage } from '../../../../services/docs.service';
import { DocsPageNavComponent } from '../../docs-page-nav.component';
import { CodeBlockComponent } from '../../../code-block/code-block.component';

@Component({
    imports: [CommonModule, RouterModule, DocsPageNavComponent, CodeBlockComponent],
    template: `
        <h1>Clipboard Operations</h1>
        <p class="lead">
            The design surface provides cut, copy, and paste operations for selected elements
            using an internal clipboard based on serialized element data.
        </p>

        <h2>How It Works</h2>
        <p>
            <strong>Copy</strong> serializes the selected element data and stores it in the internal
            clipboard. <strong>Cut</strong> copies the selected elements to the clipboard and then
            removes them from the model. <strong>Paste</strong> deserializes the clipboard data and
            inserts new elements into the model at a small offset from the original position to
            avoid exact overlap.
        </p>

        <h2>Multi-Element Support</h2>
        <p>
            All clipboard operations support multiple selected elements. When multiple elements
            are copied, all of them are serialized together and pasted as a group, preserving
            their relative positions.
        </p>

        <h2>Keyboard Shortcuts</h2>
        <table class="docs-table">
            <thead>
                <tr>
                    <th>Shortcut</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><kbd>Ctrl+C</kbd></td>
                    <td>Copy selected elements to clipboard</td>
                </tr>
                <tr>
                    <td><kbd>Ctrl+X</kbd></td>
                    <td>Cut selected elements (copy + delete)</td>
                </tr>
                <tr>
                    <td><kbd>Ctrl+V</kbd></td>
                    <td>Paste elements from clipboard</td>
                </tr>
            </tbody>
        </table>

        <h2>API</h2>
        <table class="docs-table">
            <thead>
                <tr>
                    <th>Member</th>
                    <th>Type</th>
                    <th>Description</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><code>copy()</code></td>
                    <td>method</td>
                    <td>Copies the currently selected elements to the internal clipboard.</td>
                </tr>
                <tr>
                    <td><code>cut()</code></td>
                    <td>method</td>
                    <td>Copies the selected elements to the clipboard and removes them from the model.</td>
                </tr>
                <tr>
                    <td><code>paste()</code></td>
                    <td>method</td>
                    <td>Inserts elements from the clipboard into the model at an offset from the original position.</td>
                </tr>
                <tr>
                    <td><code>canPaste</code></td>
                    <td><code>boolean</code></td>
                    <td>True if the clipboard contains element data that can be pasted.</td>
                </tr>
            </tbody>
        </table>

        <h2>Copy, Cut, and Paste</h2>
        <app-code-block [code]="operationsCode" language="javascript" label="JavaScript"></app-code-block>

        <h2>Duplicate Element Pattern</h2>
        <app-code-block [code]="duplicateCode" language="javascript" label="JavaScript"></app-code-block>

        <app-docs-page-nav [previousPage]="previousPage" [nextPage]="nextPage"></app-docs-page-nav>
    `
})
export class ClipboardPageComponent {
    previousPage: DocsPage | undefined;
    nextPage: DocsPage | undefined;

    operationsCode = `// Copy selected elements
controller.selectElement(rect);
controller.copy();

// Paste creates a duplicate at a small offset
controller.paste();
console.log('Pasted. Can paste again:', controller.canPaste);

// Cut removes the selected elements after copying
controller.selectElement(ellipse);
controller.cut();
// ellipse is now removed from the model

// Paste the cut element back
if (controller.canPaste) {
    controller.paste();
}`;

    duplicateCode = `// Duplicate pattern: copy + immediate paste
controller.selectElement(element);
controller.copy();
controller.paste();

// The pasted element is offset from the original
// and becomes the new selection
console.log('Duplicated element at offset position');

// Duplicate multiple elements at once
controller.selectAll();
controller.copy();
controller.paste();`;

    constructor(private docsService: DocsService) {
        this.previousPage = docsService.getPreviousPage('design-surface', 'clipboard');
        this.nextPage = docsService.getNextPage('design-surface', 'clipboard');
    }
}
