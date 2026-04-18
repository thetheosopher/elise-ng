import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DocsService, DocsPage } from '../../../../services/docs.service';
import { DocsPageNavComponent } from '../../docs-page-nav.component';
import { DocsSurfaceSampleComponent } from '../../docs-surface-sample.component';

@Component({
    imports: [CommonModule, FormsModule, RouterModule, DocsPageNavComponent, DocsSurfaceSampleComponent],
    template: `
        <h1>Surface Transitions</h1>
        <p class="lead">
            Surface transitions animate the moment when a <code>SurfacePane</code> replaces one
            child surface with another. Use them to control how a screen, panel, or embedded scene
            changes state.
        </p>

        <h2>Overview</h2>
        <p>
            Apply a transition with
            <code>replaceSurface(newChild, callback, transition, duration)</code>. The
            <code>transition</code> argument is a string name, and the duration is measured in
            seconds. In practice, transitions are most useful when the same pane alternates between
            a simple state and a richer media surface.
        </p>

        <h2>Transition Names</h2>
        <table class="docs-table">
            <thead>
                <tr>
                    <th>Group</th>
                    <th>Transition Names</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Basic</td>
                    <td><code>fade</code></td>
                </tr>
                <tr>
                    <td>Push</td>
                    <td><code>pushleft</code>, <code>pushright</code>, <code>pushup</code>, <code>pushdown</code></td>
                </tr>
                <tr>
                    <td>Wipe</td>
                    <td><code>wipeleft</code>, <code>wiperight</code>, <code>wipeup</code>, <code>wipedown</code>, <code>wipeleftup</code>, <code>wipeleftdown</code>, <code>wiperightup</code>, <code>wiperightdown</code>, <code>wipein</code>, <code>wipeout</code>, <code>wipeinx</code>, <code>wipeiny</code>, <code>wipeoutx</code>, <code>wipeouty</code></td>
                </tr>
                <tr>
                    <td>Reveal</td>
                    <td><code>revealleft</code>, <code>revealright</code>, <code>revealup</code>, <code>revealdown</code>, <code>revealleftup</code>, <code>revealleftdown</code>, <code>revealrightup</code>, <code>revealrightdown</code></td>
                </tr>
                <tr>
                    <td>Slide</td>
                    <td><code>slideleft</code>, <code>slideright</code>, <code>slideup</code>, <code>slidedown</code>, <code>slideleftup</code>, <code>slideleftdown</code>, <code>sliderightup</code>, <code>sliderightdown</code></td>
                </tr>
            </tbody>
        </table>

        <h2>Interactive Preview</h2>
        <p>
            Select a transition, then click the large pane area or the bottom button to swap
            between the two child surfaces.
        </p>

        <div class="transition-selector-row">
            <label for="transition-select">Transition</label>
            <select id="transition-select" [(ngModel)]="selectedTransition">
                <option *ngFor="let option of transitionOptions" [ngValue]="option">{{ option }}</option>
            </select>
        </div>

        <app-docs-surface-sample [code]="exampleCode" [scale]="0.75" language="javascript" label="JavaScript"></app-docs-surface-sample>

        <app-docs-page-nav [previousPage]="previousPage" [nextPage]="nextPage"></app-docs-page-nav>
    `,
    styles: [`
        .transition-selector-row {
            display: flex;
            align-items: center;
            gap: 12px;
            margin: 12px 0 16px;
        }

        .transition-selector-row label {
            font-weight: 600;
            color: var(--app-text, #0f172a);
        }

        .transition-selector-row select {
            min-width: 220px;
            padding: 6px 10px;
            border: 1px solid var(--app-border, #cbd5e1);
            border-radius: 6px;
            background: var(--app-surface, #ffffff);
            color: inherit;
        }
    `]
})
export class SurfaceTransitionsPageComponent {
    previousPage: DocsPage | undefined;
    nextPage: DocsPage | undefined;
    selectedTransition = 'fade';

    transitionOptions = [
        'fade',
        'pushleft',
        'pushright',
        'pushup',
        'pushdown',
        'wipeleft',
        'wiperight',
        'wipeup',
        'wipedown',
        'wipeleftup',
        'wipeleftdown',
        'wiperightup',
        'wiperightdown',
        'wipein',
        'wipeout',
        'wipeinx',
        'wipeiny',
        'wipeoutx',
        'wipeouty',
        'revealleft',
        'revealright',
        'revealup',
        'revealdown',
        'revealleftup',
        'revealleftdown',
        'revealrightup',
        'revealrightdown',
        'slideleft',
        'slideright',
        'slideup',
        'slidedown',
        'slideleftup',
        'slideleftdown',
        'sliderightup',
        'sliderightdown'
    ];

    get exampleCode(): string {
        return `const surface = new elise.Surface(640, 480);
surface.backgroundColor = 'White';
surface.normalImageSource = ':assets/player/images/frame2-normal.png';
surface.selectedImageSource = ':assets/player/images/frame2-down.png';

let pane;
let tick = false;
const currentTransition = '${this.selectedTransition}';

function multiElementSurface1() {
    const paneSurface = new elise.Surface(480, 360);
    paneSurface.backgroundColor = '#f2f2f2';

    const video = elise.SurfaceVideoLayer.create('v1', 0, 0, 480, 360, 'assets/player/video/water.mp4').addTo(paneSurface);
    video.autoPlay = true;
    video.loop = true;
    video.nativeControls = false;

    elise.SurfaceImageLayer.create('img1', 260, 10, 200, 200, 'assets/player/images/test/animated-spiral.gif', null).addTo(paneSurface);
    elise.SurfaceHtmlLayer.create('h2', 0, 0, 480, 360, 'assets/player/html/html2/default.htm').addTo(paneSurface);
    return paneSurface;
}

function simpleSurface1(backgroundColor, foregroundColor) {
    const paneSurface = new elise.Surface(480, 360);
    paneSurface.backgroundColor = backgroundColor;

    const text = elise.SurfaceTextElement.create('t1', 0, 0, 480, 360, 'Click Me', () => swapSurface()).addTo(paneSurface);
    text.textAlignment = 'center,middle';
    text.typeSize = 48;
    text.color = foregroundColor;
    return paneSurface;
}

const status = elise.SurfaceTextElement.create('status', 81, 16, 480, 18, 'Selected transition: ' + currentTransition, () => undefined).addTo(surface);
status.color = '#111827';
status.typeFace = 'sans-serif';
status.typeSize = 12;
status.textAlignment = 'center,middle';

function swapSurface() {
    let nextSurface;
    if (tick) {
        tick = false;
        nextSurface = simpleSurface1('Green', 'Black');
    }
    else {
        tick = true;
        nextSurface = multiElementSurface1();
    }

    pane.replaceSurface(nextSurface, () => undefined, currentTransition, 1.5);
}

elise.SurfaceButtonElement.create('b1', 250, 423, 158, 46, () => swapSurface()).addTo(surface);
pane = elise.SurfacePane.create('p1', 81, 41, 480, 360, simpleSurface1('Green', 'Black')).addTo(surface);

return surface;`;
    }

    constructor(docsService: DocsService) {
        this.previousPage = docsService.getPreviousPage('surface', 'surface-transitions');
        this.nextPage = docsService.getNextPage('surface', 'surface-transitions');
    }
}
