import { ElementBase } from '../elements/element-base';
import { LinearGradientFill } from './linear-gradient-fill';
import { RadialGradientFill } from './radial-gradient-fill';
import { Color } from '../core/color';
import { Point } from '../core/point';
import { BitmapResource } from '../resource/bitmap-resource';
import { ModelResource } from '../resource/model-resource';

export class FillFactory {
    /**
      Returns fill for given element with inheritance
      @param el - Element
      @returns Element stroke
    */
    static fillForElement(el: ElementBase): string | LinearGradientFill | RadialGradientFill {
        let compare = el;
        while (compare) {
            if (compare.fill) {
                return compare.fill;
            }
            compare = compare.parent;
        }
        return undefined;
    }

    /**
      Sets rendering fill style on canvas element for given element
      @param c - Rendering context
      @param el - Element being rendered
      @returns True if fill was applied for element
    */
    static setElementFill(c: CanvasRenderingContext2D, el: ElementBase): boolean {
        const model = el.model;
        const fill = FillFactory.fillForElement(el);
        if (!fill || (typeof fill === 'string' && fill === 'no')) {
            c.fillStyle = 'rgba(0,0,0,0)';
            return false;
        }
        if (fill instanceof LinearGradientFill) {
            const lgr = fill as LinearGradientFill;
            const start = Point.parse(lgr.start);
            const end = Point.parse(lgr.end);
            const linearGradient = c.createLinearGradient(start.x, start.y, end.x, end.y);
            for (let i = 0; i < lgr.stops.length; i++) {
                const stop = lgr.stops[i];
                linearGradient.addColorStop(stop.offset, Color.parse(stop.color).toStyleString());
            }
            c.fillStyle = linearGradient;
            return true;
        }
        if (fill instanceof RadialGradientFill) {
            const rgr = fill as RadialGradientFill;
            const focus = Point.parse(rgr.focus);
            const center = Point.parse(rgr.center);
            const radialGradient = c.createRadialGradient(
                focus.x,
                focus.y,
                0,
                center.x,
                center.y,
                Math.max(rgr.radiusX, rgr.radiusY)
            );
            for (let i = 0; i < rgr.stops.length; i++) {
                const stop = rgr.stops[i];
                radialGradient.addColorStop(stop.offset, Color.parse(stop.color).toStyleString());
            }
            c.fillStyle = radialGradient;
            return true;
        }

        if (typeof fill === 'string') {
            if (fill.toLowerCase().substring(0, 6) === 'image(') {
                let key = fill.substring(6, fill.length - 1);
                if (key.indexOf(';') !== -1) {
                    const parts = key.split(';');
                    const opacity = parseFloat(parts[0]);
                    c.globalAlpha = opacity;
                    key = parts[1];
                }
                const res = model.resourceManager.get(key) as BitmapResource;
                if (!res) {
                    c.fillStyle = Color.Magenta.toStyleString();
                    console.log('Image resource [' + key + '] not found');
                    return false;
                }
                const scaling = model.getFillScale(el);
                let pattern: CanvasPattern;
                if (scaling.rx === 1 && scaling.ry === 1) {
                    pattern = c.createPattern(res.image, 'repeat');
                }
                else {
                    const offscreen = document.createElement('canvas');
                    offscreen.width = res.image.width * scaling.rx;
                    offscreen.height = res.image.height * scaling.ry;
                    const c2 = offscreen.getContext('2d');
                    c2.scale(scaling.rx, scaling.ry);
                    c2.drawImage(res.image, 0, 0);
                    pattern = c.createPattern(offscreen, 'repeat');
                }
                c.fillStyle = pattern;
                return true;
            }
            if (fill.toLowerCase().substring(0, 6) === 'model(') {
                let key = fill.substring(6, fill.length - 1);
                if (key.indexOf(';') !== -1) {
                    const parts = key.split(';');
                    const opacity = parseFloat(parts[0]);
                    c.globalAlpha = opacity;
                    key = parts[1];
                }
                const res = model.resourceManager.get(key) as ModelResource;
                if (!res) {
                    c.fillStyle = Color.Magenta.toStyleString();
                    console.log('Model resource [' + key + '] not found');
                    return false;
                }
                const innerModel = res.model;
                const offscreen = document.createElement('canvas');
                const scaling = model.getFillScale(el);
                if (scaling.rx === 1 && scaling.ry === 1) {
                    offscreen.width = innerModel.getSize().width;
                    offscreen.height = innerModel.getSize().height;
                }
                else {
                    offscreen.width = innerModel.getSize().width * scaling.rx;
                    offscreen.height = innerModel.getSize().height * scaling.ry;
                }
                const c2 = offscreen.getContext('2d');
                if (scaling.rx !== 1 || scaling.ry !== 1) {
                    c2.scale(scaling.rx, scaling.ry);
                }
                innerModel.renderToContext(c2);

                const pattern = c.createPattern(offscreen, 'repeat');
                c.fillStyle = pattern;
                return true;
            }
            c.fillStyle = Color.parse(fill).toStyleString();
            return true;
        }
    }
}
