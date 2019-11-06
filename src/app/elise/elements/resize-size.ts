import { ElementBase } from './element-base';
import { Size } from '../core/size';

export class ResizeSize {
    /**
      Element being sized
    */
    element: ElementBase;

    /**
      Tentative size of element
    */
    size: Size;

    /**
      Constructs a resize size
      @classdesc Represents the tentative size of an element during a resizing operation
      @param element - Element being sized
      @param size - Tentative size of element
    */
    constructor(element: ElementBase, size: Size) {
        this.element = element;
        this.size = size;
    }
}
