import { Point } from './point';
import { Size } from './size';

export class Region {
    private _x: number;
    private _y: number;
    private _width: number;
    private _height: number;
    private _location: Point;
    private _size: Size;

    /**
      Region factory function
      @method Elise.Drawing.Region#create
      @param x - X coordinate
      @param y - Y coordinate
      @param width - Width
      @param height - Height
      @returns New region
    */
    static create(x: number, y: number, width: number, height: number): Region {
        return new Region(x, y, width, height);
    }

    /**
      Constructs a new region
      @classdesc Represents a region in 2D space
      @param x - X coordinate
      @param y - Y coordinate
      @param width - Width
      @param height - Height
    */
    constructor(x: number, y: number, width: number, height: number) {
        this._x = x;
        this._y = y;
        this._width = width;
        this._height = height;
        this._size = new Size(width, height);
        this._location = new Point(x, y);
        this.clone = this.clone.bind(this);
        this.containsPoint = this.containsPoint.bind(this);
        this.containsCoordinate = this.containsCoordinate.bind(this);
        this.containsRegion = this.containsRegion.bind(this);
        this.intersectsWith = this.intersectsWith.bind(this);
    }

    /**
      Clones this region into a new instance
      @method Elise.Drawing.Region#clone
      @returns Cloned region
    */
    clone(): Region {
        return new Region(this._x, this._y, this._width, this._height);
    }

    /**
      Returns X coordinate
      @method Elise.Drawing.Region#x
      @returns X coordinate
    */
    get x(): number {
        return this._x;
    }

    /**
      Returns Y coordinate
      @method Elise.Drawing.Region#y
      @returns Y coordinate
    */
    get y(): number {
        return this._y;
    }

    /**
      Returns width
      @method Elise.Drawing.Region#width
      @returns Width
    */
    get width(): number {
        return this._width;
    }

    /**
      Returns height
      @method Elise.Drawing.Region#height
      @returns Height
    */
    get height(): number {
        return this._height;
    }

    /**
      Returns location
      @method Elise.Drawing.Region#location
      @returns Location
    */
    get location(): Point {
        return this._location;
    }

    /**
      Returns size
      @method Elise.Drawing.Region#size
      @returns Size
    */
    get size(): Size {
        return this._size;
    }

    /**
      Determines if this region contains a given point
      @method Elise.Drawing.Region#containsPoint
      @param point - Point of interest
      @returns True if point is in this region
    */
    containsPoint(point: Point): boolean {
        if (
            point.x >= this.x &&
            point.x <= this.x + this.width &&
            point.y >= this.y &&
            point.y <= this.y + this.height
        ) {
            return true;
        }
        return false;
    }

    /**
      Determines if this region contains a coordinate
      @method Elise.Drawing.Region#containsCoordinate
      @param x - X coordinate
      @param y - Y coordinate
      @returns True if coordinate is in this region
    */
    containsCoordinate(x: number, y: number): boolean {
        if (x >= this.x && x <= this.x + this.width && y >= this.y && y <= this.y + this.height) {
            return true;
        }
        return false;
    }

    /**
      Determines if this region intersects with a another region
      @method Elise.Drawing.Region#intersectsWith
      @param region - Region of interest
      @returns True if region of interest intersects with this region
    */
    intersectsWith(region: Region): boolean {
        const x1 = this.x;
        const x2 = this.x + this.width;
        const y1 = this.y;
        const y2 = this.y + this.height;
        const x3 = region.x;
        const x4 = region.x + region.width;
        const y3 = region.y;
        const y4 = region.y + region.height;
        if (x1 < x4 && x2 > x3 && y1 < y4 && y2 > y3) {
            return true;
        }
        return false;
    }

    /**
      Determines if this region completely contains another region
      @method Elise.Drawing.Region#containsRegion
      @param region - Region of interest
      @returns True if this region completely contains the region of interest
    */
    containsRegion(region: Region): boolean {
        const x1 = this.x;
        const x2 = this.x + this.width;
        const y1 = this.y;
        const y2 = this.y + this.height;
        const x3 = region.x;
        const x4 = region.x + region.width;
        const y3 = region.y;
        const y4 = region.y + region.height;
        if (x3 >= x1 && x4 <= x2 && y3 >= y1 && y4 <= y2) {
            return true;
        }
        return false;
    }
}
