import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DocsService, DocsPage } from '../../../../services/docs.service';
import { DocsPageNavComponent } from '../../docs-page-nav.component';
import { DocsCodeSampleComponent } from '../../docs-code-sample.component';

@Component({
    selector: 'app-transforms-page',
    standalone: true,
    imports: [CommonModule, RouterModule, DocsPageNavComponent, DocsCodeSampleComponent],
    template: `
        <h1>Transforms</h1>
        <p class="lead">
            Transforms modify an element's position, rotation, scale, and skew without
            changing its underlying geometry. Set via <code>element.setTransform(transform)</code>
            or <code>element.transform = transformString</code>. Transform strings accept a
            single command such as <code>rotate(...)</code>, <code>scale(...)</code>,
            <code>translate(...)</code>, <code>skew(...)</code>, or <code>matrix(...)</code>.
        </p>

        <h2>Supported Transforms</h2>
        <table class="docs-table">
            <thead>
                <tr>
                    <th>Transform</th>
                    <th>Syntax</th>
                    <th>Description</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><code>translate</code></td>
                    <td>translate(tx, ty)</td>
                    <td>Moves element by tx horizontally and ty vertically</td>
                </tr>
                <tr>
                    <td><code>rotate</code></td>
                    <td>rotate(angle) or rotate(angle, cx, cy)</td>
                    <td>Rotates by angle in degrees, optionally around a center point</td>
                </tr>
                <tr>
                    <td><code>scale</code></td>
                    <td>scale(sx, sy)</td>
                    <td>Scales horizontally by sx and vertically by sy</td>
                </tr>
                <tr>
                    <td><code>skew</code></td>
                    <td>skew(ax, ay)</td>
                    <td>Skews along the X and Y axes by the given angles in degrees</td>
                </tr>
                <tr>
                    <td><code>matrix</code></td>
                    <td>matrix(a, b, c, d, e, f)</td>
                    <td>Applies a full 2D transformation matrix</td>
                </tr>
            </tbody>
        </table>

        <h2>Rotation</h2>
        <p>
            Rotate an element by a given angle in degrees. The rotation is applied around
            the element's center.
        </p>
        <app-docs-code-sample [code]="rotateCode" language="javascript" label="JavaScript"></app-docs-code-sample>

        <h2>Scale</h2>
        <p>
            Scale an element uniformly or non-uniformly. Values greater than 1 enlarge,
            values less than 1 shrink.
        </p>
        <app-docs-code-sample [code]="scaleCode" language="javascript" label="JavaScript"></app-docs-code-sample>

        <h2>Skew</h2>
        <p>
            Skew distorts an element along the X or Y axis, creating a slanted appearance.
            Use <code>skew(ax, ay)</code> and set the unused axis to <code>0</code>.
        </p>
        <app-docs-code-sample [code]="skewCode" language="javascript" label="JavaScript"></app-docs-code-sample>

        <h2>Matrix Transform</h2>
        <p>
            Use a matrix transform when you want to combine translation, skew, scale,
            or rotation into a single transform string.
        </p>
        <app-docs-code-sample [code]="matrixCode" language="javascript" label="JavaScript"></app-docs-code-sample>

        <h2>Animated Transform</h2>
        <p>
            Rotation can be animated using property tweens. This sample swings the
            rectangle back and forth by tweening its <code>rotation</code> value.
        </p>
        <app-docs-code-sample [code]="animatedCode" [timerEnabled]="true" language="javascript" label="JavaScript"></app-docs-code-sample>

        <app-docs-page-nav [previousPage]="previousPage" [nextPage]="nextPage"></app-docs-page-nav>
    `
})
export class TransformsPageComponent {
    previousPage?: DocsPage;
    nextPage?: DocsPage;

    rotateCode = `const m = elise.model(200, 200);

// Rotated rectangle
elise.rectangle(50, 50, 100, 100)
    .setFill('SteelBlue')
    .setStroke('Navy,1')
    .setTransform('rotate(30)')
    .addTo(m);`;

    scaleCode = `const m = elise.model(300, 200);

// Original size
elise.rectangle(20, 60, 80, 80)
    .setFill('MediumSeaGreen')
    .setStroke('DarkGreen,1')
    .addTo(m);

// Scaled up 1.5x
elise.rectangle(160, 60, 80, 80)
    .setFill('MediumSeaGreen')
    .setStroke('DarkGreen,1')
    .setTransform('scale(1.5, 1.5)')
    .addTo(m);`;

    skewCode = `const m = elise.model(400, 200);

// SkewX
elise.rectangle(30, 50, 100, 100)
    .setFill('Coral')
    .setStroke('Firebrick,1')
    .setTransform('skew(20, 0)')
    .addTo(m);

// SkewY
elise.rectangle(200, 50, 100, 100)
    .setFill('MediumOrchid')
    .setStroke('Purple,1')
    .setTransform('skew(0, 15)')
    .addTo(m);`;

    matrixCode = `const m = elise.model(300, 200);

// Matrix with translation and skew-like terms
elise.rectangle(80, 40, 100, 80)
    .setFill('CornflowerBlue')
    .setStroke('MidnightBlue,1')
    .setTransform('matrix(1, 0.15, -0.25, 1, 24, 10)')
    .addTo(m);`;

    animatedCode = `const m = elise.model(200, 200);
const rect = elise.rectangle(50, 50, 100, 100)
    .setFill('Gold')
    .setStroke('DarkGoldenrod,1')
    .setRotation(-20)
    .addTo(m);

let rotatingForward = true;

function swing() {
    rect.animate(
        { rotation: rotatingForward ? 20 : -20 },
        {
            duration: 900,
            easing: 'easeInOutSine',
            onComplete: function() {
                rotatingForward = !rotatingForward;
                swing();
            }
        }
    );
}

swing();`;

    constructor(private docsService: DocsService) {
        this.previousPage = docsService.getPreviousPage('styling', 'transforms');
        this.nextPage = docsService.getNextPage('styling', 'transforms');
    }
}
