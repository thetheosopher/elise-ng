import { Component, OnInit, ViewChild, ViewChildren, QueryList, Input, Output, ElementRef, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../../schematrix/services/api.service';
import { UploadService, UploadStateCode, Upload, UploadState } from '../../services/upload.service';
import { ContainerDTO } from '../../schematrix/classes/container-dto';
import { ManifestDTO } from '../../schematrix/classes/manifest-dto';
import { ManifestFileDTO } from '../../schematrix/classes/manifest-file-dto';
import { ContainerTreeComponent } from '../../components/container-tree/container-tree.component';
import { SignedUrlRequestDTO } from '../../schematrix/classes/signed-url-request-dto';
import { AlertService } from '../../services/alert.service';

import { Model } from 'elise-graphics/lib/core/model';
import { Region } from 'elise-graphics/lib/core/Region';
import { PointEventParameters } from 'elise-graphics/lib/core/point-event-parameters';
import { DesignController } from 'elise-graphics/lib/design/design-controller';
import { ElementBase } from 'elise-graphics/lib/elements/element-base';
import { EliseDesignComponent } from '../../elise/design/elise-design.component';

import { DesignTool } from 'elise-graphics/lib/design/tools/design-tool';
import { LineTool } from 'elise-graphics/lib/design/tools/line-tool';

import { LinearGradientFill } from 'elise-graphics/lib/fill/linear-gradient-fill';
import { RadialGradientFill } from 'elise-graphics/lib/fill/radial-gradient-fill';
import { Color, NamedColor, ViewDragArgs, ImageElement, BitmapResource } from 'elise-graphics';
import { Utility } from 'elise-graphics'

declare var $: any;

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

    @ViewChild('elise', { read: ElementRef, static: true })
    eliseViewElementRef: ElementRef;

    selectedContainerID: string | null;
    selectedContainerName: string;
    @Output() public selectedFolderPath?: string;

    folderFiles?: ManifestFileDTO[];
    uploads: Upload[] = [];

    selectedFilePath: string;

    readonly MODEL_MIME_TYPE = 'application/elise';

    eliseView: EliseDesignComponent;
    controller: DesignController;
    lastMessage = '-';
    scale = 1;
    background = 'black';
    viewMouseX: number;
    viewMouseY: number;
    mouseOverView = false;
    displayModel = true;
    formattedJson: string;
    isBusy: boolean = false;
    isDragging: boolean = false;

    _selectionEnabled: boolean;
    _activeStroke: string;
    _activeFill: string | LinearGradientFill | RadialGradientFill;
    _activeTool: LineTool;

    creatingModel: boolean;
    newModelName: string;
    newModelWidth?: number = 1024;
    newModelHeight?: number = 768;
    newModelBackgroundColor: Color = Color.Transparent;
    newModelBackgroundOpacity: number = 255;
    newModelBackgroundColorDisplay: Color = Color.Transparent;

    model: Model;
    modelContainerID: string;
    modelContainerName: string;
    modelPath: string;

    imagePreviewSource: string;

    constructor(
        private apiService: ApiService,
        private uploadService: UploadService,
        private http: HttpClient,
        private alertService: AlertService) {
    }

    ngOnInit() {

        this._activeStroke = 'Black,2';
        this._activeFill = '0.5;White';

        const lineTool = new LineTool();
        lineTool.stroke = this._activeStroke;
        this._activeTool = lineTool;

        $('[data-toggle="tooltip"]').tooltip();
    }

    ngAfterViewInit() {
        this.eliseView = this.eliseViewElementRef.nativeElement;
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

    @Input()
    set selectionEnabled(enabled: boolean) {
        if (enabled != this._selectionEnabled) {
            this._selectionEnabled = enabled;
            if (enabled) {
                if (this.controller) {
                    this.controller.clearActiveTool();
                }
            }
            else {
                if (this._activeTool) {
                    if (this.controller) {
                        this.controller.setActiveTool(this._activeTool);
                    }
                }
            }
        }
    }

    get selectionEnabled(): boolean {
        return this._selectionEnabled;
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

    onError(error, alertId = 'container-explorer') {
        console.log(error);
        this.alertService.error(error, { id: alertId });
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
                            this.alertService.success(`Upload of ${upload.name} succeeded.`, { autoClose: true, id: 'container-explorer' });
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
        // alert(file);

        // Handle file types
        this.selectedFilePath = this.selectedFolderPath + fileName;

        const extension = this.getExtension(fileName).toLowerCase();

        switch (extension) {
            case '.mdl':
                {
                    $("#modelActionModal").modal();
                }
                break;

            case '.jpg':
            case '.gif':
            case '.png':
                {
                    this.loadImagePreview();
                }
                break;
        }

        if (fileName.toLowerCase().endsWith('.mdl')) {
            $("#modelActionModal").modal('show');
        }
    }

    loadImagePreview() {
        const urlRequest = new SignedUrlRequestDTO();
        urlRequest.ContainerID = this.selectedContainerID;
        urlRequest.Path = this.selectedFilePath;
        urlRequest.Verb = 'get';
        this.apiService.getSignedUrl(urlRequest).subscribe({
            next: (signedUrlRequest) => {
                this.imagePreviewSource = signedUrlRequest.Url;
                // $("#imagePreviewModal").modal();
            },
            error: (error) => {
                this.onError(error);
            }
        });
    }

    imagePreviewLoaded() {
        $("#imagePreviewModal").modal();
    }

    imageActionView() {
        $("#imagePreviewModal").modal('hide');
        this.loadImage(this.selectedFilePath);
    }

    imageActionCreateElement() {
        $("#imagePreviewModal").modal('hide');
        const imageResourcePath = this.selectedFilePath;
        const urlRequest = new SignedUrlRequestDTO();
        urlRequest.ContainerID = this.selectedContainerID;
        urlRequest.Path = imageResourcePath;
        urlRequest.Verb = 'get';
        this.apiService.getSignedUrl(urlRequest).subscribe({
            next: (signedUrlRequest) => {
                const image = new Image();
                image.onload = e => {
                    const bitmapResource = new BitmapResource();
                    bitmapResource.uri = this.selectedFilePath;
                    bitmapResource.image = image;
                    bitmapResource.key = Utility.guid();
                    this.model.resourceManager.add(bitmapResource);
                    const imageElement = ImageElement.create(bitmapResource, 0, 0, image.width, image.height);
                    imageElement.setInteractive(true);
                    imageElement.aspectLocked = true;
                    this.controller.addElement(imageElement);
                };
                image.src = signedUrlRequest.Url;
            },
            error: (error) => {
                this.onError(error);
            }
        });
    }

    loadImage(filePath: string) {
        const urlRequest = new SignedUrlRequestDTO();
        urlRequest.ContainerID = this.selectedContainerID;
        urlRequest.Path = filePath;
        // urlRequest.ContentType = this.MODEL_MIME_TYPE;
        urlRequest.Verb = 'get';
        this.apiService.getSignedUrl(urlRequest).subscribe({
            next: (signedUrlRequest) => {
                window.open(signedUrlRequest.Url);
            },
            error: (error) => {
                this.onError(error);
            }
        });
    }

    modelActionLoad() {
        $("#modelActionModal").modal('hide');
        this.loadModel(this.selectedFilePath);
    }

    modelActionEmbed() {
        $("#modelActionModal").modal('hide');
        // this.loadModel(this.selectedFilePath);
    }

    setModel(model: Model, modelContainerID: string, modelContainerName: string, modelPath: string) {
        if (model !== this.model) {
            var self = this;
            this.modelContainerID = modelContainerID;
            this.modelContainerName = modelContainerName;
            this.modelPath = modelPath;
            model.prepareResources(null, function (result) {
                if (result) {
                    for (const el of model.elements) {
                        el.setInteractive(true);
                    }
                    self.model = model;
                    if (self.displayModel) {
                        self.formattedJson = model.formattedJSON();
                    }
                }
                else {
                    this.onError('Error loading model resources.', 'model-editor');
                }
            });
        }
    }

    loadModel(modelPath: string) {
        const urlRequest = new SignedUrlRequestDTO();
        urlRequest.ContainerID = this.selectedContainerID;
        urlRequest.Path = modelPath;
        urlRequest.ContentType = this.MODEL_MIME_TYPE;
        urlRequest.Verb = 'get';
        this.apiService.getSignedUrl(urlRequest).subscribe({
            next: (signedUrlRequest) => {
                // window.open(signedUrlRequest.Url);
                this.http.get(signedUrlRequest.Url, { responseType: 'text' }).subscribe({
                    next: (modelJson: string) => {
                        try {
                            const model = Model.parse(modelJson);
                            this.setModel(model, this.selectedContainerID, this.selectedContainerName, modelPath);
                        }
                        catch (error) {
                            this.onError(error);
                        }
                    },
                    error: (error) => {
                        this.onError(error);
                    }
                })
            },
            error: (error) => {
                this.onError(error);
            }
        });
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

    createModel(newmodelform) {

        this.creatingModel = true;

        // Create Elise model
        const model = Model.create(this.newModelWidth, this.newModelHeight);
        model.fill = this.newModelBackgroundColorDisplay.toString();
        const serializedModel = model.rawJSON();

        this.newModelName = this.ensureExtension(this.newModelName, '.mdl');
        const newModelPath = this.selectedFolderPath + this.newModelName;

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
                        this.creatingModel = false;
                        this.isBusy = false;
                        $("#newModelModal").modal('hide');
                        if (result.success) {
                            this.setModel(model, this.selectedContainerID, this.selectedContainerName, newModelPath);
                            this.newModelName = '';
                            this.alertService.success(`Model ${upload.name} created.`, { autoClose: true, id: 'model-editor' });
                            if (upload.folderPath === this.selectedFolderPath) {
                                this.listFolderFiles();
                            }
                        }
                        else {
                            if (upload.state.code == UploadStateCode.FAILED) {
                                this.onError(`Model ${upload.name} could not be created.`, 'model-editor');
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
                this.uploads.push(upload);
                this.uploadService.queue(upload);
            },
            error: (error) => {
                this.isBusy = false;
                this.creatingModel = false;
                $("#newModelModal").modal('hide');
                this.onError(error, 'model-editor');
            }
        });
    }

    saveModel(newmodelform) {
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
                            this.alertService.success(`Model ${upload.name} saved.`, { autoClose: true, id: 'model-editor' });
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

    onNewModelBackgroundColorSelected(color) {
        this.newModelBackgroundColor = color.color;
        if (color.color.a === 0) {
            this.newModelBackgroundColorDisplay = Color.Transparent;
        }
        else {
            this.newModelBackgroundColorDisplay = new Color(this.newModelBackgroundOpacity, color.color.r, color.color.g, color.color.b);
        }
    }

    onNewModelBackgroundOpacityChanged(event) {
        this.newModelBackgroundOpacity = parseInt(event.target.value);
        if (this.newModelBackgroundColor.a === 0) {
            this.newModelBackgroundColorDisplay = Color.Transparent;
        }
        else {
            this.newModelBackgroundColorDisplay.r = this.newModelBackgroundColor.r;
            this.newModelBackgroundColorDisplay.g = this.newModelBackgroundColor.g;
            this.newModelBackgroundColorDisplay.b = this.newModelBackgroundColor.b;
            this.newModelBackgroundColorDisplay.a = this.newModelBackgroundOpacity;
        }
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
        this.controller.selectionEnabled = this._selectionEnabled;
        if (!this._selectionEnabled) {
            if (this._activeTool) {
                this.controller.setActiveTool(this._activeTool);
            }
            else {
                this.controller.clearActiveTool();
            }
        }
        else {
            this.controller.clearActiveTool();
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