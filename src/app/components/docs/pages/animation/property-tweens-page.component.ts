import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DocsService, DocsPage } from '../../../../services/docs.service';
import { DocsPageNavComponent } from '../../docs-page-nav.component';
import { DocsCodeSampleComponent } from '../../docs-code-sample.component';

@Component({
    imports: [CommonModule, RouterModule, DocsPageNavComponent, DocsCodeSampleComponent],
    template: `
        <h1>Property Tweens</h1>
        <p class="lead">
            Property tweens smoothly interpolate element properties from their current values to target values over a
            specified duration, with optional easing, delay, and completion callbacks.
        </p>

        <h2>How Tweens Work</h2>
        <p>
            Use <code>ElementTween</code> or the element command handler's tween support to define target property
            values. The animation engine interpolates from the element's current property values to the specified
            targets over the given duration. The controller's animation loop drives the interpolation each frame.
        </p>

        <h2>Animatable Properties</h2>
        <table class="docs-table">
            <thead>
                <tr>
                    <th>Property</th>
                    <th>Type</th>
                    <th>Description</th>
                </tr>
            </thead>
            <tbody>
                <tr><td><code>x</code></td><td>number</td><td>Horizontal position</td></tr>
                <tr><td><code>y</code></td><td>number</td><td>Vertical position</td></tr>
                <tr><td><code>width</code></td><td>number</td><td>Element width</td></tr>
                <tr><td><code>height</code></td><td>number</td><td>Element height</td></tr>
                <tr><td><code>opacity</code></td><td>number</td><td>Element opacity (0–1)</td></tr>
                <tr><td><code>fill</code></td><td>string</td><td>Fill color (solid colors interpolated)</td></tr>
                <tr><td><code>stroke</code></td><td>string</td><td>Stroke color</td></tr>
                <tr><td><code>rotation</code></td><td>number</td><td>Rotation angle in degrees</td></tr>
                <tr><td><code>fillScale</code></td><td>number</td><td>Pattern and resource fill scale</td></tr>
                <tr>
                    <td><code>custom numeric</code></td>
                    <td>number</td>
                    <td>Any numeric property accessible on the element</td>
                </tr>
            </tbody>
        </table>

        <h2>Tween Options</h2>
        <table class="docs-table">
            <thead>
                <tr>
                    <th>Option</th>
                    <th>Type</th>
                    <th>Default</th>
                    <th>Description</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><code>duration</code></td>
                    <td>number</td>
                    <td>300</td>
                    <td>Animation duration in milliseconds</td>
                </tr>
                <tr>
                    <td><code>delay</code></td>
                    <td>number</td>
                    <td>0</td>
                    <td>Delay before animation starts in milliseconds</td>
                </tr>
                <tr>
                    <td><code>easing</code></td>
                    <td>EasingType</td>
                    <td>easeInOutCubic</td>
                    <td>Easing function applied to interpolation</td>
                </tr>
                <tr>
                    <td><code>onComplete</code></td>
                    <td>function</td>
                    <td>undefined</td>
                    <td>Callback invoked when the tween finishes</td>
                </tr>
            </tbody>
        </table>

        <h2>Animate Position</h2>
        <p>
            Move an element by tweening its <code>x</code> and <code>y</code> properties to new coordinates.
        </p>
        <app-docs-code-sample [code]="moveCode" [timerEnabled]="true" language="javascript" label="JavaScript"></app-docs-code-sample>

        <h2>Animate Opacity</h2>
        <p>
            Fade an element in or out by tweening its <code>opacity</code> property.
        </p>
        <app-docs-code-sample [code]="fadeCode" [timerEnabled]="true" language="javascript" label="JavaScript"></app-docs-code-sample>

        <h2>Animate Fill Color</h2>
        <p>
            Smoothly transition between fill colors. The engine interpolates each color channel independently.
        </p>
        <app-docs-code-sample [code]="colorCode" [timerEnabled]="true" language="javascript" label="JavaScript"></app-docs-code-sample>

        <h2>Animate Size</h2>
        <p>
            Resize an element by tweening <code>width</code> and <code>height</code>.
        </p>
        <app-docs-code-sample [code]="sizeCode" [timerEnabled]="true" language="javascript" label="JavaScript"></app-docs-code-sample>

        <h2>Chained Animations</h2>
        <p>
            Use the <code>onComplete</code> callback to chain sequential animations. Each tween starts when the
            previous one finishes, creating multi-step animation sequences.
        </p>
        <app-docs-code-sample [code]="chainCode" [timerEnabled]="true" language="javascript" label="JavaScript"></app-docs-code-sample>

        <app-docs-page-nav [previousPage]="previousPage" [nextPage]="nextPage"></app-docs-page-nav>
    `
})
export class PropertyTweensPageComponent {
    previousPage: DocsPage | undefined;
    nextPage: DocsPage | undefined;

    moveCode = `const m = elise.model(420, 220);
const rect = elise.rectangle(20, 80, 80, 60)
    .setFill('DodgerBlue')
    .addTo(m);

let movingRight = true;

function animateMove() {
    rect.animate(
        {
            x: movingRight ? 300 : 20,
            y: movingRight ? 130 : 80
        },
        {
            duration: 900,
            easing: 'easeInOutCubic',
            onComplete: function() {
                movingRight = !movingRight;
                animateMove();
            }
        }
    );
}

animateMove();`;

    fadeCode = `const m = elise.model(300, 220);
const circle = elise.ellipse(150, 110, 60, 60)
    .setFill('Coral')
    .setOpacity(1)
    .addTo(m);

let fadedOut = false;

function animateFade() {
    circle.animate(
        { opacity: fadedOut ? 1 : 0.15 },
        {
            duration: 700,
            easing: 'easeInOutSine',
            onComplete: function() {
                fadedOut = !fadedOut;
                animateFade();
            }
        }
    );
}

animateFade();`;

    colorCode = `const m = elise.model(320, 180);
const rect = elise.rectangle(60, 40, 200, 100)
    .setFill('SteelBlue')
    .addTo(m);

let warm = false;

function animateColor() {
    rect.animate(
        { fill: warm ? 'SteelBlue' : 'Coral' },
        {
            duration: 1000,
            easing: 'easeInOutSine',
            onComplete: function() {
                warm = !warm;
                animateColor();
            }
        }
    );
}

animateColor();`;

    sizeCode = `const m = elise.model(340, 220);
const rect = elise.rectangle(120, 95, 50, 30)
    .setFill('#38bdf8')
    .addTo(m);

let expanded = false;

function animateSize() {
    rect.animate(
        {
            width: expanded ? 50 : 140,
            height: expanded ? 30 : 90
        },
        {
            duration: 800,
            easing: 'easeOutBack',
            onComplete: function() {
                expanded = !expanded;
                animateSize();
            }
        }
    );
}

animateSize();`;

    chainCode = `const m = elise.model(420, 220);
const circle = elise.ellipse(60, 110, 28, 28)
    .setFill('#f472b6')
    .addTo(m);

function runSequence() {
    circle.animate(
        { centerX: 340 },
        {
            duration: 700,
            easing: 'easeInOutCubic',
            onComplete: function() {
                circle.animate(
                    { opacity: 0.2 },
                    {
                        duration: 350,
                        easing: 'easeOutQuad',
                        onComplete: function() {
                            circle.setCenter('60,110');
                            circle.setOpacity(1);
                            runSequence();
                        }
                    }
                );
            }
        }
    );
}

runSequence();`;

    constructor(docsService: DocsService) {
        this.previousPage = docsService.getPreviousPage('animation', 'property-tweens');
        this.nextPage = docsService.getNextPage('animation', 'property-tweens');
    }
}
