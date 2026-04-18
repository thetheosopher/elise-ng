import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DocsService, DocsPage } from '../../../../services/docs.service';
import { DocsPageNavComponent } from '../../docs-page-nav.component';
import { DocsCodeSampleComponent } from '../../docs-code-sample.component';

@Component({
    imports: [CommonModule, RouterModule, DocsPageNavComponent, DocsCodeSampleComponent],
    template: `
        <h1>Easing Curves</h1>
        <p class="lead">
            Easing functions control the rate of change during an animation, giving motion a natural, polished feel.
            Elise includes 31 built-in easing functions organized by curve family.
        </p>

        <h2>Easing Direction</h2>
        <p>
            Each easing family comes in three variants:
        </p>
        <table class="docs-table">
            <thead>
                <tr>
                    <th>Suffix</th>
                    <th>Behavior</th>
                </tr>
            </thead>
            <tbody>
                <tr><td><strong>In</strong></td><td>Starts slow, accelerates toward the end</td></tr>
                <tr><td><strong>Out</strong></td><td>Starts fast, decelerates toward the end</td></tr>
                <tr><td><strong>InOut</strong></td><td>Starts slow, speeds up in the middle, then slows at the end</td></tr>
            </tbody>
        </table>

        <h2>Linear</h2>
        <table class="docs-table">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Description</th>
                </tr>
            </thead>
            <tbody>
                <tr><td><code>easeLinear</code></td><td>Constant speed — no acceleration or deceleration</td></tr>
            </tbody>
        </table>

        <h2>Quadratic</h2>
        <table class="docs-table">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Description</th>
                </tr>
            </thead>
            <tbody>
                <tr><td><code>easeInQuad</code></td><td>Gentle acceleration — subtle slow start</td></tr>
                <tr><td><code>easeOutQuad</code></td><td>Gentle deceleration — subtle slow end</td></tr>
                <tr><td><code>easeInOutQuad</code></td><td>Gentle acceleration then deceleration</td></tr>
            </tbody>
        </table>

        <h2>Cubic</h2>
        <table class="docs-table">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Description</th>
                </tr>
            </thead>
            <tbody>
                <tr><td><code>easeInCubic</code></td><td>Moderate acceleration — noticeable slow start</td></tr>
                <tr><td><code>easeOutCubic</code></td><td>Moderate deceleration — smooth slow end</td></tr>
                <tr><td><code>easeInOutCubic</code></td><td>Moderate acceleration then deceleration — versatile general-purpose easing</td></tr>
            </tbody>
        </table>

        <h2>Quartic</h2>
        <table class="docs-table">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Description</th>
                </tr>
            </thead>
            <tbody>
                <tr><td><code>easeInQuart</code></td><td>Strong acceleration — pronounced slow start</td></tr>
                <tr><td><code>easeOutQuart</code></td><td>Strong deceleration — pronounced slow end</td></tr>
                <tr><td><code>easeInOutQuart</code></td><td>Strong acceleration then deceleration</td></tr>
            </tbody>
        </table>

        <h2>Quintic</h2>
        <table class="docs-table">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Description</th>
                </tr>
            </thead>
            <tbody>
                <tr><td><code>easeInQuint</code></td><td>Very strong acceleration — dramatic slow start</td></tr>
                <tr><td><code>easeOutQuint</code></td><td>Very strong deceleration — dramatic slow end</td></tr>
                <tr><td><code>easeInOutQuint</code></td><td>Very strong acceleration then deceleration</td></tr>
            </tbody>
        </table>

        <h2>Sinusoidal</h2>
        <table class="docs-table">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Description</th>
                </tr>
            </thead>
            <tbody>
                <tr><td><code>easeInSine</code></td><td>Sine-based gentle acceleration — very smooth start</td></tr>
                <tr><td><code>easeOutSine</code></td><td>Sine-based gentle deceleration — very smooth end</td></tr>
                <tr><td><code>easeInOutSine</code></td><td>Sine-based smooth acceleration and deceleration — natural breathing feel</td></tr>
            </tbody>
        </table>

        <h2>Exponential</h2>
        <table class="docs-table">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Description</th>
                </tr>
            </thead>
            <tbody>
                <tr><td><code>easeInExpo</code></td><td>Exponential acceleration — nearly still at start, explosive at end</td></tr>
                <tr><td><code>easeOutExpo</code></td><td>Exponential deceleration — fast start, very gradual stop</td></tr>
                <tr><td><code>easeInOutExpo</code></td><td>Exponential acceleration then deceleration — dramatic contrast</td></tr>
            </tbody>
        </table>

        <h2>Circular</h2>
        <table class="docs-table">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Description</th>
                </tr>
            </thead>
            <tbody>
                <tr><td><code>easeInCirc</code></td><td>Circular acceleration — sharp curve, very slow start</td></tr>
                <tr><td><code>easeOutCirc</code></td><td>Circular deceleration — sharp curve, very slow end</td></tr>
                <tr><td><code>easeInOutCirc</code></td><td>Circular acceleration then deceleration</td></tr>
            </tbody>
        </table>

        <h2>Back</h2>
        <table class="docs-table">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Description</th>
                </tr>
            </thead>
            <tbody>
                <tr><td><code>easeInBack</code></td><td>Pulls back slightly before accelerating forward — anticipation effect</td></tr>
                <tr><td><code>easeOutBack</code></td><td>Overshoots the target then settles back — springy landing</td></tr>
                <tr><td><code>easeInOutBack</code></td><td>Pulls back, overshoots, then settles — playful motion</td></tr>
            </tbody>
        </table>

        <h2>Elastic</h2>
        <table class="docs-table">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Description</th>
                </tr>
            </thead>
            <tbody>
                <tr><td><code>easeInElastic</code></td><td>Oscillates before launching — coiled spring release</td></tr>
                <tr><td><code>easeOutElastic</code></td><td>Overshoots and oscillates around target — rubber band snap</td></tr>
                <tr><td><code>easeInOutElastic</code></td><td>Oscillates at start and end — jelly wobble</td></tr>
            </tbody>
        </table>

        <h2>Bounce</h2>
        <table class="docs-table">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Description</th>
                </tr>
            </thead>
            <tbody>
                <tr><td><code>easeInBounce</code></td><td>Bouncing impacts at the start — reverse gravity bounce</td></tr>
                <tr><td><code>easeOutBounce</code></td><td>Bouncing impacts at the end — ball drop effect</td></tr>
                <tr><td><code>easeInOutBounce</code></td><td>Bouncing at both ends</td></tr>
            </tbody>
        </table>

        <h2>Comparing Easing Curves</h2>
        <p>
            Here is the same position animation applied with different easing functions. Each element starts at the
            same <code>x</code> position and tweens to the same target, but the motion character differs dramatically.
        </p>
        <app-docs-code-sample [code]="comparisonCode" [timerEnabled]="true" language="javascript" label="JavaScript"></app-docs-code-sample>

        <h2>Expressive Curves</h2>
        <p>
            Overshoot, elastic, and bounce curves are more theatrical. They are useful for playful emphasis,
            but usually too strong for ordinary UI transitions.
        </p>
        <app-docs-code-sample [code]="expressiveCode" [timerEnabled]="true" language="javascript" label="JavaScript"></app-docs-code-sample>

        <h2>Choosing an Easing Curve</h2>
        <p>
            <strong>UI transitions:</strong> <code>easeInOutCubic</code> or <code>easeInOutQuad</code> are safe
            defaults. <strong>Entrances:</strong> <code>easeOutCubic</code> or <code>easeOutBack</code> for a lively
            feel. <strong>Exits:</strong> <code>easeInCubic</code> for subtle departure. <strong>Attention:</strong>
            <code>easeOutElastic</code> or <code>easeOutBounce</code> for playful emphasis.
        </p>

        <app-docs-page-nav [previousPage]="previousPage" [nextPage]="nextPage"></app-docs-page-nav>
    `
})
export class EasingCurvesPageComponent {
    previousPage: DocsPage | undefined;
    nextPage: DocsPage | undefined;

    comparisonCode = `const m = elise.model(430, 270);
const easings = [
    'easeLinear',
    'easeInQuad',
    'easeOutQuad',
    'easeInOutCubic'
];

for (let index = 0; index < easings.length; index++) {
    const easing = easings[index];
    const y = 40 + index * 55;

    elise.text(easing, 14, y - 10, 130, 20)
        .setFill('#64748b')
        .addTo(m);

    elise.rectangle(150, y, 220, 4)
        .setFill('#e2e8f0')
        .addTo(m);

    const dot = elise.ellipse(150, y + 2, 10, 10)
        .setFill('#0284c7')
        .addTo(m);

    function loop(forward) {
        dot.animate(
            { x: forward ? 360 : 150 },
            {
                duration: 1400,
                easing: easing,
                onComplete: function() {
                    loop(!forward);
                }
            }
        );
    }

    loop(true);
}`;

    expressiveCode = `const m = elise.model(430, 220);
const easings = [
    'easeOutBack',
    'easeOutElastic',
    'easeOutBounce'
];
const colors = ['#f97316', '#8b5cf6', '#22c55e'];

for (let index = 0; index < easings.length; index++) {
    const easing = easings[index];
    const y = 42 + index * 58;

    elise.text(easing, 14, y - 10, 140, 20)
        .setFill('#64748b')
        .addTo(m);

    elise.rectangle(150, y, 220, 4)
        .setFill('#e2e8f0')
        .addTo(m);

    const chip = elise.rectangle(150, y - 10, 26, 26)
        .setFill(colors[index])
        .setStroke('White,1')
        .addTo(m);

    function loop(forward) {
        chip.animate(
            { x: forward ? 344 : 150 },
            {
                duration: 1500,
                easing: easing,
                onComplete: function() {
                    loop(!forward);
                }
            }
        );
    }

    loop(true);
}`;

    constructor(docsService: DocsService) {
        this.previousPage = docsService.getPreviousPage('animation', 'easing-curves');
        this.nextPage = docsService.getNextPage('animation', 'easing-curves');
    }
}
