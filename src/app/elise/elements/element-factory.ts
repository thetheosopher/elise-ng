import { ElementBase } from './element-base';
import { IElementCreator } from './element-creator';
import { ElementCreatorRegistration } from './element-creator-registration';

import { ImageElement } from './image-element';
import { SpriteElement } from './sprite-element';
import { RectangleElement } from './rectangle-element';
import { LineElement } from './line-element';
import { PolylineElement } from './polyline-element';
import { PolygonElement } from './polygon-element';
import { PathElement } from './path-element';
import { EllipseElement } from './ellipse-element';
import { TextElement } from './text-element';
import { ModelElement } from './model-element';

export class ElementFactory {
    /**
      @classdesc Central registy of element creators
    */
    constructor() {}

    /**
      Element creators
    */
    static ElementCreators: ElementCreatorRegistration[] = [];

    /**
      Register a new element creator
      @param name - Name
      @param creator - Element creator
    */
    static registerCreator(name: string, creator: IElementCreator) {
        ElementFactory.ElementCreators.push(new ElementCreatorRegistration(name, creator));
    }

    /**
      Create a new element given its type tag
      @param name - Element type tag
      @returns New element
    */
    static create(name: string): ElementBase {
        for (let i = 0; i < ElementFactory.ElementCreators.length; i++) {
            const ec = ElementFactory.ElementCreators[i];
            if (ec.name === name) {
                return ec.creator.create();
            }
        }
        return undefined;
    }
}

/* Register element creators */
ElementFactory.registerCreator('image', ImageElement);
ElementFactory.registerCreator('sprite', SpriteElement);
ElementFactory.registerCreator('rectangle', RectangleElement);
ElementFactory.registerCreator('line', LineElement);
ElementFactory.registerCreator('polyline', PolylineElement);
ElementFactory.registerCreator('polygon', PolygonElement);
ElementFactory.registerCreator('path', PathElement);
ElementFactory.registerCreator('ellipse', EllipseElement);
ElementFactory.registerCreator('text', TextElement);
ElementFactory.registerCreator('model', ModelElement);
