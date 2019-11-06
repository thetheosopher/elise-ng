import { DesignTool } from './design-tool';
import { Point } from '../../core/point';
import { RectangleElement } from '../../elements/rectangle-element';
import { MouseLocationArgs } from '../../core/mouse-location-args';
import { Size } from '../../core/size';

export class RectangleTool extends DesignTool {
    point1: Point;
    rectangle: RectangleElement = null;
    cancelled: boolean;

    mouseDown(args: MouseLocationArgs): void {
        this.cancelled = false;
        this.point1 = Point.create(args.location.x, args.location.y);
        this.rectangle = RectangleElement.create(args.location.x, args.location.y, 0, 0);
        if (this.stroke) {
            this.rectangle.setStroke(this.stroke);
        }
        if (this.fill) {
            this.rectangle.setFill(this.fill);
        }
        if (this.fillScale !== 1) {
            this.rectangle.setFillScale(this.fillScale);
        }
        this.rectangle.setInteractive(true).addTo(this.model);
        this.controller.invalidate();
        this.isCreating = true;
    }

    mouseMove(args: MouseLocationArgs) {
        if (this.cancelled) {
            return;
        }
        if (this.rectangle == null) {
            return;
        }
        if (args.location.x < this.point1.x || args.location.y < this.point1.y) {
            return;
        }
        this.rectangle.setSize(new Size(args.location.x - this.point1.x, args.location.y - this.point1.y));
        this.controller.invalidate();
    }

    mouseUp(args: MouseLocationArgs) {
        if (this.cancelled) {
            return;
        }
        if (this.rectangle == null) {
            return;
        }
        if (args.location.x < this.point1.x || args.location.y < this.point1.y) {
            return;
        }
        this.rectangle.setSize(new Size(args.location.x - this.point1.x, args.location.y - this.point1.y));
        this.controller.invalidate();
        this.rectangle = null;
        this.isCreating = false;
    }

    cancel() {
        this.cancelled = true;
        this.model.remove(this.rectangle);
        this.controller.invalidate();
        this.rectangle = null;
        this.isCreating = false;
    }
}
