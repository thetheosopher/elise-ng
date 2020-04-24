import { Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { NgbModal, NgbModalRef, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../schematrix/services/api.service';
import { ManifestDTO } from '../../schematrix/classes/manifest-dto';
import { ManifestFolderDTO } from '../../schematrix/classes/manifest-folder-dto';
import { TreeNode as Node } from './tree-node';
import { TreeComponent, ITreeOptions } from 'angular-tree-component'

@Component({
    selector: 'app-container-tree',
    templateUrl: './container-tree.component.html',
    styleUrls: ['./container-tree.component.scss']
})
export class ContainerTreeComponent implements OnInit {

    @ViewChild(TreeComponent)
    tree: TreeComponent;

    @ViewChild('errorModal', { static: true })
    errorModal: ElementRef;

    @ViewChild('newFolderModal', { static: true })
    newFolderModal: ElementRef;

    @ViewChild('deleteFolderModal', { static: true })
    deleteFolderModal: ElementRef;

    @Output() public folderPathSelected: EventEmitter<string | null> = new EventEmitter();

    @Input() public containerID?: string;

    @Output() public selectedFolderPath?: string;

    creatingFolder: boolean = false;
    deletingFolder: boolean = false;
    folderName: string;
    errorMessage: string;
    currentModal: NgbModalRef;

    nodes?: Node[];

    options: ITreeOptions = {
        rootId: '/'
    };

    constructor(private apiService: ApiService,
        private modalService: NgbModal) { }

    ngOnInit() {
    }

    ngAfterViewInit() {
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

    openModal(content) {
        this.currentModal = this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
        this.currentModal.result.then((result) => {
            // console.log(`Closed with: ${result}`);
        }, (reason) => {
            // console.log(`Dismissed ${reason}`);
        });
    }

    showCreateFolderModal() {
        this.openModal(this.newFolderModal);
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
                this.currentModal.close('Success');
                this.refresh(newFolderDTO.Path + '/');
                this.folderName = null;
                newfolderform.reset();
            },
            error: (error) => {
                this.creatingFolder = false;
                this.currentModal.close('Error');
                this.errorMessage = error;
                this.modalService.open(this.errorModal);
            }
        });
    }

    showDeleteFolderModal() {
        this.openModal(this.deleteFolderModal);
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
                this.currentModal.close('Success');
                this.refresh(parentPath);
            },
            error: (error) => {
                this.deletingFolder = false;
                this.currentModal.close('Error');
                this.errorMessage = error;
                this.modalService.open(this.errorModal);
            }
        });
    }

}
