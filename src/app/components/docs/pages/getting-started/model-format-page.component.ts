import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DocsService, DocsPage } from '../../../../services/docs.service';
import { DocsPageNavComponent } from '../../docs-page-nav.component';
import { CodeBlockComponent } from '../../../code-block/code-block.component';

@Component({
    imports: [CommonModule, RouterModule, DocsPageNavComponent, CodeBlockComponent],
    template: `
        <h1>Model Format</h1>
        <p class="lead">
            The JSON serialization format used to persist and transport Elise models.
        </p>

        <h2>Overview</h2>
        <p>
            An Elise model can be serialized to JSON using <code>model.serialize()</code> and restored with
            <code>Model.parse(json)</code>. The format captures the complete scene graph — model dimensions, background,
            all elements with their properties, and resource declarations.
        </p>

        <h2>Top-Level Structure</h2>
        <app-code-block [code]="topLevel" language="json" label="JSON"></app-code-block>

        <h2>Element Serialization</h2>
        <p>
            Each element is serialized as a JSON object with a <code>type</code> discriminator. Only non-default
            property values are included to keep the output compact.
        </p>
        <app-code-block [code]="elementExamples" language="json" label="JSON"></app-code-block>

        <h2>Gradient Fills</h2>
        <p>
            Linear and radial gradients serialize as nested objects:
        </p>
        <app-code-block [code]="gradientExample" language="json" label="JSON"></app-code-block>

        <h2>Resource Declarations</h2>
        <p>
            Resources (bitmaps, models, text) are listed in the top-level <code>resources</code> array:
        </p>
        <app-code-block [code]="resourceExample" language="json" label="JSON"></app-code-block>

        <h2>Round-Trip Fidelity</h2>
        <p>
            The serializer preserves all properties including clip paths, transforms, shadows, blend modes, filters,
            stroke dash patterns, and event handler tags. A model serialized and then parsed will render identically
            to the original.
        </p>

        <h2>Formatted Output</h2>
        <p>
            The <code>model.formattedJSON()</code> method returns pretty-printed JSON with indentation — useful for
            display in editors and debugging tools like the Model Playground's JSON tab.
        </p>

        <app-docs-page-nav [previousPage]="previousPage" [nextPage]="nextPage"></app-docs-page-nav>
    `
})
export class ModelFormatPageComponent {
    previousPage: DocsPage | undefined;
    nextPage: DocsPage | undefined;

    topLevel = `{
  "type": "model",
  "width": 640,
  "height": 480,
  "fill": "#0f172a",
  "stroke": null,
  "elements": [ ... ],
  "resources": [ ... ]
}`;

    elementExamples = `// Rectangle with corner radii
{
  "type": "rectangle",
  "x": 20, "y": 20, "width": 200, "height": 120,
  "fill": "#3b82f6",
  "stroke": "#1d4ed8,2",
  "cornerRadii": [12, 12, 12, 12]
}

// Ellipse
{
  "type": "ellipse",
  "centerX": 300, "centerY": 200,
  "radiusX": 80, "radiusY": 60,
  "fill": "Coral"
}

// Polygon with points
{
  "type": "polygon",
  "points": "100,10 40,198 190,78 10,78 160,198",
  "fill": "Gold",
  "stroke": "DarkGoldenrod,2",
  "winding": 2
}

// Text element
{
  "type": "text",
  "text": "Hello World",
  "x": 20, "y": 300, "width": 400, "height": 40,
  "fill": "White",
  "typeface": "Arial",
  "typesize": 24,
  "alignment": "Center,Middle"
}`;

    gradientExample = `// Linear gradient fill
{
  "type": "rectangle",
  "x": 0, "y": 0, "width": 400, "height": 300,
  "fill": {
    "type": "linearGradient",
    "start": "0,0",
    "end": "400,300",
    "stops": [
      { "color": "#ff0000ff", "offset": 0.0 },
      { "color": "#0000ffff", "offset": 1.0 }
    ]
  }
}

// Radial gradient fill
{
  "fill": {
    "type": "radialGradient",
    "center": "200,150",
    "focus": "200,150",
    "radiusX": 200, "radiusY": 150,
    "stops": [
      { "color": "#ffffff", "offset": 0.0 },
      { "color": "#000000", "offset": 1.0 }
    ]
  }
}`;

    resourceExample = `"resources": [
  {
    "type": "bitmap",
    "key": "background",
    "uri": "images/scene-bg.png"
  },
  {
    "type": "model",
    "key": "icon-star",
    "uri": "models/star.json"
  },
  {
    "type": "text",
    "key": "greeting",
    "text": "Welcome to the application",
    "locale": "en"
  }
]`;

    constructor(docsService: DocsService) {
        this.previousPage = docsService.getPreviousPage('getting-started', 'model-format');
        this.nextPage = docsService.getNextPage('getting-started', 'model-format');
    }
}
