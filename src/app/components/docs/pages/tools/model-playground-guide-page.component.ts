import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DocsService, DocsPage } from '../../../../services/docs.service';
import { DocsPageNavComponent } from '../../docs-page-nav.component';
import { CodeBlockComponent } from '../../../code-block/code-block.component';

@Component({
    selector: 'app-model-playground-guide-page',
    standalone: true,
    imports: [CommonModule, RouterModule, DocsPageNavComponent, CodeBlockComponent],
    template: `
        <h1>Model Playground Guide</h1>
        <p class="lead">
            The Model Playground is an interactive code editor for creating Elise models
            programmatically. Write model creation code and see results rendered live in
            the preview panel.
        </p>

        <h2>1. Overview</h2>
        <p>
            The Model Playground provides a split-panel interface with a code editor on the
            left and a live model preview on the right. Write Elise model creation code
            using the Elise API and see the resulting model rendered instantly. This is
            ideal for learning the API, experimenting with element creation, and prototyping
            models before integrating them into applications.
        </p>

        <h2>2. The Code Editor</h2>
        <p>
            The left panel contains a code editor where you write JavaScript code to create
            Elise models. The editor provides syntax highlighting for JavaScript. Your code
            should create a model using the Elise API - the last model created is displayed
            in the preview panel.
        </p>
        <app-code-block [code]="basicCode" language="javascript" label="JavaScript"></app-code-block>

        <h2>3. Live Preview</h2>
        <p>
            The right panel renders the model produced by your code. As you run your code,
            the preview updates to show the current state of the model. The preview supports
            zoom and pan for inspecting details.
        </p>

        <h2>4. Code Examples</h2>
        <p>
            Try these sample models to get started with the Playground:
        </p>

        <h3>Simple Shapes</h3>
        <app-code-block [code]="shapesCode" language="javascript" label="JavaScript"></app-code-block>

        <h3>Gradient Fills</h3>
        <app-code-block [code]="gradientCode" language="javascript" label="JavaScript"></app-code-block>

        <h3>Complex Scene</h3>
        <app-code-block [code]="sceneCode" language="javascript" label="JavaScript"></app-code-block>

        <h2>5. Tips and Tricks</h2>
        <ul>
            <li><strong>Debugging</strong> - Use <code>console.log()</code> to inspect model properties and element counts in the browser developer tools.</li>
            <li><strong>Resources</strong> - Reference image URLs in the code for image elements. Use absolute URLs or relative paths from the application root.</li>
            <li><strong>Animation</strong> - Add animation timers and transitions to see animated effects in the preview. The preview supports timed rendering.</li>
            <li><strong>Iteration</strong> - Use loops to create patterns and repeated elements efficiently.</li>
            <li><strong>Model size</strong> - Set an appropriate model size at the beginning. The preview scales to fit, but the coordinate system is defined by the model dimensions.</li>
        </ul>

        <app-docs-page-nav [previousPage]="previousPage" [nextPage]="nextPage"></app-docs-page-nav>
    `
})
export class ModelPlaygroundGuidePageComponent {
    previousPage: DocsPage | undefined;
    nextPage: DocsPage | undefined;

    basicCode = `// Create a simple model in the playground
const m = elise.model(400, 300);
elise.rectangle(50, 50, 300, 200)
    .setFill('LightBlue')
    .setStroke('SteelBlue', 2)
    .addTo(m);
elise.text('Hello, Elise!', 200, 150)
    .setAlignment('center')
    .setTypeface('Arial', 24)
    .setFill('Navy')
    .addTo(m);`;

    shapesCode = `const m = elise.model(400, 300);

// Rectangle
elise.rectangle(20, 20, 100, 80)
    .setFill('Coral')
    .setStroke('DarkRed', 2)
    .addTo(m);

// Ellipse
elise.ellipse(220, 60, 60, 40)
    .setFill('MediumSeaGreen')
    .setStroke('DarkGreen', 2)
    .addTo(m);

// Triangle (polygon)
elise.polygon('100,200 50,280 150,280')
    .setFill('Gold')
    .setStroke('DarkGoldenrod', 2)
    .addTo(m);

// Line
elise.line(250, 180, 380, 260)
    .setStroke('Purple', 3)
    .addTo(m);`;

    gradientCode = `const m = elise.model(400, 300);

// Linear gradient fill
elise.rectangle(20, 20, 160, 120)
    .setLinearGradientFill('Red', 'Yellow', 0, 0, 160, 120)
    .setStroke('DarkRed', 2)
    .addTo(m);

// Radial gradient fill
elise.ellipse(300, 80, 70, 60)
    .setRadialGradientFill('White', 'Blue', 0, 0, 70)
    .setStroke('Navy', 2)
    .addTo(m);

// Another linear gradient
elise.rectangle(20, 170, 360, 100)
    .setLinearGradientFill('ForestGreen', 'LimeGreen', 0, 0, 360, 0)
    .setStroke('DarkGreen', 2)
    .addTo(m);`;

    sceneCode = `const m = elise.model(400, 300);

// Sky
elise.rectangle(0, 0, 400, 200)
    .setLinearGradientFill('DeepSkyBlue', 'LightBlue', 0, 0, 0, 200)
    .addTo(m);

// Ground
elise.rectangle(0, 200, 400, 100)
    .setFill('ForestGreen')
    .addTo(m);

// Sun
elise.ellipse(320, 50, 40, 40)
    .setRadialGradientFill('Yellow', 'Orange', 0, 0, 40)
    .addTo(m);

// House body
elise.rectangle(100, 140, 120, 100)
    .setFill('BurlyWood')
    .setStroke('SaddleBrown', 2)
    .addTo(m);

// Roof
elise.polygon('90,140 160,80 230,140')
    .setFill('FireBrick')
    .setStroke('DarkRed', 2)
    .addTo(m);

// Door
elise.rectangle(140, 190, 40, 50)
    .setFill('SaddleBrown')
    .setStroke('Black', 1)
    .addTo(m);`;

    constructor(private docsService: DocsService) {
        this.previousPage = docsService.getPreviousPage('tools', 'model-playground-guide');
        this.nextPage = docsService.getNextPage('tools', 'model-playground-guide');
    }
}
