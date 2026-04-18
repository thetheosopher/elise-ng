import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DocsService, DocsPage } from '../../../../services/docs.service';
import { DocsPageNavComponent } from '../../docs-page-nav.component';
import { CodeBlockComponent } from '../../../code-block/code-block.component';
import { DocsCodeSampleComponent } from '../../docs-code-sample.component';

@Component({
    imports: [CommonModule, RouterModule, DocsPageNavComponent, CodeBlockComponent, DocsCodeSampleComponent],
    template: `
        <h1>Quick Start</h1>
        <p class="lead">
            Create, style, and render your first Elise model in minutes.
        </p>

        <h2>Step 1: Create a Model</h2>
        <p>
            Every Elise scene starts with a <code>Model</code>. A model defines a coordinate space with a fixed width
            and height, measured in logical pixels.
        </p>
        <app-docs-code-sample [code]="step1" language="javascript" label="JavaScript" [returnVar]="'model'"></app-docs-code-sample>

        <h2>Step 2: Add Elements</h2>
        <p>
            Elements are the visible objects in your scene. Use the fluent factory API to create elements, set their
            properties, and add them to the model. Elements render in the order they are added — first added is drawn
            first (bottommost).
        </p>
        <app-code-block [code]="step2" language="javascript" label="JavaScript"></app-code-block>

        <h2>Step 3: Style Elements</h2>
        <p>
            Every element supports fills and strokes. Fills can be solid colors, gradients, image patterns, or model
            patterns. Strokes have color, width, dash patterns, and cap/join styles.
        </p>
        <app-code-block [code]="step3" language="javascript" label="JavaScript"></app-code-block>

        <h2>Step 4: Render the Model</h2>
        <p>
            Attach the model to a <code>ViewController</code> to render it to a canvas element. The controller manages
            the rendering loop, timer callbacks, hit testing, and mouse/touch interaction.
        </p>
        <app-code-block [code]="step4" language="javascript" label="JavaScript"></app-code-block>

        <h2>Step 5: Add Interactivity</h2>
        <p>
            Mark elements as <code>interactive</code> to enable hit testing. Set command handler tags on mouse and
            timer events to respond to user interaction and create animations.
        </p>
        <app-code-block [code]="step5" language="javascript" label="JavaScript"></app-code-block>

        <h2>Complete Example</h2>
        <p>
            Here is a complete self-contained model that creates a simple interactive scene:
        </p>
        <app-docs-code-sample [code]="completeExample" language="javascript" label="JavaScript" [returnVar]="'model'"></app-docs-code-sample>

        <h2>The Model File Format</h2>
        <p>
            In the Elise demo application, models are stored as JavaScript files under
            <code>assets/models/&lbrace;type&rbrace;/&lbrace;id&rbrace;.js</code>. Each file is a function body that
            receives the <code>elise</code> library object as a parameter and returns a <code>Model</code> instance.
            The application evaluates these files at runtime using <code>new Function('elise', code)(elise)</code>.
        </p>

        <app-docs-page-nav [previousPage]="previousPage" [nextPage]="nextPage"></app-docs-page-nav>
    `
})
export class QuickStartPageComponent {
    previousPage: DocsPage | undefined;
    nextPage: DocsPage | undefined;

    step1 = `// Create a 400×300 model
var model = elise.model(400, 300);

// Optionally set a background fill
model.setFill('#1a1a2e');`;

    step2 = `// Add a rectangle at (20, 20) with size 160×100
elise.rectangle(20, 20, 160, 100).addTo(model);

// Add an ellipse centered at (300, 150) with radii 80×60
elise.ellipse(300, 150, 80, 60).addTo(model);

// Add a line from (20, 250) to (380, 250)
elise.line(20, 250, 380, 250).addTo(model);`;

    step3 = `// Solid color fill with named colors
elise.rectangle(20, 20, 160, 100)
    .setFill('SteelBlue')
    .setStroke('White,2')
    .addTo(model);

// Semi-transparent fill using "opacity;Color" format
elise.ellipse(300, 150, 80, 60)
    .setFill('0.6;Coral')
    .setStroke('DarkRed,1')
    .addTo(model);

// Hex color with alpha channel (#RRGGBBAA)
elise.line(20, 250, 380, 250)
    .setStroke('#38bdf880,3')
    .addTo(model);`;

    step4 = `// In the browser, get or create a host element
var hostElement = document.getElementById('elise-host');

// Create a canvas and attach a ViewController
model.assignCanvas(hostElement);
var controller = new ViewController(model, hostElement);
controller.draw();`;

    step5 = `// Make a rectangle interactive
var button = elise.rectangle(100, 100, 200, 60)
    .setFill('DodgerBlue')
    .setStroke('White,2')
    .setInteractive(true)
    .addTo(model);

// Set event handler tags
button.mouseEnter = 'highlight';
button.mouseLeave = 'normal';
button.click = 'action';`;

    completeExample = `var model = elise.model(400, 300);
model.setFill('#0f172a');

// Background card
elise.rectangle(24, 24, 352, 252)
    .setFill('#1e293b')
    .setStroke('#334155,1')
    .addTo(model);

// Title text
elise.text('Elise Quick Start', 40, 40, 320, 36)
    .setFill('#e2e8f0')
    .addTo(model);

// Colored shapes
elise.ellipse(120, 160, 60, 60)
    .setFill('#38bdf8')
    .addTo(model);

elise.rectangle(200, 120, 140, 80)
    .setFill('0.8;#f472b6')
    .setStroke('#fbbf24,2')
    .addTo(model);

// Decorative line
elise.line(40, 240, 360, 240)
    .setStroke('#475569,1')
    .addTo(model);

return model;`;

    constructor(docsService: DocsService) {
        this.previousPage = docsService.getPreviousPage('getting-started', 'quick-start');
        this.nextPage = docsService.getNextPage('getting-started', 'quick-start');
    }
}
