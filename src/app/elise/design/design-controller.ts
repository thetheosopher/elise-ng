import { Color } from '../core/color';
import { Component } from './component/component';
import { ComponentElement } from './component/component-element';
import { ComponentRegistry } from './component/component-registry';
import { ControllerEventArgs } from '../controller/controller-event-args';
import { DesignRenderer } from './design-renderer';
import { DesignTool } from './tools/design-tool';
import { ElementBase } from '../elements/element-base';
import { ElementCommandHandler } from '../command/element-command-handler';
import { ElementCreationProps } from '../elements/element-creation-props';
import { ElementDragArgs } from '../elements/element-drag-args';
import { ElementLocationArgs } from '../elements/element-location-args';
import { ElementSizeArgs } from '../elements/element-size-args';
import { ElementSizeProps } from '../elements/element-size-props';
import { EliseException } from '../core/elise-exception';
import { GridType } from './grid-type';
import { Handle } from './handle';
import { HandleFactory } from './handle';
import { IController } from '../controller/controller';
import { IControllerEvent, ControllerEvent } from '../controller/controller-event';
import { IMouseEvent } from '../core/mouse-event';
import { Logging } from '../core/logging';
import { Model } from '../core/model';
import { MouseEventArgs } from '../core/mouse-event-args';
import { MouseLocationArgs } from '../core/mouse-location-args';
import { MoveLocation } from '../elements/move-location';
import { Point } from '../core/point';
import { PointDepth } from '../core/point-depth';
import { Region } from '../core/region';
import { ResizeSize } from '../elements/resize-size';
import { Size } from '../core/size';
import { TimerParameters } from '../core/timer-parameters';
import { ViewDragArgs } from '../core/view-drag-args';
import { Utility } from '../core/utility';
import { PointEventParameters } from '../core/point-event-parameters';

const log = Logging.log;

const EPSILON = 2e-23;

export class DesignController implements IController {
    /**
      Global captured DesignController when mouse is down
    */
    static captured: DesignController;

    /**
      Fired when model is updated
    */
    modelUpdated: IControllerEvent<Model> = new ControllerEvent<Model>();

    /**
      Fired when enabled state is changed
    */
    enabledChanged: IControllerEvent<boolean> = new ControllerEvent<boolean>();

    /**
      Fired when mouse enters view
    */
    mouseEnteredView: IControllerEvent<MouseEventArgs> = new ControllerEvent<MouseEventArgs>();

    /**
      Fired when mouse leaves view
    */
    mouseLeftView: IControllerEvent<MouseEventArgs> = new ControllerEvent<MouseEventArgs>();

    /**
      Fired when mouse is pressed over view. Captures mouse activity.
    */
    mouseDownView: IControllerEvent<PointEventParameters> = new ControllerEvent<PointEventParameters>();

    /**
      Fired when mouse is released and mouse is captured.
    */
    mouseUpView: IControllerEvent<PointEventParameters> = new ControllerEvent<PointEventParameters>();

    /**
      Fired when mouse is moved over view
    */
    mouseMovedView: IControllerEvent<PointEventParameters> = new ControllerEvent<PointEventParameters>();

    /**
      Fired when mouse enters element bounds
    */
    mouseEnteredElement: IControllerEvent<ElementBase> = new ControllerEvent<ElementBase>();

    /**
      Fired when mouse leaves element bounds
    */
    mouseLeftElement: IControllerEvent<ElementBase> = new ControllerEvent<ElementBase>();

    /**
      Fired when mouse is pressed over element
    */
    mouseDownElement: IControllerEvent<ElementBase> = new ControllerEvent<ElementBase>();

    /**
      Fired when mouse is released over element
    */
    mouseUpElement: IControllerEvent<ElementBase> = new ControllerEvent<ElementBase>();

    /**
      Fired when mouse is pressed and released over an element
    */
    elementClicked: IControllerEvent<ElementBase> = new ControllerEvent<ElementBase>();

    /**
      Period animation event timer fired when timer is enabled
    */
    timer: ControllerEvent<TimerParameters> = new ControllerEvent<TimerParameters>();

    /**
      Fired when elements are selected or deselected
    */
    selectionChanged: IControllerEvent<number> = new ControllerEvent<number>();

    /**
      Fired when element is drag created
    */
    elementCreated: IControllerEvent<Region> = new ControllerEvent<Region>();

    /**
      Fired when an element is added to the model
    */
    elementAdded: IControllerEvent<ElementBase> = new ControllerEvent<ElementBase>();

    /**
      Fired when an element is removed from the model
    */
    elementRemoved: IControllerEvent<ElementBase> = new ControllerEvent<ElementBase>();

    /**
      Fired when a delete request is trigger
    */
    onDelete: IControllerEvent<ControllerEventArgs> = new ControllerEvent<ControllerEventArgs>();

    /**
      Fired when an element is being moved
    */
    elementMoving: IControllerEvent<ElementLocationArgs> = new ControllerEvent<ElementLocationArgs>();

    /**
      Fired when an element has been moved
    */
    elementMoved: IControllerEvent<ElementLocationArgs> = new ControllerEvent<ElementLocationArgs>();

    /**
      Fired when an element is being sized
    */
    elementSizing: IControllerEvent<ElementSizeArgs> = new ControllerEvent<ElementSizeArgs>();

    /**
      Fired when an element has been sized
    */
    elementSized: IControllerEvent<ElementSizeArgs> = new ControllerEvent<ElementSizeArgs>();

    /**
      Fired when a mouse drag has started over the view
    */
    viewDragEnter: IControllerEvent<ViewDragArgs> = new ControllerEvent<ViewDragArgs>();

    /**
      Fired while a mouse drag is occurring over the view
    */
    viewDragOver: IControllerEvent<ViewDragArgs> = new ControllerEvent<ViewDragArgs>();

    /**
      Fired when a mouse drag has left the view
    */
    viewDragLeave: IControllerEvent<ViewDragArgs> = new ControllerEvent<ViewDragArgs>();

    /**
      Fired when a mouse drop has occurred on the view
    */
    viewDrop: IControllerEvent<ViewDragArgs> = new ControllerEvent<ViewDragArgs>();

    /**
      Fired when a mouse drag has entered an element
    */
    elementDragEnter: IControllerEvent<ElementDragArgs> = new ControllerEvent<ElementDragArgs>();

    /**
      Fired when a mouse drag has left an element
    */
    elementDragLeave: IControllerEvent<ElementDragArgs> = new ControllerEvent<ElementDragArgs>();

    /**
      Fired when a mouse drop occurs on an element
    */
    elementDrop: IControllerEvent<ElementDragArgs> = new ControllerEvent<ElementDragArgs>();

    /**
      Fired when elements are reordered
    */
    elementsReordered: IControllerEvent<ElementBase[]> = new ControllerEvent<ElementBase[]>();

    /**
      Fired when IsDirty state changes
    */
    isDirtyChanged: IControllerEvent<boolean> = new ControllerEvent<boolean>();

    /**
      Controlled model
    */
    model: Model;

    /**
      Canvas rendering target
    */
    canvas: HTMLCanvasElement;

    /**
      User interaction enabled flag
    */
    enabled: boolean;

    /**
      Unsaved changed (dirty) flag
    */
    isDirty: boolean;

    /**
      Current mouse x position
    */
    currentX: number;

    /**
      Current mouse y position
    */
    currentY: number;

    /**
      Current drag rectangle width
    */
    currentWidth: number;

    /**
      Current drag rectangle height
    */
    currentHeight: number;

    /**
      Last mouse client X position
    */
    lastClientX: number;

    /**
      Last mouse client Y position
    */
    lastClientY: number;

    /**
      True when mouse is down and captured over view
    */
    isMouseDown: boolean;

    /**
      True when elements are being moved
    */
    isMoving: boolean;

    /**
      True when elements are being resized
    */
    isResizing: boolean;

    /**
      True when point container point is being moved
    */
    isMovingPoint: boolean;

    /**
      True when drag operation is in effect
    */
    isDragging: boolean;

    /**
      Index of point into current element being moved
    */
    movingPointIndex: number;

    /**
      Location at which mouse was pressed
    */
    mouseDownPosition: Point;

    /**
      Topmost element at mouse location
    */
    mouseOverElement: ElementBase;

    /**
      Topmost element over which mouse was pressed
    */
    pressedElement: ElementBase;

    /**
      Topmost element over which mouse drag is occurring
    */
    dragOverElement: ElementBase;

    /**
      Last mouse movement X delta
    */
    lastDeltaX: number;

    /**
      Last mouse movement Y delta
    */
    lastDeltaY: number;

    /**
      Selected element array
    */
    selectedElements: ElementBase[] = [];

    /**
      True when drag selecting
    */
    selecting: boolean;

    /**
      Sizing handle array for selected elements
    */
    sizeHandles: Handle[];

    /**
      Location of point container point in motion
    */
    movingPointLocation: Point;

    /**
      Array of tentative sizes for elements being sized
    */
    elementResizeSizes: ResizeSize[] = [];

    /**
      Array of tentative locations for elements being sized or moved
    */
    elementMoveLocations: MoveLocation[] = [];

    /**
      True when rubber band is active
    */
    rubberBandActive: boolean;

    /**
      Rubber band rectangle region
    */
    rubberBandRegion: Region;

    /**
      Snap element move and size actions to grid
    */
    snapToGrid: boolean;

    /**
      Design grid spacing
    */
    gridSpacing: number;

    /**
      Lock aspect ratio of resized items
    */
    lockAspect: boolean;

    /**
      Constrain elements to model bounds
    */
    constrainToBounds: boolean;

    /**
      Minimum size to which elements can be sized
    */
    minElementSize: Size = new Size(4, 4);

    /**
      Design surface grid type
    */
    gridType: GridType = GridType.Lines;

    /**
      Design surface grid color as string
    */
    gridColor: string;

    /**
      Design surface disabled state fill
    */
    disabledFill: string;

    /**
      Cancel mouse action flag
    */
    cancelAction: boolean;

    /**
      True when selection is enabled
    */
    selectionEnabled: boolean;

    /**
      Rendering scale
    */
    scale: number;

    /**
      True when redraw is required
    */
    needsRedraw: boolean;

    /**
      Design renderer
    */
    renderer: DesignRenderer;

    /**
      Large keyboard nudge amount
    */
    largeJump: number;

    /**
      Active element creation component
    */
    activeComponent: Component;

    /**
      Active element creation tool
    */
    activeTool: DesignTool;

    /**
      Element creation fill image
    */
    fillImage: HTMLImageElement;

    /**
      Last frame render time
    */
    lastFrameTime: number;

    /**
      Command handler for handling routed events
    */
    commandHandler: ElementCommandHandler;

    /**
      Determines if a location and size are within the bounds of a model
      @param p - Point
      @param s - Size
      @param model - Model
    */
    static isInBounds(p: Point, s: Size, model: Model): boolean {
        if (p.x < 0 || p.y < 0) {
            return false;
        }
        if (p.x + s.width > model.getSize().width) {
            return false;
        }
        if (p.y + s.height > model.getSize().height) {
            return false;
        }
        return true;
    }

    /**
     Create a new view controller and canvas and bind to host DIV element
    @param hostDiv - Host div element
    @param model - Drawing model
    @param scale - Rendering scale
    @returns New design controller
    */
    static initializeTarget(hostDiv: HTMLDivElement, model: Model, scale: number): DesignController {
        log('Initializing view controller target');
        if (!hostDiv) {
            throw new EliseException('Host element not defined.');
        }
        hostDiv.innerHTML = '';
        if (!hostDiv.id) {
            hostDiv.id = Utility.guid();
        }

        // Disable arrow/navigation keys to prevent scrolling
        // and allow handling in contained canvas
        const ar = [ 37, 38, 39, 40 ];

        // Change to use DOM 0 Style binding to prevent multiples
        hostDiv.onkeydown = function(e) {
            const key = e.which;
            ar.forEach(function(k) {
                if (k === key) {
                    e.preventDefault();
                    return false;
                }
            });
            return true;
        };

        const controller = new DesignController();
        controller.setScale(scale);
        controller.setModel(model);
        const canvas = controller.getCanvas();
        hostDiv.appendChild(canvas);
        canvas.setAttribute('id', hostDiv.id + '_canvas');
        hostDiv.style.width = model.getSize().width * scale + 'px';
        hostDiv.style.height = model.getSize().height * scale + 'px';
        controller.draw();
        model.controllerAttached.trigger(model, controller);
        return controller;
    }

    /**
      Constructs a new design controller
      @classdesc Manages rendering and interaction with rendered model content
    */
    constructor() {
        this.enabled = true;
        this.scale = 1.0;
        this.lastDeltaX = -1;
        this.lastDeltaY = -1;
        this.isDirty = false;
        this.isMouseDown = false;
        this.isMoving = false;
        this.isResizing = false;
        this.isMovingPoint = false;
        this.isDragging = false;
        this.lastClientX = -1;
        this.lastClientY = -1;
        this.selecting = false;
        this.rubberBandActive = false;
        this.snapToGrid = false;
        this.gridSpacing = 8;
        this.lockAspect = false;
        this.constrainToBounds = true;
        this.gridColor = 'Black';
        this.cancelAction = false;
        this.selectionEnabled = true;
        this.needsRedraw = false;
        this.largeJump = 10;

        this.setModel = this.setModel.bind(this);
        this.setEnabled = this.setEnabled.bind(this);
        this.addElement = this.addElement.bind(this);
        this.removeElement = this.removeElement.bind(this);
        this.removeSelected = this.removeSelected.bind(this);
        this.addComponentElement = this.addComponentElement.bind(this);
        this.getCanvas = this.getCanvas.bind(this);
        this.drawIfNeeded = this.drawIfNeeded.bind(this);
        this.createCanvas = this.createCanvas.bind(this);
        this.detach = this.detach.bind(this);
        this.setScale = this.setScale.bind(this);
        this.windowToCanvas = this.windowToCanvas.bind(this);
        this.windowMouseUp = this.windowMouseUp.bind(this);
        this.windowMouseMove = this.windowMouseMove.bind(this);
        this.onCanvasMouseEnter = this.onCanvasMouseEnter.bind(this);
        this.onCanvasMouseLeave = this.onCanvasMouseLeave.bind(this);
        this.onCanvasMouseDown = this.onCanvasMouseDown.bind(this);
        this.onCanvasMouseMove = this.onCanvasMouseMove.bind(this);
        this.onCanvasMouseUp = this.onCanvasMouseUp.bind(this);
        this.onCanvasKeyDown = this.onCanvasKeyDown.bind(this);
        this.onCanvasDragEnter = this.onCanvasDragEnter.bind(this);
        this.onCanvasDragOver = this.onCanvasDragOver.bind(this);
        this.onCanvasDragLeave = this.onCanvasDragLeave.bind(this);
        this.onCanvasDrop = this.onCanvasDrop.bind(this);
        this.ensureInBounds = this.ensureInBounds.bind(this);
        this.setMouseDownElement = this.setMouseDownElement.bind(this);
        this.setMouseOverElement = this.setMouseOverElement.bind(this);
        this.setDragOverElement = this.setDragOverElement.bind(this);
        this.onSelectionChanged = this.onSelectionChanged.bind(this);
        this.onElementAdded = this.onElementAdded.bind(this);
        this.onElementRemoved = this.onElementRemoved.bind(this);
        this.onModelUpdated = this.onModelUpdated.bind(this);
        this.onElementSizing = this.onElementSizing.bind(this);
        this.onElementSized = this.onElementSized.bind(this);
        this.setElementLocation = this.setElementLocation.bind(this);
        this.onElementMoved = this.onElementMoved.bind(this);
        this.renderGrid = this.renderGrid.bind(this);
        this.drawDashedLine = this.drawDashedLine.bind(this);
        this.getElementHandles = this.getElementHandles.bind(this);
        this.drawRubberBand = this.drawRubberBand.bind(this);
        this.drawHotspot = this.drawHotspot.bind(this);
        this.drawDashedHorizontalLine = this.drawDashedHorizontalLine.bind(this);
        this.drawDashedVerticalLine = this.drawDashedVerticalLine.bind(this);
        this.drawHorizontalLine = this.drawHorizontalLine.bind(this);
        this.drawVerticalLine = this.drawVerticalLine.bind(this);
        this.drawGuidewires = this.drawGuidewires.bind(this);
        this.draw = this.draw.bind(this);
        this.calculateFPS = this.calculateFPS.bind(this);
        this.invalidate = this.invalidate.bind(this);
        this.selectedElementCount = this.selectedElementCount.bind(this);
        this.selectedElement = this.selectedElement.bind(this);
        this.clearSelections = this.clearSelections.bind(this);
        this.isSelected = this.isSelected.bind(this);
        this.selectElement = this.selectElement.bind(this);
        this.deselectElement = this.deselectElement.bind(this);
        this.toggleSelected = this.toggleSelected.bind(this);
        this.selectAll = this.selectAll.bind(this);
        this.selectElements = this.selectElements.bind(this);
        this.onElementsReordered = this.onElementsReordered.bind(this);
        this.moveElementToBottom = this.moveElementToBottom.bind(this);
        this.moveElementToTop = this.moveElementToTop.bind(this);
        this.moveElementBackward = this.moveElementBackward.bind(this);
        this.moveElementForward = this.moveElementForward.bind(this);
        this.movableSelectedElementCount = this.movableSelectedElementCount.bind(this);
        this.resizeableSelectedElementCount = this.resizeableSelectedElementCount.bind(this);
        this.nudgeableSelectedElementCount = this.nudgeableSelectedElementCount.bind(this);
        this.clearElementResizeSizes = this.clearElementResizeSizes.bind(this);
        this.setElementResizeSize = this.setElementResizeSize.bind(this);
        this.getElementResizeSize = this.getElementResizeSize.bind(this);
        this.clearElementMoveLocations = this.clearElementMoveLocations.bind(this);
        this.setElementMoveLocation = this.setElementMoveLocation.bind(this);
        this.getElementMoveLocation = this.getElementMoveLocation.bind(this);
        this.nudgeSize = this.nudgeSize.bind(this);
        this.nudgeLocation = this.nudgeLocation.bind(this);
        this.setRubberBandActive = this.setRubberBandActive.bind(this);
        this.setRubberBandRegion = this.setRubberBandRegion.bind(this);
        this.setGridType = this.setGridType.bind(this);
        this.setGridSpacing = this.setGridSpacing.bind(this);
        this.setGridColor = this.setGridColor.bind(this);
        this.bindTarget = this.bindTarget.bind(this);
    }

    /**
      Sets controller model
    */
    setModel(model: Model): void {
        if (model === this.model) {
            return;
        }
        if (this.model) {
            this.model.controllerDetached.trigger(this.model, this);
        }
        log('Setting design controller model');
        this.model = model;
        this.currentX = undefined;
        this.currentY = undefined;
        this.currentWidth = undefined;
        this.currentHeight = undefined;

        this.isMouseDown = false;
        this.isMoving = false;
        this.isResizing = false;
        this.isMovingPoint = false;
        this.isDragging = false;
        this.mouseDownPosition = undefined;
        this.mouseOverElement = undefined;
        this.pressedElement = undefined;
        this.dragOverElement = undefined;
        this.lastDeltaX = -1;
        this.lastDeltaY = -1;

        this.selectedElements = [];
        this.selecting = false;
        this.sizeHandles = undefined;
        this.movingPointLocation = undefined;
        this.elementResizeSizes = [];
        this.elementMoveLocations = [];
        this.rubberBandActive = false;
        this.rubberBandRegion = undefined;

        if (!this.canvas) {
            this.createCanvas();
        }
        else {
            const width = this.model.getSize().width * this.scale;
            const height = this.model.getSize().height * this.scale;
            this.canvas.width = width;
            this.canvas.height = height;
            const element = this.canvas.parentElement;
            element.style.width = width + 'px';
            element.style.height = height + 'px';
        }

        if (this.model.elements && this.model.elements.length > 0) {
            this.model.elements.forEach(function(element) {
                if (element.interactive === undefined) {
                    element.interactive = true;
                }
            });
        }
    }

    /**
      Sets enabled state with optional disabled state overlay fill
      @param enabled - User interactivity enabled state
      @param disabledFill - Optional disabled state fill as string
    */
    setEnabled(enabled: boolean, disabledFill?: string): void {
        if (enabled === this.enabled) {
            return;
        }
        this.enabled = enabled;
        if (arguments.length > 1) {
            this.disabledFill = disabledFill;
        }
        if (!enabled) {
            if (this.isMouseDown) {
                this.cancelAction = true;
                this.onCanvasMouseUp({ clientX: this.lastClientX, clientY: this.lastClientY });
            }
            if (this.isDragging) {
                this.onCanvasDragLeave(undefined);
            }
        }
        this.draw();
        if (this.enabledChanged) {
            this.enabledChanged.trigger(this, this.enabled);
        }
    }

    clearActiveTool() {
        if (this.activeTool) {
            this.activeTool.cancel();
            this.activeTool.controller = undefined;
            this.activeTool.model = undefined;
            this.activeTool = undefined;
        }
    }

    setActiveTool(tool: DesignTool) {
        this.clearSelections();
        if (this.activeTool) {
            this.activeTool.cancel();
            this.activeTool.controller = undefined;
            this.activeTool.model = undefined;
        }
        tool.model = this.model;
        tool.controller = this;
        this.activeTool = tool;
    }

    /**
      Adds an element to the model
      @param el - Element to add
    */
    addElement(el: ElementBase): void {
        if (el.interactive === undefined) {
            el.interactive = true;
        }
        this.model.add(el);
        if (this.constrainToBounds) {
            this.ensureInBounds(el);
        }
        this.onElementAdded(el);
        this.onModelUpdated();
        this.drawIfNeeded();
    }

    /**
      Removed an element from the model
      @param el - Element to remove
    */
    removeElement(el: ElementBase): void {
        const index = this.model.remove(el);
        if (index !== -1) {
            this.onElementRemoved(el);
            this.deselectElement(el);
            this.onModelUpdated();
            this.drawIfNeeded();
        }
    }

    /**
      Removes all selected elements
    */
    removeSelected(): void {
        const self = this;
        let itemsRemoved = false;
        self.selectedElements.forEach(function(el) {
            const index = self.model.remove(el);
            if (index !== -1) {
                itemsRemoved = true;
                self.onElementRemoved(el);
            }
        });
        if (itemsRemoved) {
            self.selectedElements = [];
            self.onSelectionChanged();
            self.onModelUpdated();
            self.drawIfNeeded();
        }
    }

    /**
      Adds a new component element to the model
      @param type - Type of component element to add
      @param id - New element id
      @param x - X coordinate
      @param y - Y coordinate
      @param width - Width
      @param height - Height
      @param props - Element creation props
      @param callback - Element created callback (element: Elise.ElementBase)
    */
    addComponentElement(
        type: string,
        id: string,
        x: number,
        y: number,
        width: number,
        height: number,
        props: ElementCreationProps,
        callback: (element: ElementBase) => void
    ) {
        const self = this;
        const component = ComponentRegistry.getComponent(type);
        if (!component) {
            ComponentRegistry.componentNotRegistered(type);
        }
        const el = component.CreateElement(self.model, id, x, y, width, height, props);
        el.interactive = true;
        self.model.prepareResources(undefined, function(success) {
            if (success) {
                self.onElementAdded(el);
                self.onModelUpdated();
                self.drawIfNeeded();
                if (callback) {
                    callback(el);
                }
            }
            else {
                throw new EliseException('One or more resources failed to load.');
            }
        });
    }

    /**
      Creates if necessary and returns canvas element
    */
    getCanvas(): HTMLCanvasElement {
        if (!this.canvas) {
            this.createCanvas();
        }
        return this.canvas;
    }

    /**
      Renders to canvas if needed and clears redraw flag
    */
    drawIfNeeded(): void {
        if (this.needsRedraw) {
            this.draw();
            this.needsRedraw = false;
        }
    }

    /**
      Creates canvas for model at current scale and attached event handlers
    */
    createCanvas(): void {
        log('Creating canvas and attaching event handlers');
        const self = this;
        if (!self.model) {
            return;
        }
        const canvas = document.createElement('canvas');
        canvas.width = self.model.getSize().width * self.scale;
        canvas.height = self.model.getSize().height * self.scale;
        canvas.setAttribute('tabindex', '0');

        canvas.addEventListener('mouseenter', self.onCanvasMouseEnter);
        canvas.addEventListener('mouseleave', self.onCanvasMouseLeave);
        canvas.addEventListener('mousedown', self.onCanvasMouseDown);
        canvas.addEventListener('mousemove', self.onCanvasMouseMove);
        canvas.addEventListener('keydown', self.onCanvasKeyDown);
        canvas.addEventListener('dragenter', self.onCanvasDragEnter);
        canvas.addEventListener('dragleave', self.onCanvasDragLeave);
        canvas.addEventListener('drop', self.onCanvasDrop);

        self.canvas = canvas;
        self.renderer = new DesignRenderer(self);
    }

    /**
      Detaches and destroys current canvas
    */
    detach(): void {
        if (this.model) {
            this.model.controllerDetached.trigger(this.model, this);
            this.model.controllerDetached.clear();
            this.model.controllerAttached.clear();
        }
        if (!this.canvas) {
            return;
        }
        log('Detaching event handlers and destroying canvas');
        this.canvas.addEventListener('mouseenter', this.onCanvasMouseEnter);
        this.canvas.addEventListener('mouseleave', this.onCanvasMouseLeave);
        this.canvas.addEventListener('mousedown', this.onCanvasMouseDown);
        this.canvas.addEventListener('mousemove', this.onCanvasMouseMove);
        this.canvas.addEventListener('keydown', this.onCanvasKeyDown);
        this.canvas.addEventListener('dragenter', this.onCanvasDragEnter);
        this.canvas.addEventListener('dragleave', this.onCanvasDragLeave);
        this.canvas.addEventListener('drop', this.onCanvasDrop);
        const element = this.canvas.parentElement;
        if (element) {
            element.removeChild(this.canvas);
        }
        this.modelUpdated.clear();
        this.enabledChanged.clear();
        this.mouseEnteredView.clear();
        this.mouseLeftView.clear();
        this.mouseDownView.clear();
        this.mouseUpView.clear();
        this.mouseMovedView.clear();
        this.mouseEnteredElement.clear();
        this.mouseLeftElement.clear();
        this.mouseDownElement.clear();
        this.mouseUpElement.clear();
        this.elementClicked.clear();
        this.timer.clear();
        this.selectionChanged.clear();
        this.elementCreated.clear();
        this.elementAdded.clear();
        this.elementRemoved.clear();
        this.onDelete.clear();
        this.elementMoving.clear();
        this.elementMoved.clear();
        this.elementSizing.clear();
        this.elementSized.clear();
        this.viewDragEnter.clear();
        this.viewDragOver.clear();
        this.viewDragLeave.clear();
        this.viewDrop.clear();
        this.elementDragEnter.clear();
        this.elementDragLeave.clear();
        this.elementDrop.clear();
        this.elementsReordered.clear();
        this.isDirtyChanged.clear();
        this.canvas = undefined;
    }

    /**
      Changes design surface rendering scale
      @param scale - New rendering scale
    */
    setScale(scale: number, force?: boolean): void {
        if (scale === this.scale && !force) {
            return;
        }
        this.scale = scale;
        if (this.canvas) {
            const width = this.model.getSize().width * scale;
            const height = this.model.getSize().height * scale;
            this.canvas.width = width;
            this.canvas.height = height;
            const element = this.canvas.parentElement;
            element.style.width = width + 'px';
            element.style.height = height + 'px';
            this.draw();
        }
    }

    getNearestSnapX(newX: number) {
        let diff = newX % this.gridSpacing;
        if (diff > EPSILON) {
            if (diff < this.gridSpacing / 2) {
                newX -= diff;
            }
            else {
                diff = this.gridSpacing - diff;
                newX += diff;
            }
            return newX;
        }
        else {
            return newX;
        }
    }

    getNearestSnapY(newY: number) {
        let diff = newY % this.gridSpacing;
        if (diff > EPSILON) {
            if (diff < this.gridSpacing / 2) {
                newY -= diff;
            }
            else {
                diff = this.gridSpacing - diff;
                newY += diff;
            }
            return newY;
        }
        else {
            return newY;
        }
    }

    /**
     Translates raw window coordinates to model coordinates
     compensating for current scale and origin offset
     @param x - Raw x coordinate
     @param y - Raw y coordinate
    */
    windowToCanvas(x: number, y: number): Point {
        if (!this.canvas) {
            return new Point(x, y);
        }
        const bounds = this.canvas.getBoundingClientRect();
        return new Point(
            Math.round((x - bounds.left * (this.canvas.width / bounds.width)) / this.scale),
            Math.round((y - bounds.top * (this.canvas.height / bounds.height)) / this.scale)
        );
    }

    /**
      Handles captured mouse up event
      @param e - Window mouse up event
    */
    windowMouseUp(e: MouseEvent): void {
        const captured = DesignController.captured;
        if (captured) {
            log(`Window mouse up ${e.clientX}:${e.clientY}`);
            captured.onCanvasMouseUp(e);
            captured.drawIfNeeded();
            window.removeEventListener('mousedown', captured.windowMouseUp, true);
            window.removeEventListener('mousemove', captured.windowMouseMove, true);
            DesignController.captured = undefined;
        }
    }

    /**
      Handles captured mouse move event
      @param e - Window mouse up event
    */
    windowMouseMove(e: MouseEvent): void {
        const captured = DesignController.captured;
        if (captured) {
            log(`Window mouse move ${e.clientX}:${e.clientY}`);
            e.preventDefault();
            e.stopPropagation();
            captured.onCanvasMouseMove(e);
            captured.drawIfNeeded();
        }
    }

    /**
      Handles canvas mouse enter event
      @param e - DOM mouse event
    */
    onCanvasMouseEnter(e: MouseEvent): void {
        log(`Canvas mouse enter`);
        if (!this.enabled) {
            return;
        }
        if (this.mouseEnteredView.hasListeners()) {
            this.mouseEnteredView.trigger(this, new MouseEventArgs(e));
        }
        this.drawIfNeeded();
    }

    /**
      Handles canvas mouse leave event
      @param e - DOM mouse event
    */
    onCanvasMouseLeave(e: MouseEvent): void {
        log(`Canvas mouse leave`);
        if (!this.enabled) {
            return;
        }
        if (this.mouseLeftView.hasListeners()) {
            this.mouseLeftView.trigger(this, new MouseEventArgs(e));
        }
        this.drawIfNeeded();
    }

    /**
      Handles canvas mouse down event
      @param c - Design controller
      @param e - Mouse event
    */
    onCanvasMouseDown(e: MouseEvent): void {
        log(`Canvas mouse down ${e.clientX}:${e.clientY}`);
        DesignController.captured = this;
        window.addEventListener('mouseup', this.windowMouseUp, true);
        window.addEventListener('mousemove', this.windowMouseMove, true);

        if (!this.enabled) {
            return;
        }
        const p = this.windowToCanvas(e.clientX, e.clientY);
        const context = this.canvas.getContext('2d');

        // Set current location and empty width/height
        this.currentX = p.x;
        this.currentY = p.y;
        this.currentWidth = 0;
        this.currentHeight = 0;
        this.mouseDownPosition = new Point(p.x, p.y);
        this.isMouseDown = true;

        // Get button clicked (0 = Left)
        const button = e.button;

        // If we have an active tool
        if (this.activeTool) {
            // If it's creating and right button pressed, cancel and return
            if (this.activeTool.isCreating && button === 2) {
                this.activeTool.cancel();
                e.preventDefault();
                e.stopPropagation();
                this.isMouseDown = false;
                this.draw();
                return;
            }

            // If not right mouse button, pass to tool
            if (button !== 2) {
                this.activeTool.mouseDown(new MouseLocationArgs(e, new Point(p.x, p.y)));
            }

            // Fire mouse down event
            if (this.mouseDownView.hasListeners()) {
                this.mouseDownView.trigger(this, new PointEventParameters(e, new Point(p.x, p.y)));
            }

            return;
        }

        // Fire mouse down event
        if (this.mouseDownView.hasListeners()) {
            this.mouseDownView.trigger(this, new PointEventParameters(e, new Point(p.x, p.y)));
        }

        // Set active element if any at location
        const activeElement = this.model.firstActiveElementAt(context, p.x, p.y);
        this.setMouseDownElement(activeElement);

        // Clear cancel action flag
        this.cancelAction = false;

        // Left button
        if (button === 0 || button === 2) {
            let foundHandle = false;
            let selectedHandle: Handle;

            const l = this.selectedElements.length;
            for (let i = 0; i < l; i++) {
                const el = this.selectedElements[i];
                const handles = this.getElementHandles(el);

                // If element is transformed, hit test against transformed rectangles
                if (el.transform) {
                    context.save();
                    const b = el.getBounds();
                    let reference = new Point(b.x, b.y);
                    if (this.isMoving && el.canMove()) {
                        reference = this.getElementMoveLocation(el);
                    }
                    else if (this.isResizing && el.canResize()) {
                        reference = this.getElementMoveLocation(el);
                    }
                    this.model.setRenderTransform(context, el.transform, reference);
                    const hl = handles.length;
                    for (let hi = 0; hi < hl; hi++) {
                        const h = handles[hi];
                        context.beginPath();
                        context.rect(h.region.x, h.region.y, h.region.width, h.region.height);
                        const hit = context.isPointInPath(p.x, p.y);
                        context.closePath();
                        if (hit) {
                            this.canvas.style.cursor = h.cursor;
                            foundHandle = true;
                            selectedHandle = h;
                            break;
                        }
                    }
                    context.restore();
                }
                else {
                    // No element transform, so test handle regions
                    const hl = handles.length;
                    for (let hi = 0; hi < hl; hi++) {
                        const h = handles[hi];
                        const hr = h.region;
                        let hit = hr.containsCoordinate(p.x, p.y);
                        if (!hit) {
                            if (h.barRegion && h.barRegion.containsCoordinate(p.x, p.y)) {
                                hit = true;
                            }
                        }
                        if (hit) {
                            this.canvas.style.cursor = h.cursor;
                            selectedHandle = h;
                            foundHandle = true;
                            break;
                        }
                    }
                    if (foundHandle) {
                        break;
                    }
                }
            }

            // If handle found put in resizing mode
            if (foundHandle && button === 0) {
                // If multiple elements selected
                this.sizeHandles = [];
                if (this.resizeableSelectedElementCount() > 0) {
                    this.selectedElements.forEach(function(selectedElement) {
                        if (selectedElement.canResize) {
                            const elementHandles = this.getElementHandles(selectedElement);
                            elementHandles.forEach(function(handle) {
                                if (handle.handleId === selectedHandle.handleId) {
                                    this.sizeHandles.push(handle);
                                }
                            }, this);
                        }
                    }, this);
                    this.isResizing = true;
                }
                else if (this.selectedElementCount() === 1) {
                    const el = this.selectedElements[0];
                    if (el.canMovePoint()) {
                        const pointIndex = selectedHandle.handleIndex;
                        this.sizeHandles.push(selectedHandle);
                        this.isMovingPoint = true;
                        this.movingPointLocation = el.getPointAt(pointIndex, PointDepth.Full);
                        this.movingPointIndex = pointIndex;
                    }
                }
                return;
            }

            // Select/deselect element
            if (this.selectionEnabled || e.ctrlKey || e.metaKey || button === 2) {
                const elementsAtPoint = this.model.elementsAt(context, p.x, p.y);
                if (elementsAtPoint && elementsAtPoint.length > 0) {
                    this.rubberBandActive = false;
                    this.canvas.style.cursor = 'pointer';

                    // If any elements under point are already selected, do nothing
                    let elementSelected = false;
                    const sl = elementsAtPoint.length;
                    for (let si = 0; si < sl; si++) {
                        const elementAtPoint = elementsAtPoint[si];
                        if (this.isSelected(elementAtPoint)) {
                            elementSelected = true;
                            break;
                        }
                    }

                    // Select element
                    if (e.shiftKey) {
                        if (button === 0) {
                            this.toggleSelected(elementsAtPoint[elementsAtPoint.length - 1]);
                        }
                        else if (button === 2) {
                            this.selectElement(elementsAtPoint[elementsAtPoint.length - 1]);
                        }
                    }
                    else if (this.selectionEnabled && (e.ctrlKey || e.metaKey)) {
                        if (button === 0) {
                            this.toggleSelected(elementsAtPoint[elementsAtPoint.length - 1]);
                        }
                        else if (button === 2) {
                            this.selectElement(elementsAtPoint[elementsAtPoint.length - 1]);
                        }
                    }
                    else {
                        // Select current element and clear others
                        if (!elementSelected) {
                            this.clearSelections();
                            this.selectElement(elementsAtPoint[elementsAtPoint.length - 1]);
                        }
                        else {
                            // Toggle edit points mode
                            if (elementsAtPoint.length === 1) {
                                if (elementsAtPoint[0].canEditPoints()) {
                                    if (elementsAtPoint[0].editPoints) {
                                        elementsAtPoint[0].editPoints = false;
                                    }
                                }
                            }
                        }
                    }
                }
                else {
                    // Deselect all elements
                    if (!e.ctrlKey && !e.metaKey && !e.shiftKey) {
                        this.clearSelections();
                    }

                    // Enable rubber band
                    this.rubberBandRegion = new Region(p.x, p.y, 0, 0);
                    this.rubberBandActive = true;

                    if (this.selectionEnabled) {
                        this.selecting = true;
                    }
                    else {
                        if (!e.ctrlKey && !e.metaKey && !e.shiftKey) {
                            this.selecting = false;
                        }
                        else {
                            this.selecting = true;
                        }
                    }

                    this.invalidate();
                }
            }
            else {
                // Enable rubber band
                this.clearSelections();
                this.rubberBandRegion = new Region(p.x, p.y, 0, 0);
                this.rubberBandActive = true;
                this.selecting = false;
                this.invalidate();
            }
            this.invalidate();
        }
        this.drawIfNeeded();
    }

    /**
      Handles canvas mouse move event
      @param this - Design controller
      @param e - Mouse event
    */
    onCanvasMouseMove(e: MouseEvent): void {
        if (!this.enabled) {
            return;
        }
        if (e.button === 2) {
            return;
        }

        this.lastClientX = e.clientX;
        this.lastClientY = e.clientY;

        const p = this.windowToCanvas(e.clientX, e.clientY);
        if (this.isMouseDown) {
            this.currentWidth = p.x - this.currentX;
            this.currentHeight = p.y - this.currentY;
        }
        else {
            this.currentX = p.x;
            this.currentY = p.y;
            this.currentWidth = 0;
            this.currentHeight = 0;
        }

        // Get distance moved
        let deltaX = 0,
            deltaY = 0;
        if (this.mouseDownPosition) {
            const size = this.model.getSize();
            deltaX = p.x - this.mouseDownPosition.x;
            if (this.mouseDownPosition.x + deltaX < 0) {
                deltaX = -this.mouseDownPosition.x;
                this.currentX = 0;
                this.currentWidth = this.mouseDownPosition.x;
            }
            else if (this.mouseDownPosition.x + deltaX >= size.width) {
                deltaX = size.width - this.mouseDownPosition.x;
                this.currentX = size.width - 1;
                this.currentWidth = deltaX;
            }
            deltaY = p.y - this.mouseDownPosition.y;
            if (this.mouseDownPosition.y + deltaY < 0) {
                deltaY = -this.mouseDownPosition.y;
                this.currentY = 0;
                this.currentHeight = this.mouseDownPosition.y;
            }
            else if (this.mouseDownPosition.y + deltaY >= size.height) {
                deltaY = size.height - this.mouseDownPosition.y;
                this.currentY = size.height - 1;
                this.currentHeight = deltaY;
            }
            if (deltaX === this.lastDeltaX && deltaY === this.lastDeltaY) {
                return;
            }
        }
        this.lastDeltaX = deltaX;
        this.lastDeltaY = deltaY;

        // Fire view mouse moved event
        if (this.mouseMovedView.hasListeners()) {
            this.mouseMovedView.trigger(this, new PointEventParameters(e, new Point(p.x, p.y)));
        }

        // If we have an active tool, then delegate and return
        if (this.activeTool) {
            this.activeTool.mouseMove(new MouseLocationArgs(e, new Point(p.x, p.y)));
            return;
        }

        // If resizing
        if (this.isResizing && this.sizeHandles && this.sizeHandles.length > 0) {
            this.sizeHandles.forEach(function(h) {
                if (h.handleMoved) {
                    h.handleMoved(h, { deltaX: Math.round(deltaX), deltaY: Math.round(deltaY) });
                }
            });
        }
        else if (this.isMoving) {
            // Ensure no moves will result in out of bounds
            let allOkay = true;
            const sl = this.selectedElementCount();
            if (this.constrainToBounds) {
                for (let si = 0; si < sl; si++) {
                    const selectedElement = this.selectedElements[si];
                    if (selectedElement.canMove()) {
                        const b = selectedElement.getBounds();
                        const moveLocation = new Point(Math.round(b.x + deltaX), Math.round(b.y + deltaY));
                        if (!DesignController.isInBounds(moveLocation, b.size, this.model)) {
                            allOkay = false;
                            break;
                        }
                    }
                }
            }
            if (allOkay) {
                for (let si = 0; si < sl; si++) {
                    const selectedElement = this.selectedElements[si];
                    if (selectedElement.canMove()) {
                        const b = selectedElement.getBounds();
                        const moveLocation = new Point(Math.round(b.x + deltaX), Math.round(b.y + deltaY));
                        this.setElementMoveLocation(selectedElement, moveLocation, b.size);
                        this.invalidate();
                    }
                }
            }
            else {
                // Determine maximum we can move and set new diffX/diffY
                let x1 = Number.POSITIVE_INFINITY;
                let x2 = Number.NEGATIVE_INFINITY;
                let y1 = Number.POSITIVE_INFINITY;
                let y2 = Number.NEGATIVE_INFINITY;
                for (let si = 0; si < sl; si++) {
                    const selectedElement = this.selectedElements[si];
                    if (selectedElement.canMove()) {
                        const b = selectedElement.getBounds();
                        if (b.x < x1) {
                            x1 = b.x;
                        }
                        if (b.x + b.width > x2) {
                            x2 = b.x + b.width;
                        }
                        if (b.y < y1) {
                            y1 = b.y;
                        }
                        if (b.y + b.height > y2) {
                            y2 = b.y + b.height;
                        }
                    }
                }
                const size = this.model.getSize();
                if (deltaX < 0 && x1 + deltaX < 0) {
                    deltaX = -x1;
                }
                else if (deltaX > 0 && x2 + deltaX > size.width) {
                    deltaX = size.width - x2;
                }
                if (deltaY < 0 && y1 + deltaY < 0) {
                    deltaY = -y1;
                }
                else if (deltaY > 0 && y2 + deltaY > size.height) {
                    deltaY = size.height - y2;
                }
                for (let si = 0; si < sl; si++) {
                    const selectedElement = this.selectedElements[si];
                    if (selectedElement.canMove()) {
                        const b = selectedElement.getBounds();
                        const moveLocation = new Point(Math.round(b.x + deltaX), Math.round(b.y + deltaY));
                        this.setElementMoveLocation(selectedElement, moveLocation, b.size);
                        this.invalidate();
                    }
                }
            }
        }
        else if (this.isMovingPoint) {
            const pointHolder = this.selectedElements[0];
            let depth = PointDepth.Simple;
            if (this.selectedElementCount() === 1) {
                depth = PointDepth.Full;
            }
            const pointLocation = pointHolder.getPointAt(this.movingPointIndex, depth);
            let newLocation: Point;
            if (this.snapToGrid) {
                newLocation = new Point(
                    this.getNearestSnapX(pointLocation.x + deltaX),
                    this.getNearestSnapY(pointLocation.y + deltaY)
                );
            }
            else {
                newLocation = new Point(Math.round(pointLocation.x + deltaX), Math.round(pointLocation.y + deltaY));
            }
            this.movingPointLocation = newLocation;
            this.invalidate();
        }
        else if (this.isMouseDown) {
            if (!this.isMoving) {
                // Determine if any movable elements selected and if so, initiate move
                if (this.movableSelectedElementCount() > 0) {
                    if (deltaX * deltaX + deltaY * deltaY > 8) {
                        this.isMoving = true;
                        this.invalidate();
                    }
                }
            }

            // If rubber banding, update
            if (this.rubberBandActive) {
                let left = Math.min(this.mouseDownPosition.x, this.mouseDownPosition.x + deltaX);
                let top = Math.min(this.mouseDownPosition.y, this.mouseDownPosition.y + deltaY);
                let width = Math.abs(deltaX);
                let height = Math.abs(deltaY);

                // If snapping to grid
                if (this.snapToGrid) {
                    const snappedLeft = this.getNearestSnapX(this.mouseDownPosition.x);
                    left = snappedLeft;

                    const snappedTop = this.getNearestSnapY(this.mouseDownPosition.y);
                    top = snappedTop;
                }
                if (left < 0) {
                    left = 0;
                }
                if (top < 0) {
                    top = 0;
                }
                const size = this.model.getSize();
                if (left + width > size.width) {
                    width = size.width - left;
                }
                if (top + height > size.height) {
                    height = size.height - top;
                }
                this.rubberBandRegion = new Region(left, top, width, height);
                this.invalidate();
                this.canvas.style.cursor = 'none';
            }
        }
        else {
            // Determine if over handle
            let foundHandle = false;
            const sl = this.selectedElements.length;
            for (let si = 0; si < sl; si++) {
                const selectedElement = this.selectedElements[si];
                const handles = this.getElementHandles(selectedElement);

                // If element is transformed, hit test against transformed rectangles
                if (selectedElement.transform) {
                    const context = this.canvas.getContext('2d');
                    context.save();
                    const b = selectedElement.getBounds();
                    let reference = new Point(b.x, b.y);
                    if (this.isMoving && selectedElement.canMove()) {
                        reference = this.getElementMoveLocation(selectedElement);
                    }
                    else if (this.isResizing && selectedElement.canResize()) {
                        reference = this.getElementMoveLocation(selectedElement);
                    }
                    this.model.setRenderTransform(context, selectedElement.transform, reference);
                    const hl = handles.length;
                    for (let hi = 0; hi < hl; hi++) {
                        const h = handles[hi];
                        // let hit = h.region.containsCoordinate(p.x, p.y);
                        context.beginPath();
                        context.rect(h.region.x, h.region.y, h.region.width, h.region.height);
                        const hit = context.isPointInPath(p.x, p.y);
                        context.closePath();
                        if (hit) {
                            this.canvas.style.cursor = h.cursor;
                            foundHandle = true;
                            break;
                        }
                    }
                    context.restore();
                }
                else {
                    // No element transform, so test handle regions
                    const hl = handles.length;
                    for (let hi = 0; hi < hl; hi++) {
                        const h = handles[hi];
                        const hit = h.region.containsCoordinate(p.x, p.y);
                        if (hit) {
                            this.canvas.style.cursor = h.cursor;
                            foundHandle = true;
                            break;
                        }
                    }
                    if (foundHandle) {
                        break;
                    }
                }
            }
            if (!foundHandle) {
                const context = this.canvas.getContext('2d');
                const elementsAtPoint = this.model.elementsAt(context, p.x, p.y);
                if (elementsAtPoint && elementsAtPoint.length > 0) {
                    if (e.ctrlKey || e.metaKey) {
                        this.canvas.style.cursor = 'pointer';
                    }
                    else if (this.selectionEnabled) {
                        this.canvas.style.cursor = 'pointer';
                    }
                    else {
                        this.canvas.style.cursor = 'crosshair';
                    }
                    const activeElement = elementsAtPoint[elementsAtPoint.length - 1];
                    this.setMouseOverElement(activeElement);
                }
                else {
                    this.canvas.style.cursor = 'crosshair';
                    this.setMouseOverElement(undefined);
                }
            }
        }
        this.drawIfNeeded();
    }

    /**
      Handles canvas mouse up
      @param this - Design controller
      @param e - Mouse event info
    */
    onCanvasMouseUp(e: MouseEvent | IMouseEvent): void {
        log(`Canvas mouse up ${e.clientX}:${e.clientY}`);
        if (!this.enabled) {
            return;
        }

        const p = this.windowToCanvas(e.clientX, e.clientY);
        const deltaX = p.x - this.mouseDownPosition.x;
        const deltaY = p.y - this.mouseDownPosition.y;

        // Clear mouse down state and call any mouse up or click listeners
        this.isMouseDown = false;
        if (this.mouseUpView.hasListeners()) {
            this.mouseUpView.trigger(this, new PointEventParameters(e, new Point(p.x, p.y)));
        }

        // If we have an active tool, then delegate and return
        if (this.activeTool) {
            this.activeTool.mouseUp(new MouseLocationArgs(e, new Point(p.x, p.y)));
            return;
        }

        // Left button up
        const button = e.button;
        if (button === 0) {
            this.isMouseDown = false;

            // If rubber banding
            if (this.rubberBandActive) {
                this.rubberBandActive = false;
                if (this.selecting) {
                    const l = this.model.elements.length;
                    let itemsSelected = false;
                    for (let i = 0; i < l; i++) {
                        const el = this.model.elements[i];
                        if (el.interactive) {
                            const b = el.getBounds();

                            // If DX and DY are both negative, use full select
                            if (deltaX < 0 && deltaY < 0) {
                                if (this.rubberBandRegion.containsRegion(b)) {
                                    if (!this.isSelected(el)) {
                                        this.selectedElements.push(el);
                                        itemsSelected = true;
                                    }
                                }
                            }
                            else {
                                if (b.intersectsWith(this.rubberBandRegion)) {
                                    if (!this.isSelected(el)) {
                                        this.selectedElements.push(el);
                                        itemsSelected = true;
                                    }
                                }
                            }
                        }
                    }
                    if (itemsSelected) {
                        this.onSelectionChanged();
                    }
                    this.selecting = false;
                }
                else {
                    // If action not cancelled
                    if (!this.cancelAction) {
                        if (
                            this.elementCreated.hasListeners() &&
                            this.rubberBandRegion.width >= this.minElementSize.width &&
                            this.rubberBandRegion.height >= this.minElementSize.height
                        ) {
                            this.elementCreated.trigger(this, this.rubberBandRegion);
                        }
                    }
                }
            }

            this.invalidate();

            // Exit if action cancelled
            if (this.cancelAction) {
                if (this.pressedElement) {
                    const el = this.pressedElement;
                    if (this.mouseUpElement.hasListeners()) {
                        this.mouseUpElement.trigger(this, el);
                    }
                    this.pressedElement = undefined;
                }
                if (this.isMoving) {
                    this.clearElementMoveLocations();
                    this.selectedElements.forEach(function(el) {
                        if (el instanceof ComponentElement) {
                            if (el.component.size.hasListeners()) {
                                el.component.size.trigger(el.component, new ElementSizeProps(el, el.getSize()));
                            }
                        }
                    });
                    this.isMoving = false;
                    this.invalidate();
                }
                else if (this.isResizing) {
                    this.clearElementMoveLocations();
                    this.clearElementResizeSizes();
                    this.selectedElements.forEach(function(el) {
                        if (el instanceof ComponentElement) {
                            if (el.component.size.hasListeners()) {
                                el.component.size.trigger(el.component, new ElementSizeProps(el, el.getSize()));
                            }
                        }
                    });
                    this.sizeHandles = undefined;
                    this.isResizing = false;
                    this.invalidate();
                    this.canvas.style.cursor = 'crosshair';
                }
                else if (this.isMovingPoint) {
                    this.clearElementMoveLocations();
                    this.clearElementResizeSizes();
                    this.selectedElements.forEach(function(el) {
                        el.clearBounds();
                    });
                    this.sizeHandles = undefined;
                    this.isMovingPoint = false;
                    this.movingPointLocation = undefined;
                    this.invalidate();
                    this.canvas.style.cursor = 'crosshair';
                }
                return;
            }

            // If elements were being moved, commit move
            if (this.isMoving) {
                const sl = this.selectedElementCount();
                for (let si = 0; si < sl; si++) {
                    const selectedElement = this.selectedElements[si];
                    if (selectedElement.canMove()) {
                        const moveLocation = this.getElementMoveLocation(selectedElement);
                        selectedElement.setLocation(new Point(Math.round(moveLocation.x), Math.round(moveLocation.y)));
                        const resizeSize = this.getElementResizeSize(selectedElement);
                        selectedElement.setSize(new Size(Math.round(resizeSize.width), Math.round(resizeSize.height)));
                        const bounds = selectedElement.getBounds();
                        this.onElementMoved(selectedElement, new Point(bounds.x, bounds.y));
                        this.onElementSized(selectedElement, new Size(bounds.width, bounds.height));
                        this.invalidate();
                    }
                }
                this.isMoving = false;
                this.invalidate();
            }
            else if (this.isResizing) {
                const sl = this.selectedElementCount();
                for (let si = 0; si < sl; si++) {
                    const selectedElement = this.selectedElements[si];
                    if (selectedElement.canResize()) {
                        const moveLocation = this.getElementMoveLocation(selectedElement);
                        selectedElement.setLocation(new Point(Math.round(moveLocation.x), Math.round(moveLocation.y)));
                        const resizeSize = this.getElementResizeSize(selectedElement);
                        selectedElement.setSize(new Size(Math.round(resizeSize.width), Math.round(resizeSize.height)));
                        const bounds = selectedElement.getBounds();
                        this.onElementMoved(selectedElement, new Point(bounds.x, bounds.y));
                        this.onElementSized(selectedElement, new Size(bounds.width, bounds.height));
                        this.invalidate();
                    }
                }
                this.sizeHandles = undefined;
                this.isResizing = false;
                this.invalidate();
                this.canvas.style.cursor = 'crosshair';
            }
            else if (this.isMovingPoint) {
                const selectedElement = this.selectedElements[0];
                const moveLocation = this.movingPointLocation;
                let depth = PointDepth.Simple;
                if (this.selectedElementCount() === 1) {
                    depth = PointDepth.Full;
                }
                selectedElement.setPointAt(
                    this.movingPointIndex,
                    new Point(Math.round(moveLocation.x), Math.round(moveLocation.y)),
                    depth
                );
                selectedElement.clearBounds();
                this.clearElementMoveLocations();
                this.clearElementResizeSizes();
                this.sizeHandles = undefined;
                this.isMovingPoint = false;
                this.movingPointLocation = undefined;
                this.invalidate();
                this.canvas.style.cursor = 'crosshair';
            }
        }

        if (this.pressedElement) {
            const el = this.pressedElement;
            if (this.mouseUpElement.hasListeners()) {
                this.mouseUpElement.trigger(this, el);
            }
            if (el === this.mouseOverElement) {
                if (this.elementClicked.hasListeners()) {
                    this.elementClicked.trigger(this, el);
                }
            }
            this.pressedElement = undefined;
        }
        this.drawIfNeeded();
    }

    /**
      Handles canvas key down
      @param this - Design controller
      @param e - DOM Keyboard event
    */
    onCanvasKeyDown(e: KeyboardEvent): boolean {
        if (!this.enabled) {
            return false;
        }

        switch (e.keyCode) {
            case 37: // Left Arrow
                if ((e.ctrlKey || e.metaKey) && e.shiftKey) {
                    this.nudgeSize(-this.largeJump, 0);
                }
                else if (e.ctrlKey || e.metaKey) {
                    this.nudgeSize(-1, 0);
                }
                else if (e.shiftKey) {
                    this.nudgeLocation(-this.largeJump, 0);
                }
                else {
                    this.nudgeLocation(-1, 0);
                }
                return true;

            case 39: // Right Arrow
                if ((e.ctrlKey || e.metaKey) && e.shiftKey) {
                    this.nudgeSize(this.largeJump, 0);
                }
                else if (e.ctrlKey || e.metaKey) {
                    this.nudgeSize(1, 0);
                }
                else if (e.shiftKey) {
                    this.nudgeLocation(this.largeJump, 0);
                }
                else {
                    this.nudgeLocation(1, 0);
                }
                return true;

            case 38: // Up Arrow
                if ((e.ctrlKey || e.metaKey) && e.shiftKey) {
                    this.nudgeSize(0, -this.largeJump);
                }
                else if (e.ctrlKey || e.metaKey) {
                    this.nudgeSize(0, -1);
                }
                else if (e.shiftKey) {
                    this.nudgeLocation(0, -this.largeJump);
                }
                else {
                    this.nudgeLocation(0, -1);
                }
                return true;

            case 40: // Down Arrow
                if ((e.ctrlKey || e.metaKey) && e.shiftKey) {
                    this.nudgeSize(0, this.largeJump);
                }
                else if (e.ctrlKey || e.metaKey) {
                    this.nudgeSize(0, 1);
                }
                else if (e.shiftKey) {
                    this.nudgeLocation(0, this.largeJump);
                }
                else {
                    this.nudgeLocation(0, 1);
                }
                return true;

            case 65: // 'A' key
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    e.stopPropagation();
                    this.selectAll();
                    return true;
                }
                return false;

            case 46: // Delete
            case 8: // Backspace
                e.preventDefault();
                if (this.onDelete.hasListeners()) {
                    this.onDelete.trigger(this, new ControllerEventArgs(e));
                }
                else {
                    this.removeSelected();
                }
                return true;

            case 27: // ESC key
                if (this.activeTool) {
                    this.activeTool.cancel();
                }
                if (this.isMouseDown) {
                    this.cancelAction = true;
                    this.selecting = false;
                    this.onCanvasMouseUp({
                        clientX: this.lastClientX,
                        clientY: this.lastClientY,
                        button: 0
                    });
                    return true;
                }
                if (this.selectedElementCount() > 0) {
                    this.clearSelections();
                    return true;
                }
                return false;

            default:
                // console.log('Key Down Code: ' + e.keyCode);
                return false;
        }
    }

    /**
      Fired when drag begins over canvas
      @param this - Design controller
      @param e - Mouse drag event
    */
    onCanvasDragEnter(e: DragEvent): void {
        log(`Canvas drag enter`);
        e.stopPropagation();
        e.preventDefault();
        if (!this.enabled) {
            return;
        }
        this.isDragging = true;
        if (this.viewDragEnter.hasListeners()) {
            this.viewDragEnter.trigger(this, new ViewDragArgs(e, undefined));
        }
        this.drawIfNeeded();
    }

    /**
      Fired while drag is occurring over canvas
      @param this - Design controller
      @param e - Mouse drag event
    */
    onCanvasDragOver(e: DragEvent): void {
        log(`Canvas drag over ${e.clientX}:${e.clientY}`);
        e.stopPropagation();
        e.preventDefault();

        if (!this.enabled) {
            return;
        }
        const p = this.windowToCanvas(e.clientX, e.clientY);

        // Fire view drag over event
        if (this.viewDragOver.hasListeners()) {
            const evt = {
                controller: this,
                event: e,
                location: new Point(p.x, p.y)
            };
            this.viewDragOver.trigger(this, evt);
        }

        // Determine if over element
        const context = this.canvas.getContext('2d');
        const elementsAtPoint = this.model.elementsAt(context, p.x, p.y);
        if (elementsAtPoint && elementsAtPoint.length > 0) {
            let draggable: ElementBase;
            for (let i = elementsAtPoint.length - 1; i >= 0; i--) {
                const activeElement = elementsAtPoint[i];
                if (activeElement instanceof ComponentElement) {
                    if (activeElement.component.acceptsDrag) {
                        draggable = activeElement;
                        break;
                    }
                }
            }
            this.setDragOverElement(draggable, e);
        }
        else {
            this.setDragOverElement(undefined, e);
        }
        this.drawIfNeeded();
    }

    /**
      Fired when drag had ended over canvas
      @param e - Mouse drag event
    */
    onCanvasDragLeave(e: DragEvent): void {
        log(`Canvas drag leave`);
        e.stopPropagation();
        e.preventDefault();
        if (!this.enabled) {
            return;
        }
        this.isDragging = false;
        this.setDragOverElement(undefined, e);
        if (this.viewDragLeave.hasListeners()) {
            this.viewDragLeave.trigger(this, new ViewDragArgs(e, undefined));
        }
        this.drawIfNeeded();
    }

    /**
      Fired while drop occurs on canvas
      @param e - Mouse drag event
    */
    onCanvasDrop(e: DragEvent): void {
        log(`Canvas drag over ${e.clientX}:${e.clientY}`);
        e.stopPropagation();
        e.preventDefault();
        if (!this.enabled) {
            return;
        }
        this.isDragging = false;
        const p = this.windowToCanvas(e.clientX, e.clientY);
        if (this.dragOverElement) {
            if (this.dragOverElement instanceof ComponentElement) {
                const ce = this.dragOverElement as ComponentElement;
                if (ce.component.dragLeave.hasListeners()) {
                    ce.component.dragLeave.trigger(ce.component, new ElementDragArgs(this.dragOverElement, e));
                    this.invalidate();
                }
            }
            if (this.elementDrop.hasListeners()) {
                const evt = {
                    controller: this,
                    element: this.dragOverElement,
                    event: e
                };
                this.elementDrop.trigger(this, evt);
            }
        }
        else if (this.viewDrop.hasListeners()) {
            const evt = {
                controller: this,
                event: e,
                location: new Point(p.x, p.y)
            };
            this.viewDrop.trigger(this, evt);
        }
        this.drawIfNeeded();
    }

    /**
      Coerces an element into the bounds of its model
      @param el - Element
    */
    ensureInBounds(el: ElementBase): void {
        const model = this.model;
        const b = el.getBounds();
        const modelSize = model.getSize();
        if (DesignController.isInBounds(b.location, b.size, model)) {
            return;
        }
        if (!el.canResize()) {
            return;
        }

        // If can't fit in bounds, scale down to fit
        if (el.getSize().width > modelSize.width || el.getSize().height > modelSize.height) {
            let aspect = 1.0;
            if (el.getSize().height !== 0) {
                aspect = el.getSize().width / el.getSize().height;
            }
            let newWidth = el.getSize().width;
            let newHeight = el.getSize().height;
            let fits = false;
            while (!fits) {
                newWidth--;
                if (aspect !== 0) {
                    newHeight = Math.round(newWidth / aspect);
                }
                fits = newWidth <= modelSize.width && newHeight <= modelSize.height;
            }
            el.setSize(new Size(newWidth, newHeight));
        }

        // If out of bounds, but big enough to fit, then put back in bounds
        let newX = el.getLocation().x;
        let newY = el.getLocation().y;
        if (el.getSize().width <= modelSize.width && el.getSize().height <= modelSize.height) {
            if (el.getLocation().x < 0) {
                newX = 0;
            }
            if (el.getLocation().x + el.getSize().width > modelSize.width) {
                newX = modelSize.width - el.getSize().width;
            }
            if (el.getLocation().y < 0) {
                newY = 0;
            }
            if (el.getLocation().y + el.getSize().height > modelSize.height) {
                newY = modelSize.height - el.getSize().height;
            }
            el.setLocation(new Point(newX, newY));
        }
    }

    /**
      Sets current mouse down element
      @param el - Mouse down element
    */
    setMouseDownElement(el: ElementBase): void {
        if (el) {
            this.setMouseOverElement(el);
        }
        if (el !== this.pressedElement) {
            if (this.pressedElement) {
                if (this.mouseUpElement.hasListeners()) {
                    this.mouseUpElement.trigger(this, this.pressedElement);
                }
            }
            this.pressedElement = el;
            if (el) {
                if (this.mouseDownElement.hasListeners()) {
                    this.mouseDownElement.trigger(this, el);
                }
            }
        }
    }

    /**
      Sets current mouse over element
      @param el - Mouse over element
    */
    setMouseOverElement(el: ElementBase): void {
        if (el !== this.mouseOverElement) {
            if (this.mouseOverElement) {
                if (this.mouseLeftElement.hasListeners()) {
                    this.mouseLeftElement.trigger(this, this.mouseOverElement);
                }
            }
            this.mouseOverElement = el;
            if (el) {
                if (this.mouseEnteredElement.hasListeners()) {
                    this.mouseEnteredElement.trigger(this, el);
                }
            }
        }
    }

    /**
      Sets current drag over element
      @param el - Drag over element
    */
    setDragOverElement(el: ElementBase, evt: DragEvent): void {
        if (el !== this.dragOverElement) {
            if (this.dragOverElement) {
                if (this.dragOverElement instanceof ComponentElement) {
                    const ce = this.dragOverElement as ComponentElement;
                    ce.component.dragLeave.trigger(ce.component, new ElementDragArgs(this.dragOverElement, evt));
                }
                if (this.elementDragLeave.hasListeners()) {
                    this.elementDragLeave.trigger(this, new ElementDragArgs(this.dragOverElement, evt));
                }
            }
            this.dragOverElement = el;
            if (el) {
                if (el instanceof ComponentElement) {
                    el.component.dragEnter.trigger(el.component, new ElementDragArgs(el, evt));
                }
                if (this.elementDragEnter.hasListeners()) {
                    this.elementDragEnter.trigger(this, new ElementDragArgs(el, evt));
                }
            }
            this.invalidate();
        }
    }

    /**
      Called when selected elements are changed
    */
    onSelectionChanged(): void {
        const self = this;
        const selected: string[] = [];
        self.model.elements.forEach(function(el) {
            if (self.isSelected(el)) {
                selected.push(el.id);
                if (el instanceof ComponentElement) {
                    el.component.select.trigger(el.component, el);
                }
            }
            else if (el instanceof ComponentElement) {
                el.component.deselect.trigger(el.component, el);
            }
        });
        if (self.selectionChanged.hasListeners()) {
            self.selectionChanged.trigger(self, selected.length);
        }
        self.invalidate();
    }

    /**
      Called when an element is added to the model
      @param el - Element added
    */
    onElementAdded(el: ElementBase): void {
        this.elementAdded.trigger(this, el);
        this.invalidate();
    }

    /**
      Called when an element is removed from the model
      @param el - Element removed
    */
    onElementRemoved(el: ElementBase): void {
        if (el === this.mouseOverElement) {
            this.mouseOverElement = undefined;
        }
        if (el === this.pressedElement) {
            this.pressedElement = undefined;
        }
        if (el === this.dragOverElement) {
            this.dragOverElement = undefined;
        }
        this.elementRemoved.trigger(this, el);
        this.invalidate();
    }

    /**
      Called when the model is updated
      @param model - Model updated
    */
    onModelUpdated(): void {
        this.modelUpdated.trigger(this, this.model);
        this.setIsDirty(true);
        this.invalidate();
    }

    /**
      Called while an element is being resized
      @param el - Element being sized
      @param size - Tentative size
    */
    onElementSizing(el: ElementBase, size: Size): void {
        if (el instanceof ComponentElement) {
            if (el.component.size.hasListeners()) {
                el.component.size.trigger(el.component, new ElementSizeArgs(el, size));
            }
        }
        if (this.elementSizing.hasListeners()) {
            this.elementSizing.trigger(this, new ElementSizeArgs(el, size));
        }
    }

    /**
      Called while an element is being moved or sized
      @param el - Element being moved or sized
      @param location - Tentative location
    */
    onElementMoving(el: ElementBase, location: Point): void {
        if (this.elementMoving.hasListeners()) {
            this.elementMoving.trigger(this, new ElementLocationArgs(el, location));
        }
    }

    /**
      Called after and element has been resized
      @param el - Resized element
      @param size - New size
    */
    onElementSized(el: ElementBase, size: Size): void {
        if (this.constrainToBounds) {
            this.ensureInBounds(el);
        }
        if (el instanceof ComponentElement) {
            if (el.component.size.hasListeners()) {
                el.component.size.trigger(el.component, new ElementSizeArgs(el, el.getSize()));
            }
        }
        if (this.elementSized.hasListeners()) {
            this.elementSized.trigger(this, new ElementSizeArgs(el, size));
        }
        this.setIsDirty(true);
    }

    /**
      Sets a new element location and size
      @param el - Element to be moved
      @param location - New location
      @param size - New size
    */
    setElementLocation(el: ElementBase, location: Point, size: Size): void {
        el.setLocation(location);
        el.setSize(size);
        if (this.isSelected(el)) {
            this.setElementMoveLocation(el, location, size);
            this.setElementResizeSize(el, size, location);
        }
        this.onElementMoved(el, el.getLocation());
        this.onElementSized(el, el.getSize());
        this.invalidate();
    }

    /**
      Called when an element has been moved or sized
      @param el - Element being moved or sized
      @param location - New location
    */
    onElementMoved(el: ElementBase, location: Point): void {
        if (this.constrainToBounds) {
            this.ensureInBounds(el);
        }
        if (this.elementMoved.hasListeners()) {
            this.elementMoved.trigger(this, new ElementLocationArgs(el, location));
        }
        this.setIsDirty(true);
    }

    /**
      Renders design surface grid
      @method Elise.Drawing.DesignController#renderGrid
    */
    renderGrid(): void {
        return;
    }

    /**
      Renders dashed line
      @param c - Rendering context
      @param x1 - Starting x coordinate
      @param y1 - Starting y coordinate
      @param x2 - Ending x coordinate
      @param y2 - Ending x coordinate
      @param dashLength - Dash length
    */
    drawDashedLine(
        c: CanvasRenderingContext2D,
        x1: number,
        y1: number,
        x2: number,
        y2: number,
        dashLength: number
    ): void {
        c.beginPath();
        dashLength = dashLength === undefined ? 5 : dashLength;
        const deltaX = x2 - x1;
        const deltaY = y2 - y1;
        const numDashes = Math.floor(Math.sqrt(deltaX * deltaX + deltaY * deltaY) / dashLength);
        for (let i = 0; i < numDashes; ++i) {
            c[i % 2 === 0 ? 'moveTo' : 'lineTo'](x1 + deltaX / numDashes * i, y1 + deltaY / numDashes * i);
        }
        c.stroke();
    }

    /**
      Retrieves design handled for an element
      @param el - Element
      @returns Handle array
    */
    getElementHandles(el: ElementBase): Handle[] {
        const handles = HandleFactory.handlesForElement(el, this, this.scale);
        const hl = handles.length;
        for (let hi = 0; hi < hl; hi++) {
            const h = handles[hi];
            h.controller = this;
            h.element = el;
        }
        return handles;
    }

    /**
      Renders current rubber band region
      @param c - Rendering context
    */
    drawRubberBand(c: CanvasRenderingContext2D): void {
        if (!this.selecting) {
            this.drawHotspot(c);
            return;
        }

        const x1 = this.rubberBandRegion.x;
        const x2 = this.rubberBandRegion.x + this.rubberBandRegion.width;
        const y1 = this.rubberBandRegion.y;
        const y2 = this.rubberBandRegion.y + this.rubberBandRegion.height;

        c.strokeStyle = 'black';
        c.lineWidth = 1.0 / this.scale;
        c.strokeRect(x1, y1, this.rubberBandRegion.width, this.rubberBandRegion.height);

        c.strokeStyle = 'white';
        this.drawDashedLine(c, x1, y1, x2, y1, 1);
        this.drawDashedLine(c, x2, y1, x2, y2, 1);
        this.drawDashedLine(c, x2, y2, x1, y2, 1);
        this.drawDashedLine(c, x1, y2, x1, y1, 1);
    }

    /**
      Renders hotspot for rubber band region
      @param c - Rendering context
    */
    drawHotspot(c: CanvasRenderingContext2D): void {
        c.save();
        c.strokeStyle = 'red';
        c.lineWidth = 1.0 / this.scale;
        if (this.activeComponent && this.activeComponent.setCreationFill) {
            this.activeComponent.setCreationFill(c);
        }
        else if (this.fillImage) {
            const pattern = c.createPattern(this.fillImage, 'repeat');
            c.fillStyle = pattern;
        }
        else {
            c.fillStyle = 'rgba(255,215,0,1.0)';
        }
        c.globalAlpha = 0.5;
        c.fillRect(
            this.rubberBandRegion.x,
            this.rubberBandRegion.y,
            this.rubberBandRegion.width,
            this.rubberBandRegion.height
        );
        c.globalAlpha = 1.0;
        c.strokeRect(
            this.rubberBandRegion.x,
            this.rubberBandRegion.y,
            this.rubberBandRegion.width,
            this.rubberBandRegion.height
        );
        c.restore();
    }

    /**
      Renders dashed horizontal line
      @param c - Rendering context
      @param y - Y coordinate
    */
    drawDashedHorizontalLine(c: CanvasRenderingContext2D, y: number) {
        this.drawDashedLine(c, 0, y, this.model.getSize().width, y, 1);
    }

    /**
      Renders dashed vertical line
      @param c - Rendering context
      @param x - X coordinate
    */
    drawDashedVerticalLine(c: CanvasRenderingContext2D, x: number) {
        this.drawDashedLine(c, x, 0, x, this.model.getSize().height, 1);
    }

    /**
      Renders horizontal line
      @param c - Rendering context
      @param y - Y coordinate
    */
    drawHorizontalLine(c: CanvasRenderingContext2D, y: number) {
        c.beginPath();
        c.moveTo(0, y);
        c.lineTo(this.model.getSize().width, y);
        c.stroke();
    }

    /**
      Renders vertical line
      @param c - Rendering context
      @param x - X coordinate
    */
    drawVerticalLine(c: CanvasRenderingContext2D, x: number) {
        c.beginPath();
        c.moveTo(x, 0);
        c.lineTo(x, this.model.getSize().height);
        c.stroke();
    }

    /**
      Renders design guide wires
      @param c - Rendering context
      @param x - X coordinate
      @param y - Y coordinate
    */
    drawGuidewires(c: CanvasRenderingContext2D, x: number, y: number) {
        const _scale = this.scale;
        const lw = 1.0 / _scale;
        const dl = 2 / _scale;

        c.strokeStyle = 'rgba(0,0,0,0.65)';
        c.lineWidth = lw;
        this.drawHorizontalLine(c, y);
        this.drawVerticalLine(c, x);

        c.strokeStyle = 'rgba(255,255,255,0.8)';
        this.drawDashedLine(c, x, y, 0, y, dl);
        this.drawDashedLine(c, x, y, this.model.getSize().width, y, dl);
        this.drawDashedLine(c, x, y, x, 0, dl);
        this.drawDashedLine(c, x, y, x, this.model.getSize().height, dl);

        c.strokeStyle = 'rgba(0,0,0,0.6)';
        c.beginPath();
        c.arc(x, y, 6 / _scale, 0, Math.PI * 2);
        c.stroke();

        c.strokeStyle = 'rgba(255,255,255,0.75)';
        c.beginPath();
        c.arc(x, y, 5 / _scale, 0, Math.PI * 2);
        c.stroke();

        c.strokeStyle = 'rgba(0,0,0,0.6)';
        c.beginPath();
        c.arc(x, y, 4 / _scale, 0, Math.PI * 2);
        c.stroke();

        c.strokeStyle = 'rgba(0,0,0,0.9)';
        this.drawDashedLine(c, x - 1 / _scale, y, x - 4 / _scale, y, 2);
        this.drawDashedLine(c, x + 1 / _scale, y, x + 4 / _scale, y, 2);
        this.drawDashedLine(c, x, y - 1 / _scale, x, y - 4 / _scale, 2);
        this.drawDashedLine(c, x, y + 1 / _scale, x, y + 4 / _scale, 2);
    }

    /**
      Renders model and design components
    */
    draw(): void {
        if (!this.canvas) {
            return;
        }
        if (!this.model) {
            return;
        }

        const context = this.canvas.getContext('2d');
        this.model.context = context;
        let w = this.model.getSize().width;
        let h = this.model.getSize().height;

        // Clear context
        if (this.scale !== 1.0) {
            context.clearRect(0, 0, w * this.scale, h * this.scale);
        }
        else {
            context.clearRect(0, 0, w, h);
        }

        if (this.scale !== 1.0) {
            w *= this.scale;
            h *= this.scale;
            context.save();
            context.scale(this.scale, this.scale);
        }

        // Render grid
        this.renderGrid();

        // Render model (already scaled above)
        this.renderer.renderToContext(context, 1.0);

        // Draw handles for selected elements
        const l = this.selectedElements.length;
        for (let i = 0; i < l; i++) {
            const el = this.selectedElements[i];
            const b = el.getBounds();
            let reference = new Point(b.x, b.y);
            if (this.isMoving && el.canMove()) {
                reference = this.getElementMoveLocation(el);
            }
            else if (this.isResizing && el.canResize()) {
                reference = this.getElementMoveLocation(el);
            }

            // Apply element transform
            context.save();
            if (el.transform) {
                this.model.setRenderTransform(context, el.transform, reference);
            }

            // Get element handles
            const handles = this.getElementHandles(el);

            // Draw connector lines
            const hl = handles.length;
            for (let hi = 0; hi < hl; hi++) {
                const handle = handles[hi];
                if (handle.connectedHandles) {
                    const chl = handle.connectedHandles.length;
                    for (let chi = 0; chi < chl; chi++) {
                        const connected = handle.connectedHandles[chi];
                        context.beginPath();
                        context.moveTo(handle.x, handle.y);
                        context.lineTo(connected.x, connected.y);
                        context.strokeStyle = 'white';
                        context.lineWidth = 1.0 / this.scale;
                        context.stroke();
                        context.strokeStyle = 'black';
                        this.drawDashedLine(context, handle.x, handle.y, connected.x, connected.y, 2);
                    }
                }
                handle.draw(context);
            }

            // Draw handles
            for (let hi = 0; hi < hl; hi++) {
                const handle = handles[hi];
                handle.draw(context);
            }

            context.restore();
        }

        // Draw rubber band and guidewires
        if (this.enabled) {
            if (this.rubberBandActive) {
                this.drawRubberBand(context);
                // this.drawGuidewires(context, this.currentX + this.currentWidth, this.currentY + this.currentHeight);
            }
            else if (this.isMouseDown && this.selectedElementCount() === 0) {
                this.drawGuidewires(context, this.currentX + this.currentWidth, this.currentY + this.currentHeight);
            }
            else if ((this.isResizing || this.isMoving) && this.selectedElementCount() === 1) {
                // If single item being resized, show sizing guides
                const el = this.selectedElements[0];
                const s = this.getElementResizeSize(el);
                const p = this.getElementMoveLocation(el);
                let transformed = false;

                // If element is transformed, apply transform to guide wires
                if (el.transform) {
                    context.save();
                    transformed = true;
                    const b = el.getBounds();
                    let reference = new Point(b.x, b.y);
                    if (this.isMoving && el.canMove()) {
                        reference = this.getElementMoveLocation(el);
                    }
                    else if (this.isResizing && el.canResize()) {
                        reference = this.getElementMoveLocation(el);
                    }
                    this.model.setRenderTransform(context, el.transform, reference);
                }

                context.strokeStyle = 'rgba(0,0,0,0.65)';
                context.lineWidth = 1.0 / this.scale;
                this.drawHorizontalLine(context, p.y);
                this.drawHorizontalLine(context, p.y + s.height);
                this.drawVerticalLine(context, p.x);
                this.drawVerticalLine(context, p.x + s.width);

                context.strokeStyle = 'rgba(255,255,255,0.8)';
                this.drawDashedHorizontalLine(context, p.y);
                this.drawDashedHorizontalLine(context, p.y + s.height);
                this.drawDashedVerticalLine(context, p.x);
                this.drawDashedVerticalLine(context, p.x + s.width);

                if (transformed) {
                    context.restore();
                }
            }
        }

        if (this.model.displayFPS) {
            context.fillStyle = 'cornflowerblue';
            context.font = '16px monospace';
            context.fillText(this.calculateFPS().toFixed() + ' fps', 20, 20);
        }

        // If disabled draw disabled fill
        if (!this.enabled && this.disabledFill) {
            context.fillStyle = Color.parse(this.disabledFill).toStyleString();
            context.fillRect(0, 0, this.model.getSize().width, this.model.getSize().height);
        }

        if (this.scale !== 1.0) {
            context.restore();
        }

        // Clear redraw flag
        this.needsRedraw = false;
    }

    /**
      Calculates frame rate based on elapsed time since last frame
    */
    calculateFPS(): number {
        const now = +new Date();
        const fps = 1000 / (now - this.lastFrameTime);
        this.lastFrameTime = now;
        return fps;
    }

    /**
      Sets redraw flag to induce draw on next draw cycle
    */
    invalidate(): void {
        this.needsRedraw = true;
    }

    /**
      Retrieves selected element count
      @returns Number of selected elements
    */
    selectedElementCount(): number {
        return this.selectedElements.length;
    }

    /**
      Retrieves selected element
      @returns Selected element
    */
    selectedElement(): ElementBase {
        if (this.selectedElements.length > 0) {
            return this.selectedElements[0];
        }
        return undefined;
    }

    /**
      Clears selected elements
    */
    clearSelections(): void {
        if (this.selectedElements.length > 0) {
            this.selectedElements.forEach(function(el) {
                if (el.canEditPoints()) {
                    el.editPoints = false;
                }
            });
            this.selectedElements = [];
            this.onSelectionChanged();
        }
    }

    /**
      Returns true if an element is selected
      @method Elise.Drawing.DesignController#isSelected
      @param el - Element
      @returns True if element is selected
    */
    isSelected(el: ElementBase): boolean {
        const index = this.selectedElements.indexOf(el);
        if (index === -1) {
            return false;
        }
        return true;
    }

    /**
      Selects an element
      @param el - Element
    */
    selectElement(el: ElementBase): void {
        if (!this.isSelected(el)) {
            this.selectedElements.push(el);
            this.onSelectionChanged();
            return;
        }
    }

    /**
      Deselects an element
      @param el - Element
    */
    deselectElement(el: ElementBase): void {
        const index = this.selectedElements.indexOf(el);
        if (index !== -1) {
            this.selectedElements.splice(index, 1);
            if (el.canEditPoints) {
                el.editPoints = false;
            }
            this.onSelectionChanged();
        }
    }

    /**
      Toggles selected state of an element
      @param el - Element
    */
    toggleSelected(el: ElementBase): void {
        const index = this.selectedElements.indexOf(el);
        if (index !== -1) {
            if (el.canEditPoints()) {
                if (!el.editPoints) {
                    el.editPoints = true;
                }
                else {
                    el.editPoints = false;
                    this.selectedElements.splice(index, 1);
                }
            }
            else {
                this.selectedElements.splice(index, 1);
            }
        }
        else {
            this.selectedElements.push(el);
        }
        this.onSelectionChanged();
    }

    /**
      Selects all elements
    */
    selectAll(): void {
        const c = this;
        c.selectedElements = [];
        c.model.elements.forEach(function(el) {
            if (el.interactive) {
                c.selectedElements.push(el);
            }
        });
        this.onSelectionChanged();
    }

    /**
      Selects an array of elements
      @param elements - Elements to select
    */
    selectElements(elements: ElementBase[]): void {
        if (elements && elements.length > 0) {
            const l = elements.length;
            let i;
            for (i = 0; i < l; i++) {
                this.selectElement(elements[i]);
            }
        }
    }

    /**
      Duplicates selected elements
    */
    duplicateSelected(): void {
        const self = this;
        const newSelected: ElementBase[] = [];
        if (this.selectedElements.length > 0) {
            this.selectedElements.forEach(function(el) {
                const elc = el.clone();
                elc.setInteractive(true);
                self.model.add(elc);
                newSelected.push(elc);
            });
            this.selectedElements = newSelected;
            this.onSelectionChanged();
        }
    }

    onElementsReordered() {
        this.elementsReordered.trigger(this, this.selectedElements);
        this.setIsDirty(true);
    }

    moveElementToBottom(el: ElementBase) {
        const index = this.model.elements.indexOf(el);
        if (index > 0) {
            this.model.elements.splice(index, 1);
            this.model.elements.splice(0, 0, el);
            this.onElementsReordered();
        }
    }

    moveElementToTop(el: ElementBase) {
        const index = this.model.elements.indexOf(el);
        if (index < this.model.elements.length - 1) {
            this.model.elements.splice(index, 1);
            this.model.elements.splice(this.model.elements.length, 0, el);
            this.onElementsReordered();
        }
    }

    moveElementBackward(el: ElementBase) {
        const index = this.model.elements.indexOf(el);
        if (index > 0) {
            this.model.elements.splice(index, 1);
            this.model.elements.splice(index - 1, 0, el);
            this.onElementsReordered();
        }
    }

    moveElementForward(el: ElementBase) {
        const index = this.model.elements.indexOf(el);
        if (index < this.model.elements.length - 1) {
            this.model.elements.splice(index, 1);
            this.model.elements.splice(index + 1, 0, el);
            this.onElementsReordered();
        }
    }

    setIsDirty(isDirty: boolean) {
        if (isDirty !== this.isDirty) {
            this.isDirty = isDirty;
            this.isDirtyChanged.trigger(this, isDirty);
        }
    }

    /**
      Returns number of selected movable elements
      @returns Number of selected movable elements
    */
    movableSelectedElementCount(): number {
        let count = 0;
        const j = this.selectedElements.length;
        for (let i = 0; i < j; i++) {
            const el = this.selectedElements[i];
            if (el.canMove()) {
                count++;
            }
        }
        return count;
    }

    /**
      Returns number of selected resizable elements
      @returns Number of selected resizable elements
    */
    resizeableSelectedElementCount(): number {
        let count = 0;
        const j = this.selectedElements.length;
        for (let i = 0; i < j; i++) {
            const el = this.selectedElements[i];
            if (el.canResize()) {
                count++;
            }
        }
        return count;
    }

    /**
      Returns number of selected nudgeable elements
      @returns Number of selected nudgeable elements
    */
    nudgeableSelectedElementCount(): number {
        let count = 0;
        const j = this.selectedElements.length;
        for (let i = 0; i < j; i++) {
            const el = this.selectedElements[i];
            if (el.canNudge()) {
                count++;
            }
        }
        return count;
    }

    /**
      Clears all element resize sizes
    */
    clearElementResizeSizes(): void {
        this.elementResizeSizes = [];
    }

    /**
      Sets an element resize size
      @param el - Element
      @param size - Size
      @param location - Optional location
    */
    setElementResizeSize(el: ElementBase, size: Size, location?: Point) {
        if (location === undefined) {
            const b = el.getBounds();
            location = b.location;
        }
        let newWidth = size.width;
        let newHeight = size.height;
        if (this.constrainToBounds) {
            if (location.x + size.width > el.model.getSize().width) {
                newWidth = el.model.getSize().width - location.x;
            }
            if (location.y + size.height > el.model.getSize().height) {
                newHeight = el.model.getSize().height - location.y;
            }
        }
        const newSize = new Size(newWidth, newHeight);
        if (!this.constrainToBounds || DesignController.isInBounds(location, newSize, el.model)) {
            const l = this.elementResizeSizes.length;
            for (let i = 0; i < l; i++) {
                const resizeSize = this.elementResizeSizes[i];
                if (resizeSize.element === el) {
                    resizeSize.size = newSize;
                    this.onElementSizing(el, newSize);
                    return;
                }
            }
            this.elementResizeSizes.push(new ResizeSize(el, newSize));
            this.onElementSizing(el, newSize);
        }
    }

    /**
      Gets an element resize size
      @param el - Element
      @returns Size
    */
    getElementResizeSize(el: ElementBase): Size {
        const l = this.elementResizeSizes.length;
        for (let i = 0; i < l; i++) {
            const resizeSize = this.elementResizeSizes[i];
            if (resizeSize.element === el) {
                return resizeSize.size;
            }
        }
        const b = el.getBounds();
        return new Size(b.width, b.height);
    }

    /**
      Clears all element move locations
    */
    clearElementMoveLocations(): void {
        this.elementMoveLocations = [];
    }

    /**
      Sets an element move location
      @param el - Element
      @param location - Location
      @param size - Size
    */
    setElementMoveLocation(el: ElementBase, location: Point, size: Size): void {
        if (size === undefined) {
            size = el.getSize();
        }
        let newX = location.x;
        let newY = location.y;
        if (this.constrainToBounds) {
            if (newX < 0) {
                newX = 0;
            }
            else if (newX + size.width > el.model.getSize().width) {
                newX = el.model.getSize().width - size.width;
            }
            if (newY < 0) {
                newY = 0;
            }
            else if (newY + size.height > el.model.getSize().height) {
                newY = el.model.getSize().height - size.height;
            }
        }
        const newLocation = new Point(newX, newY);
        if (!this.constrainToBounds || DesignController.isInBounds(newLocation, size, el.model)) {
            const l = this.elementMoveLocations.length;
            for (let i = 0; i < l; i++) {
                const moveLocation = this.elementMoveLocations[i];
                if (moveLocation.element === el) {
                    moveLocation.location = newLocation;
                    this.onElementMoving(el, newLocation);
                    return;
                }
            }
            this.elementMoveLocations.push(new MoveLocation(el, newLocation));
            this.onElementMoving(el, newLocation);
        }
    }

    /**
      Gets an element move location
      @param el - Element
      @returns Location
    */
    getElementMoveLocation(el: ElementBase): Point {
        const l = this.elementMoveLocations.length;
        for (let i = 0; i < l; i++) {
            const moveLocation = this.elementMoveLocations[i];
            if (moveLocation.element === el) {
                return moveLocation.location;
            }
        }
        const b = el.getBounds();
        return new Point(b.x, b.y);
    }

    /**
      Nudges size of selected elements
      @param offsetX - Nudge offset X
      @param offsetY - Nudge offset Y
    */
    nudgeSize(offsetX: number, offsetY: number): void {
        const l = this.selectedElements.length;
        // Validate that all can be nudged to new size
        for (let i = 0; i < l; i++) {
            const e = this.selectedElements[i];
            if (e.canNudge()) {
                const b = e.getBounds();
                const size = new Size(b.width + offsetX, b.height + offsetY);
                if (size.width <= 0 || size.height <= 0) {
                    return;
                }
                if (this.constrainToBounds && !DesignController.isInBounds(b.location, size, e.model)) {
                    return;
                }
            }
        }
        for (let i = 0; i < l; i++) {
            const e = this.selectedElements[i];
            if (e.canNudge()) {
                e.nudgeSize(offsetX, offsetY);
                this.onElementSized(e, e.getSize());
                this.setElementResizeSize(e, e.getSize(), e.getLocation());
            }
        }
        this.onModelUpdated();
        this.drawIfNeeded();
    }

    /**
      Nudges location of selected elements
      @param offsetX - Nudge offset X
      @param offsetY - Nudge offset Y
    */
    nudgeLocation(offsetX: number, offsetY: number): void {
        // Validate that all can be nudged to new location
        let allGood = true;
        const l = this.selectedElements.length;
        for (let i = 0; i < l; i++) {
            const e = this.selectedElements[i];
            if (e.canNudge()) {
                const b = e.getBounds();
                const location = new Point(b.x + offsetX, b.y + offsetY);
                if (this.constrainToBounds && !DesignController.isInBounds(location, b.size, e.model)) {
                    allGood = false;
                    break;
                }
            }
        }
        if (!allGood) {
            // Determine maximum we can move and set new offsetX/Y
            let x1 = Number.POSITIVE_INFINITY;
            let x2 = Number.NEGATIVE_INFINITY;
            let y1 = Number.POSITIVE_INFINITY;
            let y2 = Number.NEGATIVE_INFINITY;
            const sl = this.selectedElementCount();
            for (let si = 0; si < sl; si++) {
                const selectedElement = this.selectedElements[si];
                if (selectedElement.canNudge()) {
                    const b = selectedElement.getBounds();
                    if (b.x < x1) {
                        x1 = b.x;
                    }
                    if (b.x + b.width > x2) {
                        x2 = b.x + b.width;
                    }
                    if (b.y < y1) {
                        y1 = b.y;
                    }
                    if (b.y + b.height > y2) {
                        y2 = b.y + b.height;
                    }
                }
            }
            if (offsetX < 0 && x1 + offsetX < 0) {
                offsetX = -x1;
            }
            else if (offsetX > 0 && x2 + offsetX > this.model.getSize().width) {
                offsetX = this.model.getSize().width - x2;
            }
            if (offsetY < 0 && y1 + offsetY < 0) {
                offsetY = -y1;
            }
            else if (offsetY > 0 && y2 + offsetY > this.model.getSize().height) {
                offsetY = this.model.getSize().height - y2;
            }
            for (let si = 0; si < sl; si++) {
                const selectedElement = this.selectedElements[si];
                if (selectedElement.canNudge()) {
                    selectedElement.translate(offsetX, offsetY);
                    const b = selectedElement.getBounds();
                    this.onElementMoved(selectedElement, b.location);
                }
            }
        }
        else {
            // All good move requested amount
            for (let i = 0; i < l; i++) {
                const e = this.selectedElements[i];
                if (e.canNudge()) {
                    e.translate(offsetX, offsetY);
                    const b = e.getBounds();
                    this.onElementMoved(e, b.location);
                }
            }
        }
        this.onModelUpdated();
        this.drawIfNeeded();
    }

    /**
      Sets rubber band active state
      @param value - Rubber band state
    */
    setRubberBandActive(value: boolean): void {
        if (value !== this.rubberBandActive) {
            this.rubberBandActive = value;
            this.invalidate();
        }
    }

    /**
      Sets rubber band region
      @param value - Rubber band region
    */
    setRubberBandRegion(value: Region): void {
        this.rubberBandRegion = value;
        this.invalidate();
    }

    /**
      Sets design surface grid type
      @param value - Rubber band state
    */
    setGridType(value: GridType): void {
        if (this.gridType !== value) {
            this.gridType = value;
            this.invalidate();
        }
    }

    /**
      Sets design surface grid spacing
      @param value - Grid spacing
    */
    setGridSpacing(value: number): void {
        if (this.gridSpacing !== value && value >= 1) {
            this.gridSpacing = value;
            this.invalidate();
        }
    }

    /**
      Sets design surface grid color
      @param value - Grid color
    */
    setGridColor(value: string): void {
        if (this.gridColor !== value) {
            this.gridColor = value;
            this.invalidate();
        }
    }

    /**
      Binds existing controller to host DIV element
      @param hostDiv - Hosting div element
      @returns This design controller
    */
    bindTarget(hostDiv: HTMLDivElement) {
        if (!hostDiv) {
            throw new EliseException('Host element not defined.');
        }
        hostDiv.innerHTML = '';
        if (!hostDiv.id) {
            hostDiv.id = Utility.guid();
        }

        // Disable arrow/navigation keys to prevent scrolling
        // and allow handling in contained canvas
        const ar = [ 37, 38, 39, 40 ];

        // Change to use DOM 0 Style binding to prevent multiples
        hostDiv.onkeydown = function(e) {
            const key = e.which;
            ar.forEach(function(k) {
                if (k === key) {
                    e.preventDefault();
                    return false;
                }
            });
            return true;
        };

        const canvas = this.getCanvas();
        hostDiv.appendChild(canvas);
        canvas.setAttribute('id', hostDiv.id + '_canvas');
        hostDiv.style.width = this.model.getSize().width * this.scale + 'px';
        hostDiv.style.height = this.model.getSize().height * this.scale + 'px';
        this.draw();
        this.model.controllerAttached.trigger(this.model, this);
        return this;
    }
}
