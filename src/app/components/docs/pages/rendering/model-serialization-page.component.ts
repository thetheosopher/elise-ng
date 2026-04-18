import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DocsService, DocsPage } from '../../../../services/docs.service';
import { DocsPageNavComponent } from '../../docs-page-nav.component';
import { CodeBlockComponent } from '../../../code-block/code-block.component';

@Component({
    imports: [CommonModule, RouterModule, DocsPageNavComponent, CodeBlockComponent],
    template: `
        <h1>Model Serialization</h1>
        <p class="lead">
            Elise models can be serialized to and from multiple formats — including a JavaScript function format
            for file-based models and a JSON format for data interchange.
        </p>

        <h2>JavaScript Model File Format</h2>
        <p>
            The primary model file format is a JavaScript function that receives the <code>elise</code> API object
            and returns a constructed <code>Model</code>. This format allows models to use the full Elise API
            during construction, including programmatic element creation, loops, and computed values.
        </p>
        <app-code-block [code]="jsFileCode" language="javascript" label="JavaScript"></app-code-block>
        <p>
            The <code>ModelService</code> loads these files via HTTP, then executes them using
            <code>new Function('elise', code)(elise)</code> to produce the resulting Model object. This approach
            gives model files full access to the Elise API for dynamic model construction.
        </p>

        <h2>JSON Serialization Format</h2>
        <p>
            Models can also be serialized to a JSON representation that captures the complete scene graph.
            This format is used for data storage, clipboard operations, and programmatic model exchange.
        </p>
        <app-code-block [code]="jsonCode" language="json" label="JSON"></app-code-block>
        <p>
            JSON serialization captures all element types, fill descriptors (including gradients), stroke
            descriptors, resources, and nested model references. Models round-trip through serialization
            without loss.
        </p>

        <h2>Serialization API</h2>
        <table class="docs-table">
            <thead><tr><th>Method</th><th>Description</th></tr></thead>
            <tbody>
                <tr><td><code>model.serialize()</code></td><td>Serializes the model to a JSON string</td></tr>
                <tr><td><code>Model.parse(json)</code></td><td>Deserializes a JSON string to a Model instance</td></tr>
            </tbody>
        </table>

        <h2>Loading Models</h2>
        <p>
            The <code>ModelService</code> handles loading model files from the server. Models can also be
            created programmatically using the Elise API directly:
        </p>
        <app-code-block [code]="loadCode" language="javascript" label="JavaScript"></app-code-block>

        <h2>Programmatic vs File-Based</h2>
        <table class="docs-table">
            <thead><tr><th>Approach</th><th>Advantages</th><th>Use Case</th></tr></thead>
            <tbody>
                <tr>
                    <td><strong>JS file</strong></td>
                    <td>Full API access, computed values, loops, readable</td>
                    <td>Stored models, shared assets, complex scenes</td>
                </tr>
                <tr>
                    <td><strong>JSON</strong></td>
                    <td>Language-independent, easy to store/transmit, parseable</td>
                    <td>Clipboard, data exchange, database storage</td>
                </tr>
                <tr>
                    <td><strong>Programmatic</strong></td>
                    <td>Dynamic, data-driven, full type checking</td>
                    <td>Generated UI, data visualization, runtime construction</td>
                </tr>
            </tbody>
        </table>

        <app-docs-page-nav [previousPage]="previousPage" [nextPage]="nextPage"></app-docs-page-nav>
    `
})
export class ModelSerializationPageComponent {
    previousPage: DocsPage | undefined;
    nextPage: DocsPage | undefined;

    jsFileCode = `// models/sample.js
function(elise) {
    var model = elise.Model.create(640, 480);
    model.setFill('#1a1a2e');

    // Add a rectangle
    model.add(
        elise.Rectangle.create(20, 20, 200, 120)
            .setFill('#3b82f6')
            .setStroke('#1d4ed8,2')
    );

    // Add an ellipse
    model.add(
        elise.Ellipse.create(400, 200, 80, 60)
            .setFill('Coral')
    );

    return model;
}`;

    jsonCode = `{
  "type": "model",
  "width": 640,
  "height": 480,
  "fill": "#1a1a2e",
  "elements": [
    {
      "type": "rectangle",
      "x": 20, "y": 20,
      "width": 200, "height": 120,
      "fill": "#3b82f6",
      "stroke": "#1d4ed8,2"
    },
    {
      "type": "ellipse",
      "centerX": 400, "centerY": 200,
      "radiusX": 80, "radiusY": 60,
      "fill": "Coral"
    }
  ],
  "resources": []
}`;

    loadCode = `// Load a model file from the server
modelService.getModel('assets/models/sample.js')
    .subscribe(model => {
        this.model = model;
    });

// Create a model programmatically
const model = Model.create(640, 480);
model.setFill('#ffffff');
model.add(Rectangle.create(10, 10, 100, 50).setFill('SteelBlue'));

// Serialize to JSON
const json = model.serialize();

// Deserialize from JSON
const restored = Model.parse(json);`;

    constructor(docsService: DocsService) {
        this.previousPage = docsService.getPreviousPage('rendering', 'model-serialization');
        this.nextPage = docsService.getNextPage('rendering', 'model-serialization');
    }
}
