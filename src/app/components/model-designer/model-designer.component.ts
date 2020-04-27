import { Component, OnInit, ViewChild, ViewChildren, QueryList, Input, Output, ElementRef, AfterViewInit } from '@angular/core';
import { NgbModal, NgbModalRef, NgbNavChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../../schematrix/services/api.service';
import { ContainerUrlProxy } from '../../schematrix/classes/container-url-proxy';
import { UploadService, UploadStateCode, Upload, UploadState } from '../../services/upload.service';
import { ContainerDTO } from '../../schematrix/classes/container-dto';
import { ManifestDTO } from '../../schematrix/classes/manifest-dto';
import { ManifestFileDTO } from '../../schematrix/classes/manifest-file-dto';
import { ContainerTreeComponent } from '../../components/container-tree/container-tree.component';
import { SignedUrlRequestDTO } from '../../schematrix/classes/signed-url-request-dto';
import { ToastrService } from 'ngx-toastr';

import { Model } from 'elise-graphics/lib/core/model';
import { Region } from 'elise-graphics/lib/core/Region';
import { PointEventParameters } from 'elise-graphics/lib/core/point-event-parameters';
import { DesignController } from 'elise-graphics/lib/design/design-controller';
import { ElementBase } from 'elise-graphics/lib/elements/element-base';
import { EliseDesignComponent } from '../../elise/design/elise-design.component';

import { DesignTool } from 'elise-graphics/lib/design/tools/design-tool';
import { EllipseTool } from 'elise-graphics/lib/design/tools/ellipse-tool';
import { LineTool } from 'elise-graphics/lib/design/tools/line-tool';
import { RectangleTool } from 'elise-graphics/lib/design/tools/rectangle-tool';
import { PenTool } from 'elise-graphics/lib/design/tools/pen-tool';

import { LinearGradientFill } from 'elise-graphics/lib/fill/linear-gradient-fill';
import { RadialGradientFill } from 'elise-graphics/lib/fill/radial-gradient-fill';
import { Color, ViewDragArgs, ImageElement, BitmapResource, ModelResource, ModelElement, model } from 'elise-graphics';
import { Utility } from 'elise-graphics'

import { ImageActionModalComponent, ImageActionModalInfo } from '../image-action-modal/image-action-modal.component';
import { ModelActionModalComponent, ModelActionModalInfo } from '../model-action-modal/model-action-modal.component';
import { NewModelModalComponent, NewModelModalInfo } from '../new-model-modal/new-model-modal.component';

@Component({
    selector: 'app-model-designer',
    templateUrl: './model-designer.component.html',
    styleUrls: ['./model-designer.component.scss']
})
export class ModelDesignerComponent implements OnInit, AfterViewInit {

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

    // currentModal: NgbModalRef;

    folderFiles?: ManifestFileDTO[];
    uploads: Upload[] = [];

    selectedFilePath: string;

    readonly MODEL_MIME_TYPE = 'application/elise';

    // eliseView: EliseDesignComponent;
    controller: DesignController;
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

    activeStroke: string;
    activeFill: string | LinearGradientFill | RadialGradientFill;
    activeTool?: DesignTool;

    _activeToolName: string = 'select';

    model: Model;
    modelContainerID: string;
    modelContainerName: string;
    modelPath: string;

    constructor(
        private apiService: ApiService,
        private uploadService: UploadService,
        private http: HttpClient,
        private toasterService: ToastrService,
        private modalService: NgbModal) {
    }

    ngOnInit() {

        this.activeStroke = 'Black,2';
        this.activeFill = '0.5;White';
    }

    ngAfterViewInit() {
        // this.eliseView = this.eliseViewElementRef.nativeElement;
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

    setActiveTool(tool: DesignTool | null) {
        if (tool) {
            this.activeTool = tool;
            if (this.controller) {
                this.controller.setActiveTool(tool);
                this.controller.selectionEnabled = false;
            }
        }
        else {
            this.activeTool = null;
            if (this.controller) {
                this.controller.clearActiveTool();
                this.controller.selectionEnabled = true;
            }
        }
    }

    set activeToolName(value: string) {
        this._activeToolName = value;
        switch (this.activeToolName.toLowerCase()) {
            case 'select':
                this.setActiveTool(null);
                break;

            case 'pen':
                const penTool = new PenTool();
                penTool.stroke = this.activeStroke;
                this.setActiveTool(penTool);
                break;

            case 'line':
                const lineTool = new LineTool();
                lineTool.stroke = this.activeStroke;
                this.setActiveTool(lineTool);
                break;

            case 'rectangle':
                const rectangleTool = new RectangleTool();
                rectangleTool.stroke = this.activeStroke;
                rectangleTool.fill = this.activeFill;
                this.setActiveTool(rectangleTool);
                break;

            case 'ellipse':
                const ellipseTool = new EllipseTool();
                ellipseTool.stroke = this.activeStroke;
                ellipseTool.fill = this.activeFill;
                this.setActiveTool(ellipseTool);
                break;
        }
    }

    get activeToolName(): string {
        return this._activeToolName;
    }

    onContainerSelected(container: ContainerDTO | null) {
        if (container) {
            // console.log('Host container selected: ' + container.Name);
            this.selectedContainerID = container.ContainerID;
            this.selectedContainerName = container.Name;
            this.selectedFolderPath = null;
            this.containerTree.containerID = container.ContainerID;
            this.containerTree.refresh();
        }
        else {
            // console.log('Host container cleared');
            this.selectedContainerID = null;
            this.selectedContainerName = null;
            this.selectedFolderPath = null;
            this.containerTree.containerID = null;
            this.containerTree.refresh();
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
            if (this.controller) {
                if (this.activeTool) {
                    this.controller.setActiveTool(this.activeTool);
                    this.controller.selectionEnabled = false;
                }
                else {
                    this.controller.clearActiveTool();
                    this.controller.selectionEnabled = true;
                }
            }
        }
        else if (changeEvent.nextId === 2) {
            if (!this.model) {
                this.formattedJson = '';
            }
            else {
                this.formattedJson = this.model.formattedJSON();
            }
            // changeEvent.preventDefault();
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

        const extension = this.getExtension(fileName).toLowerCase();

        switch (extension) {
            case '.mdl':
                {
                    this.loadModelActionModal();
                }
                break;

            case '.jpg':
            case '.gif':
            case '.png':
                {
                    this.loadImageActionModal();
                }
                break;
        }
    }

    loadImageActionModal() {
        const urlRequest = new SignedUrlRequestDTO();
        urlRequest.ContainerID = this.selectedContainerID;
        urlRequest.Path = this.selectedFilePath;
        urlRequest.Verb = 'get';
        this.apiService.getSignedUrl(urlRequest).subscribe({
            next: (signedUrlRequest) => {
                const modalInfo = new ImageActionModalInfo();
                modalInfo.source = signedUrlRequest.Url;
                modalInfo.path = this.selectedFilePath;
                modalInfo.containerID = this.selectedContainerID;
                modalInfo.canEmbed = this.model != null && this.modelContainerID == this.selectedContainerID;
                const modal = this.modalService.open(ImageActionModalComponent, {
                    ariaLabelledBy: 'modal-basic-title',
                    size: 'xl',
                    scrollable: true
                });
                modal.componentInstance.modalInfo = modalInfo;
                modal.result.then((result: ImageActionModalInfo) => {
                    switch (result.action) {
                        case 'view':
                            this.imageActionView(result);
                            break;

                        case 'create-element':
                            this.imageActionCreateElement(result);
                            break;

                        case 'add-resource':
                            break;
                    }
                }, (error) => {
                });
            },
            error: (error) => {
                this.onError(error);
            }
        });
    }

    imageActionView(modalInfo: ImageActionModalInfo) {
        window.open(modalInfo.source);
    }

    imageActionCreateElement(modalInfo: ImageActionModalInfo) {
        const bitmapResource = new BitmapResource();
        bitmapResource.uri = modalInfo.path;
        bitmapResource.image = modalInfo.image;
        bitmapResource.key = Utility.guid();
        this.model.resourceManager.add(bitmapResource);
        const imageElement = ImageElement.create(bitmapResource, 0, 0,
            modalInfo.image.width, modalInfo.image.height);
        imageElement.setInteractive(true);
        imageElement.aspectLocked = true;
        this.controller.addElement(imageElement);
    }

    loadModelActionModal() {
        const urlRequest = new SignedUrlRequestDTO();
        urlRequest.ContainerID = this.selectedContainerID;
        urlRequest.Path = this.selectedFilePath;
        urlRequest.Verb = 'get';
        this.isBusy = true;
        this.apiService.getSignedUrl(urlRequest).subscribe({
            next: (signedUrlRequest) => {
                this.http.get(signedUrlRequest.Url, { responseType: 'text' }).subscribe({
                    next: (modelJson: string) => {
                        try {
                            const model = Model.parse(modelJson);
                            const proxy = new ContainerUrlProxy(this.apiService, this.selectedContainerID);
                            model.resourceManager.urlProxy = proxy;
                            model.prepareResources(null, (result) => {
                                this.isBusy = false;
                                if (result) {
                                    const modalInfo = new ModelActionModalInfo();
                                    modalInfo.model = model;
                                    modalInfo.path = this.selectedFilePath;
                                    modalInfo.containerID = this.selectedContainerID;
                                    modalInfo.containerName = this.selectedContainerName;
                                    modalInfo.canEmbed = this.model != null && this.modelContainerID == this.selectedContainerID;
                                    const wr = Math.min((window.innerWidth - 360), 1000) / model.getSize().width;
                                    const hr = (window.innerHeight - 360) / model.getSize().height;
                                    modalInfo.scale = Math.min(wr, hr);
                                    modalInfo.info = model.getSize().width + 'x' + model.getSize().height;
                                    const modal = this.modalService.open(ModelActionModalComponent, {
                                        ariaLabelledBy: 'modal-basic-title',
                                        size: 'xl',
                                        scrollable: true
                                    });
                                    modal.componentInstance.modalInfo = modalInfo;
                                    modal.result.then((result: ModelActionModalInfo) => {
                                        switch (result.action) {
                                            case 'edit':
                                                this.modelActionEdit(result);
                                                break;

                                            case 'create-element':
                                                this.modelActionCreateElement(result);
                                                break;

                                            case 'add-resource':
                                                break;
                                        }
                                    }, (error) => {
                                    });
                                }
                                else {
                                    this.onError('Error loading preview model resources.');
                                }
                            });
                        }
                        catch (error) {
                            this.isBusy = false;
                            this.onError(error);
                        }
                    },
                    error: (error) => {
                        this.isBusy = false;
                        this.onError(error);
                    }
                })
            },
            error: (error) => {
                this.isBusy = false;
                this.onError(error);
            }
        });
    }

    modelActionEdit(modalInfo: ModelActionModalInfo) {
        this.modelContainerID = modalInfo.containerID;
        this.modelContainerName = modalInfo.containerName;
        this.modelPath = modalInfo.path;
        const model = modalInfo.model;
        for (const el of model.elements) {
            el.setInteractive(true);
        }
        this.scale = 1.0;
        this.model = model;
        this.modelEditorNavId = 1;
    }

    modelActionCreateElement(modalInfo: ModelActionModalInfo) {
        const modelResource = new ModelResource();
        modelResource.uri = modalInfo.path;
        modelResource.model = modalInfo.model;
        modelResource.key = Utility.guid();
        this.model.resourceManager.add(modelResource);
        const modelElement = ModelElement.create(modelResource, 0, 0,
            modalInfo.model.getSize().width, modalInfo.model.getSize().height);
        modelElement.setInteractive(true);
        modelElement.aspectLocked = true;
        this.controller.addElement(modelElement);
    }

    setModel(model: Model, modelContainerID: string, modelContainerName: string, modelPath: string) {
        if (model !== this.model) {
            this.modelContainerID = modelContainerID;
            this.modelContainerName = modelContainerName;
            this.modelPath = modelPath;
            const proxy = new ContainerUrlProxy(this.apiService, modelContainerID);
            model.resourceManager.urlProxy = proxy;
            model.prepareResources(null, (result) => {
                if (result) {
                    for (const el of model.elements) {
                        el.setInteractive(true);
                    }
                    this.scale = 1.0;
                    this.model = model;
                    this.modelEditorNavId = 1;
                }
                else {
                    this.onError('Error loading model resources.');
                }
            });
        }
    }

    ensureExtension(input: string, extension: string) {
        if (!input.toLowerCase().endsWith(extension.toLowerCase())) {
            input = input + extension;
        }
        return input;
    }

    getPathDirectory(path: string) {
        const index = path.lastIndexOf('/');
        return path.substr(0, index + 1);
    }

    getExtension(path: string) {
        const index = path.lastIndexOf('.');
        if (index < 0) {
            return '';
        }
        return path.substr(index);
    }

    showNewModelModal() {
        const modalInfo = new NewModelModalInfo();
        modalInfo.width = 1024;
        modalInfo.height = 768;
        modalInfo.backgroundColor = Color.Transparent;
        modalInfo.backgroundOpacity = 255;
        modalInfo.backgroundColorDisplay = Color.Transparent;
        const modal = this.modalService.open(NewModelModalComponent);
        modal.componentInstance.modalInfo = modalInfo;
        modal.result.then((result: NewModelModalInfo) => {
            this.createModel(result);
        }, (error) => {
        });
    }

    createModel(modalInfo: NewModelModalInfo) {

        this.isBusy = true;

        // Create model from modal settings
        const model = Model.create(modalInfo.width, modalInfo.height);
        model.fill = modalInfo.backgroundColorDisplay.toString();
        const serializedModel = model.rawJSON();
        modalInfo.name = this.ensureExtension(modalInfo.name, '.mdl');
        const newModelPath = this.selectedFolderPath + modalInfo.name;

        // Save model
        const urlRequest = new SignedUrlRequestDTO();
        urlRequest.ContainerID = this.selectedContainerID;
        urlRequest.Path = newModelPath;
        urlRequest.ContentType = this.MODEL_MIME_TYPE;
        urlRequest.Verb = 'put';
        this.isBusy = true;
        this.apiService.getSignedUrl(urlRequest).subscribe({
            next: (signedUrlRequest) => {
                const upload = Upload.createDataUpload(newModelPath, this.MODEL_MIME_TYPE, serializedModel.length, signedUrlRequest.Url, serializedModel, null);
                upload.state = new UploadState(UploadStateCode.QUEUED, 0, "Creating");
                upload.containerID = this.selectedContainerID;
                upload.folderPath = this.selectedFolderPath;
                upload.removeOnFailure = true;
                upload.removeOnSuccess = true;
                upload.callback.subscribe({
                    next: (result) => {
                        this.isBusy = false;
                        if (result.success) {
                            this.setModel(model, this.selectedContainerID, this.selectedContainerName, newModelPath);
                            this.toasterService.success(upload.name, 'Model Created');
                            if (upload.folderPath === this.selectedFolderPath) {
                                this.listFolderFiles();
                            }
                        }
                        else {
                            if (upload.state.code == UploadStateCode.FAILED) {
                                this.onError(upload.name, 'Model Create Error');
                            }
                            if (upload.state.code == UploadStateCode.ABORTED) {
                                this.onError(upload.name, 'Model Create Aborted');
                            }
                        }
                        const index = this.uploads.indexOf(upload);
                        if (index != -1) {
                            this.uploads.splice(index, 1);
                        }
                    }
                });
                this.uploads.push(upload);
                this.uploadService.queue(upload);
            },
            error: (error) => {
                this.isBusy = false;
                this.onError(error);
            }
        });
    }

    saveModel() {
        this.isBusy = true;

        // Create Elise model
        const serializedModel = this.model.rawJSON();

        const urlRequest = new SignedUrlRequestDTO();
        urlRequest.ContainerID = this.modelContainerID;
        urlRequest.Path = this.modelPath;
        urlRequest.ContentType = this.MODEL_MIME_TYPE;
        urlRequest.Verb = 'put';
        this.isBusy = true;
        this.apiService.getSignedUrl(urlRequest).subscribe({
            next: (signedUrlRequest) => {
                const upload = Upload.createDataUpload(this.modelPath, this.MODEL_MIME_TYPE, serializedModel.length, signedUrlRequest.Url, serializedModel, null);
                upload.state = new UploadState(UploadStateCode.QUEUED, 0, "Creating");
                upload.containerID = this.modelContainerID;
                upload.folderPath = this.getPathDirectory(this.modelPath);
                upload.removeOnFailure = true;
                upload.removeOnSuccess = true;
                upload.callback.subscribe({
                    next: (result) => {
                        this.isBusy = false;
                        if (result.success) {
                            this.toasterService.success(upload.name, 'Model Saved');
                            if (upload.containerID == this.selectedContainerID && upload.folderPath === this.selectedFolderPath) {
                                this.listFolderFiles();
                            }
                        }
                        else {
                            if (upload.state.code == UploadStateCode.FAILED) {
                                this.onError(`Model ${upload.name} could not be saved.`, 'model-editor');
                            }
                            if (upload.state.code == UploadStateCode.ABORTED) {
                                this.onError(`Model ${upload.name} save was aborted.`, 'model-editor');
                            }
                        }
                        const index = this.uploads.indexOf(upload);
                        if (index != -1) {
                            this.uploads.splice(index, 1);
                        }
                    }
                });
                if (upload.containerID == this.selectedContainerID && upload.folderPath == this.selectedFolderPath) {
                    this.uploads.push(upload);
                }
                this.uploadService.queue(upload);
            },
            error: (error) => {
                this.isBusy = false;
                this.onError(error, 'model-editor');
            }
        });
    }

    mouseEnteredView(e: PointEventParameters) {
        this.mouseOverView = true;
        // this.log(`Mouse Entered View`);
    }

    mouseLeftView(e: PointEventParameters) {
        this.mouseOverView = false;
        // this.log(`Mouse Left View`);
    }

    mouseMovedView(e: PointEventParameters) {
        this.viewMouseX = Math.round(e.point.x);
        this.viewMouseY = Math.round(e.point.y);
    }

    mouseDownView(e: PointEventParameters) {
        this.log(`Mouse Down View: ${e.point.x}:${e.point.y}`);
    }

    mouseUpView(e: PointEventParameters) {
        // this.log(`Mouse Up View: ${e.point.x}:${e.point.y}`);
    }

    mouseEnteredElement(e: ElementBase) {
        // this.log(`Mouse entered element: ${e.describe()}`);
    }

    mouseLeftElement(e: ElementBase) {
        // this.log(`Mouse left element: ${e.describe()}`);
    }

    mouseDownElement(e: ElementBase) {
        // this.log(`Mouse down element: ${e.describe()}`);
    }

    mouseUpElement(e: ElementBase) {
        // this.log(`Mouse up element: ${e.describe()}`);
    }

    elementClicked(e: ElementBase) {
        // this.log(`Element clicked: ${e.describe()}`);
    }

    controllerSet(controller: DesignController) {
        this.controller = controller;
        if (!this.controller) {
            return;
        };
        if (this.activeTool) {
            this.controller.setActiveTool(this.activeTool);
            this.controller.selectionEnabled = false;
        }
        else {
            this.controller.clearActiveTool();
            this.controller.selectionEnabled = true;
        }
    }

    selectionChanged(c: number) {
        this.log(`Selection Changed: ${c} items`);
    }

    elementCreated(r: Region) {
        this.log(`Element created (${r.x},${r.y}) ${r.width}x${r.height}`);
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
