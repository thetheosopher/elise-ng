import { ElementBase } from './element-base';
import { BitmapResource } from '../resource/bitmap-resource';
import { ResourceManager } from '../resource/resource';
import { Point } from '../core/point';
import { Size } from '../core/size';

export class ImageElement extends ElementBase {
    /**
      Image resource key
    */
    source: string;

    /**
       Image opacity 0 (transparent) to 1 (opaque)
    */
    opacity: number;

    /**
      Constructs a new image element
      @classdesc Renders bitmap image source
      @extends Elise.Drawing.ElementBase
    */
    constructor() {
        super();
        this.type = 'image';
        this.opacity = 1.0;
        this.setOpacity = this.setOpacity.bind(this);
    }

    /**
      Image element factory function
      @param source - Bitmap resource key or bitmap resource
      @param x - X coordinate
      @param y - Y coordinate
      @param width - Width
      @param height - Height
      @returns New image element
    */
    static create(
        source?: string | BitmapResource,
        x?: number,
        y?: number,
        width?: number,
        height?: number
    ): ImageElement {
        const e = new ImageElement();
        if (arguments.length === 5) {
            if (typeof source === 'string') {
                e.source = source;
            }
            else {
                e.source = source.key;
            }
            e._location = new Point(x, y);
            e._size = new Size(width, height);
        }
        return e;
    }

    /**
      Copies properties of another object to this instance
      @param o - Source element
    */
    parse(o: any): void {
        super.parse(o);
        if (o.source) {
            this.source = o.source;
        }
        if (o.opacity !== undefined) {
            this.opacity = o.opacity;
        }
        if (!this._location) {
            this._location = new Point(0, 0);
        }
    }

    /**
      Serializes persistent properties to new object instance
      @returns Serialized element
    */
    serialize(): any {
        const o = super.serialize();
        if (this.source) {
            o.source = this.source;
        }
        if (this.opacity !== undefined && this.opacity !== 1) {
            o.opacity = this.opacity;
        }
        if (!this._location) {
            o.location = this._location.toString();
        }
        return o;
    }

    /**
      Clones this image element to a new instance
      @returns Cloned image instance
    */
    clone(): ImageElement {
        const e: ImageElement = ImageElement.create();
        super.cloneTo(e);
        if (this.source) {
            e.source = this.source;
        }
        if (this.opacity !== undefined) {
            e.opacity = this.opacity;
        }
        return e;
    }

    /**
      Register image source with resource manager
      @param rm - Resource manager
    */
    registerResources(rm: ResourceManager): void {
        super.registerResources(rm);
        if (this.source) {
            rm.register(this.source);
        }
    }

    /**
      Returns list of referenced resource keys
      @method Elise.Drawing.ImageElement#getResourceKeys
    */
    getResourceKeys() {
        const keys = super.getResourceKeys();
        if (this.source) {
            keys.push(this.source);
        }
        return keys;
    }

    /**
      Render image element to canvas context
      @param c - Rendering context
    */
    draw(c: CanvasRenderingContext2D) {
        const model = this.model;
        const res = model.resourceManager.get(this.source) as BitmapResource;
        c.save();
        if (this.transform) {
            model.setRenderTransform(c, this.transform, this._location);
        }
        if (this.opacity && this.opacity > 0 && this.opacity < 1.0) {
            const o = c.globalAlpha;
            c.globalAlpha = this.opacity;
            c.drawImage(res.image, this._location.x, this._location.y, this._size.width, this._size.height);
            c.globalAlpha = o;
        }
        else if (res.image) {
            try {
                c.drawImage(res.image, this._location.x, this._location.y, this._size.width, this._size.height);
            } catch (ignore) {
                console.log('Error rendering image in ImageElement.draw.');
            }
        }
        if (model.setElementStroke(c, this)) {
            c.strokeRect(this._location.x, this._location.y, this._size.width, this._size.height);
        }
        c.restore();
    }

    /**
      Set image opacity
      @param opacity - Image opacity in the range of 0-1
      @returns This element
    */
    setOpacity(opacity: number) {
        this.opacity = opacity;
        return this;
    }

    /**
      Can element be stroked
      @returns Can stroke
    */
    canStroke(): boolean {
        return true;
    }
}
