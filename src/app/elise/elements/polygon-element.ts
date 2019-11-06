import { ElementBase } from './element-base';
import { Point } from '../core/point';
import { Size } from '../core/size';
import { PointDepth } from '../core/point-depth';
import { IPointContainer } from '../core/point-container';
import { Region } from '../core/region';
import { EliseException } from '../core/elise-exception';
import { WindingMode } from '../core/winding-mode';
import { FillFactory } from '../fill/fill-factory';

export class PolygonElement extends ElementBase implements IPointContainer {
    /**
     * Point array
     */
    private _points: Point[];

    /**
      Computed bounding region
    */
    bounds: Region;

    /**
      True when in point editing mode
    */
    editPoints: boolean;

    /**
     * Fill winding mode
     */
    private _winding?: WindingMode;

    /**
      Constructs a polygon element
      @classdesc Renders connected, stroked and/or filled line segments between three or more points
      @extends Elise.Drawing.ElementBase
    */
    constructor() {
        super();
        this.type = 'polygon';
        this.setPoints = this.setPoints.bind(this);
        this.setWinding = this.setWinding.bind(this);
    }

    /**
      Polygon element factory function
      @returns New polygon
    */
    static create(): PolygonElement {
        const e = new PolygonElement();
        return e;
    }

    /**
      Winding mode get accessor
      @returns Fill winding mode
    */
    get winding(): WindingMode {
        return this._winding;
    }

    /**
      Winding mode set accessor
      @param newValue - New fill winding mode
    */
    set winding(newValue: WindingMode) {
        this._winding = newValue;
    }

    /**
      Sets fill winding mode
      @param winding - Fill winding mode
      @returns This polygon
    */
    setWinding(winding: WindingMode): PolygonElement {
        this._winding = winding;
        return this;
    }

    /**
      Points get accessor as string. Serializes point array into string.
      @returns Serialized point array
    */
    get points(): string {
        if (!this._points) {
            return undefined;
        }
        else {
            let result = '';
            const pl = this._points.length;
            for (let i = 0; i < pl; i++) {
                const p = this._points[i];
                if (i > 0) {
                    result += ' ';
                }
                result += p.toString();
            }
            return result;
        }
    }

    /**
      Points set accessor as string.  Parses serialized string of points.
      @param newValue - Serialized point array
    */
    set points(newValue: string) {
        if (!newValue) {
            this._points = undefined;
        }
        else {
            this._points = [];
            const parts = newValue.split(' ');
            const pl = parts.length;
            for (let i = 0; i < pl; i++) {
                this._points.push(Point.parse(parts[i]));
            }
        }
        this.bounds = undefined;
    }

    /**
      Sets point array as either serialized points string or Point array.
      @param pointsSource - Point source as either string of Point array
      @return This polygon element
    */
    setPoints(pointsSource: string | Point[]) {
        if (typeof pointsSource === 'string') {
            this.points = pointsSource;
        }
        else {
            this._points = pointsSource.slice(0);
        }
        this.bounds = undefined;
        return this;
    }

    /**
      Copies properties of another object to this instance
      @param o - Source object
    */
    parse(o: any): void {
        super.parse(o);
        if (o.points) {
            this.points = o.points;
        }
        if (o.winding) {
            this.winding = o.winding;
        }
    }

    /**
      Serializes persistent properties to new object instance
      @returns Serialized element
    */
    serialize(): any {
        const o = super.serialize();
        o.size = undefined;
        o.location = undefined;
        if (this.points) {
            o.points = this.points;
        }
        if (this.winding && this.winding === WindingMode.EvenOdd) {
            o.winding = this.winding;
        }
        return o;
    }

    /**
      Clones this polygon element to a new instance
      @returns Cloned polygon instance
    */
    clone(): PolygonElement {
        const e: PolygonElement = PolygonElement.create();
        super.cloneTo(e);
        e.points = this.points;
        e.winding = this.winding;
        return e;
    }

    /**
      Render polygon to canvas context
      @param c - Rendering context
    */
    draw(c: CanvasRenderingContext2D): void {
        const model = this.model;
        c.save();
        if (this.transform) {
            if (!this._location) {
                this.getBounds();
            }
            model.setRenderTransform(c, this.transform, this._location);
        }
        c.beginPath();
        c.moveTo(this._points[0].x, this._points[0].y);
        const pl = this._points.length;
        for (let i = 1; i < pl; i++) {
            const p: Point = this._points[i];
            c.lineTo(p.x, p.y);
        }
        c.closePath();
        if (FillFactory.setElementFill(c, this)) {
            const loc = this.getLocation();
            if (this.fillOffsetX || this.fillOffsetY) {
                const fillOffsetX = this.fillOffsetX || 0;
                const fillOffsetY = this.fillOffsetY || 0;
                c.translate(loc.x + fillOffsetX, loc.y + fillOffsetY);
                if (this._winding && this._winding === WindingMode.EvenOdd) {
                    c.fill('evenodd');
                }
                else {
                    c.fill('nonzero');
                }
                c.translate(-(loc.x + fillOffsetX), -(loc.y + fillOffsetY));
            }
            else {
                c.translate(loc.x, loc.y);
                if (this._winding && this._winding === WindingMode.EvenOdd) {
                    c.fill('evenodd');
                }
                else {
                    c.fill('nonzero');
                }
                c.translate(-loc.x, -loc.y);
            }
        }
        if (model.setElementStroke(c, this)) {
            c.stroke();
        }
        c.restore();
    }

    /**
      Hit test polygon.  Return true if point is within polygon interior
      @param c - Rendering context
      @param tx - X coordinate of point
      @param ty - Y coordinate of point
      @returns True if point is within polygon
    */
    hitTest(c: CanvasRenderingContext2D, tx: number, ty: number): boolean {
        const model = this.model;
        c.save();
        if (this.transform) {
            model.setRenderTransform(c, this.transform, this._location);
        }
        c.beginPath();
        c.moveTo(this._points[0].x, this._points[0].y);
        const pl = this._points.length;
        for (let i = 1; i < pl; i++) {
            c.lineTo(this._points[i].x, this._points[i].y);
        }
        c.closePath();
        let hit: boolean;
        if (this._winding && this._winding === WindingMode.EvenOdd) {
            hit = c.isPointInPath(tx, ty, 'evenodd');
        }
        else {
            hit = c.isPointInPath(tx, ty, 'nonzero');
        }
        c.restore();
        return hit;
    }

    /**
      Returns string description of polygon
      @returns Description
    */
    toString(): string {
        return this.type + ' -  ' + this._points.length + ' Points';
    }

    /**
      Can element be stroked
      @returns Can stroke
    */
    canStroke(): boolean {
        return true;
    }

    /**
      Can element be filled
      @returns Can fill
    */
    canFill(): boolean {
        return true;
    }

    /**
      Polygons can be moved using mouse
      @returns True
    */
    canMove(): boolean {
        return true;
    }

    /**
      Polygons can be sized unless in point editing mode
      @returns True unless in point editing mode
    */
    canResize(): boolean {
        if (this.editPoints) {
            return false;
        }
        return true;
    }

    /**
      Polygons can be nudged with the keyboard
      @returns True
    */
    canNudge(): boolean {
        return true;
    }

    /**
      Polygons support individual point movement when in point editing mode
      @returns True if in point editing mode
    */
    canMovePoint(): boolean {
        if (this.editPoints) {
            return true;
        }
        return false;
    }

    /**
      Polygons support point editing mode
      @returns True
    */
    canEditPoints(): boolean {
        return true;
    }

    /**
      Nudges size of polygon by a given width and height offset
      @param offsetX - X offset
      @param offsetY - Y offset
      @returns This polygon
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

        if (this.aspectLocked) {
            if (offsetX === 0) {
                this.scale(newHeight / b.height, newHeight / b.height);
            }
            else {
                this.scale(newWidth / b.width, newWidth / b.width);
            }
        }
        else {
            this.scale(newWidth / b.width, newHeight / b.height);
        }
        this.bounds = undefined;
        return this;
    }

    /**
      Scales polygon points by given horizontal and vertical scaling factors
      @param scaleX - Horizontal scaling factor
      @param scaleY - Vertical scaling factor
      @returns This polygon element
    */
    scale(scaleX: number, scaleY: number) {
        const newPoints: Point[] = [];
        const pl = this._points.length;
        const location = this.getLocation();
        for (let i = 0; i < pl; i++) {
            newPoints.push(Point.scale(this._points[i], scaleX, scaleY, location.x, location.y));
        }
        this._points = newPoints;
        this.bounds = undefined;
        return this;
    }

    /**
      Moves this polygon element by the given X and Y offsets
      @param offsetX - X size offset
      @param offsetY - Y size offset
      @returns This polygon
    */
    translate(offsetX: number, offsetY: number) {
        const newPoints: Point[] = [];
        const pl = this._points.length;
        for (let i = 0; i < pl; i++) {
            newPoints.push(Point.translate(this._points[i], offsetX, offsetY));
        }
        this._points = newPoints;
        this.bounds = undefined;
        return this;
    }

    /**
      Computes (if undefined) and returns rectangular bounding region
      @returns Polygon bounding region
    */
    getBounds(): Region {
        if (this.bounds) {
            return this.bounds;
        }
        let minX: number = null;
        let minY: number = null;
        let maxX: number = null;
        let maxY: number = null;
        const pl = this._points.length;
        for (let i = 0; i < pl; i++) {
            const p: Point = this._points[i];
            if (!minX) {
                minX = p.x;
            }
            else if (p.x < minX) {
                minX = p.x;
            }
            if (!minY) {
                minY = p.y;
            }
            else if (p.y < minY) {
                minY = p.y;
            }
            if (!maxX) {
                maxX = p.x;
            }
            else if (p.x > maxX) {
                maxX = p.x;
            }
            if (!maxY) {
                maxY = p.y;
            }
            else if (p.y > maxY) {
                maxY = p.y;
            }
        }
        this.bounds = new Region(minX, minY, maxX - minX, maxY - minY);
        this._location = new Point(minX, minY);
        this._size = new Size(this.bounds.width, this.bounds.height);
        return this.bounds;
    }

    /**
      Moves polygon
      @param pointSource - New location
      @returns This polygon
    */
    setLocation(pointSource: string | Point): PolygonElement {
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
      Resizes polygon
      @param size - New size
      @returns This polygon
    */
    setSize(size: Size): PolygonElement {
        const b = this.getBounds();
        const scaleX = size.width / b.width;
        const scaleY = size.height / b.height;
        this.scale(scaleX, scaleY);
        return this;
    }

    /**
      Returns number of points in polygon
      @returns Number of points
    */
    pointCount(): number {
        if (this._points) {
            return this._points.length;
        }
        return 0;
    }

    /**
      Returns point at a given index (0 to # points - 1)
      @param index - Point index (0 to # points - 1)
      @param depth - Not applicable
      @returns Requested point
    */
    getPointAt(index: number, depth?: PointDepth): Point {
        if (this._points && index < this._points.length) {
            return this._points[index];
        }
        this.invalidIndex(index);
    }

    /**
      Sets point at a given index (0 to # points - 1)
      @param index - Point index (0 to # points - 1)
      @param value - New point value
      @param depth - Not applicable to this element
      @returns This polygon
    */
    setPointAt(index: number, value: Point, depth: PointDepth) {
        if (this._points && index < this._points.length) {
            this._points[index] = value;
            this.bounds = undefined;
            return this;
        }
        this.invalidIndex(index);
    }

    /**
      Adds a new point to this polygon
      @param point - New point
      @returns This polygon
    */
    addPoint(point: Point): PolygonElement {
        if (!this._points) {
            this._points = [];
        }
        this._points.push(point);
        this.bounds = undefined;
        return this;
    }

    /**
      Throws exception on invalid requested index
      @param index - Invalid point index
    */
    invalidIndex(index: number) {
        throw new EliseException('Invalid point index for PolygonElement: ' + index);
    }
}
