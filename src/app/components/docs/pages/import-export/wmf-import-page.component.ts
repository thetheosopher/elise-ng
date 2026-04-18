import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DocsService, DocsPage } from '../../../../services/docs.service';
import { DocsPageNavComponent } from '../../docs-page-nav.component';
import { CodeBlockComponent } from '../../../code-block/code-block.component';

@Component({
    selector: 'app-wmf-import-page',
    standalone: true,
    imports: [CommonModule, RouterModule, DocsPageNavComponent, CodeBlockComponent],
    template: `
        <h1>WMF Import</h1>
        <p class="lead">
            Import Windows Metafile (WMF) format binary data into Elise models. Convert
            legacy vector graphics from older Windows applications into the Elise framework.
        </p>

        <h2>Overview</h2>
        <p>
            The <code>WmfImporter</code> reads WMF (Windows Metafile) binary data and generates
            corresponding Elise model elements. WMF is a legacy vector graphics format used
            extensively in older Windows applications such as Microsoft Office, Visio, and
            various CAD tools. The importer processes WMF records sequentially and maps
            drawing operations to equivalent Elise elements.
        </p>

        <h2>Supported WMF Records</h2>
        <table class="docs-table">
            <thead>
                <tr>
                    <th>WMF Record</th>
                    <th>Elise Element</th>
                    <th>Notes</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>META_RECTANGLE</td>
                    <td>Rectangle</td>
                    <td>Filled and stroked rectangles</td>
                </tr>
                <tr>
                    <td>META_ELLIPSE</td>
                    <td>Ellipse</td>
                    <td>Filled and stroked ellipses</td>
                </tr>
                <tr>
                    <td>META_LINETO / META_MOVETO</td>
                    <td>Line</td>
                    <td>Individual line segments</td>
                </tr>
                <tr>
                    <td>META_POLYLINE</td>
                    <td>Polyline</td>
                    <td>Connected line segments</td>
                </tr>
                <tr>
                    <td>META_POLYGON</td>
                    <td>Polygon</td>
                    <td>Closed polygon shapes</td>
                </tr>
                <tr>
                    <td>META_TEXTOUT / META_EXTTEXTOUT</td>
                    <td>Text</td>
                    <td>Text with font and positioning</td>
                </tr>
                <tr>
                    <td>META_CREATEBRUSHINDIRECT</td>
                    <td>Fill</td>
                    <td>Solid brush colors mapped to fills</td>
                </tr>
                <tr>
                    <td>META_CREATEPENINDIRECT</td>
                    <td>Stroke</td>
                    <td>Pen style, width, color mapped to strokes</td>
                </tr>
            </tbody>
        </table>

        <h2>Loading and Importing a WMF File</h2>
        <p>
            Load a WMF file as an <code>ArrayBuffer</code> and pass it to the importer.
            The importer returns an Elise model containing the converted elements.
        </p>
        <app-code-block [code]="loadCode" language="javascript" label="JavaScript"></app-code-block>

        <h2>Limitations</h2>
        <p>
            WMF is a complex legacy format with many record types. The importer supports
            the most common drawing records. Advanced features such as clipping regions,
            raster operations, and embedded bitmaps may not be fully supported. Enhanced
            Metafile (EMF) format is not supported by this importer.
        </p>

        <app-docs-page-nav [previousPage]="previousPage" [nextPage]="nextPage"></app-docs-page-nav>
    `
})
export class WmfImportPageComponent {
    previousPage: DocsPage | undefined;
    nextPage: DocsPage | undefined;

    loadCode = `// Load a WMF file and convert to Elise model
async function loadWmfFile(url) {
    // Fetch the WMF file as binary data
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();

    // Convert WMF binary data to an Elise model
    const model = WmfImporter.toModel(arrayBuffer);

    // The model now contains elements converted from WMF records
    console.log('Elements imported:', model.elements.length);

    return model;
}

// Example usage
const model = await loadWmfFile('/assets/legacy/diagram.wmf');`;

    constructor(private docsService: DocsService) {
        this.previousPage = docsService.getPreviousPage('import-export', 'wmf-import');
        this.nextPage = docsService.getNextPage('import-export', 'wmf-import');
    }
}
