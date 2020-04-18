import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { ApiService } from '../../schematrix/services/api.service';
import { ManifestDTO } from '../../schematrix/classes/manifest-dto';
import { ManifestFolderDTO } from '../../schematrix/classes/manifest-folder-dto';
import { TreeNode as Node } from './tree-node';
import { TreeComponent, ITreeOptions } from 'angular-tree-component'

declare var $: any;

@Component({
    selector: 'app-container-tree',
    templateUrl: './container-tree.component.html',
    styleUrls: ['./container-tree.component.scss']
})
export class ContainerTreeComponent implements OnInit {

    @ViewChild(TreeComponent, { static: false }) tree: TreeComponent;

    @Output() public folderPathSelected: EventEmitter<string | null> = new EventEmitter();

    @Input() public containerID?: string;

    @Output() public selectedFolderPath?: string;

    creatingFolder: boolean = false;
    deletingFolder: boolean = false;
    folderName: string;
    errorMessage: string;

    nodes?: Node[];

    options: ITreeOptions = {
        rootId: '/'
    };

    constructor(private apiService: ApiService) { }

    ngOnInit() {
    }

    ngAfterViewInit() {
        /*
        this.containerID = '062a6e0a-a220-4f72-a668-b0972838a2f7';
        this.loadContainer();
        */
    }

    populateFolderChildren(node: Node, folderParent: ManifestDTO | ManifestFolderDTO) {
        if(folderParent.Folders) {
            node.children = [];
            for(let folder of folderParent.Folders) {
                let childNode = {
                    name: folder.Name,
                    id: node.id + folder.Name + '/'
                };
                node.children.push(childNode);
                this.populateFolderChildren(childNode, folder);
            }
        }
        else {
            node.children = [];
        }
    }

    manifestToNodes(manifest: ManifestDTO) {
        let nodes: Node[] = [];
        const rootNode = {
            name: '/',
            id: '/',
            hasChildren: (manifest.Folders && manifest.Folders.length > 0) ? true: false,
            isExpanded: false
        };
        nodes.push(rootNode);
        this.populateFolderChildren(rootNode, manifest);
        return nodes;
    }

    nodeActivate(event) {
        // console.log(event.node.id);
        this.folderPathSelected.emit(event.node.id);
        this.selectedFolderPath = event.node.id;
    }

    /*
    expandAll() {
        this.tree.treeModel.expandAll();
    }*/

    refresh(reselectNode = '/') {
        this.tree.treeModel.activeNodes.forEach(node => {
            node.setIsActive(false);
        });
        this.selectedFolderPath = null;
        this.folderPathSelected.emit(null);
        this.nodes = [];
        if(this.containerID) {
            this.apiService.getContainerManifest(this.containerID, true).subscribe({
                next: (manifest: ManifestDTO) => {
                    this.nodes = this.manifestToNodes(manifest);
                    // setTimeout(() => { this.expandAll() }, 10);
                    setTimeout(() => {
                        if(this.nodes.length > 0) {
                            const node = this.tree.treeModel.getNodeById(reselectNode);
                            if(node) {
                                node.ensureVisible();
                                node.setIsActive(true);
                            }
                        }
                    }, 10);
                },
                error: (err) => {
                    this.nodes = [];
                }
            })
        }
    }

    createFolder(newfolderform) {
        this.creatingFolder = true;
        const newFolderDTO =
        {
            ContainerID: this.containerID,
            Path: this.selectedFolderPath + this.folderName
        };
        this.apiService.createFolder(newFolderDTO).subscribe({
            next: (newFolder) => {
                this.creatingFolder = false;
                $("#newFolderModal").modal('hide');
                this.refresh(newFolderDTO.Path + '/');
                this.folderName = null;
                newfolderform.reset();
            },
            error: (error) => {
                this.creatingFolder = false;
                $("#newFolderModal").modal('hide');
                this.errorMessage = error;
                $('#errorModal').modal();
            }
        });
    }

    deleteFolder() {
        let parentPath;
        if(!this.selectedFolderPath || this.selectedFolderPath == '/') {
            return;
        }
        else {
            const parts = this.selectedFolderPath.split('/')
            parts.splice(parts.length - 2, 1);
            parentPath = parts.join('/')
        }
        this.deletingFolder = true;
        this.apiService.deleteFolder(this.containerID, this.selectedFolderPath).subscribe({
            next: () => {
                this.deletingFolder = false;
                $("#deleteFolderModal").modal('hide');
                this.refresh(parentPath);
            },
            error: (error) => {
                this.deletingFolder = false;
                $("#deleteFolderModal").modal('hide');
                this.errorMessage = error;
                $('#errorModal').modal();
            }
        });
    }

}
