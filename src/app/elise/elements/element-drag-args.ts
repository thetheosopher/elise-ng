import { ElementBase } from './element-base';

export class ElementDragArgs {
    /**
      Model element
    */
    element: ElementBase;

    /**
      Drag Event
    */
    event: DragEvent;

    /**
      Constructs an element drag args
      @classdesc Describes an element drag event
      @param element - Model element
      @param event - Mouse drag event
    */
    constructor(element: ElementBase, event: DragEvent) {
        this.element = element;
        this.event = event;
    }
}
