import { ElementBase } from './element-base';
import { Point } from '../core/point';
import { PointDepth } from '../core/point-depth';
import { IPointContainer } from '../core/point-container';
import { Region } from '../core/region';
import { EliseException } from '../core/elise-exception';

export class LineElement extends ElementBase implements IPointContainer {
    /**
      Point 1
    */
    private _p1: Point;

    /**
      Point 2
    */
    private _p2: Point;

    /**
      Line element factory function
      @param x1 - Point 1 X coordinate
      @param y1 - Point 1 Y coordinate
      @param x2 - Point 2 X coordinate
      @param y2 - Point 2 Y coordinate
      @returns New line element
    */
    static create(x1?: number, y1?: number, x2?: number, y2?: number) {
        const e = new LineElement();
        if (arguments.length === 4) {
            e._p1 = new Point(x1, y1);
            e._p2 = new Point(x2, y2);
        }
        return e;
    }

    /**
      Constructs a line element
      @classdesc Renders stroked line between two points
      @extends Elise.Drawing.ElementBase
    */
    constructor() {
        super();
        this.type = 'line';
    }

    /**
      Copies properties of another object to this instance
      @param o - Source element
    */
    parse(o: any): void {
        super.parse(o);
        if (o.p1) {
            this._p1 = Point.parse(o.p1);
        }
        if (o.p2) {
            this._p2 = Point.parse(o.p2);
        }
    }

    /**
      Serializes persistent properties to new object instance
      @returns Serialized element
    */
    serialize(): any {
        const o = super.serialize();
        if (this.p1) {
            o.p1 = this.p1.toString();
        }
        if (this.p2) {
            o.p2 = this.p2.toString();
        }
        return o;
    }

    /**
      Clones this line element to a new instance
      @returns Cloned line instance
    */
    clone(): LineElement {
        const e: LineElement = LineElement.create();
        super.cloneTo(e);
        e.p1 = this.p1;
        e.p2 = this.p2;
        return e;
    }

    /**
      Point 1 get accessor as string
      @returns Point 1 as string
    */
    get p1(): string {
        if (!this._p1) {
            return undefined;
        }
        else {
            return this._p1.toString();
        }
    }
    /**
      Point 1 set accessor as string
      @param newValue New point value as string
    */
    set p1(newValue: string) {
        if (!newValue) {
            this._p1 = undefined;
        }
        else {
            this._p1 = Point.parse(newValue);
        }
    }
    /**
      Point 1 get accessor as Point
      @returns Point 1 as point object
    */
    getP1(): Point {
        return this._p1;
    }
    /**
      Point 1 set accessor as string or Point
      @param pointSource - String or point object point source
    */
    setP1(pointSource: string | Point): LineElement {
        this._p1 = Point.parse(pointSource);
        return this;
    }

    /**
      Point 2 get accessor as string
      @returns Point 2 as string
    */
    get p2(): string {
        if (!this._p2) {
            return undefined;
        }
        else {
            return this._p2.toString();
        }
    }
    /**
      Point 2 set accessor as string
      @param newValue - New point value as string
    */
    set p2(newValue: string) {
        if (!newValue) {
            this._p2 = undefined;
        }
        else {
            this._p2 = Point.parse(newValue);
        }
    }

    /**
      Point 2 get accessor as Point
      @returns Point 2 as point object
    */
    getP2(): Point {
        return this._p2;
    }

    /**
      Point 2 set accessor as string or Point
      @param pointSource - String or point object point source
     */
    setP2(pointSource: string | Point): LineElement {
        this._p2 = Point.parse(pointSource);
        return this;
    }

    /**
      Render line element to canvas context
      @param c - Rendering context
    */
    draw(c: CanvasRenderingContext2D) {
        const model = this.model;
        c.save();
        if (this.transform) {
            model.setRenderTransform(c, this.transform, this._p1);
        }
        c.beginPath();
        c.moveTo(this._p1.x, this._p1.y);
        c.lineTo(this._p2.x, this._p2.y);
        if (model.setElementStroke(c, this)) {
            c.stroke();
        }
        c.restore();
    }

    /**
      Hit test line.  Return true if point is on or near to line element
      @param c - Rendering context
      @param tx - X coordinate of point
      @param ty - Y coordinate of point
      @returns True if point on line element
    */
    hitTest(c: CanvasRenderingContext2D, tx: number, ty: number): boolean {
        let distance: number;
        const dxline = this._p2.x - this._p1.x;
        const dyline = this._p2.y - this._p1.y;
        let tolerance = 2;
        const dx1 = this._p1.x - tx;
        const dy1 = this._p1.y - ty;
        if ((dxline > 0 && dx1 > 0) || (dyline < 0 && dy1 < 0) || (dxline < 0 && dx1 < 0) || (dyline > 0 && dy1 > 0)) {
            distance = Math.sqrt(dx1 * dx1 + dy1 * dy1);
            if (distance <= tolerance) {
                return true;
            }
            return false;
        }
        const dx2 = this._p2.x - tx;
        const dy2 = this._p2.y - ty;
        if ((dxline > 0 && dx2 < 0) || (dyline < 0 && dy2 > 0) || (dxline < 0 && dx2 > 0) || (dyline > 0 && dy2 < 0)) {
            distance = Math.sqrt(dx2 * dx2 + dy2 * dy2);
            if (distance <= tolerance) {
                return true;
            }
            return false;
        }
        tolerance *= Math.sqrt(dxline * dxline + dyline * dyline);
        const diff = dy1 * dx2 - dy2 * dx1;
        if (diff >= -tolerance && diff <= tolerance) {
            return true;
        }
        return false;
    }

    /**
      Returns string description of line
      @returns Description
    */
    toString(): string {
        return this.type + ' - (' + this._p1.x + ',' + this._p1.y + ')-(' + this._p2.x + ',' + this._p2.y + ')';
    }

    /**
      Can element be stroked
      @returns Can stroke
    */
    canStroke(): boolean {
        return true;
    }

    /**
      Lines are movable
      @returns True - Lines can be moved
    */
    canMove(): boolean {
        return true;
    }

    /**
      Lines cannot be sized using mouse since end points are each editable
      @returns False - Lines cannot be sized
    */
    canResize(): boolean {
        return false;
    }

    /**
      Lines can be nudged with the keyboard
      @returns True
    */
    canNudge(): boolean {
        return true;
    }

    /**
      Lines support individual point movement
      @returns True
    */
    canMovePoint(): boolean {
        return true;
    }

    /**
      Lines don't support point editing mode since they are always in point editing mode
      @returns False
    */
    canEditPoints(): boolean {
        return false;
    }

    /**
      Scales line by given horizontal and vertical scaling factors
      @param scaleX - Horizontal scaling factor
      @param scaleY - Vertical scaling factor
      @returns This line element
    */
    scale(scaleX: number, scaleY: number) {
        let bx = this._p1.x;
        let by = this._p1.y;
        if (this._p2.x < this._p1.x) {
            bx = this._p2.x;
        }
        if (this._p2.y < this._p1.y) {
            by = this._p2.y;
        }
        this._p1 = Point.scale(this._p1, scaleX, scaleY, bx, by);
        this._p2 = Point.scale(this._p2, scaleX, scaleY, bx, by);
        return this;
    }

    /**
      Nudges size of this line element by the given X and Y offsets
      @param offsetX - X size offset
      @param offsetY - Y size offset
      @returns This line element
    */
    nudgeSize(offsetX: number, offsetY: number) {
        const b = this.getBounds();
        let newWidth = b.width + offsetX;
        if (newWidth < 1) {
            newWidth = 1;
        }
        let newHeight = b.height + offsetY;
        if (newHeight < 1) {
            newHeight = 1;
        }
        this.scale(newWidth / b.width, newHeight / b.height);
        return this;
    }

    /**
      Moves this line element by the given X and Y offsets
      @param offsetX - X size offset
      @param offsetY - Y size offset
      @returns This line element
    */
    translate(offsetX: number, offsetY: number) {
        this._p1 = Point.translate(this._p1, offsetX, offsetY);
        this._p2 = Point.translate(this._p2, offsetX, offsetY);
        return this;
    }

    /**
      Moves line
      @param pointSource - New location
      @returns This line
    */
    setLocation(pointSource: string | Point) {
        const b = this.getBounds();
        let pt: Point;
        if (typeof pointSource === 'string') {
            pt = Point.parse(pointSource);
        }
        else {
            pt = new Point(pointSource.x, pointSource.y);
        }
        const deltaX = pt.x - b.x;
        const deltaY = pt.y - b.y;
        this.translate(deltaX, deltaY);
        return this;
    }

    /**
      Returns rectangular bounding region
      @returns Line bounding region
    */
    getBounds(): Region {
        let x: number, y: number, width: number, height: number;
        if (this._p1.x < this._p2.x) {
            x = this._p1.x;
            width = this._p2.x - x;
        }
        else {
            x = this._p2.x;
            width = this._p1.x - x;
        }
        if (this._p1.y < this._p2.y) {
            y = this._p1.y;
            height = this._p2.y - y;
        }
        else {
            y = this._p2.y;
            height = this._p1.y - y;
        }
        return new Region(x, y, width, height);
    }

    /**
      Returns line point count
      @returns Two (2) points
    */
    pointCount(): number {
        return 2;
    }

    /**
      Returns point at a given index (0 or 1)
      @param index - Point index (0 or 1)
      @param depth - Not applicable
      @returns Requested point
    */
    getPointAt(index: number, depth?: PointDepth): Point {
        if (index === 0) {
            return this._p1;
        }
        if (index === 1) {
            return this._p2;
        }
        this.invalidIndex(index);
    }

    /**
      Sets point at a given index (0 or 1)
      @param index - Point index (0 or 1)
      @param value - New point value
      @param depth - Not applicable
    */
    setPointAt(index: number, value: Point, depth: PointDepth) {
        if (index === 0) {
            this._p1 = new Point(value.x, value.y);
            return this;
        }
        else if (index === 1) {
            this._p2 = new Point(value.x, value.y);
            return this;
        }
        else {
            this.invalidIndex(index);
        }
    }

    /**
      Throws exception on invalid requested index
      @param index - Invalid point index
    */
    invalidIndex(index: number) {
        throw new EliseException('Invalid point index for LineElement: ' + index);
    }
}
