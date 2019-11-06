import { Size } from '../core/size';
import { Point } from '../core/point';
import { Region } from '../core/region';
import { PointDepth } from '../core/point-depth';
import { LinearGradientFill } from '../fill/linear-gradient-fill';
import { RadialGradientFill } from '../fill/radial-gradient-fill';
import { Color } from '../core/color';
import { ResourceManager } from '../resource/resource';
import { Model } from '../core/model';
import { EliseException } from '../core/elise-exception';
import { IPointContainer } from '../core/point-container';

export class ElementBase implements IPointContainer {
    /**
      ElementBase constructor (abstract)
      @classdesc Base class for all model elements
    */
    constructor() {
        this.parse = this.parse.bind(this);
        this.serialize = this.serialize.bind(this);
        this.clone = this.clone.bind(this);
        this.cloneTo = this.cloneTo.bind(this);
        this.toString = this.toString.bind(this);
        this.describe = this.describe.bind(this);
        this.canEditPoints = this.canEditPoints.bind(this);
        this.canMove = this.canMove.bind(this);
        this.canMovePoint = this.canMovePoint.bind(this);
        this.canNudge = this.canNudge.bind(this);
        this.canResize = this.canResize.bind(this);
        this.registerResources = this.registerResources.bind(this);
        this.draw = this.draw.bind(this);
        this.hitTest = this.hitTest.bind(this);
        this.nudgeSize = this.nudgeSize.bind(this);
        this.translate = this.translate.bind(this);
        this.scale = this.scale.bind(this);
        this.clearBounds = this.clearBounds.bind(this);
        this.getBounds = this.getBounds.bind(this);
        this.getLocation = this.getLocation.bind(this);
        this.setLocation = this.setLocation.bind(this);
        this.getSize = this.getSize.bind(this);
        this.setSize = this.setSize.bind(this);
        this.setStroke = this.setStroke.bind(this);
        this.setFill = this.setFill.bind(this);
        this.setFillScale = this.setFillScale.bind(this);
        this.setInteractive = this.setInteractive.bind(this);
        this.setTransform = this.setTransform.bind(this);
        this.pointCount = this.pointCount.bind(this);
        this.getPointAt = this.getPointAt.bind(this);
        this.setPointAt = this.setPointAt.bind(this);
        this.addTo = this.addTo.bind(this);
        this.notImplemented = this.notImplemented.bind(this);
    }

    /**
      Element type tag
    */
    type: string;

    /**
      Element ID
    */
    id: string;

    /**
      True if individual points can be edited
    */
    editPoints: boolean;

    /**
     * Size
     */
    protected _size: Size;

    /**
      Size get accessor as string
      @returns Size as string
    */
    get size(): string {
        if (!this._size) {
            return undefined;
        }
        else {
            return this._size.toString();
        }
    }

    /**
      Size set accessor as string
      @param newValue - Size as string
    */
    set size(newValue: string) {
        if (!newValue) {
            this._size = undefined;
        }
        else {
            this._size = Size.parse(newValue);
        }
    }

    /**
     * Location
     */
    protected _location: Point;

    /**
      Location set accessor as string
      @returns Location as string
    */
    get location(): string {
        if (!this._location) {
            return undefined;
        }
        else {
            return this._location.toString();
        }
    }
    /**
     * Location set accessor as string
      @param newValue - Location as string
    */
    set location(newValue: string) {
        if (!newValue) {
            this._location = undefined;
        }
        else {
            this._location = Point.parse(newValue);
        }
    }

    /**
      Should element disallow moving/sizing
    */
    locked: boolean;

    /**
      Should aspect ratio be maintained during resizing
    */
    aspectLocked: boolean;

    /**
      Fill property
    */
    fill: string | LinearGradientFill | RadialGradientFill;

    /**
      Fill scaling factor
    */
    fillScale: number;

    /**
      Fill X Offset
    */
    fillOffsetX: number;

    /**
      Fill Y Offset
    */
    fillOffsetY: number;

    /**
      Stroke property
    */
    stroke: string;

    /**
      Transform property
    */
    transform: string;

    /**
      Should element support interaction
    */
    interactive: boolean;

    /**
      Mouse down command handler tag
    */
    mouseDown: string;

    /**
      Mouse up command handler tag
    */
    mouseUp: string;

    /**
      Mouse enter command handler tag
    */
    mouseEnter: string;

    /**
      Mouse leave command handler tag
    */
    mouseLeave: string;

    /**
      Click command handler tag
    */
    click: string;

    /**
      Timer command handler tag
    */
    timer: string;

    /**
      Owner model
    */
    model: Model;

    /**
      Parent element
    */
    parent: ElementBase;

    /**
      Element fill stack
    */
    fillStack: any[];

    /**
      Element stroke stack
    */
    strokeStack: any[];

    /**
     Associated object
    */
    tag: any;

    /**
      Copies properies of another element instance to this instance
      @param Source element
    */
    parse(o: any): void {
        if (o.type) {
            this.type = String(o.type);
        }
        if (o.id) {
            this.id = String(o.id);
        }
        if (o.size) {
            this._size = Size.parse(o.size);
        }
        if (o.location) {
            this._location = Point.parse(o.location);
        }
        if (o.locked) {
            this.locked = o.locked;
        }
        else {
            this.locked = false;
        }
        if (o.aspectLocked) {
            this.aspectLocked = o.aspectLocked;
        }
        else {
            this.aspectLocked = false;
        }
        if (o.fill) {
            if (typeof o.fill === 'string') {
                this.fill = o.fill;
            }
            else if (o.fill.type === 'linearGradient') {
                const lgr1 = o.fill as LinearGradientFill;
                const lgr2 = new LinearGradientFill(lgr1.start, lgr1.end);
                for (let i = 0; i < lgr1.stops.length; i++) {
                    lgr2.addFillStop(lgr1.stops[i].color, lgr1.stops[i].offset);
                }
                this.fill = lgr2;
            }
            else if (o.fill.type === 'radialGradient') {
                const rgr1 = o.fill as RadialGradientFill;
                const rgr2 = new RadialGradientFill(rgr1.center, rgr1.focus, rgr1.radiusX, rgr1.radiusY);
                for (let i = 0; i < rgr1.stops.length; i++) {
                    rgr2.addFillStop(rgr1.stops[i].color, rgr1.stops[i].offset);
                }
                this.fill = rgr2;
            }
            else {
                this.fill = o.fill;
            }
        }
        if (o.fillScale) {
            this.fillScale = o.fillScale;
        }
        if (o.fillOffsetX) {
            this.fillOffsetX = o.fillOffsetX;
        }
        if (o.fillOffsetY) {
            this.fillOffsetY = o.fillOffsetY;
        }
        if (o.stroke) {
            this.stroke = o.stroke;
        }
        if (o.transform) {
            this.transform = o.transform;
        }
        if (o.mouseDown) {
            this.mouseDown = o.mouseDown;
            this.interactive = true;
        }
        if (o.mouseUp) {
            this.mouseUp = o.mouseUp;
            this.interactive = true;
        }
        if (o.mouseEnter) {
            this.mouseEnter = o.mouseEnter;
            this.interactive = true;
        }
        if (o.mouseLeave) {
            this.mouseLeave = o.mouseLeave;
            this.interactive = true;
        }
        if (o.click) {
            this.click = o.click;
            this.interactive = true;
        }
    }

    /**
      Serializes persistent properties to new object instance
      @returns Serialized element
    */
    serialize(): any {
        const o: any = {};
        o.type = this.type;
        if (this.id) {
            o.id = String(this.id);
        }
        if (this._size) {
            o.size = this.size.toString();
        }
        if (this._location) {
            o.location = this.location.toString();
        }
        if (this.locked) {
            o.locked = this.locked;
        }
        if (this.aspectLocked) {
            o.aspectLocked = this.aspectLocked;
        }
        if (this.fill) {
            o.fill = this.fill;
        }
        if (this.fillScale && this.fillScale !== 1) {
            o.fillScale = this.fillScale;
        }
        if (this.fillOffsetX) {
            o.fillOffsetX = this.fillOffsetX;
        }
        if (this.fillOffsetY) {
            o.fillOffsetY = this.fillOffsetY;
        }
        if (this.stroke) {
            o.stroke = this.stroke;
        }
        if (this.transform) {
            o.transform = this.transform;
        }
        if (this.mouseDown) {
            o.mouseDown = this.mouseDown;
        }
        if (this.mouseUp) {
            o.mouseUp = this.mouseUp;
        }
        if (this.mouseEnter) {
            o.mouseEnter = this.mouseEnter;
        }
        if (this.mouseLeave) {
            o.mouseLeave = this.mouseLeave;
        }
        if (this.click) {
            o.click = this.click;
        }
        return o;
    }

    /**
      Clones this element to a new instance
      @returns Cloned element instance
    */
    clone(): ElementBase {
        const e: ElementBase = new ElementBase();
        this.cloneTo(e);
        return e;
    }

    /**
      Copies properties of this instance to another instance
      @param e - Target element instance
    */
    cloneTo(e: any): void {
        if (this.type) {
            e.type = this.type;
        }
        if (this.id) {
            e.id = this.id;
        }
        if (this.size) {
            e.size = this.size.toString();
        }
        if (this._location) {
            e.location = this.location.toString();
        }
        if (this.locked) {
            e.locked = this.locked;
        }
        if (this.aspectLocked) {
            e.aspectLocked = this.aspectLocked;
        }
        if (this.fill) {
            e.fill = this.fill;
        }
        if (this.fillScale && this.fillScale !== 1) {
            e.fillScale = this.fillScale;
        }
        if (this.fillOffsetX) {
            e.fillOffsetX = this.fillOffsetX;
        }
        if (this.fillOffsetY) {
            e.fillOffsetY = this.fillOffsetY;
        }
        if (this.stroke) {
            e.stroke = this.stroke;
        }
        if (this.transform) {
            e.transform = this.transform;
        }
        if (this.mouseDown) {
            e.mouseDown = this.mouseDown;
        }
        if (this.mouseUp) {
            e.mouseUp = this.mouseUp;
        }
        if (this.mouseEnter) {
            e.mouseEnter = this.mouseEnter;
        }
        if (this.mouseLeave) {
            e.mouseLeave = this.mouseLeave;
        }
        if (this.click) {
            e.click = this.click;
        }
    }

    /**
      Returns string description of element
      @returns Element description
    */
    toString(): string {
        return (
            this.type +
            ' - (' +
            this._location.x +
            ',' +
            this._location.y +
            ') [' +
            this._size.width +
            'x' +
            this._size.height +
            ']'
        );
    }

    /**
      Returns detailed string description
      @returns Detailed description
    */
    describe(): string {
        let desc = this.toString();
        if (this.stroke) {
            desc = this.stroke.toString() + ' stroked ' + desc;
        }
        if (this.fill) {
            desc = this.fill.toString() + ' filled ' + desc;
        }
        return desc;
    }

    /**
      Can element be stroked
      @returns Can stroke
    */
    canStroke(): boolean {
        return false;
    }

    /**
      Can element be filled
      @returns Can fill
    */
    canFill(): boolean {
        return false;
    }

    /**
      Can element be moved
      @returns Can move
    */
    canMove(): boolean {
        return true;
    }

    /**
      Can element be resized
      @returns Can resize
    */
    canResize(): boolean {
        return true;
    }

    /**
      Can element be nudged with keyboard commands
      @returns Can nudge
    */
    canNudge(): boolean {
        return true;
    }

    /**
      Can individual element points be moved
      @returns Can move point
    */
    canMovePoint(): boolean {
        return false;
    }

    /**
      Can element points be edited
      @returns Can edit points
    */
    canEditPoints(): boolean {
        return false;
    }

    /**
      Register any required resources with the provided resource manager
      @param rm - Resource manager
    */
    registerResources(rm: ResourceManager): void {
        let key: string;

        // If an image or model fill, then register referenced resource
        if (this.fill && typeof this.fill === 'string') {
            const fillString: string = this.fill as string;
            if (fillString.toLowerCase().substring(0, 6) === 'image(') {
                key = fillString.substring(6, fillString.length - 1);
                if (key.indexOf(';') !== -1) {
                    const parts = key.split(';');
                    key = parts[1];
                }
                rm.register(key);
            }
            else if (fillString.toLowerCase().substring(0, 6) === 'model(') {
                key = fillString.substring(6, fillString.length - 1);
                if (key.indexOf(';') !== -1) {
                    const parts = key.split(';');
                    key = parts[1];
                }
                rm.register(key);
            }
        }
    }

    /**
      Returns list of keys referenced by element
    */
    getResourceKeys() {
        const keys = [];
        let key: string;

        // If an image or model fill, then register referenced resource
        if (this.fill && typeof this.fill === 'string') {
            const fillString: string = this.fill as string;
            if (fillString.toLowerCase().substring(0, 6) === 'image(') {
                key = fillString.substring(6, fillString.length - 1);
                if (key.indexOf(';') !== -1) {
                    const parts = key.split(';');
                    key = parts[1];
                }
                keys.push(key);
            }
            else if (fillString.toLowerCase().substring(0, 6) === 'model(') {
                key = fillString.substring(6, fillString.length - 1);
                if (key.indexOf(';') !== -1) {
                    const parts = key.split(';');
                    key = parts[1];
                }
                keys.push(key);
            }
        }
        return keys;
    }

    /**
      Render the element to the HTML5 rendering context provided
      @param c - Rendering context
    */
    draw(c: CanvasRenderingContext2D) {
        return;
    }

    /**
     * Determines if given x/y coordinate is contained within element
     * @param Rendering context
     * @param tx - X coordinate
     * @param ty - Y coordinate
     * @returns True if coordinate is contained within element
     */
    hitTest(c: CanvasRenderingContext2D, tx: number, ty: number): boolean {
        const model = this.model;
        const x = this._location.x;
        const y = this._location.y;
        const w = this._size.width;
        const h = this._size.height;
        c.save();
        if (this.transform) {
            model.setRenderTransform(c, this.transform, this._location);
        }
        c.beginPath();
        c.rect(x, y, w, h);
        const hit = c.isPointInPath(tx, ty);
        c.closePath();
        c.restore();
        return hit;
    }

    /**
      Resizes element by a given width and height amount
      @param widthDelta - Width adjustment
      @param heightDelta Height adjustment
      @returns Resized element
    */
    nudgeSize(widthDelta: number, heightDelta: number) {
        let newWidth = this._size.width + widthDelta;
        let newHeight = this._size.height + heightDelta;
        if (newWidth < 0) {
            newWidth = 0;
        }
        if (newHeight < 0) {
            newHeight = 0;
        }
        this._size = new Size(newWidth, newHeight);
        return this;
    }

    /**
      Moves element by a given horizontal and vertical offset
      @param offsetX - Horizontal offset
      @param offsetY - Vertical offset
      @returns Relocated element
    */
    translate(offsetX: number, offsetY: number) {
        this._location = new Point(this._location.x + offsetX, this._location.y + offsetY);
        return this;
    }

    /**
      Scales element by a given horizontal and vertical scaling factor
      @param scaleX - Horizontal scaling factor
      @param scaleY - Vertical scaling factor
      @returns Scaled element
    */
    scale(scaleX: number, scaleY: number) {
        this._size = Size.scale(this._size, scaleX, scaleY);
        this._location = Point.scale(this._location, scaleY, scaleY);
        return this;
    }

    /**
      Element bounding region. Returns rectangular region that completely encloses the element
      @returns Rectangular element bounding region
    */
    getBounds(): Region {
        if (this._location && this._size) {
            return new Region(this._location.x, this._location.y, this._size.width, this._size.height);
        }
        return null;
    }

    /**
      Clears the interal bounds of the associated complex element, forcing
      the bounds to be recomputed on the next request.
    */
    clearBounds() {
        this._location = undefined;
        this._size = undefined;
    }

    /**
      Location get accessor
      @method Elise.Drawing.ElementBase#getLocation
    */
    getLocation(): Point {
        if (this._location) {
            return this._location;
        }
        return this.getBounds().location;
    }

    /**
      Location set accessor.  Sets location value as string or Point
      @method Elise.Drawing.ElementBase#setLocation
      @param pointSource - Location as Point object or string
      @returns This element
    */
    setLocation(pointSource: string | Point): ElementBase {
        this._location = Point.parse(pointSource);
        return this;
    }

    /**
      Size get accessor
      @returns Size of element bounding region
    */
    getSize(): Size {
        if (this._size) {
            return this._size;
        }
        return this.getBounds().size;
    }

    /**
      Size set accessor. Sets size of element as string or Size object
      @param sizeSource - Size as Size object or string
      @returns This element
    */
    setSize(sizeSource: string | Size): ElementBase {
        this._size = Size.parse(sizeSource);
        return this;
    }

    /**
      Sets stroke used to draw element outline
      @param stroke - Stroke definition
      @returns This element
    */
    setStroke(stroke: string | Color) {
        if(stroke instanceof Color) {
            this.stroke = stroke.toString();
        }
        else {
            this.stroke = stroke;
        }
        return this;
    }

    /**
     * Sets fill used to fill element interior
      @param fill - Fill definition
      @returns This element
    */
    setFill(fill: string | Color | LinearGradientFill | RadialGradientFill) {
        if(fill instanceof Color) {
            this.fill = fill.toString();
        }
        else {
            this.fill = fill;
        }
        return this;
    }

    /**
      Sets fill scale used to alter fill rendering
      @param fillScale - Fill scale - Default 1
      @returns This element
    */
    setFillScale(fillScale: number) {
        this.fillScale = fillScale;
        return this;
    }

    /**
      Sets fill X offset used to alter fill rendering
      @param fillOffsetX - Fill X Offset
      @returns This element
    */
    setFillOffsetX(fillOffsetX: number) {
        this.fillOffsetX = fillOffsetX;
        return this;
    }

    /**
      Sets fill Y offset used to alter fill rendering
      @param fillOffsetY - Fill Y Offset
      @returns This element
    */
    setFillOffsetY(fillOffsetY: number) {
        this.fillOffsetY = fillOffsetY;
        return this;
    }

    /**
      Sets user interface interactivity for element
      @param interactive - Interactive flag value
      @returns This element
    */
    setInteractive(interactive: boolean) {
        this.interactive = interactive;
        return this;
    }

    /**
      Sets affine transform used for rendering element
      @param transform - Transform definition
      @returns This element
    */
    setTransform(transform: string) {
        this.transform = transform;
        return this;
    }

    /**
      Retrieves number of points in element
      @returns Number of points
    */
    pointCount(): number {
        throw new EliseException('ElementBase.PointCount()');
    }

    /**
      Gets value of point at given index
      @param index - Point index
      @param depth - Point depth (simple or complex)
      @returns Point at index
    */
    getPointAt(index: number, depth?: PointDepth): Point {
        throw new EliseException('ElementBase.getPointAt()');
    }

    /**
      Sets value of point at given index
      @param index - Point index
      @param value - New point value
      @param depth - Point depth (simple or complex)
    */
    setPointAt(index: number, value: Point, depth: PointDepth) {
        throw new EliseException('ElementBase.setPointAt()');
    }

    /**
      Adds element to the designated parent model.
      @param model - Parent model
      @returns This element
    */
    addTo(model: Model) {
        model.add(this);
        return this;
    }

    /**
      Throws not implemented exception
      @param subject - Not implemented item
    */
    notImplemented(subject: string) {
        throw new EliseException('Not implemented: ' + subject);
    }
}
