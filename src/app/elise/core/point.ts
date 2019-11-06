export class Point {
    static ORIGIN: Point = new Point(0, 0);

    private _x: number;
    private _y: number;

    /**
      Point factory function
      @method Elise.Drawing.Point#create
      @param x - X coordinate
      @param y - Y coordinate
      @returns New point
    */
    static create(x: number, y: number): Point {
        return new Point(x, y);
    }

    /**
      Parses a point described as a string or clones existing point
      @method Elise.Drawing.Point#parse
      @param pointSource - Point string description or point to clone
      @returns Parsed or cloned point object
    */
    static parse(pointSource: string | Point): Point {
        if (typeof pointSource === 'string') {
            const parts = pointSource.split(',');
            const x = parseFloat(parts[0]);
            const y = parseFloat(parts[1]);
            return new Point(x, y);
        }
        else {
            return new Point(pointSource.x, pointSource.y);
        }
    }

    /**
      Scales a point by specified scaling factors.  Scaling reference can be optionally specified.
      @method Elise.Drawing.Point#scale
      @param point - Point to be scaled.
      @param scaleX - X scaling factor
      @param scaleY - Y scaling factor
      @param baseX - Optional x reference point
      @param baseY - Optional y reference point
      @returns Scaled point
    */
    static scale(point: Point, scaleX: number, scaleY: number, baseX?: number, baseY?: number): Point {
        if (arguments.length === 5) {
            return new Point((point.x - baseX) * scaleX + baseX, (point.y - baseY) * scaleY + baseY);
        }
        else {
            return new Point(point.x * scaleX, point.y * scaleY);
        }
    }

    /**
     Returns a new point from a given point translated by a given offset
    @method Elise.Drawing.Point#translate
    @param point - Original point
    @param offsetX - X offset
    @param offsetY - Y offset
    @returns Translated point
    */
    static translate(point: Point, offsetX: number, offsetY: number): Point {
        return new Point(point.x + offsetX, point.y + offsetY);
    }

    /**
      Constructs a new Point object
      @classdesc Describes a point in 2D space
      @param x - X Coordinate
      @param y - Y Coordinate
     */
    constructor(x: number, y: number) {
        this._x = x;
        this._y = y;
        this.clone = this.clone.bind(this);
        this.equals = this.equals.bind(this);
        this.toString = this.toString.bind(this);
    }

    /**
      Clones this point into a new instance
      @method Elise.Drawing.Point#clone
      @returns Clone of point
    */
    clone(): Point {
        return new Point(this.x, this.y);
    }

    /**
      Returns x coordinate
      @method Elise.Drawing.Point#x
      @returns X coordinate
    */
    get x(): number {
        return this._x;
    }

    /**
      Sets x coordinate
      @method Elise.Drawing.Point#x
      @param value - X coordinate
    */
    set x(value: number) {
        this._x = value;
    }

    /**
      Returns y coordinate
      @method Elise.Drawing.Point#y
      @returns Y coordinate
    */
    get y(): number {
        return this._y;
    }

    /**
      Sets y coordinate
      @method Elise.Drawing.Point#y
      @param value - Y coordinate
    */
    set y(value: number) {
        this._y = value;
    }

    /**
      Compares this point with another for equality
      @method Elise.Drawing.Point#equals
      @param that - Point to compare with this
      @returns True if point given matches this
    */
    equals(that: Point): boolean {
        return that !== null && this.x === that.x && this.y === that.y;
    }

    /**
      Describes point as a string
      @method Elise.Drawing.Point#toString
      @returns Description of point
    */
    toString(): string {
        return this.x.toFixed(0) + ',' + this.y.toFixed(0);
    }
}
