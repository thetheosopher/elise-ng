import { ElementBase } from './element-base';
import { Point } from '../core/point';

export class MoveLocation {
    /**
      Element being moved
    */
    element: ElementBase;

    /**
      Tentative location of element
    */
    location: Point;

    /**
      Constructs a move location
      @classdesc Represents the tentative location of an element during a move operation
      @param element - Element being sized
      @param location - Tentative location of element
    */
    constructor(element: ElementBase, location: Point) {
        this.element = element;
        this.location = location;
    }
}
