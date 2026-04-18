import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DocsService, DocsPage } from '../../../../services/docs.service';
import { DocsPageNavComponent } from '../../docs-page-nav.component';
import { DocsSurfaceSampleComponent } from '../../docs-surface-sample.component';

@Component({
    imports: [CommonModule, RouterModule, DocsPageNavComponent, DocsSurfaceSampleComponent],
    template: `
        <h1>Commands &amp; Navigation</h1>
        <p class="lead">
            The current surface authoring model is callback-based. Click listeners on surface
            elements call your own functions, and navigation is typically handled by replacing the
            child surface of a <code>SurfacePane</code> with an optional transition.
        </p>

        <h2>Recommended Pattern</h2>
        <p>
            Lower-level internals still use command handlers inside specific surface implementations,
            but application-facing surface docs should use explicit callbacks. This keeps navigation
            logic local, typed, and easier to reason about than string command dispatch.
        </p>

        <h2>Core Building Blocks</h2>
        <table class="docs-table">
            <thead>
                <tr>
                    <th>Pattern</th>
                    <th>Description</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><code>SurfaceTextElement.create(..., click)</code></td>
                    <td>Attach a direct callback to a text chip or label</td>
                </tr>
                <tr>
                    <td><code>SurfaceButtonElement.create(..., click)</code></td>
                    <td>Use image-backed buttons or toggles as navigation triggers</td>
                </tr>
                <tr>
                    <td><code>SurfaceRadioStrip.create(..., itemSelected)</code></td>
                    <td>Map a strip selection directly to a pane replacement or view change</td>
                </tr>
                <tr>
                    <td><code>pane.replaceSurface(next, callback, transition, duration)</code></td>
                    <td>Swap the currently displayed child surface with an optional transition</td>
                </tr>
                <tr>
                    <td>State in closures</td>
                    <td>Keep current pane, selected item, and status text in regular variables</td>
                </tr>
            </tbody>
        </table>

        <h2>Button-Driven Pane Navigation</h2>
        <p>
            This sample uses clickable text chips to replace a child pane that displays local
            image-backed content screens.
        </p>
        <app-docs-surface-sample [code]="navigateCode" language="javascript" label="JavaScript"></app-docs-surface-sample>

        <h2>Radio Strip Navigation</h2>
        <p>
            Radio strips work well as structured navigation controls. Here the selected item drives
            the content shown in the pane above it, with each section using local repo assets.
        </p>
        <app-docs-surface-sample [code]="radioCode" language="javascript" label="JavaScript"></app-docs-surface-sample>

        <app-docs-page-nav [previousPage]="previousPage" [nextPage]="nextPage"></app-docs-page-nav>
    `
})
export class SurfaceCommandsPageComponent {
    previousPage: DocsPage | undefined;
    nextPage: DocsPage | undefined;

    navigateCode = `const surface = new elise.Surface(380, 252);
surface.backgroundColor = '#0f172a';

function makePane(title, subtitle, source) {
    const child = new elise.Surface(320, 144);
    child.normalImageSource = source;

    const titleText = elise.SurfaceTextElement.create('title-' + title, 44, 18, 232, 28, title, () => undefined).addTo(child);
    titleText.color = 'White';
    titleText.typeFace = 'sans-serif';
    titleText.typeSize = 18;
    titleText.textAlignment = 'center,middle';
    titleText.background = 'rgba(15,23,42,0.72)';
    titleText.padding = 6;

    const subtitleText = elise.SurfaceTextElement.create('subtitle-' + title, 36, 102, 248, 22, subtitle, () => undefined).addTo(child);
    subtitleText.color = '#e2e8f0';
    subtitleText.typeFace = 'sans-serif';
    subtitleText.typeSize = 11;
    subtitleText.textAlignment = 'center,middle';
    subtitleText.background = 'rgba(15,23,42,0.64)';
    subtitleText.padding = 4;

    return child;
}

function paneFor(target) {
    switch (target) {
        case 'detail':
            return makePane('Detail Screen', 'Focused destination detail content', '/assets/examples/surface/destinations/rocky-coast.jpg');
        case 'reel':
            return makePane('Spotlight Reel', 'A reel entry point using local gallery art', '/assets/examples/surface/nasa/earthrise.jpg');
        case 'home':
        default:
            return makePane('Destination Home', 'Landing screen with a local hero image', '/assets/examples/surface/destinations/tropical.jpg');
    }
}

const pane = elise.SurfacePane.create('nav-pane', 30, 18, 320, 144, paneFor('home')).addTo(surface);

const status = elise.SurfaceTextElement.create('status', 30, 170, 320, 18, 'Transition: fade', () => undefined).addTo(surface);
status.color = '#cbd5e1';
status.typeFace = 'sans-serif';
status.typeSize = 11;
status.textAlignment = 'center,middle';

function go(target, transition) {
    pane.replaceSurface(paneFor(target), () => undefined, transition, 0.65);
    const text = 'Transition: ' + transition;
    status.content = text;
    if (status.textElement) {
        status.textElement.setText(text);
    }
    surface.controller?.draw();
}

const actions = [
    ['home', 30, 'Home', 'fade'],
    ['detail', 146, 'Detail', 'slideLeft'],
    ['reel', 262, 'Reel', 'revealRight']
];

actions.forEach(([target, left, label, transition]) => {
    const chip = elise.SurfaceTextElement.create('chip-' + target, left, 206, 88, 24, label, () => go(target, transition)).addTo(surface);
    chip.color = 'White';
    chip.typeFace = 'sans-serif';
    chip.typeSize = 12;
    chip.textAlignment = 'center,middle';
    chip.background = '#2563eb';
    chip.padding = 4;
});

return surface;`;

    radioCode = `const surface = new elise.Surface(480, 320);
surface.backgroundColor = '#0f172a';
surface.normalImageSource = ':assets/player/page11/normal.png';
surface.selectedImageSource = ':assets/player/page11/selected.png';
surface.highlightedImageSource = ':assets/player/page11/highlighted.png';

function makePane(title, subtitle, source) {
    const child = new elise.Surface(440, 184);
    child.normalImageSource = source;

    const heading = elise.SurfaceTextElement.create('heading-' + title, 110, 26, 220, 28, title, () => undefined).addTo(child);
    heading.color = 'White';
    heading.typeFace = 'sans-serif';
    heading.typeSize = 20;
    heading.textAlignment = 'center,middle';
    heading.background = 'rgba(15,23,42,0.72)';
    heading.padding = 6;

    const caption = elise.SurfaceTextElement.create('caption-' + title, 88, 138, 264, 22, subtitle, () => undefined).addTo(child);
    caption.color = '#e2e8f0';
    caption.typeFace = 'sans-serif';
    caption.typeSize = 12;
    caption.textAlignment = 'center,middle';
    caption.background = 'rgba(15,23,42,0.64)';
    caption.padding = 4;

    return child;
}

function sectionFor(item) {
    switch (item) {
        case 'gallery':
            return makePane('Gallery', 'Browse imagery from the local surface examples', '/assets/examples/surface/cars/showroom.jpg');
        case 'specs':
            return makePane('Specs', 'Supporting technical content with local NASA art', '/assets/examples/surface/nasa/earth-view.jpg');
        case 'overview':
        default:
            return makePane('Overview', 'Destination overview content', '/assets/examples/surface/destinations/hidden-cove.jpg');
    }
}

const pane = elise.SurfacePane.create('content-pane', 20, 20, 440, 184, sectionFor('overview')).addTo(surface);

const strip = elise.SurfaceRadioStrip.create(
    'nav-strip',
    34,
    249,
    411,
    34,
    34,
    249,
    101,
    34,
    args => {
        const item = args?.item?.id || 'overview';
        pane.replaceSurface(sectionFor(item), () => undefined, 'fade', 0.55);
    }
).addTo(surface);
strip.normalColor = 'Black';
strip.selectedColor = 'White';
strip.highlightedColor = '#f8fafc';
strip.typeFace = 'sans-serif';
strip.typeSize = 14;
strip.addItem('overview', 'Overview');
strip.addItem('gallery', 'Gallery');
strip.addItem('specs', 'Specs');
strip.selectItem('overview', true);

return surface;`;

    constructor(docsService: DocsService) {
        this.previousPage = docsService.getPreviousPage('surface', 'surface-commands');
        this.nextPage = docsService.getNextPage('surface', 'surface-commands');
    }
}
