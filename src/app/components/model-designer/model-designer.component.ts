import { Component, DestroyRef, OnInit, ViewChild, ViewChildren, QueryList, Input, Output,
    ElementRef, AfterViewInit, ChangeDetectorRef, HostListener, inject, PLATFORM_ID } from '@angular/core';
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
import { BitmapResource, Color, GridType, Model, ModelResource, Point, Region, Resource, Size,
    PolylineElement, PolygonElement, PathElement, TextResource } from 'elise-graphics';
import { FillInfo, LinearGradientFill, PointEventParameters, RadialGradientFill, StrokeInfo, UndoState, ViewDragArgs } from 'elise-graphics';
import { ElementBase, ImageElement, ModelElement, TextElement } from 'elise-graphics';
import { DesignContextMenuEventArgs, DesignController } from 'elise-graphics';
import { SVGImporter } from 'elise-graphics';

// Design tools
import { ArcTool, ArrowTool, DesignTool, EllipseTool, ImageElementTool, LineTool, ModelElementTool,
            PenTool, PolygonTool, PolylineTool, RectangleTool, RegularPolygonTool, RingTool, TextTool, WedgeTool } from 'elise-graphics';

// Modals
import { ImageActionModalComponent, ImageActionModalInfo } from '../image-action-modal/image-action-modal.component';
import { ModelActionModalComponent, ModelActionModalInfo } from '../model-action-modal/model-action-modal.component';
import { NewModelModalComponent, NewModelModalInfo } from '../new-model-modal/new-model-modal.component';
import { StrokeModalComponent, StrokeModalInfo } from '../stroke-modal/stroke-modal.component';
import { FillModalComponent, FillModalInfo } from '../fill-modal/fill-modal.component';
import { ImageElementModalComponent, ImageElementModalInfo } from '../image-element-modal/image-element-modal.component';
import { ModelElementModalComponent, ModelElementModalInfo } from '../model-element-modal/model-element-modal.component';
import { TextContentMode, TextElementModalComponent, TextElementModalInfo, TextModalResourceSummary, TextModalRun, TextResourceMode } from '../text-element-modal/text-element-modal.component';
import { SizeModalComponent, SizeModalInfo } from '../size-modal/size-modal.component';
import { PointsModalComponent, PointsModalInfo } from '../points-modal/points-modal.component';
import { PathElementModalComponent, PathElementModalInfo } from '../path-element-modal/path-element-modal.component';
import { GridSettingsModalComponent, GridSettingsModalInfo } from '../grid-settings-modal/grid-settings-modal.component';
import { AppearanceModalComponent, AppearanceModalInfo } from '../appearance-modal/appearance-modal.component';
import { ExportModelModalComponent, ExportModelModalInfo, ModelExportFormat } from '../export-model-modal/export-model-modal.component';
import { TransformModalComponent, TransformModalInfo } from '../transform-modal/transform-modal.component';
import { CommonModule, DOCUMENT, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularSplitModule } from 'angular-split';
import { EliseDesignComponent } from '../../elise/design/elise-design.component';
import { ContainerSelectorComponent } from '../container-selector/container-selector.component';
import { ContainerTreeComponent } from '../container-tree/container-tree.component';
import { AlertComponent } from '../alert/alert.component';
import { UploadListComponent } from '../upload-list/upload-list.component';
import { FileListComponent } from '../file-list/file-list.component';
import { DndDirective } from '../../directives/dnd.directive';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { take } from 'rxjs';

type AppearanceBlendMode = GlobalCompositeOperation;
type AppearanceFilter = string;
type AppearanceShadow = {
    color: string;
    blur?: number;
    offsetX?: number;
    offsetY?: number;
};

type AppearanceState = {
    opacity: number;
    interactive: boolean;
    blendMode?: AppearanceBlendMode;
    filter?: AppearanceFilter;
    shadow?: AppearanceShadow;
};

type DesignerTextRun = {
    text: string;
    typeface?: string;
    typesize?: number;
    typestyle?: string;
    letterSpacing?: number;
    decoration?: string;
};

@Component({
    imports: [CommonModule, FormsModule, NgbModule, AngularSplitModule, EliseDesignComponent, ContainerSelectorComponent, ContainerTreeComponent, AlertComponent, UploadListComponent, FileListComponent, DndDirective],
    selector: 'app-model-designer',
    templateUrl: './model-designer.component.html',
    styleUrls: ['./model-designer.component.scss']
})
export class ModelDesignerComponent implements OnInit, AfterViewInit {

    private readonly gridSettingsCookieName = 'elise-model-designer-grid-settings';

    readonly toolOptions = [
        { value: 'select', label: 'Select' },
        { value: 'pen', label: 'Pen' },
        { value: 'line', label: 'Line' },
        { value: 'rectangle', label: 'Rectangle' },
        { value: 'ellipse', label: 'Ellipse' },
        { value: 'arc', label: 'Arc' },
        { value: 'polyline', label: 'Polyline' },
        { value: 'polygon', label: 'Polygon' },
        { value: 'regularpolygon', label: 'Regular Polygon' },
        { value: 'arrow', label: 'Arrow' },
        { value: 'wedge', label: 'Wedge / Sector' },
        { value: 'ring', label: 'Ring / Annulus' },
        { value: 'text', label: 'Text' },
        { value: 'image', label: 'Image' },
        { value: 'model', label: 'Model' }
    ];

    private readonly destroyRef = inject(DestroyRef);
    private readonly document = inject(DOCUMENT);
    private readonly platformId = inject(PLATFORM_ID);

    @ViewChild(ContainerTreeComponent, { static: true })
    containerTree: ContainerTreeComponent;

    @ViewChildren('fileUploadInput', { read: ElementRef })
    fileUploadInputRefs: QueryList<ElementRef>;
    fileUploadInputElement: HTMLInputElement;

    @ViewChild('elise', { read: ElementRef, static: false })
    eliseViewElementRef: ElementRef;

    @ViewChild('surfaceContextMenu', { read: ElementRef, static: false })
    surfaceContextMenuRef: ElementRef;

    selectedContainerID: string | null;
    selectedContainerName: string;
    @Output() public selectedFolderPath?: string;

    folderFiles?: ManifestFileDTO[];
    uploads: Upload[] = [];

    selectedFilePath: string;

    readonly MODEL_MIME_TYPE = 'application/elise';
    readonly SVG_MIME_TYPE = 'image/svg+xml';
    readonly PNG_MIME_TYPE = 'image/png';
    readonly JPEG_MIME_TYPE = 'image/jpeg';
    readonly WEBP_MIME_TYPE = 'image/webp';

    controller: DesignController;
    lastMessage = '-';
    scale = 1;
    background = 'grid';
    viewMouseX: number;
    viewMouseY: number;
    modelEditorNavId: number;
    mouseOverView = false;
    formattedJson: string;
    isBusy = false;
    isDragging = false;
    pendingImportPoint?: Point;
    selectedElementCount = 0;
    canUndo = false;
    canRedo = false;
    surfaceContextMenuVisible = false;
    surfaceContextMenuX = 0;
    surfaceContextMenuY = 0;
    lowestSelectedIndex: number;
    highestSelectedIndex: number;
    singleElementType: string;

    strokeType = 'color';
    strokeColor: string = ('#000000cc');
    strokeWidth = 2;
    strokeDash?: number[];
    strokeLineCap: CanvasLineCap = 'butt';
    strokeLineJoin: CanvasLineJoin = 'miter';
    strokeMiterLimit = 10;
    strokeTooltip: string;
    applyStrokeToModel = false;
    applyStrokeToSelected = true;
    activeStroke: string;

    fillType = 'color';
    fillColor = '#ffffffff';
    fillOpacity = 1;
    fillScale = 1;
    fillOffsetX = 0;
    fillOffsetY = 0;
    fillTooltip: string;
    fillBitmapSource: string;
    fillModelSource: string;
    fillgradientColor1 = '#000000ff';
    fillgradientColor2 = '#ffffffff';
    fillLinearGradientStartX = 0;
    fillLinearGradientStartY = 0;
    fillLinearGradientEndX = 100;
    fillLinearGradientEndY = 100;
    fillRadialGradientCenterX = 50;
    fillRadialGradientCenterY = 50;
    fillRadialGradientFocusX = 50;
    fillRadialGradientFocusY = 50;
    fillRadialGradientRadiusX = 50;
    fillradialGradientRadiusY = 50;

    applyFillToModel = false;
    applyFillToSelected = true;
    activeFill: string | LinearGradientFill | RadialGradientFill;

    textToolTypeface = 'Sans-Serif';
    textToolTypesize = 32;
    textToolIsBold = false;
    textToolIsItalic = false;
    textToolHAlign = 'left';
    textToolVAlign = 'top';
    textToolText = 'Text Element Content';
    textToolLetterSpacing = 0;
    textToolLineHeight?: number;
    textToolTextDecoration = '';
    textToolContentMode: TextContentMode = 'inline';
    textToolResourceMode: TextResourceMode = 'embedded';
    textToolSourceKey = '';
    textToolSourceLocale = '';
    textToolSourceText = 'Text Element Content';
    textToolSourceUri = '';
    textToolRichText: TextModalRun[] = [];

    activeTool?: DesignTool;
    toolOpacity = 1;
    toolLockAspect = true;
    appearanceOpacity = 255;
    appearanceInteractive = true;
    appearanceBlendMode: AppearanceBlendMode | '' = '';
    appearanceFilter = '';
    appearanceShadowEnabled = false;
    appearanceShadowColor = '#00000055';
    appearanceShadowBlur = 12;
    appearanceShadowOffsetX = 6;
    appearanceShadowOffsetY = 8;
    applyAppearanceToModel = false;
    applyAppearanceToSelected = true;
    transformText = '';
    applyTransformToModel = false;
    applyTransformToSelected = true;

    _activeToolName = 'select';

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
        this.fileUploadInputRefs.changes.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((refs: QueryList<ElementRef>) => {
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
                    this.applyStrokeStyleToElement(selectedElement);
                }
            });
        }
        if (updateModel) {
            this.model.setStroke(this.activeStroke);
            this.applyStrokeStyleToElement(this.model);
        }
        if (updateSelectedElements || updateModel) {
            this.controller.draw();
        }
    }

    setNoStroke(updateSelectedElements: boolean, updateModel: boolean) {
        this.strokeType = 'none';
        this.updateStrokeTooltip();
        this.setStroke(null, updateSelectedElements, updateModel);
    }

    setColorStroke(color: string, width: number, updateSelectedElements: boolean, updateModel: boolean,
        strokeStyle?: { strokeDash?: number[]; lineCap?: CanvasLineCap; lineJoin?: CanvasLineJoin; miterLimit?: number }) {
        this.strokeType = 'color';
        this.strokeColor = color;
        this.strokeWidth = width;
        this.setStrokeStyleState(strokeStyle);
        let stroke = color;
        if (width !== 1) {
            stroke += ',' + width;
        }
        this.updateStrokeTooltip();
        this.setStroke(stroke, updateSelectedElements, updateModel);
    }

    private applyStrokeStyleToElement(element: ElementBase, strokeStyle?: { strokeDash?: number[]; lineCap?: CanvasLineCap; lineJoin?: CanvasLineJoin; miterLimit?: number }) {
        const normalizedStrokeStyle = this.getNormalizedStrokeStyle(strokeStyle);
        element.setStrokeDash(normalizedStrokeStyle.strokeDash);
        element.setLineCap(normalizedStrokeStyle.lineCap);
        element.setLineJoin(normalizedStrokeStyle.lineJoin);
        element.setMiterLimit(normalizedStrokeStyle.miterLimit);
    }

    private getNormalizedStrokeStyle(strokeStyle?: { strokeDash?: number[]; lineCap?: CanvasLineCap; lineJoin?: CanvasLineJoin; miterLimit?: number }): {
        strokeDash?: number[];
        lineCap?: CanvasLineCap;
        lineJoin?: CanvasLineJoin;
        miterLimit?: number;
    } {
        const sourceStrokeStyle = strokeStyle ?? {
            strokeDash: this.strokeDash,
            lineCap: this.strokeLineCap,
            lineJoin: this.strokeLineJoin,
            miterLimit: this.strokeMiterLimit
        };
        const strokeDash = this.normalizeStrokeDash(sourceStrokeStyle.strokeDash);
        const lineCap = sourceStrokeStyle.lineCap ?? 'butt';
        const lineJoin = sourceStrokeStyle.lineJoin ?? 'miter';
        const miterLimit = this.normalizeMiterLimit(sourceStrokeStyle.miterLimit ?? 10);

        return {
            strokeDash,
            lineCap: lineCap === 'round' || lineCap === 'square' ? lineCap : undefined,
            lineJoin: lineJoin === 'round' || lineJoin === 'bevel' ? lineJoin : undefined,
            miterLimit: miterLimit !== 10 ? miterLimit : undefined
        };
    }

    private setStrokeStyleState(strokeStyle?: { strokeDash?: number[]; lineCap?: CanvasLineCap; lineJoin?: CanvasLineJoin; miterLimit?: number }) {
        const normalizedStrokeStyle = this.getStrokeStyleState(strokeStyle);
        this.strokeDash = normalizedStrokeStyle.strokeDash;
        this.strokeLineCap = normalizedStrokeStyle.lineCap;
        this.strokeLineJoin = normalizedStrokeStyle.lineJoin;
        this.strokeMiterLimit = normalizedStrokeStyle.miterLimit;
    }

    private getStrokeStyleState(strokeStyle?: { strokeDash?: number[]; lineCap?: CanvasLineCap; lineJoin?: CanvasLineJoin; miterLimit?: number }): {
        strokeDash?: number[];
        lineCap: CanvasLineCap;
        lineJoin: CanvasLineJoin;
        miterLimit: number;
    } {
        const sourceStrokeStyle = strokeStyle ?? {
            strokeDash: this.strokeDash,
            lineCap: this.strokeLineCap,
            lineJoin: this.strokeLineJoin,
            miterLimit: this.strokeMiterLimit
        };

        return {
            strokeDash: this.normalizeStrokeDash(sourceStrokeStyle.strokeDash),
            lineCap: sourceStrokeStyle.lineCap === 'round' || sourceStrokeStyle.lineCap === 'square' ? sourceStrokeStyle.lineCap : 'butt',
            lineJoin: sourceStrokeStyle.lineJoin === 'round' || sourceStrokeStyle.lineJoin === 'bevel' ? sourceStrokeStyle.lineJoin : 'miter',
            miterLimit: this.normalizeMiterLimit(sourceStrokeStyle.miterLimit ?? 10)
        };
    }

    private normalizeStrokeDash(strokeDash?: number[]) {
        if (!strokeDash || strokeDash.length === 0) {
            return undefined;
        }

        const normalizedStrokeDash = strokeDash
            .map((value) => Number(value))
            .filter((value) => Number.isFinite(value) && value >= 0);
        return normalizedStrokeDash.length > 0 ? normalizedStrokeDash : undefined;
    }

    private normalizeMiterLimit(miterLimit?: number) {
        const normalizedMiterLimit = Number(miterLimit);
        return Number.isFinite(normalizedMiterLimit) && normalizedMiterLimit > 0 ? normalizedMiterLimit : 10;
    }

    private parseStrokeDashText(dashPatternText?: string) {
        if (!dashPatternText) {
            return undefined;
        }

        const strokeDash = dashPatternText
            .split(/[\s,]+/)
            .map((value) => Number(value))
            .filter((value) => Number.isFinite(value) && value >= 0);
        return strokeDash.length > 0 ? strokeDash : undefined;
    }

    private formatStrokeDashText(strokeDash?: number[]) {
        return strokeDash && strokeDash.length > 0 ? strokeDash.join(', ') : '';
    }

    private updateStrokeTooltip() {
        if (this.strokeType !== 'color') {
            this.strokeTooltip = 'No Stroke';
            return;
        }

        const parts = [this.strokeColor];
        if (this.strokeWidth !== 1) {
            parts.push(this.strokeWidth + 'px');
        }
        if (this.strokeDash && this.strokeDash.length > 0) {
            parts.push('dash ' + this.strokeDash.join(' '));
        }
        if (this.strokeLineCap !== 'butt') {
            parts.push(this.strokeLineCap + ' cap');
        }
        if (this.strokeLineJoin !== 'miter') {
            parts.push(this.strokeLineJoin + ' join');
        }
        if (this.strokeMiterLimit !== 10) {
            parts.push('miter ' + this.strokeMiterLimit);
        }
        this.strokeTooltip = parts.join(' | ');
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
                    selectedElement.fillOffsetX = this.fillOffsetX;
                    selectedElement.fillOffsetY = this.fillOffsetY;
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
            this.model.fillOffsetX = this.fillOffsetX;
            this.model.fillOffsetY = this.fillOffsetY;
}
        if (updateModel || updateSelectedElements) {
            this.controller.draw();
        }
    }

    setNoFill(updateSelectedElements: boolean, updateModel: boolean) {
        this.fillType = 'none';
        this.fillTooltip = 'No Fill';
        this.fillOffsetX = 0;
        this.fillOffsetY = 0;
        this.setFill(null, null, updateSelectedElements, updateModel);
    }

    setColorFill(color: string, updateSelectedElements: boolean, updateModel: boolean) {
        this.fillType = 'color';
        this.fillColor = color;
        this.fillTooltip = color;
        this.fillOffsetX = 0;
        this.fillOffsetY = 0;
        this.setFill(color, null, updateSelectedElements, updateModel);
    }

    setImageFill(fillInfo: FillModalInfo) {
        this.fillType = 'image';
        this.fillBitmapSource = fillInfo.selectedBitmapResource.key;
        this.fillOpacity = fillInfo.opacity / 255;
        this.fillTooltip = 'Image';
        this.fillScale = fillInfo.scale / 100;
        this.fillOffsetX = fillInfo.fillOffsetX;
        this.fillOffsetY = fillInfo.fillOffsetY;
        let fill: string = this.fillBitmapSource;
        if (fillInfo.opacity !== 255) {
            fill = (fillInfo.opacity / 255).toFixed(4) + ';' + fill;
        }
        fill = `image(${fill})`;
        this.setFill(fill, fillInfo.scale / 100, fillInfo.applyToSelected, fillInfo.applyToModel);
    }

    setModelFill(fillInfo: FillModalInfo) {
        this.fillType = 'model';
        this.fillModelSource = fillInfo.selectedModelResource.key;
        this.fillOpacity = fillInfo.opacity;
        this.fillTooltip = 'Model';
        this.fillScale = fillInfo.scale / 100;
        this.fillOffsetX = fillInfo.fillOffsetX;
        this.fillOffsetY = fillInfo.fillOffsetY;
        let fill: string = this.fillModelSource;
        if (fillInfo.opacity !== 255) {
            fill = (fillInfo.opacity / 255).toFixed(4) + ';' + fill;
        }
        fill = `model(${fill})`;
        this.setFill(fill, fillInfo.scale / 100, fillInfo.applyToSelected, fillInfo.applyToModel);
    }

    setLinearGradientFill(fillInfo: FillModalInfo) {
        this.fillType = 'linearGradient';
        this.fillTooltip = 'Linear Gradient';
        this.fillScale = 1;
        this.fillOffsetX = 0;
        this.fillOffsetY = 0;
        const fill = new LinearGradientFill(
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
        this.fillOffsetX = 0;
        this.fillOffsetY = 0;
        const fill = new RadialGradientFill(
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
            tool.opacity = Math.round(this.toolOpacity * 255);
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

    selectTool(toolName: string) {
        this.activeToolName = toolName;
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

            case 'arc':
                const arcTool = new ArcTool();
                this.setActiveTool(arcTool);
                this.ensureStroke();
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

            case 'regularpolygon':
                const regularPolygonTool = new RegularPolygonTool();
                this.setActiveTool(regularPolygonTool);
                this.ensureStrokeOrFill();
                break;

            case 'arrow':
                const arrowTool = new ArrowTool();
                this.setActiveTool(arrowTool);
                this.ensureStrokeOrFill();
                break;

            case 'wedge':
                const wedgeTool = new WedgeTool();
                this.setActiveTool(wedgeTool);
                this.ensureStrokeOrFill();
                break;

            case 'ring':
                const ringTool = new RingTool();
                this.setActiveTool(ringTool);
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

    get activeToolLabel(): string {
        return this.toolOptions.find((tool) => tool.value === this.activeToolName)?.label ?? 'Select';
    }

    ensureStroke() {
        if (!this.activeStroke || this.activeStroke === 'None') {
            this.setColorStroke('#000000ff', 1, false, false);
        }
    }

    ensureStrokeOrFill() {
        if ((!this.activeStroke || this.activeStroke === 'None') &&
            (!this.activeFill || this.activeFill === 'None')) {
            this.setColorStroke('#000000ff', 1, false, false);
        }
    }

    showTextToolModal() {
        const modalInfo = this.createTextModalInfoFromToolState();
        const modal = this.modalService.open(TextElementModalComponent, {
            ariaLabelledBy: 'modal-basic-title',
            size: 'xl',
            scrollable: true
        });
        modal.componentInstance.modalInfo = modalInfo;
        modal.result.then((result: TextElementModalInfo) => {
            this.setTextToolStateFromModal(result);

            const textTool = new TextTool();
            textTool.typeface = this.textToolTypeface;
            textTool.text = this.getTextPreviewFromModal(result);
            textTool.typesize = this.textToolTypesize;
            textTool.typestyle = this.buildTextStyle(this.textToolIsBold, this.textToolIsItalic);
            textTool.alignment = this.buildTextAlignment(this.textToolHAlign, this.textToolVAlign);
            this.setActiveTool(textTool);
        }, (reason) => {
            this.setSelectTool();
        });
    }

    private createTextModalInfoFromToolState() {
        const modalInfo = new TextElementModalInfo();
        modalInfo.fonts = this.fontService.listFonts();
        modalInfo.textResources = this.getTextResources();
        modalInfo.typeface = this.textToolTypeface;
        modalInfo.typesize = this.textToolTypesize;
        modalInfo.isBold = this.textToolIsBold;
        modalInfo.isItalic = this.textToolIsItalic;
        modalInfo.halign = this.textToolHAlign;
        modalInfo.valign = this.textToolVAlign;
        modalInfo.text = this.textToolText;
        modalInfo.letterSpacing = this.textToolLetterSpacing;
        modalInfo.lineHeight = this.textToolLineHeight;
        modalInfo.textDecoration = this.textToolTextDecoration;
        modalInfo.contentMode = this.textToolContentMode;
        modalInfo.resourceMode = this.textToolResourceMode;
        modalInfo.sourceKey = this.textToolSourceKey;
        modalInfo.sourceLocale = this.textToolSourceLocale;
        modalInfo.sourceText = this.textToolSourceText;
        modalInfo.sourceUri = this.textToolSourceUri;
        modalInfo.richText = this.cloneTextRuns(this.textToolRichText.length > 0
            ? this.textToolRichText
            : [this.createDefaultTextRun(this.textToolText)]);
        return modalInfo;
    }

    private createTextModalInfoFromTextElement(textElement: TextElement) {
        const modalInfo = new TextElementModalInfo();
        const style = this.parseTextStyle(textElement.typestyle);
        const alignment = this.parseTextAlignment(textElement.alignment);
        const resource = textElement.source ? this.findTextResource(textElement.source) : undefined;
        modalInfo.fonts = this.fontService.listFonts();
        modalInfo.textResources = this.getTextResources();
        modalInfo.typeface = textElement.typeface ?? this.textToolTypeface;
        modalInfo.typesize = textElement.typesize ?? this.textToolTypesize;
        modalInfo.isBold = style.isBold;
        modalInfo.isItalic = style.isItalic;
        modalInfo.halign = alignment.halign;
        modalInfo.valign = alignment.valign;
        modalInfo.text = textElement.text ?? textElement.getResolvedText() ?? '';
        modalInfo.letterSpacing = Number.isFinite(Number(textElement.letterSpacing)) ? Number(textElement.letterSpacing) : 0;
        modalInfo.lineHeight = textElement.lineHeight;
        modalInfo.textDecoration = textElement.textDecoration ?? '';
        modalInfo.sourceKey = textElement.source ?? '';
        modalInfo.sourceLocale = resource?.locale ?? '';
        modalInfo.sourceText = resource?.text ?? '';
        modalInfo.sourceUri = resource?.uri ?? '';
        modalInfo.contentMode = textElement.richText && textElement.richText.length > 0
            ? 'rich'
            : textElement.source
                ? 'resource'
                : 'inline';
        modalInfo.resourceMode = textElement.source ? 'existing' : resource?.uri ? 'uri' : 'embedded';
        modalInfo.richText = this.mapDesignerRunsToModalRuns(textElement.richText, modalInfo);
        if (modalInfo.contentMode === 'rich' && modalInfo.richText.length === 0) {
            modalInfo.richText = [this.createDefaultTextRun(modalInfo.text)];
        }
        return modalInfo;
    }

    private setTextToolStateFromModal(result: TextElementModalInfo) {
        this.textToolTypeface = result.typeface;
        this.textToolTypesize = result.typesize;
        this.textToolIsBold = result.isBold;
        this.textToolIsItalic = result.isItalic;
        this.textToolHAlign = result.halign;
        this.textToolVAlign = result.valign;
        this.textToolText = result.text;
        this.textToolLetterSpacing = this.normalizeTextNumber(result.letterSpacing);
        this.textToolLineHeight = this.normalizeOptionalPositiveNumber(result.lineHeight);
        this.textToolTextDecoration = this.normalizeTextDecoration(result.textDecoration);
        this.textToolContentMode = result.contentMode;
        this.textToolResourceMode = result.resourceMode;
        this.textToolSourceKey = result.sourceKey.trim();
        this.textToolSourceLocale = result.sourceLocale.trim();
        this.textToolSourceText = result.sourceText;
        this.textToolSourceUri = result.sourceUri.trim();
        this.textToolRichText = this.cloneTextRuns(result.richText);
    }

    private getTextResources(): TextModalResourceSummary[] {
        if (!this.model?.resources) {
            return [];
        }

        return this.model.resources
            .filter((resource) => resource.type === 'text')
            .map((resource) => {
                const textResource = resource as TextResource;
                return {
                    key: textResource.key,
                    locale: textResource.locale,
                    text: textResource.text,
                    uri: textResource.uri
                };
            })
            .sort((left, right) => `${left.key}|${left.locale ?? ''}`.localeCompare(`${right.key}|${right.locale ?? ''}`));
    }

    private findTextResource(key: string, locale?: string) {
        const normalizedKey = key.trim();
        const normalizedLocale = locale?.trim() ?? '';
        if (!normalizedKey) {
            return undefined;
        }

        return this.getTextResources().find((resource) => resource.key === normalizedKey && (resource.locale ?? '') === normalizedLocale)
            ?? this.getTextResources().find((resource) => resource.key === normalizedKey);
    }

    private createDefaultTextRun(text: string): TextModalRun {
        return {
            text,
            typeface: this.textToolTypeface,
            typesize: this.textToolTypesize,
            isBold: this.textToolIsBold,
            isItalic: this.textToolIsItalic,
            letterSpacing: this.textToolLetterSpacing,
            decoration: this.textToolTextDecoration
        };
    }

    private cloneTextRuns(runs: TextModalRun[] = []) {
        return runs.map((run) => ({
            text: run.text,
            typeface: run.typeface,
            typesize: run.typesize,
            isBold: run.isBold,
            isItalic: run.isItalic,
            letterSpacing: run.letterSpacing,
            decoration: run.decoration
        }));
    }

    private mapDesignerRunsToModalRuns(runs: DesignerTextRun[] | undefined, modalInfo: TextElementModalInfo) {
        return (runs ?? []).map((run) => {
            const style = this.parseTextStyle(run.typestyle);
            return {
                text: run.text ?? '',
                typeface: run.typeface ?? modalInfo.typeface,
                typesize: run.typesize ?? modalInfo.typesize,
                isBold: style.isBold,
                isItalic: style.isItalic,
                letterSpacing: this.normalizeTextNumber(run.letterSpacing),
                decoration: run.decoration ?? ''
            };
        });
    }

    private mapModalRunsToDesignerRuns(runs: TextModalRun[]) {
        return runs.map((run) => ({
            text: run.text,
            typeface: run.typeface,
            typesize: run.typesize,
            typestyle: this.buildTextStyle(run.isBold, run.isItalic),
            letterSpacing: this.normalizeTextNumber(run.letterSpacing),
            decoration: this.normalizeTextDecoration(run.decoration)
        }));
    }

    private parseTextStyle(style?: string) {
        const normalizedStyle = (style ?? '').toLowerCase();
        return {
            isBold: normalizedStyle.indexOf('bold') !== -1,
            isItalic: normalizedStyle.indexOf('italic') !== -1
        };
    }

    private buildTextStyle(isBold: boolean, isItalic: boolean) {
        const styleParts: string[] = [];
        if (isBold) {
            styleParts.push('bold');
        }
        if (isItalic) {
            styleParts.push('italic');
        }
        return styleParts.join(',');
    }

    private parseTextAlignment(alignment?: string) {
        const normalizedAlignment = (alignment ?? '').toLowerCase();
        return {
            halign: normalizedAlignment.indexOf('center') !== -1
                ? 'center'
                : normalizedAlignment.indexOf('right') !== -1
                    ? 'right'
                    : 'left',
            valign: normalizedAlignment.indexOf('middle') !== -1
                ? 'middle'
                : normalizedAlignment.indexOf('bottom') !== -1
                    ? 'bottom'
                    : 'top'
        };
    }

    private buildTextAlignment(halign: string, valign: string) {
        const alignmentParts: string[] = [];
        if (halign !== 'left') {
            alignmentParts.push(halign);
        }
        if (valign !== 'top') {
            alignmentParts.push(valign);
        }
        return alignmentParts.join(',');
    }

    private getTextPreviewFromModal(result: TextElementModalInfo) {
        switch (result.contentMode) {
            case 'resource': {
                if (result.resourceMode === 'uri') {
                    return result.sourceKey.trim() || 'Remote Text';
                }

                if (result.resourceMode === 'existing') {
                    const resource = this.findTextResource(result.sourceKey, result.sourceLocale);
                    return resource?.text || resource?.uri || result.sourceKey || 'Text Resource';
                }

                return result.sourceText || result.sourceKey || 'Text Resource';
            }
            case 'rich':
                return result.richText.map((run) => run.text).join('');
            default:
                return result.text;
        }
    }

    private normalizeTextNumber(value?: number) {
        const normalized = Number(value);
        return Number.isFinite(normalized) ? normalized : 0;
    }

    private normalizeOptionalPositiveNumber(value?: number) {
        const normalized = Number(value);
        return Number.isFinite(normalized) && normalized > 0 ? normalized : undefined;
    }

    private normalizeTextDecoration(value?: string) {
        return (value ?? '')
            .split(',')
            .map((part) => part.trim())
            .filter((part) => part.length > 0)
            .join(',');
    }

    selectImageTool() {
        const bitmapResources: BitmapResource[] = [];
        this.model.resources.forEach((r) => {
            if (r.type === 'bitmap') {
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
            this.apiService.getSignedUrl(urlRequest).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
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
        modalInfo.opacity = this.toolOpacity * 255;
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
            this.toolOpacity = result.opacity / 255;
            this.toolLockAspect = result.lockAspect;
            this.setActiveTool(imageElementTool);
        }, (reason) => {
            this.setSelectTool();
        });
    }

    selectModelTool() {
        const modelResources: ModelResource[] = [];
        this.model.resources.forEach((r) => {
            if (r.type === 'model') {
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
        modalInfo.opacity = this.toolOpacity * 255;
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
            this.toolOpacity = result.opacity / 255;
            this.toolLockAspect = result.lockAspect;
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

    onContainerDeleted(containerId: string) {
        if(containerId === this.selectedContainerID) {
            if(this.controller) {
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
            });
        }
    }

    listFolderFiles() {
        this.folderFiles = null;
        if (!this.selectedContainerID) {
            return;
        }
        this.apiService.getContainerManifest(this.selectedContainerID, false, this.selectedFolderPath, true, true, false).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
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

    importLocalSvg(files: FileList | null, input: HTMLInputElement) {
        this.importLocalSvgAtPoint(files, input, undefined);
    }

    importLocalSvgAtPoint(files: FileList | null, input: HTMLInputElement | null, point?: Point) {
        if (!files || files.length === 0) {
            return;
        }
        const file = files[0];
        if (this.getExtension(file.name).toLowerCase() !== '.svg') {
            if (input) {
                input.value = null;
            }
            this.toasterService.warning('Only SVG files can be dropped directly into the model editor.');
            return;
        }
        const reader = new FileReader();
        this.isBusy = true;
        this.pendingImportPoint = point;
        reader.onload = () => {
            const svgText = typeof reader.result === 'string' ? reader.result : '';
            this.openSvgActionModal(svgText, file.name, null, true);
            if (input) {
                input.value = null;
            }
        };
        reader.onerror = () => {
            this.isBusy = false;
            this.pendingImportPoint = undefined;
            if (input) {
                input.value = null;
            }
            this.onError(`Unable to read ${file.name}.`);
        };
        reader.readAsText(file);
    }

    uploadFile(file: File) {
        const urlRequest = new SignedUrlRequestDTO();
        urlRequest.ContainerID = this.selectedContainerID;
        urlRequest.Path = this.selectedFolderPath + file.name;
        urlRequest.ContentType = file.type;
        urlRequest.Verb = 'put';
        this.apiService.getSignedUrl(urlRequest).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: (signedUrlRequest) => {
                // Start upload using signed URL
                const upload = new Upload(file.name, file.type, file.size, signedUrlRequest.Url);
                upload.containerID = this.selectedContainerID;
                upload.folderPath = this.selectedFolderPath;
                upload.file = file;
                upload.removeOnFailure = true;
                upload.removeOnSuccess = true;
                upload.callback.pipe(take(1), takeUntilDestroyed(this.destroyRef)).subscribe({
                    next: (result) => {
                        if (result.success) {
                            console.log('Upload callback: Success');
                            this.toasterService.success(upload.name, 'File Upload Complete');
                            if (upload.containerID === this.selectedContainerID && upload.folderPath === this.selectedFolderPath) {
                                this.listFolderFiles();
                            }
                        }
                        else {
                            if (upload.state.code === UploadStateCode.FAILED) {
                                this.onError(`Upload of ${upload.name} failed.`);
                            }
                            if (upload.state.code === UploadStateCode.ABORTED) {
                                this.onError(`Upload of ${upload.name} was aborted.`);
                            }
                        }
                        const index = this.uploads.indexOf(upload);
                        if (index !== -1) {
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

            case '.svg':
                {
                    this.loadSvgActionModal();
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
        this.apiService.getSignedUrl(urlRequest).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: (signedUrlRequest) => {
                const modalInfo = new ImageActionModalInfo();
                modalInfo.source = signedUrlRequest.Url;
                modalInfo.path = this.selectedFilePath;
                modalInfo.containerID = this.selectedContainerID;
                modalInfo.canEmbed = this.model != null && this.modelContainerID === this.selectedContainerID;
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
        this.apiService.getSignedUrl(urlRequest).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: (signedUrlRequest) => {
                this.http.get(signedUrlRequest.Url, { responseType: 'text' }).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
                    next: (modelJson: string) => {
                        try {
                            const model = Model.parse(modelJson);
                            const proxy = new ContainerUrlProxy(this.apiService, this.selectedContainerID);
                            model.resourceManager.urlProxy = proxy;
                            model.prepareResources(null, (prepareResourceResult) => {
                                this.isBusy = false;
                                if (prepareResourceResult) {
                                    const modalInfo = this.createModelActionModalInfo(
                                        model,
                                        this.selectedFilePath,
                                        this.selectedContainerID,
                                        this.selectedContainerName,
                                        'model');
                                    modalInfo.canEdit = true;
                                    modalInfo.canEmbed = this.model != null && this.modelContainerID === this.selectedContainerID;
                                    this.openModelActionModal(modalInfo);
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
                });
            },
            error: (error) => {
                this.isBusy = false;
                this.onError(error);
            }
        });
    }

    loadSvgActionModal() {
        const urlRequest = new SignedUrlRequestDTO();
        urlRequest.ContainerID = this.selectedContainerID;
        urlRequest.Path = this.selectedFilePath;
        urlRequest.Verb = 'get';
        this.isBusy = true;
        this.apiService.getSignedUrl(urlRequest).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: (signedUrlRequest) => {
                this.http.get(signedUrlRequest.Url, { responseType: 'text' }).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
                    next: (svgText: string) => {
                        this.openSvgActionModal(svgText, this.selectedFilePath, this.selectedContainerID, true);
                    },
                    error: (error) => {
                        this.isBusy = false;
                        this.onError(error);
                    }
                });
            },
            error: (error) => {
                this.isBusy = false;
                this.onError(error);
            }
        });
    }

    openSvgActionModal(svgText: string, path: string, containerID: string | null, canPrepareResources: boolean) {
        try {
            const model = SVGImporter.parse(svgText);
            if (containerID) {
                this.normalizeImportedSvgResourceUris(model, this.getPathDirectory(path));
                model.resourceManager.urlProxy = new ContainerUrlProxy(this.apiService, containerID);
                model.resourceManager.localResourcePath = this.getPathDirectory(path);
            }
            if (canPrepareResources && this.canPrepareImportedResources(model)) {
                model.prepareResources(null, (prepareResourceResult) => {
                    this.isBusy = false;
                    if (prepareResourceResult) {
                        this.showSvgActionModal(model, path, containerID);
                    }
                    else {
                        this.onError('Error loading SVG preview resources.');
                    }
                });
                return;
            }
            if (!containerID && this.model) {
                this.toasterService.warning('Local SVG import does not resolve sibling image files. Relative image references may be skipped.');
            }
            this.isBusy = false;
            this.showSvgActionModal(model, path, containerID);
        }
        catch (error) {
            this.isBusy = false;
            this.onError(error);
        }
    }

    showSvgActionModal(model: Model, path: string, containerID: string | null) {
        const modalInfo = this.createModelActionModalInfo(
            model,
            path,
            containerID,
            this.selectedContainerName,
            'svg');
        modalInfo.canEdit = false;
        modalInfo.canEmbed = this.model != null;
        modalInfo.canDecompose = this.model != null;
        modalInfo.importMode = 'embed';
        this.openModelActionModal(modalInfo);
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
        if (modalInfo.sourceType === 'svg') {
            if (modalInfo.importMode === 'decompose') {
                this.svgActionDecompose(modalInfo);
            }
            else {
                this.svgActionCreateElement(modalInfo);
            }
            return;
        }
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
        if (modalInfo.sourceType === 'svg') {
            this.svgActionAddResource(modalInfo);
            return;
        }
        const modelResource = new ModelResource();
        modelResource.uri = modalInfo.path;
        modelResource.model = modalInfo.model;
        modelResource.key = this.getResourceKey(modalInfo.path);
        this.model.resourceManager.add(modelResource);
    }

    svgActionCreateElement(modalInfo: ModelActionModalInfo) {
        const modelResource = this.addEmbeddedModelResource(modalInfo.path, modalInfo.model);
        const modelSize = modalInfo.model.getSize();
        const importPoint = this.pendingImportPoint ?? Point.create(0, 0);
        const modelElement = ModelElement.create(modelResource, importPoint.x, importPoint.y, modelSize.width, modelSize.height);
        modelElement.setInteractive(true);
        modelElement.aspectLocked = true;
        this.controller.addElement(modelElement);
        this.pendingImportPoint = undefined;
    }

    svgActionAddResource(modalInfo: ModelActionModalInfo) {
        this.addEmbeddedModelResource(modalInfo.path, modalInfo.model);
        this.pendingImportPoint = undefined;
    }

    svgActionDecompose(modalInfo: ModelActionModalInfo) {
        const importedElements = this.importModelElements(modalInfo.model, this.pendingImportPoint);
        if (importedElements.length === 0) {
            this.pendingImportPoint = undefined;
            this.toasterService.warning('The SVG did not produce any importable elements.');
            return;
        }
        this.controller.selectedElements = importedElements;
        this.controller.draw();
        this.selectionChanged(importedElements.length);
        this.pendingImportPoint = undefined;
    }

    createModelActionModalInfo(
        model: Model,
        path: string,
        containerID: string | null,
        containerName: string,
        sourceType: 'model' | 'svg') {
        const modalInfo = new ModelActionModalInfo();
        modalInfo.model = model;
        modalInfo.path = path;
        modalInfo.containerID = containerID;
        modalInfo.containerName = containerName;
        modalInfo.sourceType = sourceType;
        const modelSize = model.getSize();
        const wr = Math.min((window.innerWidth - 360), 1000) / modelSize.width;
        const hr = (window.innerHeight - 360) / modelSize.height;
        modalInfo.scale = Math.min(wr, hr);
        modalInfo.info = modelSize.width + 'x' + modelSize.height;
        return modalInfo;
    }

    openModelActionModal(modalInfo: ModelActionModalInfo) {
        const modal = this.modalService.open(ModelActionModalComponent, {
            ariaLabelledBy: 'modal-basic-title',
            size: 'xl',
            scrollable: true
        });
        modal.componentInstance.modalInfo = modalInfo;
        modal.result.then((modalResult: ModelActionModalInfo) => {
            switch (modalResult.action) {
                case 'edit':
                    this.modelActionEdit(modalResult);
                    break;

                case 'create-element':
                    this.modelActionCreateElement(modalResult);
                    break;

                case 'add-resource':
                    this.modelActionAddResource(modalResult);
                    break;
            }
        }, (_error) => {
        });
    }

    addEmbeddedModelResource(path: string, model: Model) {
        const modelResource = ModelResource.create(this.getResourceKey(path), model);
        this.model.resourceManager.add(modelResource);
        return modelResource;
    }

    importModelElements(sourceModel: Model, point?: Point) {
        const resourceKeyMap = new Map<string, string>();
        sourceModel.resources.forEach((resource) => {
            const importedResource = this.cloneImportedResource(resource, resourceKeyMap);
            this.model.resourceManager.add(importedResource);
        });

        const importedElements: ElementBase[] = [];
        const origin = point ?? Point.create(0, 0);
        sourceModel.elements.forEach((sourceElement) => {
            const clonedElement = sourceElement.clone();
            this.remapElementResourceKeys(clonedElement, resourceKeyMap);
            clonedElement.translate(origin.x, origin.y);
            clonedElement.setInteractive(true);
            this.model.add(clonedElement);
            importedElements.push(clonedElement);
        });
        return importedElements;
    }

    cloneImportedResource(resource: Resource, resourceKeyMap: Map<string, string>) {
        const clonedResource = resource.clone();
        if (clonedResource.key) {
            const mappedKey = this.getAvailableResourceKey(clonedResource.key, clonedResource.locale);
            resourceKeyMap.set(clonedResource.key, mappedKey);
            clonedResource.key = mappedKey;
        }
        return clonedResource;
    }

    remapElementResourceKeys(element: ElementBase, resourceKeyMap: Map<string, string>) {
        const elementWithSource = element as ElementBase & { source?: string };
        if (elementWithSource.source) {
            elementWithSource.source = this.mapImportedResourceKey(elementWithSource.source, resourceKeyMap);
        }
        if (typeof element.fill === 'string') {
            element.fill = this.remapFillResourceKey(element.fill, resourceKeyMap);
        }
    }

    mapImportedResourceKey(key: string, resourceKeyMap: Map<string, string>) {
        return resourceKeyMap.get(key) ?? key;
    }

    remapFillResourceKey(fill: string, resourceKeyMap: Map<string, string>) {
        const loweredFill = fill.toLowerCase();
        if (!loweredFill.startsWith('image(') && !loweredFill.startsWith('model(')) {
            return fill;
        }
        const prefix = fill.substring(0, 6);
        const body = fill.substring(6, fill.length - 1);
        const parts = body.split(';');
        const key = parts.length === 2 ? parts[1] : parts[0];
        const mappedKey = this.mapImportedResourceKey(key, resourceKeyMap);
        if (parts.length === 2) {
            return `${prefix}${parts[0]};${mappedKey})`;
        }
        return `${prefix}${mappedKey})`;
    }

    canPrepareImportedResources(model: Model) {
        return model.resources.every((resource) => !resource.uri || !this.isRelativeResourceUri(resource.uri));
    }

    normalizeImportedSvgResourceUris(model: Model, basePath: string) {
        model.resources.forEach((resource) => {
            if (resource.uri && this.isRelativeResourceUri(resource.uri)) {
                resource.uri = basePath + resource.uri;
            }
        });
    }

    isRelativeResourceUri(uri: string) {
        const loweredUri = uri.toLowerCase();
        return !uri.startsWith('/') && !uri.startsWith(':') &&
            !loweredUri.startsWith('http://') && !loweredUri.startsWith('https://') &&
            !loweredUri.startsWith('data:') && !loweredUri.startsWith('blob:');
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
        return this.getAvailableResourceKey(fileName);
    }

    getAvailableResourceKey(baseKey: string, locale?: string) {
        let fileNameTest = baseKey;
        let index = 0;
        do {
            const resource = this.model.resourceManager.findBestResource(fileNameTest, locale);
            if (!resource) {
                break;
            }
            index++;
            fileNameTest = baseKey + '.' + index;
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

    canExportModel() {
        return !!this.model && isPlatformBrowser(this.platformId);
    }

    exportCurrentModelAsSvg() {
        this.showExportModelModal('svg');
    }

    exportCurrentModelAsPng() {
        this.showExportModelModal('png');
    }

    exportCurrentModelAsJpeg() {
        this.showExportModelModal('jpeg');
    }

    exportCurrentModelAsWebp() {
        this.showExportModelModal('webp');
    }

    private showExportModelModal(format: ModelExportFormat) {
        if (!this.canExportModel()) {
            return;
        }

        const modalInfo = new ExportModelModalInfo();
        modalInfo.format = format;
        modalInfo.fileName = this.getExportFileName(this.getExportExtensionForFormat(format));
        modalInfo.scale = 100;
        modalInfo.quality = 92;
        modalInfo.modelWidth = this.model.getSize().width;
        modalInfo.modelHeight = this.model.getSize().height;

        const modal = this.modalService.open(ExportModelModalComponent, {
            ariaLabelledBy: 'modal-basic-title',
            scrollable: true,
            size: 'lg'
        });
        modal.componentInstance.modalInfo = modalInfo;
        modal.result.then((result: ExportModelModalInfo) => {
            this.exportCurrentModel(result);
        }, () => {
        });
    }

    private exportCurrentModel(exportInfo: ExportModelModalInfo) {
        try {
            if (exportInfo.format === 'svg') {
                this.downloadTextFile(this.model.toSVG(), exportInfo.fileName, this.SVG_MIME_TYPE);
                return;
            }

            const mimeType = this.getExportMimeType(exportInfo.format);
            const quality = exportInfo.format === 'png' ? undefined : exportInfo.quality / 100;
            const scale = exportInfo.scale / 100;
            this.model.downloadAs(exportInfo.fileName, mimeType, quality, scale);
        }
        catch (error) {
            this.onError(error, 'Model Export Error');
        }
    }

    private getExportMimeType(format: ModelExportFormat) {
        switch (format) {
            case 'jpeg':
                return this.JPEG_MIME_TYPE;
            case 'webp':
                return this.WEBP_MIME_TYPE;
            default:
                return this.PNG_MIME_TYPE;
        }
    }

    private getExportExtensionForFormat(format: ModelExportFormat) {
        switch (format) {
            case 'svg':
                return '.svg';
            case 'jpeg':
                return '.jpg';
            case 'webp':
                return '.webp';
            default:
                return '.png';
        }
    }

    private downloadTextFile(content: string, fileName: string, mimeType: string) {
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }

        const blob = new Blob([content], { type: `${mimeType};charset=utf-8` });
        const link = this.document.createElement('a');
        const urlApi = typeof URL === 'undefined' ? undefined : URL;

        link.download = fileName;
        if (urlApi && typeof urlApi.createObjectURL === 'function' && typeof urlApi.revokeObjectURL === 'function') {
            const objectUrl = urlApi.createObjectURL(blob);
            link.href = objectUrl;
            link.click();
            urlApi.revokeObjectURL(objectUrl);
            return;
        }

        link.href = `data:${mimeType};charset=utf-8,${encodeURIComponent(content)}`;
        link.click();
    }

    private getExportFileName(extension: string) {
        const baseName = this.modelPath
            ? this.getFileNameWithoutExtension(this.getPathFileName(this.modelPath))
            : 'model';
        return this.ensureExtension(baseName, extension);
    }

    showAppearanceModal() {
        const modalInfo = new AppearanceModalInfo();
        modalInfo.opacity = this.appearanceOpacity;
        modalInfo.interactive = this.appearanceInteractive;
        modalInfo.blendMode = this.appearanceBlendMode;
        modalInfo.filter = this.appearanceFilter;
        modalInfo.shadowEnabled = this.appearanceShadowEnabled;
        modalInfo.shadowColor = this.appearanceShadowColor;
        modalInfo.shadowBlur = this.appearanceShadowBlur;
        modalInfo.shadowOffsetX = this.appearanceShadowOffsetX;
        modalInfo.shadowOffsetY = this.appearanceShadowOffsetY;
        modalInfo.applyToModel = this.applyAppearanceToModel;
        modalInfo.applyToSelected = this.applyAppearanceToSelected;
        modalInfo.selectedElementCount = this.selectedElementCount;

        const modal = this.modalService.open(AppearanceModalComponent, {
            ariaLabelledBy: 'modal-basic-title',
            scrollable: true,
            size: 'xl',
            windowClass: 'appearance-modal-window'
        });
        modal.componentInstance.modalInfo = modalInfo;
        modal.result.then((result: AppearanceModalInfo) => {
            this.applyAppearanceToSelected = result.applyToSelected;
            this.applyAppearanceToModel = result.applyToModel;
            this.setAppearanceState({
                opacity: result.opacity / 255,
                interactive: result.interactive,
                blendMode: result.blendMode || undefined,
                filter: result.filter || undefined,
                shadow: result.shadowEnabled
                    ? {
                        color: result.shadowColor,
                        blur: result.shadowBlur,
                        offsetX: result.shadowOffsetX,
                        offsetY: result.shadowOffsetY
                    }
                    : undefined
            }, result.applyToSelected, result.applyToModel);
        }, () => {
        });
    }

    private setAppearanceState(appearance: AppearanceState, updateSelectedElements: boolean, updateModel: boolean) {
        this.setAppearanceUiState(appearance);
        this.toolOpacity = appearance.opacity;

        if (this.activeTool) {
            this.activeTool.opacity = Math.round(appearance.opacity * 255);
        }

        if (updateSelectedElements && this.controller?.selectedElementCount() > 0) {
            this.controller.selectedElements.forEach((selectedElement) => {
                this.applyAppearanceToElement(selectedElement, appearance, true);
            });
        }

        if (updateModel) {
            this.applyAppearanceToElement(this.model, appearance, false);
        }

        if (updateSelectedElements || updateModel) {
            this.controller.draw();
        }
    }

    private setAppearanceUiState(appearance: AppearanceState) {
        this.appearanceOpacity = Math.round(this.normalizeAppearanceOpacity(appearance.opacity) * 255);
        this.appearanceInteractive = appearance.interactive;
        this.appearanceBlendMode = appearance.blendMode ?? '';
        this.appearanceFilter = appearance.filter ?? '';
        this.appearanceShadowEnabled = !!appearance.shadow;
        this.appearanceShadowColor = appearance.shadow?.color ?? '#00000055';
        this.appearanceShadowBlur = appearance.shadow?.blur ?? 12;
        this.appearanceShadowOffsetX = appearance.shadow?.offsetX ?? 6;
        this.appearanceShadowOffsetY = appearance.shadow?.offsetY ?? 8;
    }

    private getAppearanceStateFromElement(element: ElementBase): AppearanceState {
        return {
            opacity: this.normalizeAppearanceOpacity(element.opacity),
            interactive: element.interactive !== false,
            blendMode: element.blendMode,
            filter: element.filter,
            shadow: element.shadow
                ? {
                    color: element.shadow.color,
                    blur: element.shadow.blur,
                    offsetX: element.shadow.offsetX,
                    offsetY: element.shadow.offsetY
                }
                : undefined
        };
    }

    private applyAppearanceToElement(element: ElementBase, appearance: AppearanceState = this.getCurrentAppearanceState(), includeInteractive = true) {
        element.setOpacity(appearance.opacity);
        element.setShadow(appearance.shadow);
        element.setBlendMode(appearance.blendMode);
        element.setFilter(appearance.filter);
        if (includeInteractive) {
            element.setInteractive(appearance.interactive);
        }
    }

    private getCurrentAppearanceState(): AppearanceState {
        return {
            opacity: this.appearanceOpacity / 255,
            interactive: this.appearanceInteractive,
            blendMode: this.appearanceBlendMode || undefined,
            filter: this.appearanceFilter.trim() || undefined,
            shadow: this.appearanceShadowEnabled
                ? {
                    color: this.appearanceShadowColor,
                    blur: this.appearanceShadowBlur,
                    offsetX: this.appearanceShadowOffsetX,
                    offsetY: this.appearanceShadowOffsetY
                }
                : undefined
        };
    }

    private normalizeAppearanceOpacity(opacity?: number) {
        const normalized = Number(opacity);
        if (!Number.isFinite(normalized)) {
            return 1;
        }
        return Math.max(0, Math.min(1, normalized));
    }

    showTransformModal() {
        const modalInfo = new TransformModalInfo();
        modalInfo.transformText = this.transformText;
        modalInfo.applyToModel = this.applyTransformToModel;
        modalInfo.applyToSelected = this.applyTransformToSelected;
        modalInfo.selectedElementCount = this.selectedElementCount;

        const modal = this.modalService.open(TransformModalComponent, {
            ariaLabelledBy: 'modal-basic-title',
            scrollable: true,
            size: 'xl',
            windowClass: 'transform-modal-window'
        });
        modal.componentInstance.modalInfo = modalInfo;
        modal.result.then((result: TransformModalInfo) => {
            this.applyTransformToSelected = result.applyToSelected;
            this.applyTransformToModel = result.applyToModel;
            this.setTransformState(result.transformText, result.applyToSelected, result.applyToModel);
        }, () => {
        });
    }

    private setTransformState(transformText: string, updateSelectedElements: boolean, updateModel: boolean) {
        this.transformText = this.normalizeTransformText(transformText);

        if (updateSelectedElements && this.controller?.selectedElementCount() > 0) {
            this.controller.selectedElements.forEach((selectedElement) => {
                this.applyTransformToElement(selectedElement, this.transformText);
            });
        }

        if (updateModel) {
            this.applyTransformToElement(this.model, this.transformText);
        }

        if (updateSelectedElements || updateModel) {
            this.controller.draw();
        }
    }

    private applyTransformToElement(element: ElementBase, transformText: string = this.transformText) {
        const normalizedTransform = this.normalizeTransformText(transformText);
        if (normalizedTransform.length === 0) {
            element.transform = undefined;
            return;
        }

        element.setTransform(normalizedTransform);
    }

    private normalizeTransformText(transformText?: string) {
        return (transformText ?? '').trim();
    }

    showStrokeModal() {
        const modalInfo = new StrokeModalInfo();
        modalInfo.width = this.strokeWidth;
        modalInfo.color = this.strokeColor;
        const color = Color.parse(this.strokeColor);
        if(color.isNamedColor()) {
            const namedColor = Color.NamedColors.find((c) => (c.color as Color).equalsHue(color));
            modalInfo.namedColor = namedColor;
        }
        modalInfo.strokeType = this.strokeType;
        modalInfo.dashPatternText = this.formatStrokeDashText(this.strokeDash);
        modalInfo.lineCap = this.strokeLineCap;
        modalInfo.lineJoin = this.strokeLineJoin;
        modalInfo.miterLimit = this.strokeMiterLimit;
        modalInfo.applyToModel = this.applyStrokeToModel;
        modalInfo.applyToSelected = this.applyStrokeToSelected;
        modalInfo.selectedElementCount = this.selectedElementCount;
        const modal = this.modalService.open(StrokeModalComponent, {
            ariaLabelledBy: 'modal-basic-title',
            scrollable: true,
            size: 'xl',
            windowClass: 'stroke-modal-window'
        });
        modal.componentInstance.modalInfo = modalInfo;
        modal.result.then((result: StrokeModalInfo) => {
            this.applyStrokeToSelected = result.applyToSelected;
            this.applyStrokeToModel = result.applyToModel;
            if (result.strokeType === 'color') {
                this.setColorStroke(result.color, result.width, result.applyToSelected, result.applyToModel, {
                    strokeDash: this.parseStrokeDashText(result.dashPatternText),
                    lineCap: result.lineCap,
                    lineJoin: result.lineJoin,
                    miterLimit: result.miterLimit
                });
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
            const namedColor = Color.NamedColors.find((c) => (c.color as Color).equalsHue(color));
            modalInfo.namedColor = namedColor;
        }

        modalInfo.gradientColor1 = this.fillgradientColor1;
        color = Color.parse(this.fillgradientColor1);
        if(color.isNamedColor()) {
            const namedColor = Color.NamedColors.find((c) => (c.color as Color).equalsHue(color));
            modalInfo.gradientNamedColor1 = namedColor;
        }

        modalInfo.gradientColor2 = this.fillgradientColor2;
        color = Color.parse(this.fillgradientColor2);
        if(color.isNamedColor()) {
            const namedColor = Color.NamedColors.find((c) => (c.color as Color).equalsHue(color));
            modalInfo.gradientNamedColor2 = namedColor;
        }

        modalInfo.opacity = this.fillOpacity * 255;
        modalInfo.fillType = this.fillType;
        modalInfo.scale = this.fillScale * 100;
        modalInfo.fillOffsetX = this.fillOffsetX;
        modalInfo.fillOffsetY = this.fillOffsetY;

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
        const bitmapResources: BitmapResource[] = [];
        let selectedBitmapResource: BitmapResource;
        this.model.resources.forEach((r) => {
            if (r.type === 'bitmap') {
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
        const modelResources: ModelResource[] = [];
        let selectedModelResource: BitmapResource;
        this.model.resources.forEach((r) => {
            if (r.type === 'model') {
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
            scrollable: true,
            size: 'xl',
            windowClass: 'fill-modal-window'
        });
        modal.componentInstance.modalInfo = modalInfo;
        modal.result.then((result: FillModalInfo) => {
            this.applyFillToSelected = result.applyToSelected;
            this.applyFillToModel = result.applyToModel;
            if (result.fillType === 'color') {
                this.setColorFill(result.color, modalInfo.applyToSelected, modalInfo.applyToModel);
            }
            else if (result.fillType === 'image') {
                this.setImageFill(result);
            }
            else if (result.fillType === 'model') {
                this.setModelFill(result);
            }
            else if(result.fillType === 'linearGradient') {
                this.setLinearGradientFill(result);
            }
            else if(result.fillType === 'radialGradient') {
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
        this.apiService.getSignedUrl(urlRequest).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: (signedUrlRequest) => {
                const upload = Upload.createDataUpload(newModelPath, this.MODEL_MIME_TYPE,
                    serializedModel.length, signedUrlRequest.Url, serializedModel, null);
                upload.state = new UploadState(UploadStateCode.QUEUED, 0, 'Creating');
                upload.containerID = this.selectedContainerID;
                upload.folderPath = this.selectedFolderPath;
                upload.removeOnFailure = true;
                upload.removeOnSuccess = true;
                upload.callback.pipe(take(1), takeUntilDestroyed(this.destroyRef)).subscribe({
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
                            if (upload.state.code === UploadStateCode.FAILED) {
                                this.onError(upload.name, 'Model Create Error');
                            }
                            if (upload.state.code === UploadStateCode.ABORTED) {
                                this.onError(upload.name, 'Model Create Aborted');
                            }
                        }
                        const index = this.uploads.indexOf(upload);
                        if (index !== -1) {
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
        this.apiService.getSignedUrl(urlRequest).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: (signedUrlRequest) => {
                const upload = Upload.createDataUpload(this.modelPath, this.MODEL_MIME_TYPE,
                    serializedModel.length, signedUrlRequest.Url, serializedModel, null);
                upload.state = new UploadState(UploadStateCode.QUEUED, 0, 'Creating');
                upload.containerID = this.modelContainerID;
                upload.folderPath = this.getPathDirectory(this.modelPath);
                upload.removeOnFailure = true;
                upload.removeOnSuccess = true;
                upload.callback.pipe(take(1), takeUntilDestroyed(this.destroyRef)).subscribe({
                    next: (result) => {
                        this.isBusy = false;
                        if (result.success) {
                            this.toasterService.success(upload.name, 'Model Saved');
                            if (upload.containerID === this.selectedContainerID && upload.folderPath === this.selectedFolderPath) {
                                this.listFolderFiles();
                            }
                        }
                        else {
                            if (upload.state.code === UploadStateCode.FAILED) {
                                this.onError(`Model ${upload.name} could not be saved.`);
                            }
                            if (upload.state.code === UploadStateCode.ABORTED) {
                                this.onError(`Model ${upload.name} save was aborted.`);
                            }
                        }
                        const index = this.uploads.indexOf(upload);
                        if (index !== -1) {
                            this.uploads.splice(index, 1);
                        }
                    }
                });
                if (upload.containerID === this.selectedContainerID && upload.folderPath === this.selectedFolderPath) {
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
        this.closeSurfaceContextMenu();
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
        this.closeSurfaceContextMenu();
        // this.log(`Mouse down element: ${e.describe()}`);
    }

    mouseUpElement(e: ElementBase) {
        // this.log(`Mouse up element: ${e.describe()}`);
    }

    elementClicked(e: ElementBase) {
        this.closeSurfaceContextMenu();
        // this.log(`Element clicked: ${e.describe()}`);
    }

    contextMenuRequested(args: DesignContextMenuEventArgs) {
        if (!this.controller) {
            return;
        }

        if (args.element && !this.controller.isSelected(args.element)) {
            this.controller.selectedElements = [args.element];
            this.refreshSelectionUiState();
        }

        const sourceEvent = args.event as MouseEvent | undefined;
        this.openSurfaceContextMenu(sourceEvent?.clientX ?? 0, sourceEvent?.clientY ?? 0);
    }

    controllerSet(controller: DesignController) {
        this.controller = controller;
        this.syncUndoState();
        if (!this.controller) {
            return;
        }
        if (this.activeTool) {
            this.controller.setActiveTool(this.activeTool);
            this.controller.selectionEnabled = false;
        }
        else {
            this.controller.clearActiveTool();
            this.controller.selectionEnabled = true;
        }
        this.applyPersistedGridSettings();
        // this.controller.renderer = new DesignRenderer(this.controller);
    }

    undoChanged(state: UndoState) {
        this.canUndo = state?.canUndo ?? false;
        this.canRedo = state?.canRedo ?? false;
    }

    private syncUndoState() {
        this.canUndo = this.controller?.canUndo ?? false;
        this.canRedo = this.controller?.canRedo ?? false;
    }

    undo() {
        if (!this.controller?.undo()) {
            this.syncUndoState();
            return;
        }

        this.afterUndoRedo();
    }

    redo() {
        if (!this.controller?.redo()) {
            this.syncUndoState();
            return;
        }

        this.afterUndoRedo();
    }

    private afterUndoRedo() {
        if (this.modelEditorNavId === 2 && this.model) {
            this.formattedJson = this.model.formattedJSON();
        }

        this.selectionChanged(this.controller?.selectedElementCount?.() ?? 0);
        this.syncUndoState();
        this.changeDetectorRef.detectChanges();
    }

    private openSurfaceContextMenu(clientX: number, clientY: number) {
        this.surfaceContextMenuX = clientX;
        this.surfaceContextMenuY = clientY;
        this.surfaceContextMenuVisible = true;
        this.changeDetectorRef.detectChanges();

        setTimeout(() => {
            const menuElement = this.surfaceContextMenuRef?.nativeElement as HTMLElement | undefined;
            if (!menuElement || !this.surfaceContextMenuVisible) {
                return;
            }

            const padding = 12;
            this.surfaceContextMenuX = Math.max(padding, Math.min(clientX, window.innerWidth - menuElement.offsetWidth - padding));
            this.surfaceContextMenuY = Math.max(padding, Math.min(clientY, window.innerHeight - menuElement.offsetHeight - padding));
            this.changeDetectorRef.detectChanges();
        });
    }

    closeSurfaceContextMenu() {
        this.surfaceContextMenuVisible = false;
    }

    @HostListener('document:mousedown', ['$event'])
    onDocumentMouseDown(event: MouseEvent) {
        if (!this.surfaceContextMenuVisible) {
            return;
        }

        const target = event.target as Node | null;
        const menuElement = this.surfaceContextMenuRef?.nativeElement as HTMLElement | undefined;
        if (target && menuElement?.contains(target)) {
            return;
        }

        this.closeSurfaceContextMenu();
    }

    @HostListener('document:keydown.escape')
    onEscapeKey() {
        this.closeSurfaceContextMenu();
    }

    elementSelected(element: ElementBase) {
        return this.controller.isSelected(element);
    }

    selectElement(element: ElementBase) {
        if(this.controller.isSelected(element)) {
            this.controller.deselectElement(element);
        }
        else {
            this.controller.selectElement(element);
        }
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

        this.syncUndoState();

        if (this.selectedElementCount > 0) {
            selectedElement = this.controller.selectedElements[0];
        }
        else if (this.selectedElementCount === 0) {
            selectedElement = this.model;
        }

        // If single element selected
        if (this.selectedElementCount === 1) {
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

                case 'polyline':
                    this.onPolylineElementSelected(selectedElement as PolylineElement);
                    break;

                case 'polygon':
                    this.onPolygonElementSelected(selectedElement as PolygonElement);
                    break;

                case 'path':
                    this.onPathElementSelected(selectedElement as PathElement);
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
            this.applyAppearanceToSelected = this.selectedElementCount > 0;
            this.applyAppearanceToModel = this.selectedElementCount === 0;
            return;
        }

        // Set active stroke to first selected element or model
        if (selectedElement.canStroke()) {
            const strokeInfo = StrokeInfo.getStrokeInfo(selectedElement);
            if (strokeInfo.strokeType === 'color') {
                this.strokeColor = strokeInfo.strokeColor;
                this.strokeWidth = strokeInfo.strokeWidth;
                this.activeStroke = selectedElement.stroke;
                this.setColorStroke(this.strokeColor, this.strokeWidth, false, false, {
                    strokeDash: selectedElement.strokeDash,
                    lineCap: selectedElement.lineCap,
                    lineJoin: selectedElement.lineJoin,
                    miterLimit: selectedElement.miterLimit
                });
            }
            else if (strokeInfo.strokeType === 'none') {
                // this.setNoStroke(false, false);
            }
        }

        // Set active fill to first selected element
        if (selectedElement.canFill()) {
            const fillInfo = FillInfo.getFillInfo(selectedElement);
            if (fillInfo.type === 'image') {
                const modalInfo: FillModalInfo = new FillModalInfo();
                modalInfo.fillType = 'image';
                modalInfo.selectedBitmapResource = this.model.resources.find(r => r.key === fillInfo.source);
                modalInfo.opacity = fillInfo.opacity;
                modalInfo.scale = fillInfo.scale * 100;
                modalInfo.fillOffsetX = selectedElement.fillOffsetX;
                modalInfo.fillOffsetY = selectedElement.fillOffsetY;
                modalInfo.applyToModel = false;
                modalInfo.applyToSelected = false;
                this.setImageFill(modalInfo);
            }
            else if (fillInfo.type === 'model') {
                const modalInfo: FillModalInfo = new FillModalInfo();
                modalInfo.fillType = 'model';
                modalInfo.selectedModelResource = this.model.resources.find(r => r.key === fillInfo.source);
                modalInfo.opacity = fillInfo.opacity;
                modalInfo.scale = fillInfo.scale * 100;
                modalInfo.fillOffsetX = selectedElement.fillOffsetX;
                modalInfo.fillOffsetY = selectedElement.fillOffsetY;
                modalInfo.applyToModel = false;
                modalInfo.applyToSelected = false;
                this.setModelFill(modalInfo);
            }
            else if (fillInfo.type === 'color') {
                const color = Color.parse(fillInfo.color);
                if(fillInfo.opacity !== 255) {
                    color.a = Math.floor(fillInfo.opacity);
                }
                this.fillColor = color.toHexString();
                this.activeFill = selectedElement.fill;
                this.fillScale = selectedElement.fillScale ?? 1;
                this.setColorFill(this.fillColor, false, false);
            }
            else if(fillInfo.type === 'linear') {
                this.fillType = 'linearGradient';
                const start = Point.parse(fillInfo.start);
                this.fillLinearGradientStartX = start.x;
                this.fillLinearGradientStartY = start.y;
                const end = Point.parse(fillInfo.end);
                this.fillLinearGradientEndX = end.x;
                this.fillLinearGradientEndY = end.y;
                this.fillgradientColor1 = fillInfo.fillStops[0].color;
                this.fillgradientColor2 = fillInfo.fillStops[1].color;
            }
            else if(fillInfo.type === 'radial') {
                this.fillType = 'radialGradient';
                const center = Point.parse(fillInfo.center);
                this.fillRadialGradientCenterX = center.x;
                this.fillRadialGradientCenterY = center.y;
                const focus = Point.parse(fillInfo.focus);
                this.fillRadialGradientFocusX = focus.x;
                this.fillRadialGradientFocusY = focus.y;
                this.fillRadialGradientRadiusX = fillInfo.radiusX;
                this.fillradialGradientRadiusY = fillInfo.radiusY;
                this.fillgradientColor1 = fillInfo.fillStops[0].color;
                this.fillgradientColor2 = fillInfo.fillStops[1].color;
            }
            else if (fillInfo.type === 'none') {
                // this.setNoFill(false, false);
            }
        }

        if (this.selectedElementCount === 1) {
            this.setAppearanceUiState(this.getAppearanceStateFromElement(selectedElement));
        }
        else if (this.selectedElementCount > 1) {
            this.setAppearanceUiState(this.getAppearanceStateFromElement(selectedElement));
        }

        this.transformText = this.normalizeTransformText(selectedElement.transform);

        if (this.selectedElementCount > 0) {
            this.setSelectedIndexes();
            this.applyFillToSelected = true;
            this.applyFillToModel = false;
            this.applyStrokeToSelected = true;
            this.applyStrokeToModel = false;
            this.applyAppearanceToSelected = true;
            this.applyAppearanceToModel = false;
            this.applyTransformToSelected = true;
            this.applyTransformToModel = false;
        }
        else {
            this.applyFillToSelected = false;
            this.applyFillToModel = true;
            this.applyStrokeToSelected = false;
            this.applyStrokeToModel = true;
            this.applyAppearanceToSelected = false;
            this.applyAppearanceToModel = true;
            this.applyTransformToSelected = false;
            this.applyTransformToModel = true;
        }

        this.log(`Selection Changed: ${c} items`);
    }

    onImageElementSelected(imageElement: ImageElement) {
        this.singleElementType = imageElement.type;
    }

    showImageElementModal() {
        const imageElement = this.controller.selectedElements[0] as ImageElement;

        const modalInfo = new ImageElementModalInfo();
        const bitmapResources: BitmapResource[] = [];
        let selectedResource: BitmapResource;
        this.model.resources.forEach((r) => {
            if (r.type === 'bitmap') {
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
        const modelResources: ModelResource[] = [];
        let selectedResource: ModelResource;
        this.model.resources.forEach((r) => {
            if (r.type === 'model') {
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
        this.setTextToolStateFromModal(this.createTextModalInfoFromTextElement(textElement));
    }

    showTextElementModal() {

        const textElement = this.controller.selectedElements[0] as TextElement;

        const modalInfo = this.createTextModalInfoFromTextElement(textElement);
        const modal = this.modalService.open(TextElementModalComponent, {
            ariaLabelledBy: 'modal-basic-title',
            size: 'xl',
            scrollable: true
        });
        modal.componentInstance.modalInfo = modalInfo;
        modal.result.then((result: TextElementModalInfo) => {
            if (!this.applyTextModalResultToElement(textElement, result)) {
                return;
            }

            this.setTextToolStateFromModal(result);
            this.controller.draw();
        }, (reason) => {
        });
    }

    private applyTextModalResultToElement(textElement: TextElement, result: TextElementModalInfo) {
        textElement.typeface = result.typeface;
        textElement.typesize = result.typesize;
        textElement.typestyle = this.buildTextStyle(result.isBold, result.isItalic);
        textElement.alignment = this.buildTextAlignment(result.halign, result.valign);
        textElement.setLetterSpacing(this.normalizeTextNumber(result.letterSpacing));
        textElement.setLineHeight(this.normalizeOptionalPositiveNumber(result.lineHeight));
        textElement.setTextDecoration(this.normalizeTextDecoration(result.textDecoration) || undefined);

        if (result.contentMode === 'resource') {
            if (!this.ensureTextResource(result)) {
                return false;
            }

            textElement.richText = undefined;
            textElement.setSource(result.sourceKey.trim());
            this.prepareRemoteTextResourcesIfNeeded(result);
            return true;
        }

        if (result.contentMode === 'rich') {
            textElement.source = undefined;
            textElement.text = undefined;
            textElement.setRichText(this.mapModalRunsToDesignerRuns(result.richText));
            return true;
        }

        textElement.richText = undefined;
        textElement.setText(result.text);
        return true;
    }

    private ensureTextResource(result: TextElementModalInfo) {
        if (!this.model) {
            return false;
        }

        const key = result.sourceKey.trim();
        const locale = result.sourceLocale.trim() || undefined;

        if (!key) {
            this.toasterService.warning('Text resources require a key.');
            return false;
        }

        const hasConflictingResource = this.model.resources.some((resource) => {
            if (resource.type === 'text') {
                return false;
            }
            return resource.key === key && ((resource.locale ?? '') === (locale ?? ''));
        });
        if (hasConflictingResource) {
            this.toasterService.warning(`Resource key ${key} is already used by another resource type.`);
            return false;
        }

        if (result.resourceMode === 'existing') {
            const existingResource = this.findTextResource(key, locale);
            if (!existingResource) {
                this.toasterService.warning(`Text resource ${key} was not found in the model.`);
                return false;
            }
            return true;
        }

        for (let index = this.model.resources.length - 1; index >= 0; index--) {
            const resource = this.model.resources[index];
            if (resource.type === 'text' && resource.key === key && ((resource.locale ?? '') === (locale ?? ''))) {
                this.model.resources.splice(index, 1);
            }
        }

        const textResource = result.resourceMode === 'uri'
            ? TextResource.createFromUri(key, result.sourceUri.trim(), locale)
            : TextResource.createFromText(key, result.sourceText ?? '', locale);
        this.model.resourceManager.add(textResource);
        return true;
    }

    private prepareRemoteTextResourcesIfNeeded(result: TextElementModalInfo) {
        if (result.contentMode !== 'resource' || result.resourceMode !== 'uri' || !this.model) {
            return;
        }

        this.model.prepareResources(undefined, () => {
            this.controller?.draw();
        });
    }

    onPolylineElementSelected(polylineElement: PolylineElement) {
        this.singleElementType = polylineElement.type;
    }

    onPolygonElementSelected(polygonElement: PolygonElement) {
        this.singleElementType = polygonElement.type;
    }

    showPointsContainerModal() {
        const pointsElement = this.controller.selectedElements[0] as PolylineElement | PolygonElement;
        const modalInfo = new PointsModalInfo();
        modalInfo.pointsString = pointsElement.points;
        const modal = this.modalService.open(PointsModalComponent, {
            ariaLabelledBy: 'modal-basic-title',
            size: 'xl',
            scrollable: true
        });
        modal.componentInstance.modalInfo = modalInfo;
        modal.result.then((result: PointsModalInfo) => {
            pointsElement.points = result.pointsString;
            this.controller.draw();
        }, (reason) => {
        });
    }

    onPathElementSelected(pathElement: PathElement) {
        this.singleElementType = pathElement.type;
    }

    showPathElementModal() {
        const pathElement = this.controller.selectedElements[0] as PathElement;
        const modalInfo = new PathElementModalInfo();
        modalInfo.commandString = pathElement.commands;
        const modal = this.modalService.open(PathElementModalComponent, {
            ariaLabelledBy: 'modal-basic-title',
            size: 'xl',
            scrollable: true
        });
        modal.componentInstance.modalInfo = modalInfo;
        modal.result.then((result: PathElementModalInfo) => {
            pathElement.commands = result.commandString;
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
        let requiresDraw = false;
        if (this.strokeType === 'color' && this.controller?.selectedElements?.length) {
            this.controller.selectedElements.forEach((selectedElement) => {
                if (selectedElement.canStroke()) {
                    this.applyStrokeStyleToElement(selectedElement);
                }
                this.applyAppearanceToElement(selectedElement);
                this.applyTransformToElement(selectedElement);
                if (selectedElement instanceof TextElement) {
                    this.applyTextModalResultToElement(selectedElement, this.createTextModalInfoFromToolState());
                }
            });
            requiresDraw = true;
        }
        else if (this.controller?.selectedElements?.length) {
            this.controller.selectedElements.forEach((selectedElement) => {
                this.applyAppearanceToElement(selectedElement);
                this.applyTransformToElement(selectedElement);
                if (selectedElement instanceof TextElement) {
                    this.applyTextModalResultToElement(selectedElement, this.createTextModalInfoFromToolState());
                }
            });
            requiresDraw = true;
        }

        if (requiresDraw) {
            this.controller.draw();
        }
        this.log(`Element created (${r.x},${r.y}) ${r.width}x${r.height}`);
    }

    viewDragEnter(args: ViewDragArgs) {
        this.isDragging = true;
    }

    viewDragLeave(args: ViewDragArgs) {
        this.isDragging = false;
    }

    viewDrop(args: ViewDragArgs) {
        this.isDragging = false;
        const files = args.event?.dataTransfer?.files;
        if (!this.model || !files || files.length === 0) {
            return;
        }
        this.importLocalSvgAtPoint(files, null, args.location);
    }

    log(message: string) {
        this.lastMessage = message;
    }

    canDuplicateSelected() {
        return this.selectedElementCount > 0;
    }

    duplicateSelected() {
        if (this.controller && this.controller.selectedElementCount() > 0) {
            this.controller.duplicateSelectedElements();
            this.refreshSelectionUiState();
        }
    }

    canCutSelected() {
        return this.selectedElementCount > 0;
    }

    cutSelectedToClipboard() {
        if (this.controller?.cutSelectedToClipboard()) {
            this.refreshSelectionUiState();
        }
    }

    canCopySelected() {
        return this.selectedElementCount > 0;
    }

    copySelectedToClipboard() {
        this.controller?.copySelectedToClipboard();
    }

    canPasteClipboard() {
        return !!this.controller;
    }

    async pasteFromClipboard() {
        if (!this.controller) {
            return;
        }

        if (await this.controller.pasteFromClipboard()) {
            this.refreshSelectionUiState();
        }
    }

    private refreshSelectionUiState() {
        this.selectionChanged(this.controller?.selectedElementCount?.() ?? 0);
    }

    canMoveSelectedUp() {
        return this.selectedElementCount > 0 && this.highestSelectedIndex < this.model.elements.length - 1;
    }

    moveSelectedUp() {
        if (this.controller && this.controller.selectedElementCount() > 0) {
            this.controller.bringForward();
            this.refreshSelectionUiState();
        }
    }

    canMoveSelectedDown() {
        return this.selectedElementCount > 0 && this.lowestSelectedIndex > 0;
    }

    moveSelectedDown() {
        if (this.controller && this.controller.selectedElementCount() > 0) {
            this.controller.sendBackward();
            this.refreshSelectionUiState();
        }
    }

    canMoveSelectedToTop() {
        return this.selectedElementCount > 0;
    }

    moveSelectedToTop() {
        if (this.controller && this.controller.selectedElementCount() > 0) {
            this.controller.bringToFront();
            this.refreshSelectionUiState();
        }
    }

    canMoveSelectedToBottom() {
        return this.selectedElementCount > 0;
    }

    moveSelectedToBottom() {
        if (this.controller && this.controller.selectedElementCount() > 0) {
            this.controller.sendToBack();
            this.refreshSelectionUiState();
        }
    }

    canDeleteSelected() {
        return this.selectedElementCount > 0;
    }

    deleteSelected() {
        if (this.controller) {
            this.controller.removeSelected();
            this.refreshSelectionUiState();
        }
    }

    removeUnusedResources() {
        if (this.controller) {
            const removedCount = this.controller.removeUnusedResourcesFromResourceManager();
            if (removedCount > 0) {
                this.log(`Removed ${removedCount} unused resource${removedCount === 1 ? '' : 's'}`);
                this.refreshSelectionUiState();
            }
            else {
                this.log('No unused resources found');
            }
        }
    }

    canArrange() {
        return (this.controller?.movableSelectedElementCount?.() ?? 0) > 1;
    }

    canDistribute() {
        return (this.controller?.movableSelectedElementCount?.() ?? 0) > 2;
    }

    alignSelectedLeft() {
        this.controller.alignSelectedHorizontally('left');
        this.refreshSelectionUiState();
    }

    alignSelectedCenter() {
        this.controller.alignSelectedHorizontally('center');
        this.refreshSelectionUiState();
    }

    alignSelectedRight() {
        this.controller.alignSelectedHorizontally('right');
        this.refreshSelectionUiState();
    }

    alignSelectedTop() {
        this.controller.alignSelectedVertically('top');
        this.refreshSelectionUiState();
    }

    alignSelectedMiddle() {
        this.controller.alignSelectedVertically('middle');
        this.refreshSelectionUiState();
    }

    alignSelectedBottom() {
        this.controller.alignSelectedVertically('bottom');
        this.refreshSelectionUiState();
    }

    distributeSelectedHorizontally() {
        this.controller.distributeSelectedHorizontally();
        this.refreshSelectionUiState();
    }

    distributeSelectedVertically() {
        this.controller.distributeSelectedVertically();
        this.refreshSelectionUiState();
    }

    canResize() {
        return (this.controller?.resizeableSelectedElementCount?.() ?? 0) > 1;
    }

    resizeSelectedWidth() {
        this.controller.resizeSelectedToSameWidth();
        this.refreshSelectionUiState();
    }

    resizeSelectedHeight() {
        this.controller.resizeSelectedToSameHeight();
        this.refreshSelectionUiState();
    }

    resizeSelectedSize() {
        this.controller.resizeSelectedToSameSize();
        this.refreshSelectionUiState();
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

    showGridSettingsModal() {
        if (!this.controller) {
            return;
        }

        const currentSettings = this.getNormalizedGridSettings({
            snapToGrid: this.controller.snapToGrid,
            smartAlignmentEnabled: this.controller.smartAlignmentEnabled,
            gridType: this.controller.gridType,
            gridSpacing: this.controller.gridSpacing
        });
        const modalInfo = new GridSettingsModalInfo;
        modalInfo.snapToGrid = currentSettings.snapToGrid;
        modalInfo.smartAlignmentEnabled = currentSettings.smartAlignmentEnabled;
        modalInfo.gridType = currentSettings.gridType;
        modalInfo.gridSpacing = currentSettings.gridSpacing;

        const modal = this.modalService.open(GridSettingsModalComponent, {
            ariaLabelledBy: 'modal-basic-title'
        });
        modal.componentInstance.modalInfo = modalInfo;
        modal.result.then((result: GridSettingsModalInfo) => {
            const nextSettings = this.getNormalizedGridSettings(result);
            this.applyGridSettings(nextSettings, true);
        }, (reason) => {
        });
    }

    private applyPersistedGridSettings() {
        const persistedSettings = this.readGridSettingsCookie();
        if (!persistedSettings) {
            return;
        }

        this.applyGridSettings(persistedSettings, false);
    }

    private applyGridSettings(settings: PersistedGridSettings, persist: boolean) {
        if (!this.controller) {
            return;
        }

        const normalizedSettings = this.getNormalizedGridSettings(settings);
        const settingsChanged =
            normalizedSettings.snapToGrid !== this.controller.snapToGrid ||
            normalizedSettings.smartAlignmentEnabled !== this.controller.smartAlignmentEnabled ||
            normalizedSettings.gridType !== this.controller.gridType ||
            normalizedSettings.gridSpacing !== this.controller.gridSpacing;

        if (!settingsChanged && !persist) {
            return;
        }

        this.controller.snapToGrid = normalizedSettings.snapToGrid;
        this.controller.smartAlignmentEnabled = normalizedSettings.smartAlignmentEnabled;
        this.controller.setGridType(normalizedSettings.gridType);
        this.controller.setGridSpacing(normalizedSettings.gridSpacing);

        if (persist) {
            this.writeGridSettingsCookie(normalizedSettings);
        }

        if (settingsChanged) {
            this.controller.draw();
        }
    }

    private getNormalizedGridSettings(settings: Partial<PersistedGridSettings>): PersistedGridSettings {
        const gridType = Number(settings.gridType);
        const normalizedGridType = Object.values(GridType).includes(gridType)
            ? gridType as GridType
            : GridType.Lines;

        return {
            snapToGrid: !!settings.snapToGrid,
            smartAlignmentEnabled: settings.smartAlignmentEnabled !== false,
            gridType: normalizedGridType,
            gridSpacing: Math.max(1, Math.round(Number(settings.gridSpacing) || 1))
        };
    }

    private readGridSettingsCookie(): PersistedGridSettings | null {
        if (!isPlatformBrowser(this.platformId)) {
            return null;
        }

        try {
            const cookiePrefix = `${this.gridSettingsCookieName}=`;
            const cookieValue = this.document.cookie
                .split(';')
                .map((entry) => entry.trim())
                .find((entry) => entry.startsWith(cookiePrefix));

            if (!cookieValue) {
                return null;
            }

            const parsed = JSON.parse(decodeURIComponent(cookieValue.substring(cookiePrefix.length)));
            return this.getNormalizedGridSettings(parsed);
        }
        catch {
            return null;
        }
    }

    private writeGridSettingsCookie(settings: PersistedGridSettings) {
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }

        try {
            const expires = new Date();
            expires.setFullYear(expires.getFullYear() + 1);
            const value = encodeURIComponent(JSON.stringify(this.getNormalizedGridSettings(settings)));
            this.document.cookie = `${this.gridSettingsCookieName}=${value}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
        }
        catch {
            // Ignore cookie failures and keep in-memory settings.
        }
    }
}

interface PersistedGridSettings {
    snapToGrid: boolean;
    smartAlignmentEnabled: boolean;
    gridType: GridType;
    gridSpacing: number;
}
