import { ElementBase } from './element-base';
import { Point } from '../core/point';
import { Size } from '../core/size';
import { PointDepth } from '../core/point-depth';
import { IPointContainer } from '../core/point-container';
import { Region } from '../core/region';
import { EliseException } from '../core/elise-exception';
import { WindingMode } from '../core/winding-mode';
import { FillFactory } from '../fill/fill-factory';

export class PathElement extends ElementBase implements IPointContainer {
    /**
      Drawing commands array
    */
    private _commands: string[];

    /**
      Computed bounding region
    */
    bounds: Region;

    /**
      True when in point editing mode
    */
    editPoints: boolean;

    /**
      Fill winding mode
    */
    private _winding: WindingMode;

    /**
      Constructs a path element
      @classdesc Renders series of stroked and/or filled drawing commands
      @extends Elise.Drawing.ElementBase
    */
    constructor() {
        super();
        this.type = 'path';
        this.setWinding = this.setWinding.bind(this);
    }

    /**
      Path element factory function
      @returns New path element
    */
    static create(): PathElement {
        const e = new PathElement();
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
      @returns This path element
    */
    setWinding(winding: WindingMode): PathElement {
        this._winding = winding;
        return this;
    }

    /**
      Commands get accessor as string. Serializes command array into string.
      @returns Serialized command array
    */
    get commands(): string {
        if (!this._commands) {
            return undefined;
        }
        else {
            return this._commands.join(' ');
        }
    }

    /**
      Commands set accessor as string.  Parses serialized string of commands.
      @param newValue - Serialized command array
    */
    set commands(newValue: string) {
        if (newValue) {
            this._commands = newValue.split(' ');
        }
        else {
            this._commands = undefined;
        }
        this.bounds = undefined;
    }

    /**
      Commands get access as command string []
      @returns Drawing command array
    */
    getCommands(): string[] {
        return this._commands;
    }

    /**
      Sets commands as serialized command string
      @param commandString - Serialized command string
      @returns This path element
    */
    setCommands(commandString: string): PathElement {
        this.commands = commandString;
        return this;
    }

    /**
      Copies properties of another object to this instance
      @param o - Source object
    */
    parse(o: any): void {
        super.parse(o);
        if (o.commands) {
            const commandString: string = o.commands;
            this._commands = commandString.split(' ');
        }
        if (o.winding) {
            this.winding = o.winding;
        }
        this.bounds = undefined;
    }

    /**
      Serializes persistent properties to new object instance
      @returns Serialized element
    */
    serialize(): any {
        const o = super.serialize();
        o.size = undefined;
        o.location = undefined;
        if (this._commands) {
            o.commands = this._commands.join(' ');
        }
        if (this.winding && this.winding === WindingMode.EvenOdd) {
            o.winding = this.winding;
        }
        return o;
    }

    /**
      Clones this path element to a new instance
      @returns Cloned path element
    */
    clone(): PathElement {
        const e: PathElement = PathElement.create();
        super.cloneTo(e);
        if (this._commands && this._commands.length > 0) {
            e.commands = this._commands.join(' ');
        }
        e.winding = this.winding;
        return e;
    }

    /**
      Render path element to canvas context
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
        const cl = this._commands.length;
        for (let i = 0; i < cl; i++) {
            const command = this._commands[i];
            if (command.charAt(0) === 'm') {
                const point = Point.parse(command.substring(1, command.length));
                c.moveTo(point.x, point.y);
            }
            else if (command.charAt(0) === 'l') {
                const point = Point.parse(command.substring(1, command.length));
                c.lineTo(point.x, point.y);
            }
            else if (command.charAt(0) === 'c') {
                const parts = command.substring(1, command.length).split(',');
                c.bezierCurveTo(
                    parseFloat(parts[0]),
                    parseFloat(parts[1]),
                    parseFloat(parts[2]),
                    parseFloat(parts[3]),
                    parseFloat(parts[4]),
                    parseFloat(parts[5])
                );
            }
            else if (command.charAt(0) === 'z') {
                c.closePath();
            }
        }
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
      Hit test path element.  Return true if point is within path element interior
      @param c - Rendering context
      @param tx - X coordinate of point
      @param ty - Y coordinate of point
      @returns True if point is within path element interior
    */
    hitTest(c: CanvasRenderingContext2D, tx: number, ty: number): boolean {
        const model = this.model;
        c.save();
        if (this.transform) {
            if (!this._location) {
                this.getBounds();
            }
            model.setRenderTransform(c, this.transform, this._location);
        }
        c.beginPath();
        const cl = this._commands.length;
        for (let i = 0; i < cl; i++) {
            const command = this._commands[i];
            if (command.charAt(0) === 'm') {
                const point = Point.parse(command.substring(1, command.length));
                c.moveTo(point.x, point.y);
            }
            else if (command.charAt(0) === 'l') {
                const point = Point.parse(command.substring(1, command.length));
                c.lineTo(point.x, point.y);
            }
            else if (command.charAt(0) === 'c') {
                const parts = command.substring(1, command.length).split(',');
                c.bezierCurveTo(
                    parseFloat(parts[0]),
                    parseFloat(parts[1]),
                    parseFloat(parts[2]),
                    parseFloat(parts[3]),
                    parseFloat(parts[4]),
                    parseFloat(parts[5])
                );
            }
            else if (command.charAt(0) === 'z') {
                c.closePath();
            }
        }
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
      Returns string description of path element
      @returns Description
    */
    toString(): string {
        return this.type + ' -  ' + this._commands.length + ' Commands';
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
      Path elements can be moved using mouse
      @returns True
    */
    canMove(): boolean {
        return true;
    }

    /**
      Path elements can be sized unless in point editing mode
      @returns True unless in point editing mode
    */
    canResize(): boolean {
        if (this.editPoints) {
            return false;
        }
        return true;
    }

    /**
      Path elements can be nudged with the keyboard
      @returns True
    */
    canNudge(): boolean {
        return true;
    }

    /**
      Path elements support individual point movement when in point editing mode
      @returns True if in point editing mode
    */
    canMovePoint(): boolean {
        if (this.editPoints) {
            return true;
        }
        return false;
    }

    /**
      Path elements support point editing mode
      @returns True
    */
    canEditPoints(): boolean {
        return true;
    }

    /**
      Nudges size of path element by a given width and height offset
      @param offsetX - Width adjustment
      @param offsetY - Height adjustment
      @returns This path element
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
      Scales path element command points by given horizontal and vertical scaling factors
      @param scaleX - Horizontal scaling factor
      @param scaleY - Vertical scaling factor
      @returns This path element
    */
    scale(scaleX: number, scaleY: number) {
        const cl = this._commands.length;
        const location = this.getLocation();
        for (let i = 0; i < cl; i++) {
            const command = this._commands[i];
            if (command.charAt(0) === 'm') {
                this._commands[i] =
                    'm' +
                    Point.scale(
                        Point.parse(command.substring(1, command.length)),
                        scaleX,
                        scaleY,
                        location.x,
                        location.y
                    ).toString();
            }
            else if (command.charAt(0) === 'l') {
                this._commands[i] =
                    'l' +
                    Point.scale(
                        Point.parse(command.substring(1, command.length)),
                        scaleX,
                        scaleY,
                        location.x,
                        location.y
                    ).toString();
            }
            else if (command.charAt(0) === 'c') {
                const parts = command.substring(1, command.length).split(',');
                const cp1 = Point.scale(
                    new Point(parseFloat(parts[0]), parseFloat(parts[1])),
                    scaleX,
                    scaleY,
                    location.x,
                    location.y
                );
                const cp2 = Point.scale(
                    new Point(parseFloat(parts[2]), parseFloat(parts[3])),
                    scaleX,
                    scaleY,
                    location.x,
                    location.y
                );
                const endPoint = Point.scale(
                    new Point(parseFloat(parts[4]), parseFloat(parts[5])),
                    scaleX,
                    scaleY,
                    location.x,
                    location.y
                );
                this._commands[i] = 'c' + cp1.toString() + ',' + cp2.toString() + ',' + endPoint.toString();
            }
        }
        this.bounds = undefined;
        return this;
    }

    /**
      Moves this path element by the given X and Y offsets
      @param offsetX - X size offset
      @param offsetY - Y size offset
      @returns This path element
    */
    translate(offsetX: number, offsetY: number) {
        const cl = this._commands.length;
        for (let i = 0; i < cl; i++) {
            const command = this._commands[i];
            if (command.charAt(0) === 'm') {
                this._commands[i] =
                    'm' +
                    Point.translate(Point.parse(command.substring(1, command.length)), offsetX, offsetY).toString();
            }
            else if (command.charAt(0) === 'l') {
                this._commands[i] =
                    'l' +
                    Point.translate(Point.parse(command.substring(1, command.length)), offsetX, offsetY).toString();
            }
            else if (command.charAt(0) === 'c') {
                const parts = command.substring(1, command.length).split(',');
                const cp1 = Point.translate(new Point(parseFloat(parts[0]), parseFloat(parts[1])), offsetX, offsetY);
                const cp2 = Point.translate(new Point(parseFloat(parts[2]), parseFloat(parts[3])), offsetX, offsetY);
                const endPoint = Point.translate(
                    new Point(parseFloat(parts[4]), parseFloat(parts[5])),
                    offsetX,
                    offsetY
                );
                this._commands[i] = 'c' + cp1.toString() + ',' + cp2.toString() + ',' + endPoint.toString();
            }
        }
        this.bounds = undefined;
        return this;
    }

    /**
      Computes (if undefined) and returns rectangular bounding region
      @returns Path element bounding region
    */
    getBounds(): Region {
        if (this.bounds) {
            return this.bounds;
        }
        let minX: number = null;
        let minY: number = null;
        let maxX: number = null;
        let maxY: number = null;
        const cl = this._commands.length;
        for (let i = 0; i < cl; i++) {
            const command = this._commands[i];
            let p: Point = null;
            if (command.charAt(0) === 'm') {
                p = Point.parse(command.substring(1, command.length));
            }
            else if (command.charAt(0) === 'l') {
                p = Point.parse(command.substring(1, command.length));
            }
            else if (command.charAt(0) === 'c') {
                const parts = command.substring(1, command.length).split(',');
                p = new Point(parseFloat(parts[4]), parseFloat(parts[5]));
            }
            if (p !== null) {
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
        }
        this.bounds = new Region(minX, minY, maxX - minX, maxY - minY);
        this._location = new Point(minX, minY);
        this._size = new Size(this.bounds.width, this.bounds.height);
        return this.bounds;
    }

    /**
      Moves path element
      @param pointSource - New location
      @returns This path element
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
      Resizes path element
      @param size - New size
      @returns This path element
    */
    setSize(size: Size) {
        const b = this.getBounds();
        const scaleX = size.width / b.width;
        const scaleY = size.height / b.height;
        this.scale(scaleX, scaleY);
        return this;
    }

    /**
      Returns number of points in path element
      @returns Number of points
    */
    pointCount(): number {
        let pointCount = 0;
        const cl = this._commands.length;
        for (let i = 0; i < cl; i++) {
            const command = this._commands[i];
            if (command.charAt(0) === 'm') {
                pointCount++;
            }
            else if (command.charAt(0) === 'l') {
                pointCount++;
            }
            else if (command.charAt(0) === 'c') {
                pointCount += 3;
            }
        }
        return pointCount;
    }

    /**
      Returns point at a given index (0 to # points - 1)
      @param index - Point index (0 to # points - 1)
      @param depth - Point depth
      @returns Requested point
    */
    getPointAt(index: number, depth?: PointDepth): Point {
        let current = -1;
        const cl = this._commands.length;
        for (let i = 0; i < cl; i++) {
            const command = this._commands[i];
            if (command.charAt(0) === 'm') {
                current++;
                if (current === index) {
                    return Point.parse(command.substring(1, command.length));
                }
            }
            else if (command.charAt(0) === 'l') {
                current++;
                if (current === index) {
                    return Point.parse(command.substring(1, command.length));
                }
            }
            else if (command.charAt(0) === 'c') {
                const parts = command.substring(1, command.length).split(',');
                const cp1 = new Point(parseFloat(parts[0]), parseFloat(parts[1]));
                const cp2 = new Point(parseFloat(parts[2]), parseFloat(parts[3]));
                const endPoint = new Point(parseFloat(parts[4]), parseFloat(parts[5]));
                current++;
                if (current === index) {
                    return endPoint;
                }
                if (depth === PointDepth.Full) {
                    current++;
                    if (current === index) {
                        return cp1;
                    }
                    current++;
                    if (current === index) {
                        return cp2;
                    }
                }
            }
        }
        this.invalidIndex(index);
    }

    /**
      Sets point at a given index (0 to # points - 1)
      @param index - Point index (0 to # points - 1)
      @param value - New point value
      @param depth - Not applicable to this element
    */
    setPointAt(index: number, value: Point, depth: PointDepth) {
        let current = -1;
        const cl = this._commands.length;
        for (let i = 0; i < cl; i++) {
            const command = this._commands[i];
            if (command.charAt(0) === 'm') {
                current++;
                if (current === index) {
                    this._commands[i] = 'm' + value.toString();
                    this.bounds = undefined;
                    return this;
                }
            }
            else if (command.charAt(0) === 'l') {
                current++;
                if (current === index) {
                    this._commands[i] = 'l' + value.toString();
                    this.bounds = undefined;
                    return this;
                }
            }
            else if (command.charAt(0) === 'c') {
                const parts = command.substring(1, command.length).split(',');
                let cp1 = new Point(parseFloat(parts[0]), parseFloat(parts[1]));
                let cp2 = new Point(parseFloat(parts[2]), parseFloat(parts[3]));
                let endPoint = new Point(parseFloat(parts[4]), parseFloat(parts[5]));
                current++;
                if (current === index) {
                    endPoint = value;
                    this._commands[i] = 'c' + cp1.toString() + ',' + cp2.toString() + ',' + endPoint.toString();
                    this.bounds = undefined;
                    return this;
                }
                if (depth === PointDepth.Full) {
                    current++;
                    if (current === index) {
                        cp1 = value;
                        this._commands[i] = 'c' + cp1.toString() + ',' + cp2.toString() + ',' + endPoint.toString();
                        this.bounds = undefined;
                        return this;
                    }
                    current++;
                    if (current === index) {
                        cp2 = value;
                        this._commands[i] = 'c' + cp1.toString() + ',' + cp2.toString() + ',' + endPoint.toString();
                        this.bounds = undefined;
                        return this;
                    }
                }
            }
        }
        this.invalidIndex(index);
    }

    /**
      Adds a new command to this path element
      @param command - New drawing command
      @returns This path element
    */
    add(command: string): PathElement {
        if (!this._commands) {
            this._commands = [];
        }
        this._commands.push(command);
        this.bounds = undefined;
        return this;
    }

    /**
      Throws exception on invalid requested index
      @param index - Invalid point index
    */
    invalidIndex(index: number) {
        throw new EliseException('Invalid point index for PathElement: ' + index);
    }
}
