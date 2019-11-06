import { ElementBase } from './element-base';
import { ModelResource } from '../resource/model-resource';
import { ResourceManager } from '../resource/resource';
import { Point } from '../core/point';
import { Size } from '../core/size';
import { Model } from '../core/model';

export class ModelElement extends ElementBase {
    /**
      Model resource key
    */
    source: string;

    /**
      Rendering opacity (0-1)
    */
    opacity: number;

    /**
      Directly embedded source model
    */
    sourceModel: Model;

    /**
      Constructs a model element
      @classdesc Renders embedded or externally referenced model
      @extends Elise.Drawing.ElementBase
    */
    constructor() {
        super();
        this.type = 'model';
        this.opacity = 1;
        this.setOpacity = this.setOpacity.bind(this);
    }

    /**
      Model element factory function
      @param source - Model resource key or model resource to render
      @param x - X coordinate
      @param y - Y coordinate
      @param width - Width
      @param height - Height
      @returns New model element
    */
    static create(
        source?: string | ModelResource,
        x?: number,
        y?: number,
        width?: number,
        height?: number
    ): ModelElement {
        const e = new ModelElement();
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
      @param o - Source object
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
        return o;
    }

    /**
      Clones this model element to a new instance
      @returns Cloned model element
    */
    clone(): ModelElement {
        const e: ModelElement = ModelElement.create();
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
      Sets rendering opacity in the range of 0-1
      @param opacity - Rendering opacity
    */
    setOpacity(opacity: number) {
        this.opacity = opacity;
        return this;
    }

    /**
      Registers referenced resources with resource manager
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
      @method Elise.Drawing.ModelElement#getResourceKeys
    */
    getResourceKeys() {
        const keys = super.getResourceKeys();
        if (this.source) {
            keys.push(this.source);
        }
        return keys;
    }

    /**
      Render model element to canvas context
      @param c - Rendering context
    */
    draw(c: CanvasRenderingContext2D): void {
        const model = this.model;
        let innerModel: Model = null;
        if (!this.sourceModel) {
            const res = this.model.resourceManager.get(this.source) as ModelResource;
            innerModel = res.model;
        }
        else {
            innerModel = this.sourceModel;
        }

        if (!innerModel) {
            console.log('Model resource ' + this.source + ' could not be loaded.');
            return;
        }

        const x = this._location.x;
        const y = this._location.y;
        let w = 0;
        let h = 0;
        let rx = 1;
        let ry = 1;
        if (this._size && !this._size.equals(Size.Empty)) {
            w = this._size.width;
            h = this._size.height;
        }
        else if (innerModel.size) {
            w = innerModel.getSize().width;
            h = innerModel.getSize().height;
        }
        if (innerModel.size) {
            rx = w / innerModel.getSize().width;
            ry = h / innerModel.getSize().height;
        }

        // Clip to bounds
        /*
        c.save();
        c.rect(x, y, w, h);
        c.stroke();
        c.clip();
        */

        // If not full opacity, then render to intermediate canvas
        if (this.opacity && this.opacity > 0 && this.opacity < 1.0) {
            const offscreen = document.createElement('canvas') as HTMLCanvasElement;
            offscreen.width = w;
            offscreen.height = h;
            const c2 = offscreen.getContext('2d');
            c2.scale(rx, ry);
            innerModel.renderToContext(c2);
            c.save();
            c.globalAlpha = this.opacity;
            if (this.transform) {
                model.setRenderTransform(c, this.transform, new Point(x, y));
            }
            c.drawImage(offscreen, x, y);
            c.restore();
        }
        else {
            c.save();
            if (this.transform) {
                model.setRenderTransform(c, this.transform, new Point(x, y));
            }
            c.save();
            c.translate(x, y);
            if (rx !== 1 || ry !== 1) {
                c.scale(rx, ry);
            }
            innerModel.renderToContext(c);
            c.restore();
            c.restore();
        }

        // Restore from clip
        // c.restore();
    }
}
