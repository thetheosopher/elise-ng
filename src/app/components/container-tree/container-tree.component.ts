import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../schematrix/services/api.service';
import { ManifestDTO } from '../../schematrix/classes/manifest-dto';
import { ManifestFolderDTO } from '../../schematrix/classes/manifest-folder-dto';
import { TreeNode as Node } from './tree-node';
import { TreeComponent, ITreeOptions } from 'angular-tree-component'
import { ToastrService } from 'ngx-toastr';
import { NewFolderModalComponent, NewFolderModalInfo } from '../new-folder-modal/new-folder-modal.component';
import { DeleteFolderModalComponent, DeleteFolderModalInfo } from '../delete-folder-modal/delete-folder-modal.component';

@Component({
    selector: 'app-container-tree',
    templateUrl: './container-tree.component.html',
    styleUrls: ['./container-tree.component.scss']
})
export class ContainerTreeComponent implements OnInit {

    constructor(
        private apiService: ApiService,
        private modalService: NgbModal,
        private toasterService: ToastrService) { }

    @ViewChild(TreeComponent)
    tree: TreeComponent;

    @Output() public folderPathSelected: EventEmitter<string | null> = new EventEmitter();

    @Input() public containerID?: string;

    @Output() public selectedFolderPath?: string;

    nodes?: Node[];

    options: ITreeOptions = {
        rootId: '/'
    };

    ngOnInit() {
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

    showNewFolderModal() {
        const modalInfo = new NewFolderModalInfo();
        modalInfo.parent = this.selectedFolderPath;
        const modal = this.modalService.open(NewFolderModalComponent);
        modal.componentInstance.modalInfo = modalInfo;
        modal.result.then((result: NewFolderModalInfo) => {
            this.createFolder(result);
        }, (cancelReason) => {
        });
    }

    createFolder(folderModalInfo: NewFolderModalInfo) {
        const newFolderDTO =
        {
            ContainerID: this.containerID,
            Path: folderModalInfo.parent + folderModalInfo.name
        };
        this.apiService.createFolder(newFolderDTO).subscribe({
            next: (newFolder) => {
                this.refresh(newFolderDTO.Path + '/');
                this.toasterService.success(folderModalInfo.name, 'Folder Created');
            },
            error: (error) => {
                this.toasterService.error(error, 'Error Creating Folder');
            }
        });
    }

    showDeleteFolderModal() {
        const modalInfo = new DeleteFolderModalInfo();
        modalInfo.path = this.selectedFolderPath;
        const modal = this.modalService.open(DeleteFolderModalComponent);
        modal.componentInstance.modalInfo = modalInfo;
        modal.result.then((result: DeleteFolderModalInfo) => {
            this.deleteFolder(result);
        }, (cancelReason) => {
        });
    }

    deleteFolder(folderModalInfo: DeleteFolderModalInfo) {
        let parentPath;
        if(!folderModalInfo.path || folderModalInfo.path == '/') {
            return;
        }
        else {
            const parts = this.selectedFolderPath.split('/')
            parts.splice(parts.length - 2, 1);
            parentPath = parts.join('/')
        }
        this.apiService.deleteFolder(this.containerID, folderModalInfo.path).subscribe({
            next: () => {
                this.refresh(parentPath);
                this.toasterService.success(folderModalInfo.path, 'Folder Deleted');
            },
            error: (error) => {
                this.toasterService.error(error, 'Error Deleting Folder');
            }
        });
    }
}
