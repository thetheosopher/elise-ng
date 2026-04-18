import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DocsService, DocsPage } from '../../../../services/docs.service';
import { DocsPageNavComponent } from '../../docs-page-nav.component';

@Component({
    selector: 'app-container-explorer-guide-page',
    standalone: true,
    imports: [CommonModule, RouterModule, DocsPageNavComponent],
    template: `
        <h1>Container Explorer Guide</h1>
        <p class="lead">
            The Container Explorer provides cloud-based file management for Elise models,
            with container tree navigation, file previews, and integration with the Model Designer.
        </p>

        <h2>1. Overview</h2>
        <p>
            Containers are cloud storage units for Elise models, managed via the Schematrix API.
            Each container holds folders and model files, providing an organized way to store,
            retrieve, and share vector graphics. The Container Explorer is the visual interface
            for browsing and managing this cloud storage.
        </p>

        <h2>2. Navigation</h2>
        <p>
            The Container Explorer uses a two-panel layout:
        </p>
        <ul>
            <li><strong>Left panel</strong> - Container tree showing all containers and their folder structure. Click a container or folder to expand and navigate.</li>
            <li><strong>Right panel</strong> - File list showing model files within the selected container or folder. Files display name, size, and modification date.</li>
        </ul>

        <h2>3. Creating Containers and Folders</h2>
        <p>
            Use the <strong>New Container</strong> button to create a new top-level container.
            Provide a name for the container. Within a container, use the <strong>New Folder</strong>
            button to create subfolders for organizing your models. Folders can be nested
            within other folders.
        </p>

        <h2>4. Uploading Model Files</h2>
        <p>
            Navigate to the desired container or folder, then use the upload function to
            add model files. Supported file formats include Elise JSON model files.
            Uploaded files appear immediately in the file list.
        </p>

        <h2>5. Viewing and Previewing Models</h2>
        <p>
            Click on a model file in the file list to select it. The preview panel displays
            a rendered view of the model. This allows quick visual inspection without
            opening the full Model Designer.
        </p>

        <h2>6. Deleting Containers, Folders, and Files</h2>
        <p>
            Select a container, folder, or file and use the delete action. A confirmation
            dialog appears before deletion. Deleting a container or folder removes all
            contents within it. This action cannot be undone.
        </p>

        <h2>7. Integration with Model Designer</h2>
        <p>
            Open a model file directly in the Model Designer from the Container Explorer.
            Select a model file and choose <strong>Open in Designer</strong> to load it
            for editing. After making changes in the Designer, save the model back to
            the same container location.
        </p>

        <app-docs-page-nav [previousPage]="previousPage" [nextPage]="nextPage"></app-docs-page-nav>
    `
})
export class ContainerExplorerGuidePageComponent {
    previousPage: DocsPage | undefined;
    nextPage: DocsPage | undefined;

    constructor(private docsService: DocsService) {
        this.previousPage = docsService.getPreviousPage('tools', 'container-explorer-guide');
        this.nextPage = docsService.getNextPage('tools', 'container-explorer-guide');
    }
}
