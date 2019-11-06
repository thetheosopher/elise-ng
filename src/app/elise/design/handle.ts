import { ElementBase } from '../elements/element-base';
import { Region } from '../core/region';
import { Size } from '../core/size';
import { Point } from '../core/point';
import { PointDepth } from '../core/point-depth';
import { PathElement } from '../elements/path-element';
import { DesignController } from '../design/design-controller';

export class Handle {
    /**
      Handle size
    */
    static Size = new Size(7, 7);

    /**
      X coordinate
    */
    x: number;

    /**
     Y coordinate
   */
    y: number;

    /**
     Can handle be moved horizontally
   */
    canMoveHorizontal: boolean;

    /**
     Can handle be moved vertically
   */
    canMoveVertical: boolean;

    /**
     CSS handle cursor style
   */
    cursor: string;

    /**
     Element associated with handle
   */
    element: ElementBase;

    /**
     Design controller
   */
    controller: DesignController;

    /**
     Handle region
   */
    region: Region;

    /**
     Associated bar region
   */
    barRegion: Region;

    /**
     Handle ID
   */
    handleId: any;

    /**
     Handle index
   */
    handleIndex: number;

    /**
     Rendering scale
   */
    scale: number;

    /**
     Handle shape
   */
    shape: string;

    /**
     Handles connected to this handle
   */
    connectedHandles: Handle[] = null;

    /**
     Movement handler function
   */
    handleMoved: HandleMovedHandler = null;

    /**
      Handles movement of left middle rectangular sizing handle
      @method Elise.Drawing.Design.Handle#sizeRectangleLeftMiddle
      @param h - Handle being moved
      @param args - Handle movement info
    */
    static sizeRectangleLeftMiddle(h: Handle, args: HandleMovedArgs): void {
        const el = h.element;
        const b = el.getBounds();
        let newX = b.x + args.deltaX;
        let newWidth = b.width - args.deltaX;
        let newHeight = b.height;
        if (newWidth < h.controller.minElementSize.width || newHeight < h.controller.minElementSize.height) {
            return;
        }
        if (h.controller.snapToGrid) {
            const snappedX = h.controller.getNearestSnapX(newX);
            if (snappedX !== newX) {
                if (newWidth + newX - snappedX >= h.controller.minElementSize.width) {
                    newWidth += newX - snappedX;
                    newX = snappedX;
                }
            }
        }
        if (el.aspectLocked || h.controller.lockAspect) {
            const aspect = b.width / b.height;
            newHeight = newWidth / aspect;
        }
        const moveLocation = new Point(newX, b.y);
        const resizeSize = new Size(
            Math.max(newWidth, h.controller.minElementSize.width),
            Math.max(newHeight, h.controller.minElementSize.height)
        );
        h.controller.setElementMoveLocation(el, moveLocation, resizeSize);
        h.controller.setElementResizeSize(el, resizeSize, moveLocation);
        h.controller.invalidate();
    }

    /**
     Handles movement of left bottom rectangular sizing handle
    @method Elise.Drawing.Design.Handle#sizeRectangleLeftBottom
    @param h - Handle being moved
    @param args - Handle movement info
    */
    static sizeRectangleLeftBottom(h: Handle, args: HandleMovedArgs): void {
        const el = h.element;
        const b = el.getBounds();
        let newX = b.x + args.deltaX;
        let newWidth = b.width - args.deltaX;
        let newHeight = b.height + args.deltaY;
        if (newWidth < h.controller.minElementSize.width || newHeight < h.controller.minElementSize.height) {
            return;
        }
        if (newX < 0) {
            newX = 0;
        }
        if (b.y + newHeight > el.model.getSize().height) {
            newHeight = el.model.getSize().height - b.y;
        }
        if (h.controller.snapToGrid) {
            const snappedX = h.controller.getNearestSnapX(newX);
            if (snappedX !== newX) {
                if (newWidth + newX - snappedX >= h.controller.minElementSize.width) {
                    newWidth += newX - snappedX;
                    newX = snappedX;
                }
            }

            const newY = b.y + b.height + args.deltaY;
            const snappedY = h.controller.getNearestSnapY(newY);
            if (snappedY !== newY) {
                if (newHeight + newY - snappedY >= h.controller.minElementSize.height) {
                    newHeight -= newY - snappedY;
                }
            }
        }
        if (el.aspectLocked || h.controller.lockAspect) {
            const aspect = b.width / b.height;
            newHeight = newWidth / aspect;
        }
        const moveLocation = new Point(newX, b.y);
        const resizeSize = new Size(
            Math.max(newWidth, h.controller.minElementSize.width),
            Math.max(newHeight, h.controller.minElementSize.height)
        );
        h.controller.setElementMoveLocation(el, moveLocation, resizeSize);
        h.controller.setElementResizeSize(el, resizeSize, moveLocation);
        h.controller.invalidate();
    }

    /**
     Handles movement of bottom center rectangular sizing handle
    @method Elise.Drawing.Design.Handle#sizeRectangleBottomCenter
    @param h - Handle being moved
    @param args - Handle movement info
    */
    static sizeRectangleBottomCenter(h: Handle, args: HandleMovedArgs): void {
        const el = h.element;
        const b = el.getBounds();
        let newHeight = b.height + args.deltaY;
        let newWidth = b.width;
        if (newWidth < h.controller.minElementSize.width || newHeight < h.controller.minElementSize.height) {
            return;
        }
        if (h.controller.snapToGrid) {
            const newY = b.y + b.height + args.deltaY;
            const snappedY = h.controller.getNearestSnapY(newY);
            if (snappedY !== newY) {
                if (newHeight + newY - snappedY >= h.controller.minElementSize.height) {
                    newHeight -= newY - snappedY;
                }
            }
        }
        if (el.aspectLocked || h.controller.lockAspect) {
            const aspect = b.width / b.height;
            newWidth = newHeight * aspect;
        }
        const resizeSize = new Size(
            Math.max(newWidth, h.controller.minElementSize.width),
            Math.max(newHeight, h.controller.minElementSize.height)
        );
        h.controller.setElementResizeSize(el, resizeSize);
        h.controller.invalidate();
    }

    /**
     Handles movement of right middle rectangular sizing handle
    @method Elise.Drawing.Design.Handle#sizeRectangleRightMiddle
    @param h - Handle being moved
    @param args - Handle movement info
    */
    static sizeRectangleRightMiddle(h: Handle, args: HandleMovedArgs): void {
        const el = h.element;
        const b = el.getBounds();
        let newWidth = b.width + args.deltaX;
        let newHeight = b.height;
        if (newWidth < h.controller.minElementSize.width || newHeight < h.controller.minElementSize.height) {
            return;
        }
        if (h.controller.snapToGrid) {
            const newX = b.x + b.width + args.deltaX;
            const snappedX = h.controller.getNearestSnapX(newX);
            if (snappedX !== newX) {
                if (newWidth + newX - snappedX >= h.controller.minElementSize.width) {
                    newWidth -= newX - snappedX;
                }
            }
        }
        if (el.aspectLocked || h.controller.lockAspect) {
            const aspect = b.width / b.height;
            newHeight = newWidth / aspect;
        }
        const resizeSize = new Size(
            Math.max(newWidth, h.controller.minElementSize.width),
            Math.max(newHeight, h.controller.minElementSize.height)
        );
        h.controller.setElementResizeSize(el, resizeSize);
        h.controller.invalidate();
    }

    /**
     Handles movement of right bottom rectangular sizing handle
    @method Elise.Drawing.Design.Handle#sizeRectangleRightBottom
    @param h - Handle being moved
    @param args - Handle movement info
    */
    static sizeRectangleRightBottom(h: Handle, args: HandleMovedArgs): void {
        const el = h.element;
        const b = el.getBounds();
        let newWidth = b.width + args.deltaX;
        let newHeight = b.height + args.deltaY;
        if (newWidth < h.controller.minElementSize.width || newHeight < h.controller.minElementSize.height) {
            return;
        }
        if (h.controller.snapToGrid) {
            const newX = b.x + b.width + args.deltaX;
            const snappedX = h.controller.getNearestSnapX(newX);
            if (snappedX !== newX) {
                if (newWidth + newX - snappedX >= h.controller.minElementSize.width) {
                    newWidth -= newX - snappedX;
                }
            }
            const newY = b.y + b.height + args.deltaY;
            const snappedY = h.controller.getNearestSnapY(newY);
            if (snappedY !== newY) {
                if (newHeight + newY - snappedY >= h.controller.minElementSize.height) {
                    newHeight -= newY - snappedY;
                }
            }
        }
        if (el.aspectLocked || h.controller.lockAspect) {
            const aspect = b.width / b.height;
            newHeight = newWidth / aspect;
        }
        const resizeSize = new Size(
            Math.max(newWidth, h.controller.minElementSize.width),
            Math.max(newHeight, h.controller.minElementSize.height)
        );
        h.controller.setElementResizeSize(el, resizeSize);
        h.controller.invalidate();
    }

    /**
     Handles movement of right top rectangular sizing handle
    @method Elise.Drawing.Design.Handle#sizeRectangleRightTop
    @param h - Handle being moved
    @param args - Handle movement info
    */
    static sizeRectangleRightTop(h: Handle, args: HandleMovedArgs): void {
        const el = h.element;
        const b = el.getBounds();
        let newY = b.y + args.deltaY;
        let newWidth = b.width + args.deltaX;
        let newHeight = b.height - args.deltaY;
        if (newWidth < h.controller.minElementSize.width || newHeight < h.controller.minElementSize.height) {
            return;
        }
        if (h.controller.snapToGrid) {
            const newX = b.x + b.width + args.deltaX;
            const snappedX = h.controller.getNearestSnapX(newX);
            if (snappedX !== newX) {
                if (newWidth + newX - snappedX >= h.controller.minElementSize.width) {
                    newWidth -= newX - snappedX;
                }
            }
            const snappedY = h.controller.getNearestSnapY(newY);
            if (snappedY !== newY) {
                if (newHeight + newY - snappedY >= h.controller.minElementSize.height) {
                    newHeight += newY - snappedY;
                    newY = snappedY;
                }
            }
        }
        if (el.aspectLocked || h.controller.lockAspect) {
            const aspect = b.width / b.height;
            const adjustedHeight = newWidth / aspect;
            newY -= adjustedHeight - newHeight;
            newHeight = adjustedHeight;
        }
        const moveLocation = new Point(b.x, newY);
        const resizeSize = new Size(
            Math.max(newWidth, h.controller.minElementSize.width),
            Math.max(newHeight, h.controller.minElementSize.height)
        );
        h.controller.setElementMoveLocation(el, moveLocation, resizeSize);
        h.controller.setElementResizeSize(el, resizeSize, moveLocation);
        h.controller.invalidate();
    }

    /**
     Handles movement of top center rectangular sizing handle
    @method Elise.Drawing.Design.Handle#sizeRectangleTopCenter
    @param h - Handle being moved
    @param args - Handle movement info
    */
    static sizeRectangleTopCenter(h: Handle, args: HandleMovedArgs): void {
        const el = h.element;
        const b = el.getBounds();
        let newY = b.y + args.deltaY;
        let newHeight = b.height - args.deltaY;
        let newWidth = b.width;
        if (newWidth < h.controller.minElementSize.width || newHeight < h.controller.minElementSize.height) {
            return;
        }
        if (h.controller.snapToGrid) {
            const snappedY = h.controller.getNearestSnapY(newY);
            if (snappedY !== newY) {
                if (newHeight + newY - snappedY >= h.controller.minElementSize.height) {
                    newHeight += newY - snappedY;
                    newY = snappedY;
                }
            }
        }
        if (el.aspectLocked || h.controller.lockAspect) {
            const aspect = b.width / b.height;
            newWidth = newHeight * aspect;
        }
        const moveLocation = new Point(b.x, newY);
        const resizeSize = new Size(
            Math.max(newWidth, h.controller.minElementSize.width),
            Math.max(newHeight, h.controller.minElementSize.height)
        );
        h.controller.setElementMoveLocation(el, moveLocation, resizeSize);
        h.controller.setElementResizeSize(el, resizeSize, moveLocation);
        h.controller.invalidate();
    }

    /**
     Handles movement of left top rectangular sizing handle
    @method Elise.Drawing.Design.Handle#sizeRectangleLeftTop
    @param h - Handle being moved
    @param args - Handle movement info
    */
    static sizeRectangleLeftTop(h: Handle, args: HandleMovedArgs): void {
        const el = h.element;
        const b = el.getBounds();
        let newX = b.x + args.deltaX;
        let newY = b.y + args.deltaY;
        let newWidth = b.width - args.deltaX;
        let newHeight = b.height - args.deltaY;
        if (newWidth < h.controller.minElementSize.width || newHeight < h.controller.minElementSize.height) {
            return;
        }
        if (h.controller.snapToGrid) {
            const snappedX = h.controller.getNearestSnapX(newX);
            if (snappedX !== newX) {
                if (newWidth + newX - snappedX >= h.controller.minElementSize.width) {
                    newWidth += newX - snappedX;
                    newX = snappedX;
                }
            }
            const snappedY = h.controller.getNearestSnapY(newY);
            if (snappedY !== newY) {
                if (newHeight + newY - snappedY >= h.controller.minElementSize.height) {
                    newHeight += newY - snappedY;
                    newY = snappedY;
                }
            }
        }
        if (el.aspectLocked || h.controller.lockAspect) {
            const aspect = b.width / b.height;
            const adjustedHeight = newWidth / aspect;
            newY -= adjustedHeight - newHeight;
            newHeight = adjustedHeight;
        }
        const moveLocation = new Point(newX, newY);
        const resizeSize = new Size(
            Math.max(newWidth, h.controller.minElementSize.width),
            Math.max(newHeight, h.controller.minElementSize.height)
        );
        h.controller.setElementMoveLocation(el, moveLocation, resizeSize);
        h.controller.setElementResizeSize(el, resizeSize, moveLocation);
        h.controller.invalidate();
    }

    /**
     Handles movement of point container point handle
    @method Elise.Drawing.Design.Handle#movePointContainerPoint
    @param h - Handle being moved
    @param args - Handle movement info
    */
    static movePointContainerPoint(h: Handle, args: HandleMovedArgs): void {
        const el = h.element;
        const pointIndex = h.handleIndex;
        let depth = PointDepth.Simple;
        if (h.controller.selectedElementCount() === 1) {
            depth = PointDepth.Full;
        }
        const p = el.getPointAt(pointIndex, depth);
        let newX = p.x + args.deltaX;
        let newY = p.y + args.deltaY;
        if (h.controller.snapToGrid) {
            newX = h.controller.getNearestSnapX(newX);
            newY = h.controller.getNearestSnapY(newY);
        }
        h.controller.movingPointLocation = new Point(newX, newY);
        const dc: DesignController = h.controller as DesignController;
        dc.clearElementMoveLocations();
        dc.clearElementResizeSizes();
        el.clearBounds();
        h.controller.invalidate();
    }
    /**
      Constructs a handle
      @classdesc Represents an element design control handle
      @param x - X coordinate
      @param y - Y coordinate
    */
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.canMoveHorizontal = true;
        this.canMoveVertical = true;
        this.cursor = 'crosshair';
        this.scale = 1.0;

        this.getBounds = this.getBounds.bind(this);
        this.draw = this.draw.bind(this);
    }

    /**
      Returns handle bounding region
      @method Elise.Drawing.Design.Handle#getBounds
    */
    getBounds(): Region {
        let width = Handle.Size.width;
        let height = Handle.Size.height;
        if (this.scale && this.scale !== 0) {
            height /= this.scale;
            width /= this.scale;
        }
        return new Region(this.x - width / 2, this.y - height / 2, width, height);
    }

    /**
      Renders handle to 2D canvas context
      @method Elise.Drawing.Design.Handle#draw
      @param c - Rendering context
    */
    draw(c: CanvasRenderingContext2D): void {
        const b = this.region;

        // Circle
        if (this.shape === 'circle') {
            c.beginPath();
            c.arc(b.x + b.width / 2, b.y + b.height / 2, b.width / 2, 0, 2 * Math.PI, false);
            c.fillStyle = 'black';
            c.fill();
            c.strokeStyle = 'white';
            c.lineWidth = 0.5 / this.scale;
            c.stroke();
        }
        else {
            // Rectangle
            c.fillStyle = 'white';
            c.fillRect(b.x, b.y, b.width, b.height);
            c.strokeStyle = 'black';
            c.lineWidth = 0.5 / this.scale;
            c.strokeRect(b.x, b.y, b.width, b.height);
        }
    }
}

export class HandleMovedArgs {
    /**
      Constructs a HandleMovedArgs
      @classdesc Represents movement of element handle
      @param deltaX - x movement
      @param deltaY - Y movement
    */
    constructor(deltaX: number, deltaY: number) {
        this.deltaX = deltaX;
        this.deltaY = deltaY;
    }

    /**
      Horizontal (x) movement
    */
    deltaX: number;

    /**
      Vertical (y) movement
    */
    deltaY: number;
}

export type HandleMovedHandler = (h: Handle, args: HandleMovedArgs) => void;

export class HandleFactory {
    /**
      @classdesc Creates design control handles for model elements
     */
    constructor() {}

    /**
      Creates array of handles for element
      @method Elise.Drawing.Design.HandleFactory#handlesForElement
      @param el - Element
      @param c - Design controller
      @param scale - Controller rendering scale
      @returns Array of handles for element
    */
    static handlesForElement(el: ElementBase, c: DesignController, scale: number): Handle[] {
        if (el.type === 'path') {
            if (el.editPoints) {
                return HandleFactory.pathShapeHandles(el as PathElement, c, scale);
            }
            return HandleFactory.rectangularElementHandles(el, c, scale);
        }
        if (el.type === 'polyline' || el.type === 'polygon') {
            if (el.editPoints) {
                return HandleFactory.pointContainerHandles(el, c, scale);
            }
            return HandleFactory.rectangularElementHandles(el, c, scale);
        }
        if (el.type === 'line') {
            return HandleFactory.pointContainerHandles(el, c, scale);
        }
        // image, sprite, rectangle, ellipse, model, text elements
        return HandleFactory.rectangularElementHandles(el, c, scale);
    }

    /**
      Creates handles for rectangular elements
      @method Elise.Drawing.Design.HandleFactory#handlesForElement
      @param el - Rectangular element
      @param c - Design controller
      @param scale - Controller rendering scale
      @returns Array of handles for element
    */
    static rectangularElementHandles(el: ElementBase, c: DesignController, scale: number): Handle[] {
        const handles: Handle[] = [];
        let moveLocation: Point;
        let resizeSize: Size;
        const b = el.getBounds();
        let location = b.location;
        let size = b.size;

        if (c.isMoving) {
            if (c.isSelected(el) && el.canMove()) {
                moveLocation = c.getElementMoveLocation(el);
                location = new Point(moveLocation.x, moveLocation.y);
            }
        }
        else if (c.isResizing) {
            if (c.isSelected(el) && el.canResize()) {
                moveLocation = c.getElementMoveLocation(el);
                location = new Point(moveLocation.x, moveLocation.y);
                resizeSize = c.getElementResizeSize(el);
                size = new Size(resizeSize.width, resizeSize.height);
            }
        }

        // Top Left
        const topLeft = new Handle(location.x, location.y);
        topLeft.scale = scale;
        topLeft.handleId = 'topLeft';
        topLeft.handleMoved = Handle.sizeRectangleLeftTop;
        topLeft.canMoveHorizontal = true;
        topLeft.canMoveVertical = true;
        topLeft.cursor = 'nw-resize';
        topLeft.region = topLeft.getBounds();
        handles.push(topLeft);

        // Top center
        const topCenter = new Handle(location.x + size.width / 2, location.y);
        topCenter.scale = scale;
        topCenter.handleId = 'topCenter';
        topCenter.handleMoved = Handle.sizeRectangleTopCenter;
        topCenter.canMoveHorizontal = false;
        topCenter.canMoveVertical = true;
        topCenter.region = topCenter.getBounds();
        // topCenter.barRegion = elise.region(location.x, location.y, size.width / 4, scale);
        topCenter.cursor = 'n-resize';
        handles.push(topCenter);

        // Top right
        const topRight = new Handle(location.x + size.width, location.y);
        topRight.scale = scale;
        topRight.handleId = 'topRight';
        topRight.handleMoved = Handle.sizeRectangleRightTop;
        topRight.canMoveHorizontal = true;
        topRight.canMoveVertical = true;
        topRight.region = topRight.getBounds();
        topRight.cursor = 'ne-resize';
        handles.push(topRight);

        // Middle right
        const middleRight = new Handle(location.x + size.width, location.y + size.height / 2);
        middleRight.scale = scale;
        middleRight.handleId = 'middleRight';
        middleRight.handleMoved = Handle.sizeRectangleRightMiddle;
        middleRight.canMoveHorizontal = true;
        middleRight.canMoveVertical = false;
        middleRight.region = middleRight.getBounds();
        // middleRight.barRegion = elise.region(location.x + size.width, location.y, 4 / scale, size.height);
        middleRight.cursor = 'e-resize';
        handles.push(middleRight);

        // Bottom right
        const bottomRight = new Handle(location.x + size.width, location.y + size.height);
        bottomRight.scale = scale;
        bottomRight.handleId = 'bottomRight';
        bottomRight.handleMoved = Handle.sizeRectangleRightBottom;
        bottomRight.canMoveHorizontal = true;
        bottomRight.canMoveVertical = true;
        bottomRight.region = bottomRight.getBounds();
        bottomRight.cursor = 'se-resize';
        handles.push(bottomRight);

        // Bottom center
        const bottomCenter = new Handle(location.x + size.width / 2, location.y + size.height);
        bottomCenter.scale = scale;
        bottomCenter.handleId = 'bottomCenter';
        bottomCenter.handleMoved = Handle.sizeRectangleBottomCenter;
        bottomCenter.canMoveHorizontal = false;
        bottomCenter.canMoveVertical = true;
        bottomCenter.region = bottomCenter.getBounds();
        // bottomCenter.barRegion = elise.region(location.x, location.y + size.height, size.width, 4 / scale);
        bottomCenter.cursor = 's-resize';
        handles.push(bottomCenter);

        // Left bottom
        const bottomLeft = new Handle(location.x, location.y + size.height);
        bottomLeft.scale = scale;
        bottomLeft.handleId = 'bottomLeft';
        bottomLeft.handleMoved = Handle.sizeRectangleLeftBottom;
        bottomLeft.canMoveHorizontal = true;
        bottomLeft.canMoveVertical = true;
        bottomLeft.region = bottomLeft.getBounds();
        bottomLeft.cursor = 'sw-resize';
        handles.push(bottomLeft);

        // Middle left
        const middleLeft = new Handle(location.x, location.y + size.height / 2);
        middleLeft.scale = scale;
        middleLeft.handleId = 'middleLeft';
        middleLeft.handleMoved = Handle.sizeRectangleLeftMiddle;
        middleLeft.canMoveHorizontal = true;
        middleLeft.canMoveVertical = false;
        middleLeft.region = middleLeft.getBounds();
        // middleLeft.barRegion = elise.region(location.x, location.y, 4 / scale, size.height);
        middleLeft.cursor = 'w-resize';
        handles.push(middleLeft);

        // Connect handles
        topLeft.connectedHandles = [ topRight, bottomLeft ];
        bottomRight.connectedHandles = [ bottomLeft, topRight ];

        return handles;
    }

    /**
      Creates handles for path elements
      @method Elise.Drawing.Design.HandleFactory#handlesForElement
      @param el - Path element
      @param c - Design controller
      @param scale - Controller rendering scale
      @returns Array of handles for element
    */
    static pathShapeHandles(el: PathElement, c: DesignController, scale: number): Handle[] {
        const handles: Handle[] = [];
        let movingPointIndex = -1;
        let offsetX = 0;
        let offsetY = 0;
        if (c.isMoving) {
            const offset = c.getElementMoveLocation(el);
            const b = el.getBounds();
            offsetX = offset.x - b.x;
            offsetY = offset.y - b.y;
        }
        if (c.isMovingPoint) {
            movingPointIndex = c.movingPointIndex;
        }
        let depth = PointDepth.Simple;
        if (c.selectedElementCount() === 1) {
            depth = PointDepth.Full;
        }
        let handleIndex = -1;
        let handlePoint = Point.ORIGIN;
        let previous: Handle = null;
        const commands = el.getCommands();
        const l = commands.length;
        for (let i = 0; i < l; i++) {
            const command = commands[i];
            let createHandle = true;
            const connectToPrevious = true;
            if (command.charAt(0) === 'm') {
                handleIndex++;
                handlePoint = Point.parse(command.substring(1, command.length));
            }
            else if (command.charAt(0) === 'l') {
                handleIndex++;
                handlePoint = Point.parse(command.substring(1, command.length));
            }
            else if (command.charAt(0) === 'c') {
                const parts = command.substring(1, command.length).split(',');
                const cp1 = new Point(parseFloat(parts[0]), parseFloat(parts[1]));
                const cp2 = new Point(parseFloat(parts[2]), parseFloat(parts[3]));
                const endPoint = new Point(parseFloat(parts[4]), parseFloat(parts[5]));
                handleIndex++;
                handlePoint = endPoint;

                if (depth === PointDepth.Full) {
                    if (handleIndex === movingPointIndex) {
                        handlePoint = c.movingPointLocation;
                    }

                    // End point
                    const hend = new Handle(handlePoint.x + offsetX, handlePoint.y + offsetY);
                    hend.scale = scale;
                    hend.handleIndex = handleIndex;
                    hend.handleMoved = Handle.movePointContainerPoint;
                    hend.canMoveHorizontal = true;
                    hend.canMoveVertical = true;
                    hend.region = hend.getBounds();
                    hend.cursor = 'move';
                    handles.push(hend);
                    if (connectToPrevious && previous !== null) {
                        hend.connectedHandles = [ previous ];
                    }
                    previous = hend;

                    // Control point 1
                    handleIndex++;
                    handlePoint = cp1;
                    if (handleIndex === movingPointIndex) {
                        handlePoint = c.movingPointLocation;
                    }

                    const hcp1 = new Handle(handlePoint.x + offsetX, handlePoint.y + offsetY);
                    hcp1.scale = scale;
                    hcp1.handleIndex = handleIndex;
                    hcp1.shape = 'circle';
                    hcp1.handleMoved = Handle.movePointContainerPoint;
                    hcp1.canMoveHorizontal = true;
                    hcp1.canMoveVertical = true;
                    hcp1.region = hcp1.getBounds();
                    hcp1.cursor = 'move';
                    handles.push(hcp1);
                    hcp1.connectedHandles = [ previous ];

                    // Control point2
                    handleIndex++;
                    handlePoint = cp2;
                    if (handleIndex === movingPointIndex) {
                        handlePoint = c.movingPointLocation;
                    }

                    const hcp2 = new Handle(handlePoint.x + offsetX, handlePoint.y + offsetY);
                    hcp2.scale = scale;
                    hcp2.handleIndex = handleIndex;
                    hcp2.shape = 'circle';
                    hcp2.handleMoved = Handle.movePointContainerPoint;
                    hcp2.canMoveHorizontal = true;
                    hcp2.canMoveVertical = true;
                    hcp2.region = hcp2.getBounds();
                    hcp2.cursor = 'move';
                    handles.push(hcp2);
                    hcp2.connectedHandles = [ previous ];

                    createHandle = false;
                }
            }
            else {
                createHandle = false;
                previous = null;
            }

            if (handleIndex === movingPointIndex) {
                handlePoint = c.movingPointLocation;
            }

            if (createHandle) {
                const h = new Handle(handlePoint.x + offsetX, handlePoint.y + offsetY);
                h.scale = scale;
                h.handleIndex = handleIndex;
                h.handleMoved = Handle.movePointContainerPoint;
                h.canMoveHorizontal = true;
                h.canMoveVertical = true;
                h.region = h.getBounds();
                h.cursor = 'move';
                handles.push(h);
                if (connectToPrevious && previous !== null) {
                    h.connectedHandles = [ previous ];
                }
                previous = h;
            }
        }

        return handles;
    }

    /**
      Creates handles for line, polyline and polygon elements (i.e. Point containers)
      @method Elise.Drawing.Design.HandleFactory#handlesForElement
      @param el - Element
      @param c - Design controller
      @param scale - Controller rendering scale
      @returns Array of handles for element
    */
    static pointContainerHandles(el: ElementBase, c: DesignController, scale: number): Handle[] {
        const handles: Handle[] = [];
        let movingPointIndex = -1;
        if (c.isMovingPoint) {
            movingPointIndex = c.movingPointIndex;
        }
        let offsetX = 0;
        let offsetY = 0;
        if (c.isMoving) {
            const offset = c.getElementMoveLocation(el);
            const b = el.getBounds();
            offsetX = offset.x - b.x;
            offsetY = offset.y - b.y;
        }
        let previous: Handle = null;
        const l = el.pointCount();
        for (let i = 0; i < l; i++) {
            let p = el.getPointAt(i);
            if (i === movingPointIndex) {
                p = c.movingPointLocation;
            }
            const h = new Handle(p.x + offsetX, p.y + offsetY);
            h.scale = scale;
            h.handleIndex = i;
            h.handleMoved = Handle.movePointContainerPoint;
            h.canMoveHorizontal = true;
            h.canMoveVertical = true;
            h.region = h.getBounds();
            h.cursor = 'move';
            handles.push(h);
            if (i !== 0) {
                h.connectedHandles = [ previous ];
            }
            previous = h;
        }

        // If polygon, connect last to first
        if (el.type === 'polygon') {
            handles[handles.length - 1].connectedHandles.push(handles[0]);
        }

        return handles;
    }
}
