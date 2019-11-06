import { DesignTool } from './design-tool';
import { Point } from '../../core/point';
import { LineElement } from '../../elements/line-element';
import { PolygonElement } from '../../elements/polygon-element';
import { MouseLocationArgs } from '../../core/mouse-location-args';

export class PolygonTool extends DesignTool {
    points: Point[] = null;
    lastPoint: Point = null;
    polygon: PolygonElement = null;
    line: LineElement = null;

    mouseDown(args: MouseLocationArgs): void {
        if (!this.points || this.points.length === 0) {
            this.points = [];
            this.points.push(new Point(args.location.x, args.location.y));
            this.points.push(new Point(args.location.x, args.location.y));
            this.lastPoint = this.points[this.points.length - 1];
            this.line = LineElement.create(this.points[0].x, this.points[0].y, this.points[1].x, this.points[1].y);
            this.line.setStroke(this.stroke);
            this.line.setInteractive(true).addTo(this.model);
            this.isCreating = true;
        }
        else {
            if (this.line != null) {
                this.model.remove(this.line);
                this.line = null;
                this.polygon = PolygonElement.create();
                this.polygon.setStroke(this.stroke);
                this.polygon.setFill(this.fill);
                if (this.fillScale !== 1) {
                    this.polygon.setFillScale(this.fillScale);
                }
                this.polygon.setInteractive(true).addTo(this.model);
                this.lastPoint.x = args.location.x;
                this.lastPoint.y = args.location.y;
                for (let i = 0; i < this.points.length; i++) {
                    this.polygon.addPoint(this.points[i].clone());
                }
                const point = new Point(args.location.x, args.location.y);
                this.lastPoint = point;
                this.polygon.addPoint(this.lastPoint);
                this.points.push(point);
            }
            else if (this.polygon != null) {
                const point = new Point(args.location.x, args.location.y);
                this.points.push(point);
                this.lastPoint = point;
                this.polygon.addPoint(this.lastPoint);
            }
        }
        this.controller.invalidate();
    }

    mouseMove(args: MouseLocationArgs) {
        if (this.line === null && this.polygon === null) {
            return;
        }
        if (this.line != null) {
            this.line.setP2(args.location);
        }
        else if (this.lastPoint != null) {
            this.lastPoint.x = args.location.x;
            this.lastPoint.y = args.location.y;
        }
        this.controller.invalidate();
    }

    mouseUp(args: MouseLocationArgs) {}

    cancel() {
        if (this.line !== null) {
            this.model.remove(this.line);
            this.line = null;
        }
        else if (this.polygon !== null) {
            this.points.splice(this.points.length - 1);
            if (this.points.length < 3) {
                this.model.remove(this.polygon);
            }
            else {
                this.polygon.setPoints(this.points);
            }
        }
        this.line = null;
        this.polygon = null;
        this.points = null;
        this.lastPoint = null;
        this.controller.invalidate();
        this.isCreating = false;
    }
}
