import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DocsService, DocsPage } from '../../../../services/docs.service';
import { DocsPageNavComponent } from '../../docs-page-nav.component';
import { DocsSurfaceSampleComponent } from '../../docs-surface-sample.component';

@Component({
    imports: [CommonModule, RouterModule, DocsPageNavComponent, DocsSurfaceSampleComponent],
    template: `
        <h1>Surface Overview</h1>
        <p class="lead">
            A Surface is a multi-pane, interactive presentation layer built on top of Elise models.
            It provides a layered system with navigation, buttons, text overlays, and transitions
            between panes.
        </p>

        <h2>What Is a Surface?</h2>
        <p>
            A Surface consists of layers (panes) that can be navigated between using transitions.
            Each layer displays content — an animated Elise model, a static image, HTML content, or
            video — and surface elements such as buttons, text overlays, and radio strips are
            positioned on top. The <code>SurfaceController</code> manages the surface lifecycle,
            transitions, and element interaction.
        </p>

        <h2>Architecture</h2>
        <table class="docs-table">
            <thead>
                <tr>
                    <th>Component</th>
                    <th>Role</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><code>Surface</code></td>
                    <td>Root container defining size, layers, elements, and resources</td>
                </tr>
                <tr>
                    <td><code>SurfaceController</code></td>
                    <td>Manages lifecycle, transitions, input, and rendering</td>
                </tr>
                <tr>
                    <td>Layers (Panes)</td>
                    <td>Content panes — animation, image, HTML, video, or hidden</td>
                </tr>
                <tr>
                    <td>Surface Elements</td>
                    <td>Overlay controls — text, buttons, radio strips</td>
                </tr>
                <tr>
                    <td>Transitions</td>
                    <td>Animated navigation between layers</td>
                </tr>
            </tbody>
        </table>

        <h2>Layer Types</h2>
        <table class="docs-table">
            <thead>
                <tr>
                    <th>Layer Type</th>
                    <th>Description</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><a routerLink="/docs/surface/surface-animation-layer">SurfaceAnimationLayer</a></td>
                    <td>Renders a full Elise model with timer-driven animation</td>
                </tr>
                <tr>
                    <td><a routerLink="/docs/surface/surface-image-layer">SurfaceImageLayer</a></td>
                    <td>Displays a static or dynamic image</td>
                </tr>
                <tr>
                    <td><a routerLink="/docs/surface/surface-html-layer">SurfaceHtmlLayer</a></td>
                    <td>Embeds HTML content or an external URL</td>
                </tr>
                <tr>
                    <td><a routerLink="/docs/surface/surface-video-layer">SurfaceVideoLayer</a></td>
                    <td>Plays video content with optional controls</td>
                </tr>
                <tr>
                    <td>SurfaceHiddenLayer</td>
                    <td>Logic-only layer with no visible content</td>
                </tr>
            </tbody>
        </table>

        <h2>Surface Elements</h2>
        <p>
            Surface elements are overlaid controls positioned on top of layers. They provide
            interactive UI for navigation and user input.
        </p>
        <table class="docs-table">
            <thead>
                <tr>
                    <th>Element Type</th>
                    <th>Description</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><a routerLink="/docs/surface/surface-elements">SurfaceTextElement</a></td>
                    <td>Styled text label overlay</td>
                </tr>
                <tr>
                    <td><a routerLink="/docs/surface/surface-elements">SurfaceButtonElement</a></td>
                    <td>Clickable button with command binding</td>
                </tr>
                <tr>
                    <td><a routerLink="/docs/surface/surface-elements">SurfaceRadioStrip</a></td>
                    <td>Radio button selector strip</td>
                </tr>
            </tbody>
        </table>

        <h2>Angular Integration</h2>
        <p>
            The <code>&lt;app-elise-surface&gt;</code> component renders a surface in an Angular
            application. Pass a <code>Surface</code> instance to the <code>[surface]</code> input
            and the component handles controller creation, rendering, and cleanup.
        </p>

        <h2>Working Surface Example</h2>
        <p>
            This example creates a real surface with a background image layer, text overlays,
            and a nested detail pane rendered as a child surface.
        </p>
        <app-docs-surface-sample [code]="basicCode" language="javascript" label="JavaScript"></app-docs-surface-sample>

        <app-docs-page-nav [previousPage]="previousPage" [nextPage]="nextPage"></app-docs-page-nav>
    `
})
export class SurfaceOverviewPageComponent {
    previousPage: DocsPage | undefined;
    nextPage: DocsPage | undefined;

    basicCode = `const surface = new elise.Surface(320, 220);
surface.backgroundColor = '#0f172a';

// Full-surface background image layer
elise.SurfaceImageLayer.create(
    'hero',
    0,
    0,
    320,
    220,
    '/assets/test/images/clouds.jpg',
    () => undefined
).addTo(surface);

// Overlay title and summary text
const title = elise.SurfaceTextElement.create(
    'title',
    18,
    18,
    284,
    32,
    'Surface Overview',
    () => undefined
).addTo(surface);
title.color = 'White';
title.typeFace = 'sans-serif';
title.typeSize = 22;
title.textAlignment = 'center,middle';
title.background = 'rgba(15,23,42,0.62)';
title.padding = 6;

const summary = elise.SurfaceTextElement.create(
    'summary',
    28,
    56,
    264,
    38,
    'Layers host media. Surface elements float above them.',
    () => undefined
).addTo(surface);
summary.color = '#e2e8f0';
summary.typeFace = 'sans-serif';
summary.typeSize = 12;
summary.textAlignment = 'center,middle';
summary.background = 'rgba(15,23,42,0.52)';
summary.padding = 6;

// Child surface hosted inside a pane
const detail = new elise.Surface(118, 72);
detail.backgroundColor = '#ecfeff';

const paneTitle = elise.SurfaceTextElement.create(
    'pane-title',
    10,
    10,
    98,
    18,
    'Detail Pane',
    () => undefined
).addTo(detail);
paneTitle.color = '#0f172a';
paneTitle.typeFace = 'sans-serif';
paneTitle.typeSize = 13;
paneTitle.textAlignment = 'center,middle';
paneTitle.background = 'rgba(255,255,255,0.72)';

const paneCopy = elise.SurfaceTextElement.create(
    'pane-copy',
    10,
    34,
    98,
    24,
    'A pane can host another full surface.',
    () => undefined
).addTo(detail);
paneCopy.color = '#334155';
paneCopy.typeFace = 'sans-serif';
paneCopy.typeSize = 10;
paneCopy.textAlignment = 'center,middle';

elise.SurfacePane.create('detail-pane', 176, 122, 118, 72, detail).addTo(surface);

const footer = elise.SurfaceTextElement.create(
    'footer',
    22,
    178,
    120,
    24,
    'Image Layer',
    () => undefined
).addTo(surface);
footer.color = 'White';
footer.typeFace = 'sans-serif';
footer.typeSize = 12;
footer.textAlignment = 'center,middle';
footer.background = 'rgba(30,41,59,0.72)';
footer.border = '#93c5fd,1';

return surface;`;

    constructor(docsService: DocsService) {
        this.previousPage = docsService.getPreviousPage('surface', 'surface-overview');
        this.nextPage = docsService.getNextPage('surface', 'surface-overview');
    }
}
