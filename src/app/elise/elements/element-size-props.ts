import { ElementBase } from './element-base';
import { Size } from '../core/size';

export class ElementSizeProps {
    /**
      Element being sized
    */
    element: ElementBase;

    /**
      Element size
    */
    size: Size;

    /**
      Constructs an element size props
      @classdesc Describes the size of an element
      @param element - Element being sized
      @param size - New element size
    */
    constructor(element: ElementBase, size: Size) {
        this.element = element;
        this.size = size;
    }
}
