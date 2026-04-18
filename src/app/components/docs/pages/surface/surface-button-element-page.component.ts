import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DocsService, DocsPage } from '../../../../services/docs.service';
import { DocsPageNavComponent } from '../../docs-page-nav.component';
import { DocsSurfaceSampleComponent } from '../../docs-surface-sample.component';

@Component({
    imports: [CommonModule, RouterModule, DocsPageNavComponent, DocsSurfaceSampleComponent],
    template: `
        <h1>SurfaceButtonElement</h1>
        <p class="lead">
            SurfaceButtonElement renders multistate buttons by cropping regions from the surface's
            normal, selected, highlighted, and disabled images. Use these elements for image-backed
            buttons, toggles, radio groups, and checkboxes.
        </p>

        <h2>Overview</h2>
        <p>
            Buttons do not draw their own rectangle or label. Instead, they reference a region from
            the surface images and raise a callback when activated. Toggle and radio-button variants
            are created with <code>createCheckbox(...)</code> and <code>createRadioButton(...)</code>.
        </p>

        <h2>Properties</h2>
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
                    <td><code>id</code></td>
                    <td>string</td>
                    <td>Unique identifier for the button element</td>
                </tr>
                <tr>
                    <td><code>left</code></td>
                    <td>number</td>
                    <td>Horizontal position of the button</td>
                </tr>
                <tr>
                    <td><code>top</code></td>
                    <td>number</td>
                    <td>Vertical position of the button</td>
                </tr>
                <tr>
                    <td><code>width</code></td>
                    <td>number</td>
                    <td>Button width in pixels</td>
                </tr>
                <tr>
                    <td><code>height</code></td>
                    <td>number</td>
                    <td>Button height in pixels</td>
                </tr>
                <tr>
                    <td><code>isToggle</code></td>
                    <td>boolean</td>
                    <td>True for checkbox and radio button variants</td>
                </tr>
                <tr>
                    <td><code>isSelected</code></td>
                    <td>boolean</td>
                    <td>Toggle state tracked by checkbox and radio buttons</td>
                </tr>
                <tr>
                    <td><code>groupId</code></td>
                    <td>string</td>
                    <td>Shared radio group identifier for mutually exclusive buttons</td>
                </tr>
                <tr>
                    <td><code>setEnabled()</code></td>
                    <td>function</td>
                    <td>Enables or disables the button and updates the drawn state</td>
                </tr>
                <tr>
                    <td><code>click listener</code></td>
                    <td>function</td>
                    <td>Callback invoked when the user activates the button</td>
                </tr>
            </tbody>
        </table>

        <h2>Image-Backed Buttons</h2>
        <p>
            Standard surface buttons crop their states from the current surface skin.
        </p>
        <app-docs-surface-sample [code]="basicCode" language="javascript" label="JavaScript"></app-docs-surface-sample>

        <h2>Checkbox Toggles</h2>
        <p>
            Toggle buttons keep selection state internally and can update surrounding surface text.
        </p>
        <app-docs-surface-sample [code]="toggleCode" language="javascript" label="JavaScript"></app-docs-surface-sample>

        <app-docs-page-nav [previousPage]="previousPage" [nextPage]="nextPage"></app-docs-page-nav>
    `
})
export class SurfaceButtonElementPageComponent {
    previousPage: DocsPage | undefined;
    nextPage: DocsPage | undefined;

    basicCode = `const surface = new elise.Surface(480, 320);
surface.backgroundColor = 'White';
surface.normalImageSource = ':assets/player/page2/normal.png';
surface.selectedImageSource = ':assets/player/page2/selected.png';
surface.highlightedImageSource = ':assets/player/page2/highlighted.png';
surface.disabledImageSource = ':assets/player/page2/disabled.png';

const title = elise.SurfaceTextElement.create(
    'title',
    286,
    18,
    168,
    28,
    'SurfaceButtonElement',
    () => undefined
).addTo(surface);
title.color = 'Black';
title.typeFace = 'sans-serif';
title.typeSize = 16;
title.textAlignment = 'center,middle';

// These coordinates match the labeled button regions in the page2 skin.
elise.SurfaceButtonElement.create('button-1', 27, 20, 168, 62, () => undefined).addTo(surface);
elise.SurfaceButtonElement.create('button-2', 27, 93, 168, 62, () => undefined).addTo(surface);
elise.SurfaceButtonElement.create('button-3', 27, 164, 168, 62, () => undefined).addTo(surface);

const disabled = elise.SurfaceButtonElement.create('button-4', 27, 235, 168, 62, () => undefined);
disabled.addTo(surface);
disabled.setEnabled(false);

return surface;`;

    toggleCode = `const surface = new elise.Surface(480, 320);
surface.backgroundColor = '#f8fafc';
surface.normalImageSource = ':assets/player/page4/normal.png';
surface.selectedImageSource = ':assets/player/page4/selected.png';
surface.highlightedImageSource = ':assets/player/page4/highlighted.png';
surface.disabledImageSource = ':assets/player/page4/disabled.png';

const summary = elise.SurfaceTextElement.create(
    'summary',
    250,
    8,
    200,
    28,
    'Toggle a data layer',
    () => undefined
).addTo(surface);
summary.color = '#0f172a';
summary.typeFace = 'sans-serif';
summary.typeSize = 15;
summary.textAlignment = 'left,middle';

function setSummary(button, label) {
    const text = label + ': ' + (button && button.isSelected ? 'On' : 'Off');
    summary.content = text;
    if (summary.textElement) {
        summary.textElement.setText(text);
    }
    surface.controller?.draw();
}

const labels = ['Temperature', 'Atmosphere', 'Terrain', 'Water'];
labels.forEach((label, index) => {
    const top = index === 3 ? 238 : 22 + index * 71;
    const checkbox = elise.SurfaceButtonElement.createCheckbox('cb' + (index + 1), 22, top, 220, 56, button => setSummary(button, label));
    checkbox.addTo(surface);

    const text = elise.SurfaceTextElement.create('label-' + index, 250, 58 + index * 61, 180, 24, label, () => undefined).addTo(surface);
    text.color = '#334155';
    text.typeFace = 'sans-serif';
    text.typeSize = 14;
    text.textAlignment = 'left,middle';
});

return surface;`;

    constructor(docsService: DocsService) {
        this.previousPage = docsService.getPreviousPage('surface', 'surface-button-element');
        this.nextPage = docsService.getNextPage('surface', 'surface-button-element');
    }
}
