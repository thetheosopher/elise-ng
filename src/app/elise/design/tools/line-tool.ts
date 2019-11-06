import { DesignTool } from './design-tool';
import { Point } from '../../core/point';
import { LineElement } from '../../elements/line-element';
import { MouseLocationArgs } from '../../core/mouse-location-args';

export class LineTool extends DesignTool {
    point1: Point;
    point2: Point;
    line: LineElement = null;
    cancelled: boolean;

    mouseDown(args: MouseLocationArgs): void {
        this.cancelled = false;
        this.line = LineElement.create(args.location.x, args.location.y, args.location.x, args.location.y);
        this.line.setStroke(this.stroke);
        this.line.setInteractive(true).addTo(this.model);
        this.isCreating = true;
        this.controller.invalidate();
    }

    mouseMove(args: MouseLocationArgs) {
        if (this.cancelled) {
            return;
        }
        if (this.line == null) {
            return;
        }
        this.line.setP2(args.location);
        this.controller.invalidate();
    }

    mouseUp(args: MouseLocationArgs) {
        if (this.cancelled) {
            return;
        }
        if (this.line == null) {
            return;
        }
        this.line.setP2(args.location);
        this.controller.invalidate();
        this.line = null;
        this.isCreating = false;
    }

    cancel() {
        this.cancelled = true;
        this.model.remove(this.line);
        this.controller.invalidate();
        this.line = null;
        this.isCreating = false;
    }
}
