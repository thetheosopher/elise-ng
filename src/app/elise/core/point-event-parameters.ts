import { Point } from './point';
import { MousePositionInfo } from './mouse-position-info';

export class PointEventParameters {
    /**
      Point at which the event occurred adjusted to model coordinates
    */
    point: Point;

    /**
      DOM source event
    */
    event: Event;

    /**
      Constructs a new PointEventParameters
      @classdesc Represents a DOM point related event
      @param event - Source DOM event
      @param point - Model scale adjusted point at which event occurred
    */
    constructor(event: Event | MousePositionInfo, point?: Point) {
        if (event instanceof Event) {
            this.event = event;
        }
        if (arguments.length === 2) {
            this.point = point;
        }
    }
}
