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
import { FontService } from '../../services/font.service';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { UploadService, UploadStateCode, Upload, UploadState } from '../../services/upload.service';

// Elise core classes
import { BitmapResource, Color, Model, ModelResource, Point, Region, Resource, Size } from 'elise-graphics';
import { FillInfo, LinearGradientFill, PointEventParameters, RadialGradientFill, StrokeInfo, ViewDragArgs } from 'elise-graphics';
import { ElementBase, ImageElement, ModelElement, TextElement } from 'elise-graphics';
import { DesignController } from 'elise-graphics';

// Design tools
import { DesignTool, EllipseTool, ImageElementTool, LineTool, ModelElementTool,
            PenTool, PolygonTool, PolylineTool, RectangleTool, TextTool } from 'elise-graphics';

// Modals
import { ImageActionModalComponent, ImageActionModalInfo } from '../image-action-modal/image-action-modal.component';
import { ModelActionModalComponent, ModelActionModalInfo } from '../model-action-modal/model-action-modal.component';
import { NewModelModalComponent, NewModelModalInfo } from '../new-model-modal/new-model-modal.component';
import { StrokeModalComponent, StrokeModalInfo } from '../stroke-modal/stroke-modal.component';
import { FillModalComponent, FillModalInfo } from '../fill-modal/fill-modal.component';
import { ImageElementModalComponent, ImageElementModalInfo } from '../image-element-modal/image-element-modal.component';
import { ModelElementModalComponent, ModelElementModalInfo } from '../model-element-modal/model-element-modal.component';
import { TextElementModalComponent, TextElementModalInfo } from '../text-element-modal/text-element-modal.component';
import { SizeModalComponent, SizeModalInfo } from '../size-modal/size-modal.component';

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
    selectedElementCount: number = 0;
    lowestSelectedIndex: number;
    highestSelectedIndex: number;
    singleElementType: string;

    strokeType: string = 'color';
    strokeColor: string = ('#000000cc');
    strokeWidth: number = 2;
    strokeTooltip: string;
    applyStrokeToModel: boolean = false;
    applyStrokeToSelected: boolean = true;
    activeStroke: string;

    fillType: string = 'color';
    fillColor: string = '#ffffffff';
    fillOpacity: number = 1;
    fillScale: number = 1;
    fillTooltip: string;
    fillBitmapSource: string;
    fillModelSource: string;
    fillgradientColor1: string = "#000000ff";
    fillgradientColor2: string = "#ffffffff";
    fillLinearGradientStartX: number = 0;
    fillLinearGradientStartY: number = 0;
    fillLinearGradientEndX: number = 100;
    fillLinearGradientEndY: number = 100;
    fillRadialGradientCenterX: number = 50;
    fillRadialGradientCenterY: number = 50;
    fillRadialGradientFocusX: number = 50;
    fillRadialGradientFocusY: number = 50;
    fillRadialGradientRadiusX: number = 50;
    fillradialGradientRadiusY: number = 50;

    applyFillToModel: boolean = false;
    applyFillToSelected: boolean = true;
    activeFill: string | LinearGradientFill | RadialGradientFill;

    textToolTypeface = 'Sans-Serif';
    textToolTypesize = 32;
    textToolIsBold = false;
    textToolIsItalic = false;
    textToolHAlign = 'left';
    textToolVAlign = 'top';
    textToolText = 'Text Element Content';

    activeTool?: DesignTool;
    toolOpacity: number = 255;
    toolLockAspect: boolean = true;

    _activeToolName: string = 'select';

    model: Model;
    modelContainerID: string;
    modelContainerName: string;
    modelPath: string;

    constructor(
        private apiService: ApiService,
        private fontService: FontService,
        private uploadService: UploadService,
        private http: HttpClient,
        private toasterService: ToastrService,
        private modalService: NgbModal,
        private changeDetectorRef: ChangeDetectorRef) {
    }

    ngOnInit() {
        this.setColorStroke(this.strokeColor, this.strokeWidth, false, false);
        this.activeFill = 'White';
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

    setStroke(stroke: string, updateSelectedElements: boolean, updateModel: boolean) {
        this.activeStroke = stroke;
        if (this.activeTool) {
            this.activeTool.stroke = this.activeStroke;
        }
        if (updateSelectedElements && this.controller && this.controller.selectedElementCount() > 0) {
            const selectedElements = this.controller.selectedElements;
            selectedElements.forEach(selectedElement => {
                if (selectedElement.canStroke()) {
                    selectedElement.setStroke(this.activeStroke);
                }
            });
        }
        if (updateModel) {
            this.model.setStroke(this.activeStroke);
        }
        if (updateSelectedElements || updateModel) {
            this.controller.draw();
        }
    }

    setNoStroke(updateSelectedElements: boolean, updateModel: boolean) {
        this.strokeType = 'none';
        this.strokeTooltip = 'No Stroke';
        this.setStroke(null, updateSelectedElements, updateModel);
    }

    setColorStroke(color: string, width: number, updateSelectedElements: boolean, updateModel: boolean) {
        this.strokeType = 'color';
        this.strokeColor = color;
        this.strokeWidth = width;
        let stroke = color;
        if (width != 1) {
            stroke += ',' + width;
        }
        this.strokeTooltip = color;
        this.setStroke(stroke, updateSelectedElements, updateModel);
    }

    setFill(fill: string | RadialGradientFill | LinearGradientFill, fillScale: number | null,
        updateSelectedElements: boolean, updateModel: boolean) {
        this.activeFill = fill;
        if (this.activeTool) {
            this.activeTool.fill = this.activeFill;
            this.activeTool.fillScale = this.fillScale;
        }
        if (updateSelectedElements && this.controller && this.controller.selectedElementCount() > 0) {
            const selectedElements = this.controller.selectedElements;
            selectedElements.forEach(selectedElement => {
                if (selectedElement.canFill()) {
                    selectedElement.setFill(this.activeFill);
                    if (fillScale) {
                        selectedElement.setFillScale(fillScale);
                    }
                    else {
                        selectedElement.fillScale = undefined;
                    }
                }
            });
        }
        if (updateModel) {
            this.model.setFill(this.activeFill);
            if (fillScale) {
                this.model.setFillScale(fillScale);
            }
            else {
                this.model.fillScale = undefined;
            }
        }
        if (updateModel || updateSelectedElements) {
            this.controller.draw();
        }
    }

    setNoFill(updateSelectedElements: boolean, updateModel: boolean) {
        this.fillType = 'none';
        this.fillTooltip = 'No Fill';
        this.setFill(null, null, updateSelectedElements, updateModel);
    }

    setColorFill(color: string, updateSelectedElements: boolean, updateModel: boolean) {
        this.fillType = 'color';
        this.fillColor = color;
        this.fillTooltip = color;
        this.setFill(color, null, updateSelectedElements, updateModel);
    }

    setImageFill(bitmapResourceKey: string, opacity: number, scale: number, updateSelectedElements: boolean, updateModel: boolean) {
        this.fillType = 'image';
        this.fillBitmapSource = bitmapResourceKey;
        this.fillOpacity = opacity;
        this.fillTooltip = 'Image';
        this.fillScale = scale;
        let fill: string = this.fillBitmapSource;
        if (opacity !== 1) {
            fill = (opacity / 255).toString() + ';' + fill;
        }
        fill = `image(${fill})`;
        this.setFill(fill, scale, updateSelectedElements, updateModel);
    }

    setModelFill(modelResourceKey: string, opacity: number, scale: number, updateSelectedElements: boolean, updateModel: boolean) {
        this.fillType = 'model';
        this.fillModelSource = modelResourceKey;
        this.fillOpacity = opacity;
        this.fillTooltip = 'Model';
        this.fillScale = scale;
        let fill: string = this.fillModelSource;
        if (opacity !== 1) {
            fill = (opacity / 255).toString() + ';' + fill;
        }
        fill = `model(${fill})`;
        this.setFill(fill, scale, updateSelectedElements, updateModel);
    }

    setLinearGradientFill(fillInfo: FillModalInfo) {
        this.fillType = 'linearGradient';
        this.fillTooltip = 'Linear Gradient';
        this.fillScale = 1;
        let fill = new LinearGradientFill(
            `${fillInfo.linearGradientStartX},${fillInfo.linearGradientStartY}`,
            `${fillInfo.linearGradientEndX},${fillInfo.linearGradientEndY}`);
        fill.addFillStop(fillInfo.gradientColor1, 0);
        fill.addFillStop(fillInfo.gradientColor2, 1);
        this.setFill(fill, fillInfo.scale, fillInfo.applyToSelected, fillInfo.applyToModel);
        this.fillgradientColor1 = fillInfo.gradientColor1;
        this.fillgradientColor2 = fillInfo.gradientColor2;
        this.fillLinearGradientStartX = fillInfo.linearGradientStartX;
        this.fillLinearGradientStartY = fillInfo.linearGradientStartY;
        this.fillLinearGradientEndX = fillInfo.linearGradientEndX;
        this.fillLinearGradientEndY = fillInfo.linearGradientEndY;
    }

    setRadialGradientFill(fillInfo: FillModalInfo) {
        this.fillType = 'radialGradient';
        this.fillTooltip = 'Radial Gradient';
        this.fillScale = 1;
        let fill = new RadialGradientFill(
            `${fillInfo.radialGradientCenterX},${fillInfo.radialGradientCenterY}`,
            `${fillInfo.radialGradientFocusX},${fillInfo.radialGradientFocusY}`,
            fillInfo.radialGradientRadiusX, fillInfo.radialGradientRadiusY);
        fill.addFillStop(fillInfo.gradientColor1, 0);
        fill.addFillStop(fillInfo.gradientColor2, 1);
        this.setFill(fill, fillInfo.scale, fillInfo.applyToSelected, fillInfo.applyToModel);
        this.fillgradientColor1 = fillInfo.gradientColor1;
        this.fillgradientColor2 = fillInfo.gradientColor2;
        this.fillRadialGradientCenterX = fillInfo.radialGradientCenterX;
        this.fillRadialGradientCenterY = fillInfo.radialGradientCenterY;
        this.fillRadialGradientFocusX = fillInfo.radialGradientFocusX;
        this.fillRadialGradientFocusY = fillInfo.radialGradientFocusY;
        this.fillRadialGradientRadiusX = fillInfo.radialGradientRadiusX;
        this.fillradialGradientRadiusY = fillInfo.radialGradientRadiusY;
    }

    setActiveTool(tool: DesignTool | null) {
        if (tool) {
            tool.stroke = this.activeStroke;
            tool.fill = this.activeFill;
            tool.fillScale = this.fillScale;
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

    setSelectTool() {
        setTimeout(() => {
            this._activeToolName = 'select';
            this.activeTool = null;
            this.changeDetectorRef.detectChanges();
        }, 25);
    }

    activeToolChange(event: any, ngActiveTool: NgModel) {
        ngActiveTool.control.markAsTouched();
        this.activeToolName = ngActiveTool.control.value;
    }

    set activeToolName(value: string) {
        this._activeToolName = value;
        switch (this.activeToolName.toLowerCase()) {
            case 'select':
                this.setActiveTool(null);
                break;

            case 'pen':
                const penTool = new PenTool();
                this.setActiveTool(penTool);
                this.ensureStroke();
                break;

            case 'line':
                const lineTool = new LineTool();
                this.setActiveTool(lineTool);
                this.ensureStroke();
                break;

            case 'rectangle':
                const rectangleTool = new RectangleTool();
                this.setActiveTool(rectangleTool);
                this.ensureStrokeOrFill();
                break;

            case 'ellipse':
                const ellipseTool = new EllipseTool();
                this.setActiveTool(ellipseTool);
                this.ensureStrokeOrFill();
                break;

            case 'polyline':
                const polylineTool = new PolylineTool();
                this.setActiveTool(polylineTool);
                this.ensureStroke();
                break;

            case 'polygon':
                const polygonTool = new PolygonTool();
                this.setActiveTool(polygonTool);
                this.ensureStrokeOrFill();
                break;

            case 'text':
                this.showTextToolModal();
                break;

            case 'image':
                this.selectImageTool();
                break;

            case 'model':
                this.selectModelTool();
                break;
        }
    }

    get activeToolName(): string {
        return this._activeToolName;
    }

    ensureStroke() {
        if (!this.activeStroke || this.activeStroke == 'None') {
            this.setColorStroke('#000000ff', 1, false, false);
        }
    }

    ensureStrokeOrFill() {
        if ((!this.activeStroke || this.activeStroke == 'None') &&
            (!this.activeFill || this.activeFill == 'None')) {
            this.setColorStroke('#000000ff', 1, false, false);
        }
    }

    showTextToolModal() {
        const modalInfo = new TextElementModalInfo();
        modalInfo.fonts = this.fontService.listFonts();

        modalInfo.typeface = this.textToolTypeface;
        modalInfo.typesize = this.textToolTypesize;
        modalInfo.isBold = this.textToolIsBold;
        modalInfo.isItalic = this.textToolIsItalic;
        modalInfo.halign = this.textToolHAlign;
        modalInfo.valign = this.textToolVAlign;
        modalInfo.text = this.textToolText;
        const modal = this.modalService.open(TextElementModalComponent, {
            ariaLabelledBy: 'modal-basic-title',
            size: 'xl',
            scrollable: true
        });
        modal.componentInstance.modalInfo = modalInfo;
        modal.result.then((result: TextElementModalInfo) => {
            this.textToolTypeface = result.typeface;
            this.textToolTypesize = result.typesize;
            this.textToolIsBold = result.isBold;
            this.textToolIsItalic = result.isItalic;
            this.textToolHAlign = result.halign;
            this.textToolVAlign = result.valign;
            this.textToolText = result.text;

            const textTool = new TextTool();
            textTool.typeface = this.textToolTypeface;
            textTool.text = this.textToolText;
            textTool.typesize = this.textToolTypesize;
            let style = '';
            if (this.textToolIsBold) {
                style += 'bold';
            }
            if (this.textToolIsItalic) {
                if (style.length != 0) {
                    style += ',';
                }
                style += 'italic';
            }
            textTool.typestyle = style;
            let alignment = '';
            if (this.textToolHAlign != 'left') {
                alignment += this.textToolHAlign;
            }
            if (this.textToolVAlign != 'top') {
                if (alignment.length != 0) {
                    alignment += ',';
                }
                alignment += this.textToolVAlign;
            }
            textTool.alignment = alignment;
            this.setActiveTool(textTool);
        }, (reason) => {
            this.setSelectTool();
        });
    }

    selectImageTool() {
        let bitmapResources: BitmapResource[] = [];
        this.model.resources.forEach((r) => {
            if (r.type == 'bitmap') {
                bitmapResources.push(r);
            }
        });
        if (bitmapResources.length === 0) {
            this.toasterService.warning('No image resources available.');
            this.setSelectTool();
            return;
        }

        const bitmapResource = bitmapResources[0];
        if (bitmapResource.image) {
            this.showImageToolModal(bitmapResource, bitmapResources, bitmapResource.image.src);
        }
        else {
            const urlRequest = new SignedUrlRequestDTO();
            urlRequest.ContainerID = this.selectedContainerID;
            urlRequest.Path = bitmapResource.uri;
            urlRequest.Verb = 'get';
            this.apiService.getSignedUrl(urlRequest).subscribe({
                next: (signedUrlRequest) => {
                    this.showImageToolModal(bitmapResource, bitmapResources, signedUrlRequest.Url);
                },
                error: (error) => {
                    this.onError(error);
                }
            });
        }
    }

    showImageToolModal(selectedResource: BitmapResource, bitmapResources: BitmapResource[], source: string) {
        const modalInfo = new ImageElementModalInfo();
        modalInfo.resources = bitmapResources;
        modalInfo.selectedResource = selectedResource;
        modalInfo.source = source;
        modalInfo.urlProxy = new ContainerUrlProxy(this.apiService, this.modelContainerID);
        modalInfo.lockAspect = this.toolLockAspect;
        modalInfo.opacity = this.toolOpacity;
        const modal = this.modalService.open(ImageElementModalComponent, {
            ariaLabelledBy: 'modal-basic-title',
            size: 'xl',
            scrollable: true
        });
        modal.componentInstance.modalInfo = modalInfo;
        modal.result.then((result: ImageElementModalInfo) => {
            const imageElementTool = new ImageElementTool();
            imageElementTool.source = result.selectedResource.key;
            imageElementTool.opacity = result.opacity;
            imageElementTool.aspectLocked = result.lockAspect;
            if (result.selectedResource.image) {
                imageElementTool.nativeAspect = result.selectedResource.image.naturalWidth / result.selectedResource.image.naturalHeight;
            }
            this.toolOpacity = result.opacity;
            this.toolLockAspect = result.lockAspect;
            this.setActiveTool(imageElementTool);
        }, (reason) => {
            this.setSelectTool();
        });
    }

    selectModelTool() {
        let modelResources: ModelResource[] = [];
        this.model.resources.forEach((r) => {
            if (r.type == 'model') {
                modelResources.push(r);
            }
        });
        if (modelResources.length === 0) {
            this.toasterService.warning('No model resources available.');
            this.setSelectTool();
            return;
        }
        const modelResource = modelResources[0];
        this.showModelToolResourceModal(modelResource, modelResources);
    }

    showModelToolResourceModal(selectedResource: ModelResource, modelResources: ModelResource[]) {
        const modalInfo = new ModelElementModalInfo();
        modalInfo.resources = modelResources;
        modalInfo.selectedResource = selectedResource;
        if (selectedResource.model) {
            const wr = Math.min((window.innerWidth - 360), 1000) / selectedResource.model.getSize().width;
            const hr = (window.innerHeight - 360) / selectedResource.model.getSize().height;
            modalInfo.scale = Math.min(wr, hr);
            modalInfo.info = selectedResource.model.getSize().width + 'x' + selectedResource.model.getSize().height;
            modalInfo.model = selectedResource.model;
        }
        modalInfo.urlProxy = new ContainerUrlProxy(this.apiService, this.modelContainerID);
        modalInfo.lockAspect = this.toolLockAspect;
        modalInfo.opacity = this.toolOpacity;
        const modal = this.modalService.open(ModelElementModalComponent, {
            ariaLabelledBy: 'modal-basic-title',
            size: 'xl',
            scrollable: true
        });
        modal.componentInstance.modalInfo = modalInfo;
        modal.result.then((result: ModelElementModalInfo) => {
            const modelElementTool = new ModelElementTool();
            modelElementTool.source = result.selectedResource.key;
            modelElementTool.opacity = result.opacity;
            modelElementTool.aspectLocked = result.lockAspect;
            this.setActiveTool(modelElementTool);
        }, (reason) => {
            this.setSelectTool();
        });
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
            if(this.controller) {
                this.controller.detach();
                this.model = null;
            }
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
        // Designer tab
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
                this.controller.draw();
            }
        }
        // Model JSON tab
        else if (changeEvent.nextId === 2) {
            if (!this.model) {
                this.formattedJson = '';
            }
            else {
                this.formattedJson = this.model.formattedJSON();
            }
        }
        // Element list
        else if(changeEvent.nextId === 3) {

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
                            this.imageActionAddResource(result);
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
        bitmapResource.key = this.getResourceKey(modalInfo.path);
        this.model.resourceManager.add(bitmapResource);
        const imageElement = ImageElement.create(bitmapResource, 0, 0,
            modalInfo.image.width, modalInfo.image.height);
        imageElement.setInteractive(true);
        imageElement.aspectLocked = true;
        this.controller.addElement(imageElement);
    }

    imageActionAddResource(modalInfo: ImageActionModalInfo) {
        const bitmapResource = new BitmapResource();
        bitmapResource.uri = modalInfo.path;
        bitmapResource.image = modalInfo.image;
        bitmapResource.key = this.getResourceKey(modalInfo.path);
        this.model.resourceManager.add(bitmapResource);
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
                                                this.modelActionAddResource(result);
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
        this.selectionChanged(0);
    }

    modelActionCreateElement(modalInfo: ModelActionModalInfo) {
        const modelResource = new ModelResource();
        modelResource.uri = modalInfo.path;
        modelResource.model = modalInfo.model;
        modelResource.key = this.getResourceKey(modalInfo.path);
        this.model.resourceManager.add(modelResource);
        const modelElement = ModelElement.create(modelResource, 0, 0,
            modalInfo.model.getSize().width, modalInfo.model.getSize().height);
        modelElement.setInteractive(true);
        modelElement.aspectLocked = true;
        this.controller.addElement(modelElement);
    }

    modelActionAddResource(modalInfo: ModelActionModalInfo) {
        const modelResource = new ModelResource();
        modelResource.uri = modalInfo.path;
        modelResource.model = modalInfo.model;
        modelResource.key = this.getResourceKey(modalInfo.path);
        this.model.resourceManager.add(modelResource);
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

    getResourceKey(path: string) {
        const fileName = this.getFileNameWithoutExtension(this.getPathFileName(path));
        let fileNameTest = fileName;
        let index = 0;
        do {
            const resource = this.model.resourceManager.findBestResource(fileNameTest, null);
            if (!resource) {
                break;
            }
            index++;
            fileNameTest = fileName + '.' + index;
        } while (true);
        return fileNameTest;
    }

    getFileNameWithoutExtension(fileName: string) {
        const extension = this.getExtension(fileName);
        const fileNameWithoutExtension = fileName.substr(0, fileName.length - extension.length);
        return fileNameWithoutExtension;
    }

    getPathFileName(path: string) {
        const index = path.lastIndexOf('/');
        return path.substr(index + 1);
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

    showStrokeModal() {
        const modalInfo = new StrokeModalInfo();
        modalInfo.width = this.strokeWidth;
        modalInfo.color = this.strokeColor;
        let color = Color.parse(this.strokeColor);
        if(color.isNamedColor()) {
            let namedColor = Color.NamedColors.find((c) => c.color.equalsHue(color));
            modalInfo.namedColor = namedColor;
        }
        modalInfo.strokeType = this.strokeType;
        modalInfo.applyToModel = this.applyStrokeToModel;
        modalInfo.applyToSelected = this.applyStrokeToSelected;
        modalInfo.selectedElementCount = this.selectedElementCount;
        const modal = this.modalService.open(StrokeModalComponent);
        modal.componentInstance.modalInfo = modalInfo;
        modal.result.then((result: StrokeModalInfo) => {
            if (result.strokeType == 'color') {
                this.setColorStroke(result.color, result.width, result.applyToSelected, result.applyToModel);
            }
            else {
                this.setNoStroke(result.applyToSelected, result.applyToModel);
            }
        }, (error) => {
        });
    }

    showFillModal() {
        const modalInfo = new FillModalInfo();

        modalInfo.color = this.fillColor;
        let color = Color.parse(this.fillColor);
        if(color.isNamedColor()) {
            let namedColor = Color.NamedColors.find((c) => c.color.equalsHue(color));
            modalInfo.namedColor = namedColor;
        }

        modalInfo.gradientColor1 = this.fillgradientColor1;
        color = Color.parse(this.fillgradientColor1);
        if(color.isNamedColor()) {
            let namedColor = Color.NamedColors.find((c) => c.color.equalsHue(color));
            modalInfo.gradientNamedColor1 = namedColor;
        }

        modalInfo.gradientColor2 = this.fillgradientColor2;
        color = Color.parse(this.fillgradientColor2);
        if(color.isNamedColor()) {
            let namedColor = Color.NamedColors.find((c) => c.color.equalsHue(color));
            modalInfo.gradientNamedColor2 = namedColor;
        }

        modalInfo.opacity = this.fillOpacity;
        modalInfo.fillType = this.fillType;
        modalInfo.scale = this.fillScale * 100;

        modalInfo.linearGradientStartX = this.fillLinearGradientStartX;
        modalInfo.linearGradientStartY = this.fillLinearGradientStartY;
        modalInfo.linearGradientEndX = this.fillLinearGradientEndX;
        modalInfo.linearGradientEndY = this.fillLinearGradientEndY;

        modalInfo.radialGradientCenterX = this.fillRadialGradientCenterX;
        modalInfo.radialGradientCenterY = this.fillRadialGradientCenterY;
        modalInfo.radialGradientFocusX = this.fillRadialGradientFocusX;
        modalInfo.radialGradientFocusY = this.fillRadialGradientFocusY;
        modalInfo.radialGradientRadiusX = this.fillRadialGradientRadiusX;
        modalInfo.radialGradientRadiusY = this.fillradialGradientRadiusY;

        modalInfo.applyToModel = this.applyFillToModel;
        modalInfo.applyToSelected = this.applyFillToSelected;
        modalInfo.selectedElementCount = this.selectedElementCount;

        // Load bitmap resources
        let bitmapResources: BitmapResource[] = [];
        let selectedBitmapResource: BitmapResource;
        this.model.resources.forEach((r) => {
            if (r.type == 'bitmap') {
                bitmapResources.push(r);
                if (this.fillBitmapSource && r.key === this.fillBitmapSource) {
                    selectedBitmapResource = r;
                }
            }
        });
        if (bitmapResources.length !== 0) {
            modalInfo.bitmapResources = bitmapResources;
            modalInfo.selectedBitmapResource = selectedBitmapResource ?? bitmapResources[0];
        }

        // Load model resources
        let modelResources: ModelResource[] = [];
        let selectedModelResource: BitmapResource;
        this.model.resources.forEach((r) => {
            if (r.type == 'model') {
                modelResources.push(r);
                if (this.fillModelSource && r.key === this.fillModelSource) {
                    selectedModelResource = r;
                }
            }
        });
        if (modelResources.length !== 0) {
            modalInfo.modelResources = modelResources;
            modalInfo.selectedModelResource = selectedModelResource ?? modelResources[0];
        }

        const modal = this.modalService.open(FillModalComponent, {
            ariaLabelledBy: 'modal-basic-title',
            scrollable: true
        });
        modal.componentInstance.modalInfo = modalInfo;
        modal.result.then((result: FillModalInfo) => {
            this.applyFillToSelected = result.applyToSelected;
            this.applyFillToModel = result.applyToModel;
            if (result.fillType == 'color') {
                this.setColorFill(result.color, modalInfo.applyToSelected, modalInfo.applyToModel);
            }
            else if (result.fillType == 'image') {
                this.setImageFill(result.selectedBitmapResource.key, result.opacity, result.scale / 100, modalInfo.applyToSelected, modalInfo.applyToModel);
            }
            else if (result.fillType == 'model') {
                this.setModelFill(result.selectedModelResource.key, result.opacity, result.scale / 100, modalInfo.applyToSelected, modalInfo.applyToModel);
            }
            else if(result.fillType == 'linearGradient') {
                this.setLinearGradientFill(result);
            }
            else if(result.fillType == 'radialGradient') {
                this.setRadialGradientFill(result);
            }
            else {
                this.setNoFill(modalInfo.applyToSelected, modalInfo.applyToModel);
            }
        }, (reason) => {
        });
    }

    showNewModelModal() {
        const modalInfo = new NewModelModalInfo();
        modalInfo.width = 1024;
        modalInfo.height = 768;
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
                                this.onError(`Model ${upload.name} could not be saved.`);
                            }
                            if (upload.state.code == UploadStateCode.ABORTED) {
                                this.onError(`Model ${upload.name} save was aborted.`);
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
                this.onError(error);
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

    mouseUpView(e) {
        if(e.event.button === 1) {
            e.event.preventDefault();
        }
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
        // this.controller.renderer = new DesignRenderer(this.controller);
    }

    elementSelected(element: ElementBase) {
        return this.controller.isSelected(element);
    }

    selectElement(element: ElementBase) {
        this.controller.toggleSelected(element);
    }

    onRequestDeleteElement(element: ElementBase) {
        if(this.model && this.controller) {
            this.controller.removeElement(element);
        }
    }

    selectionChanged(c: number) {
        let selectedElement: ElementBase;
        if (this.controller) {
            this.selectedElementCount = this.controller.selectedElementCount();
        }
        else {
            this.selectedElementCount = 0;
        }
        if (this.selectedElementCount == 1) {
            selectedElement = this.controller.selectedElements[0];
        }
        else if (this.selectedElementCount == 0) {
            selectedElement = this.model;
        }

        // If single element selected
        if (this.selectedElementCount == 1) {
            const selectedElement = this.controller.selectedElements[0];

            switch (selectedElement.type) {

                case 'image':
                    this.onImageElementSelected(selectedElement as ImageElement);
                    break;

                case 'model':
                    this.onModelElementSelected(selectedElement as ModelElement);
                    break;

                case 'text':
                    this.onTextElementSelected(selectedElement as TextElement);
                    break;

                default:
                    this.singleElementType = undefined;
                    break;
            }
        }
        else {
            this.singleElementType = undefined;
        }

        // Return if multiple selected
        if (!selectedElement) {
            this.setNoStroke(false, false);
            this.setNoFill(false, false);
            return;
        }

        // Set active stroke to first selected element or model
        if (selectedElement.canStroke()) {
            const strokeInfo = StrokeInfo.getStrokeInfo(selectedElement);
            if (strokeInfo.strokeType == 'color') {
                this.strokeColor = strokeInfo.strokeColor;
                this.strokeWidth = strokeInfo.strokeWidth;
                this.activeStroke = selectedElement.stroke;
                this.setColorStroke(this.strokeColor, this.strokeWidth, false, false);
            }
            else if (strokeInfo.strokeType == 'none') {
                // this.setNoStroke(false, false);
            }
        }

        // Set active fill to first selected element
        if (selectedElement.canFill()) {
            const fillInfo = FillInfo.getFillInfo(selectedElement);
            if (fillInfo.type === 'image') {
                this.fillType = 'image';
                this.fillBitmapSource = fillInfo.source;
                this.fillScale = selectedElement.fillScale ?? 1;
                this.setImageFill(fillInfo.source, fillInfo.opacity, fillInfo.scale, false, false);

            }
            else if (fillInfo.type === 'model') {
                this.fillType = 'model';
                this.fillModelSource = fillInfo.source;
                this.fillScale = selectedElement.fillScale ?? 1;
                this.setModelFill(fillInfo.source, fillInfo.opacity, fillInfo.scale, false, false);
            }
            else if (fillInfo.type === 'color') {
                let color = Color.parse(fillInfo.color);
                if(fillInfo.opacity != 255) {
                    color.a = Math.floor(fillInfo.opacity);
                }
                this.fillColor = color.toHexString();
                this.activeFill = selectedElement.fill;
                this.fillScale = selectedElement.fillScale ?? 1;
                this.setColorFill(this.fillColor, false, false);
            }
            else if(fillInfo.type === 'linear') {
                this.fillType = 'linearGradient';
                let start = Point.parse(fillInfo.start);
                this.fillLinearGradientStartX = start.x;
                this.fillLinearGradientStartY = start.y;
                let end = Point.parse(fillInfo.end);
                this.fillLinearGradientEndX = end.x;
                this.fillLinearGradientEndY = end.y;
                this.fillgradientColor1 = fillInfo.fillStops[0].color;
                this.fillgradientColor2 = fillInfo.fillStops[1].color;
            }
            else if(fillInfo.type === 'radial') {
                this.fillType = 'radialGradient';
                let center = Point.parse(fillInfo.center);
                this.fillRadialGradientCenterX = center.x;
                this.fillRadialGradientCenterY = center.y;
                let focus = Point.parse(fillInfo.focus);
                this.fillRadialGradientFocusX = focus.x;
                this.fillRadialGradientFocusY = focus.y;
                this.fillRadialGradientRadiusX = fillInfo.radiusX;
                this.fillradialGradientRadiusY = fillInfo.radiusY;
                this.fillgradientColor1 = fillInfo.fillStops[0].color;
                this.fillgradientColor2 = fillInfo.fillStops[1].color;
            }
            else if (fillInfo.type == 'none') {
                // this.setNoFill(false, false);
            }
        }

        if (this.selectedElementCount > 0) {
            this.setSelectedIndexes();
            this.applyFillToSelected = true;
            this.applyFillToModel = false;
            this.applyStrokeToSelected = true;
            this.applyStrokeToModel = false;
        }
        else {
            this.applyFillToSelected = false;
            this.applyFillToModel = true;
            this.applyStrokeToSelected = false;
            this.applyStrokeToModel = true;
        }

        this.log(`Selection Changed: ${c} items`);
    }

    onImageElementSelected(imageElement: ImageElement) {
        this.singleElementType = imageElement.type;
    }

    showImageElementModal() {
        const imageElement = this.controller.selectedElements[0] as ImageElement;

        const modalInfo = new ImageElementModalInfo();
        let bitmapResources: BitmapResource[] = [];
        let selectedResource: BitmapResource;
        this.model.resources.forEach((r) => {
            if (r.type == 'bitmap') {
                bitmapResources.push(r);
            }
            if(r.key === imageElement.source) {
                selectedResource = r;
            }
        });
        modalInfo.resources = bitmapResources;
        modalInfo.selectedResource = selectedResource;
        modalInfo.source = selectedResource.image.src;
        modalInfo.urlProxy = new ContainerUrlProxy(this.apiService, this.modelContainerID);
        modalInfo.lockAspect = imageElement.aspectLocked;
        modalInfo.opacity = imageElement.opacity * 255;
        const modal = this.modalService.open(ImageElementModalComponent, {
            ariaLabelledBy: 'modal-basic-title',
            size: 'xl',
            scrollable: true
        });
        modal.componentInstance.modalInfo = modalInfo;
        modal.result.then((result: ImageElementModalInfo) => {
            imageElement.source = result.selectedResource.key;
            imageElement.opacity = result.opacity / 255;
            imageElement.aspectLocked = result.lockAspect;
            this.controller.draw();
        }, (reason) => {
        });
    }

    onModelElementSelected(modelElement: ModelElement) {
        this.singleElementType = modelElement.type;
    }

    showModelElementModal() {
        const modelElement = this.controller.selectedElements[0] as ModelElement;

        const modalInfo = new ModelElementModalInfo();
        let modelResources: ModelResource[] = [];
        let selectedResource: ModelResource;
        this.model.resources.forEach((r) => {
            if (r.type == 'model') {
                modelResources.push(r);
            }
            if(r.key === modelElement.source) {
                selectedResource = r;
            }
        });
        modalInfo.resources = modelResources;
        modalInfo.selectedResource = selectedResource;
        modalInfo.model = selectedResource.model;
        modalInfo.urlProxy = new ContainerUrlProxy(this.apiService, this.modelContainerID);
        modalInfo.lockAspect = modelElement.aspectLocked;
        modalInfo.opacity = modelElement.opacity * 255;
        const modal = this.modalService.open(ModelElementModalComponent, {
            ariaLabelledBy: 'modal-basic-title',
            size: 'xl',
            scrollable: true
        });
        modal.componentInstance.modalInfo = modalInfo;
        modal.result.then((result: ModelElementModalInfo) => {
            modelElement.source = result.selectedResource.key;
            modelElement.opacity = result.opacity / 255;
            modelElement.aspectLocked = result.lockAspect;
            this.controller.draw();
        }, (reason) => {
        });
    }

    onTextElementSelected(textElement: TextElement) {
        this.singleElementType = textElement.type;
        this.textToolTypeface = textElement.typeface;
        this.textToolTypesize = textElement.typesize;
        if(textElement.typestyle) {
            this.textToolIsBold = textElement.typestyle.toLowerCase().indexOf('bold') != -1;
            this.textToolIsItalic = textElement.typestyle.toLowerCase().indexOf('italic') != -1;
        }
        else {
            this.textToolIsBold = false;
            this.textToolIsItalic = false;
        }
        this.textToolText = textElement.text;
        if(textElement.alignment) {
            if(textElement.alignment.indexOf('center') != -1) {
                this.textToolHAlign = 'center';
            }
            else if(textElement.alignment.indexOf('right') != -1) {
                this.textToolHAlign = 'right';
            }
            else {
                this.textToolHAlign = 'left';
            }
            if(textElement.alignment.indexOf('middle') != -1) {
                this.textToolVAlign = 'middle';
            }
            else if(textElement.alignment.indexOf('bottom') != -1) {
                this.textToolVAlign = 'bottom';
            }
            else {
                this.textToolVAlign = 'top';
            }
        }
        else {
            this.textToolHAlign = 'left';
            this.textToolVAlign = 'top';
        }
    }

    showTextElementModal() {

        const textElement = this.controller.selectedElements[0] as TextElement;

        const modalInfo = new TextElementModalInfo();
        modalInfo.fonts = this.fontService.listFonts();

        modalInfo.typeface = textElement.typeface;
        modalInfo.typesize = textElement.typesize;
        if(textElement.typestyle) {
            modalInfo.isBold = textElement.typestyle.toLowerCase().indexOf('bold') != -1;
            modalInfo.isItalic = textElement.typestyle.toLowerCase().indexOf('italic') != -1;
        }
        else {
            modalInfo.isBold = false;
            modalInfo.isItalic = false;
        }
        if(textElement.alignment) {
            if(textElement.alignment.indexOf('center') != -1) {
                modalInfo.halign = 'center';
            }
            else if(textElement.alignment.indexOf('right') != -1) {
                modalInfo.halign = 'right';
            }
            else {
                modalInfo.halign = 'left';
            }
            if(textElement.alignment.indexOf('middle') != -1) {
                modalInfo.valign = 'middle';
            }
            else if(textElement.alignment.indexOf('bottom') != -1) {
                modalInfo.valign = 'bottom';
            }
            else {
                modalInfo.valign = 'top';
            }
        }
        else {
            modalInfo.halign = 'left';
            modalInfo.valign = 'top';
        }
        modalInfo.text = textElement.text;
        const modal = this.modalService.open(TextElementModalComponent, {
            ariaLabelledBy: 'modal-basic-title',
            size: 'xl',
            scrollable: true
        });
        modal.componentInstance.modalInfo = modalInfo;
        modal.result.then((result: TextElementModalInfo) => {
            textElement.typeface = result.typeface;
            textElement.typesize = result.typesize;
            textElement.text = result.text;
            let style = '';
            if (result.isBold) {
                style += 'bold';
            }
            if (result.isItalic) {
                if (style.length != 0) {
                    style += ',';
                }
                style += 'italic';
            }
            textElement.typestyle = style;
            let alignment = '';
            if (result.halign != 'left') {
                alignment += result.halign;
            }
            if (result.valign != 'top') {
                if (alignment.length != 0) {
                    alignment += ',';
                }
                alignment += result.valign;
            }
            textElement.alignment = alignment;
            this.controller.draw();
        }, (reason) => {
        });
    }

    setSelectedIndexes() {
        let lowestIndex = this.model.elements.length;
        let highestIndex = -1;
        this.controller.selectedElements.forEach((el) => {
            const index = this.model.elements.indexOf(el);
            if (index > highestIndex) {
                highestIndex = index;
            }
            if (index < lowestIndex) {
                lowestIndex = index;
            }
        });
        this.lowestSelectedIndex = lowestIndex;
        this.highestSelectedIndex = highestIndex;
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

    canDuplicateSelected() {
        return this.selectedElementCount > 0;
    }

    duplicateSelected() {
        if (this.controller && this.controller.selectedElementCount() > 0) {
            const clonedElements: ElementBase[] = new Array();
            this.controller.selectedElements.forEach(selectedElement => {
                const clonedElement = selectedElement.clone();
                clonedElements.push(clonedElement);
                clonedElement.setInteractive(true);
                this.model.add(clonedElement);
            });
            this.controller.selectedElements = clonedElements;
            this.controller.draw();
            this.selectionChanged(clonedElements.length);
        }
    }

    sortElementsByIndex(array: ElementBase[]) {
        array.sort((el1, el2) => {
            const index1 = this.controller.model.elements.indexOf(el1);
            const index2 = this.controller.model.elements.indexOf(el2);
            return index1 - index2;
        })
    }

    getSelectedElementsSorted() {
        let clonedArray: ElementBase[] = new Array();
        this.controller.selectedElements.forEach(el => {
            clonedArray.push(el);
        });
        this.sortElementsByIndex(clonedArray);
        return clonedArray;
    }

    canMoveSelectedUp() {
        return this.selectedElementCount > 0 && this.highestSelectedIndex < this.model.elements.length - 1;
    }

    moveSelectedUp() {
        if (this.controller && this.controller.selectedElementCount() > 0) {
            let selectedElements = this.getSelectedElementsSorted();
            selectedElements = selectedElements.reverse();
            selectedElements.forEach(el => {
                this.controller.moveElementForward(el);
            });
            this.setSelectedIndexes();
            this.controller.draw();
        }
    }

    canMoveSelectedDown() {
        return this.selectedElementCount > 0 && this.lowestSelectedIndex > 0;
    }

    moveSelectedDown() {
        if (this.controller && this.controller.selectedElementCount() > 0) {
            let selectedElements = this.getSelectedElementsSorted();
            selectedElements.forEach(el => {
                this.controller.moveElementBackward(el);
            });
            this.setSelectedIndexes();
            this.controller.draw();
        }
    }

    canMoveSelectedToTop() {
        return this.selectedElementCount > 0;
    }

    moveSelectedToTop() {
        if (this.controller && this.controller.selectedElementCount() > 0) {
            const selectedElements = this.getSelectedElementsSorted();
            selectedElements.forEach(el => {
                this.controller.moveElementToTop(el);
            });
            this.setSelectedIndexes();
            this.controller.draw();
        }
    }

    canMoveSelectedToBottom() {
        return this.selectedElementCount > 0;
    }

    moveSelectedToBottom() {
        if (this.controller && this.controller.selectedElementCount() > 0) {
            let selectedElements = this.getSelectedElementsSorted();
            selectedElements = selectedElements.reverse();
            selectedElements.forEach(el => {
                this.controller.moveElementToBottom(el);
            });
            this.setSelectedIndexes();
            this.controller.draw();
        }
    }

    canDeleteSelected() {
        return this.selectedElementCount > 0;
    }

    deleteSelected() {
        if (this.controller) {
            let clonedArray: ElementBase[] = new Array();
            this.controller.selectedElements.forEach(el => {
                clonedArray.push(el);
            });
            clonedArray.forEach(el => {
                this.controller.removeElement(el);
            });
            this.setSelectedIndexes();
            this.controller.draw();
        }
    }

    removeUnusedResources() {
        if (this.controller) {
            const usedResources = this.model.getResourceKeyReferenceCounts(null);
            const unusedResources: Resource[] = [];
            this.model.resources.forEach((resource) => {
                if (!usedResources[resource.key]) {
                    unusedResources.push(resource);
                }
            });
            unusedResources.forEach((resource) => {
                const index = this.model.resources.indexOf(resource, 0);
                if (index > -1) {
                    this.model.resources.splice(index, 1);
                }
            })
        }
    }

    canArrange() {
        return this.selectedElementCount > 1;
    }

    alignSelectedLeft() {
        const left = this.controller.selectedElements[0].getLocation().x;
        this.controller.selectedElements.forEach(el => {
            let location = el.getLocation();
            if (location.x != left) {
                el.setLocation(new Point(left, location.y));
            }
        });
        this.controller.draw();
    }

    alignSelectedCenter() {
        const center = this.controller.selectedElements[0].getLocation().x +
            this.controller.selectedElements[0].getSize().width / 2;
        this.controller.selectedElements.forEach(el => {
            let location = el.getLocation();
            let size = el.getSize();
            if (location.x + size.width / 2 != center) {
                el.setLocation(new Point(center - size.width / 2, location.y));
            }
        });
        this.controller.draw();
    }

    alignSelectedRight() {
        const right = this.controller.selectedElements[0].getLocation().x +
            this.controller.selectedElements[0].getSize().width;
        this.controller.selectedElements.forEach(el => {
            let location = el.getLocation();
            let size = el.getSize();
            if (location.x + size.width != right) {
                el.setLocation(new Point(right - size.width, location.y));
            }
        });
        this.controller.draw();
    }

    alignSelectedTop() {
        const top = this.controller.selectedElements[0].getLocation().y;
        this.controller.selectedElements.forEach(el => {
            let location = el.getLocation();
            if (location.y != top) {
                el.setLocation(new Point(location.x, top));
            }
        });
        this.controller.draw();
    }

    alignSelectedMiddle() {
        const middle = this.controller.selectedElements[0].getLocation().y +
            this.controller.selectedElements[0].getSize().height / 2;
        this.controller.selectedElements.forEach(el => {
            let location = el.getLocation();
            let size = el.getSize();
            if (location.y + size.height / 2 != middle) {
                el.setLocation(new Point(location.x, middle - size.height / 2));
            }
        });
        this.controller.draw();
    }

    alignSelectedBottom() {
        const bottom = this.controller.selectedElements[0].getLocation().y +
            this.controller.selectedElements[0].getSize().height;
        this.controller.selectedElements.forEach(el => {
            let location = el.getLocation();
            let size = el.getSize();
            if (location.y + size.height != bottom) {
                el.setLocation(new Point(location.x, bottom - size.height));
            }
        });
        this.controller.draw();
    }

    canResize() {
        return this.selectedElementCount > 1;
    }

    resizeSelectedWidth() {
        const width = this.controller.selectedElements[0].getSize().width;
        this.controller.selectedElements.forEach(el => {
            let size = el.getSize();
            if (size.width != width) {
                el.setSize(new Size(width, size.height));
            }
        });
        this.controller.draw();
    }

    resizeSelectedHeight() {
        const height = this.controller.selectedElements[0].getSize().height;
        this.controller.selectedElements.forEach(el => {
            let size = el.getSize();
            if (size.height != height) {
                el.setSize(new Size(size.width, height));
            }
        });
        this.controller.draw();
    }

    resizeSelectedSize() {
        const size1 = this.controller.selectedElements[0].getSize();
        this.controller.selectedElements.forEach(el => {
            let size2 = el.getSize();
            if (size1.width != size2.width || size1.height != size2.height) {
                el.setSize(size1);
            }
        });
        this.controller.draw();
    }

    showElementSizeModal() {
        const selectedElement = this.controller.selectedElements[0] as ElementBase;
        const modalInfo = new SizeModalInfo;
        const size = selectedElement.getSize();
        modalInfo.width = size.width;
        modalInfo.height = size.height;
        const modal = this.modalService.open(SizeModalComponent, {
            ariaLabelledBy: 'modal-basic-title',
            scrollable: true
        });
        modal.componentInstance.modalInfo = modalInfo;
        modal.result.then((result: SizeModalInfo) => {
            if(result.width !== size.width || result.height !== size.height) {
                selectedElement.setSize(new Size(result.width, result.height));
                this.controller.draw();
            }
        }, (reason) => {
        });
    }

    showModelSizeModal() {
        const modalInfo = new SizeModalInfo;
        const size = this.model.getSize();
        modalInfo.width = size.width;
        modalInfo.height = size.height;
        const modal = this.modalService.open(SizeModalComponent, {
            ariaLabelledBy: 'modal-basic-title',
            scrollable: true
        });
        modal.componentInstance.modalInfo = modalInfo;
        modal.result.then((result: SizeModalInfo) => {
            if(result.width !== size.width || result.height !== size.height) {
                this.model.setSize(new Size(result.width, result.height));
                this.controller.setScale(this.scale, true);
            }
        }, (reason) => {
        });
    }
}
