import { Component, OnInit, ViewChild, ViewChildren, QueryList, Input, Output, ElementRef, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { NgModel } from '@angular/forms';
import { ContainerTreeComponent } from '../../components/container-tree/container-tree.component';
import { NgbModal, NgbNavChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { ContainerUrlProxy } from '../../schematrix/classes/container-url-proxy';

import { ContainerDTO } from '../../schematrix/classes/container-dto';
import { ManifestDTO } from '../../schematrix/classes/manifest-dto';
import { ManifestFileDTO } from '../../schematrix/classes/manifest-file-dto';
import { SignedUrlRequestDTO } from '../../schematrix/classes/signed-url-request-dto';

// Services
import { ApiService } from '../../schematrix/services/api.service';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { ModelService } from '../../services/model.service';
import { UploadService, UploadStateCode, Upload } from '../../services/upload.service';

// Elise core classes
import { Model, ViewDragArgs } from 'elise-graphics';
import { ViewController } from 'elise-graphics';

import { default as elise } from 'elise-graphics/lib/index';

@Component({
    selector: 'app-model-playground',
    templateUrl: './model-playground.component.html',
    styleUrls: ['./model-playground.component.scss']
})
export class ModelPlaygroundComponent implements OnInit, AfterViewInit {

    @ViewChild(ContainerTreeComponent, { static: true })
    containerTree: ContainerTreeComponent;

    @ViewChildren('fileUploadInput', { read: ElementRef })
    fileUploadInputRefs: QueryList<ElementRef>;
    fileUploadInputElement: HTMLInputElement;

    @ViewChild('elise', { read: ElementRef, static: false })
    eliseViewElementRef: ElementRef;

    selectedContainerID: string | null;
    selectedContainerName: string;
    @Output() public selectedFolderPath?: string;

    folderFiles?: ManifestFileDTO[];
    uploads: Upload[] = [];

    selectedFilePath: string;

    readonly MODEL_MIME_TYPE = 'application/elise';

    controller: ViewController;
    lastMessage = '-';
    scale = 1;
    background = 'grid';
    viewMouseX: number;
    viewMouseY: number;
    modelEditorNavId: number;
    mouseOverView = false;
    formattedJson: string;
    isBusy: boolean = false;
    isDragging: boolean = false;

    model: Model;
    modelContainerID: string;
    modelContainerName: string;
    modelPath: string;

    playgroundText: string;
    scriptError: string;

    constructor(
        private apiService: ApiService,
        private uploadService: UploadService,
        private toasterService: ToastrService,
        private modelService: ModelService) {
    }

    ngOnInit() {
        this.loadModel('samples', 'simple');
    }

    runScript() {
        this.evaluate();
        if(this.scriptError == null) {
            this.modelEditorNavId = 2;
        }
    }

    evaluate() {
        try {
            const wrapped = `(function(elise) {
                ${this.playgroundText}
            })`;
            const modelFunction = eval(wrapped);
            const model = modelFunction(elise);
            if(this.selectedContainerID) {
                const proxy = new ContainerUrlProxy(this.apiService, this.selectedContainerID);
                model.resourceManager.urlProxy = proxy;
            }
            model.prepareResources(null, (result) => {
                if (result) {
                    this.model = model;
                    this.scriptError = null;
                }
                else {
                    this.scriptError = 'Error loading model resources.';
                    this.toasterService.error(this.scriptError);
                }
            });
        }
        catch(error) {
            this.scriptError = 'Error in model code. ' + error;
            this.toasterService.error(this.scriptError);
        }
    }

    loadModel(type:string, name: string) {
        this.modelService.getModel(type, name).subscribe({
            next: (modelData) => {
                this.playgroundText = modelData;
                this.evaluate();
            },
            error: (er) => {
                this.toasterService.error('Unable to load model. ' + er);
                // this.model = Model.create(1, 1);
            }
        });
    }

    ngAfterViewInit() {
        this.fileUploadInputRefs.changes.subscribe((refs: QueryList<ElementRef>) => {
            if (refs.length > 0) {
                this.fileUploadInputElement = refs.first.nativeElement;
            }
            else {
                this.fileUploadInputElement = undefined;
            }
        });
    }

    backgroundClass() {
        return {
            'view-host': true,
            'border': true,
            grid: this.background === 'grid',
            black: this.background === 'black',
            white: this.background === 'white',
            gray: this.background === 'gray',
            'fileover': true
        };
    }

    onContainerSelected(container: ContainerDTO | null) {
        if (container) {
            this.selectedContainerID = container.ContainerID;
            this.selectedContainerName = container.Name;
            this.selectedFolderPath = null;
            this.containerTree.containerID = container.ContainerID;
            this.containerTree.refresh();
        }
        else {
            this.selectedContainerID = null;
            this.selectedContainerName = null;
            this.selectedFolderPath = null;
            this.containerTree.containerID = null;
            this.containerTree.refresh();
            if (this.controller) {
                this.controller.detach();
                this.model = null;
            }
        }
    }

    onContainerDeleted(containerId: string) {
        if (containerId === this.selectedContainerID) {
            if (this.controller) {
                this.controller.model = null;
                this.controller.detach();
            }
            this.model = null;
        }
    }

    onFolderPathSelected(folderPath: string | null) {
        this.selectedFolderPath = folderPath;
        this.listFolderFiles();
        this.refreshUploads();
    }

    refreshUploads() {
        this.uploads = [];
        if (this.uploadService.uploads) {
            this.uploadService.uploads.forEach(upload => {
                if (upload.containerID === this.selectedContainerID && upload.folderPath === this.selectedFolderPath) {
                    this.uploads.push(upload);
                }
            })
        }
    }

    listFolderFiles() {
        this.folderFiles = null;
        if (!this.selectedContainerID) {
            return;
        }
        this.apiService.getContainerManifest(this.selectedContainerID, false, this.selectedFolderPath, true, true, false).subscribe({
            next: (manifest: ManifestDTO) => {
                this.folderFiles = [];
                if (manifest.Files) {
                    manifest.Files.forEach(file => {
                        this.folderFiles.push(file);
                    });
                }
            },
            error: (err) => {
                this.onError(err);
            }
        });
    }

    onNavChange(changeEvent: NgbNavChangeEvent) {
        if (changeEvent.nextId === 1) {
        }
        else if (changeEvent.nextId === 2) {
            this.evaluate();
        }
    }

    onError(error, title?) {
        console.log(error);
        this.toasterService.error(error, title);
    }

    onFileDropped($event) {
        this.uploadFiles($event);
    }

    uploadFiles(files: File[]) {
        for (const file of files) {
            this.uploadFile(file);
        }
        this.fileUploadInputElement.value = null;
    }

    uploadFile(file: File) {
        const urlRequest = new SignedUrlRequestDTO();
        urlRequest.ContainerID = this.selectedContainerID;
        urlRequest.Path = this.selectedFolderPath + file.name;
        urlRequest.ContentType = file.type;
        urlRequest.Verb = 'put';
        this.apiService.getSignedUrl(urlRequest).subscribe({
            next: (signedUrlRequest) => {
                // Start upload using signed URL
                const upload = new Upload(file.name, file.type, file.size, signedUrlRequest.Url);
                upload.containerID = this.selectedContainerID;
                upload.folderPath = this.selectedFolderPath;
                upload.file = file;
                upload.removeOnFailure = true;
                upload.removeOnSuccess = true;
                upload.callback.subscribe({
                    next: (result) => {
                        if (result.success) {
                            console.log('Upload callback: Success');
                            this.toasterService.success(upload.name, 'File Upload Complete')
                            if (upload.containerID == this.selectedContainerID && upload.folderPath === this.selectedFolderPath) {
                                this.listFolderFiles();
                            }
                        }
                        else {
                            if (upload.state.code == UploadStateCode.FAILED) {
                                this.onError(`Upload of ${upload.name} failed.`);
                            }
                            if (upload.state.code == UploadStateCode.ABORTED) {
                                this.onError(`Upload of ${upload.name} was aborted.`);
                            }
                        }
                        const index = this.uploads.indexOf(upload);
                        if (index != -1) {
                            this.uploads.splice(index, 1);
                        }
                    }
                });
                this.uploads.push(upload);
                // upload.state = new UploadState(UploadStateCode.QUEUED, 50, '');
                this.uploadService.queue(upload);
            },
            error: (error) => {
                this.onError(error);
            }
        });
    }

    cancelUpload(upload: Upload) {
        this.uploadService.remove(upload);
        this.refreshUploads();
    }

    selectFile(fileName: string) {
        // Handle file types
        this.selectedFilePath = this.selectedFolderPath + fileName;
    }

    controllerSet(controller: ViewController) {
        this.controller = controller;
        if (!this.controller) {
            return;
        };
        // this.controller.renderer = new DesignRenderer(this.controller);
    }

    viewDragEnter(args: ViewDragArgs) {
        this.isDragging = true;
    }

    viewDragLeave(args: ViewDragArgs) {
        this.isDragging = false;
    }

    log(message: string) {
        this.lastMessage = message;
    }

}
