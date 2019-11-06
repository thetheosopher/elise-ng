import { DesignTool } from './design-tool';
import { Point } from '../../core/point';
import { Size } from '../../core/size';
import { TextElement } from '../../elements/text-element';
import { MouseLocationArgs } from '../../core/mouse-location-args';

export class TextTool extends DesignTool {
    point1: Point;
    textElement: TextElement = null;

    text: string = null;
    typeface: string = null;
    typesize: number;
    typestyle: string = null;
    alignment: string = null;
    cancelled: boolean;

    constructor() {
        super();
        this.typesize = 10;
    }

    mouseDown(args: MouseLocationArgs): void {
        this.cancelled = false;
        this.point1 = Point.create(args.location.x, args.location.y);
        this.textElement = TextElement.create(this.text, args.location.x, args.location.y, 0, 0);
        if (this.stroke) {
            this.textElement.setStroke(this.stroke);
        }
        if (this.fill) {
            this.textElement.setFill(this.fill);
        }
        if (this.fillScale !== 1) {
            this.textElement.setFillScale(this.fillScale);
        }
        this.textElement.alignment = this.alignment;
        this.textElement.typeface = this.typeface;
        this.textElement.typestyle = this.typestyle;
        this.textElement.typesize = this.typesize;
        this.textElement.setInteractive(true).addTo(this.model);
        this.controller.invalidate();
        this.isCreating = true;
    }

    mouseMove(args: MouseLocationArgs) {
        if (this.cancelled) {
            return;
        }
        if (this.textElement == null) {
            return;
        }
        if (args.location.x < this.point1.x || args.location.y < this.point1.y) {
            return;
        }
        this.textElement.setSize(new Size(args.location.x - this.point1.x, args.location.y - this.point1.y));
        this.controller.invalidate();
    }

    mouseUp(args: MouseLocationArgs) {
        if (this.cancelled) {
            return;
        }
        if (this.textElement == null) {
            return;
        }
        if (args.location.x < this.point1.x || args.location.y < this.point1.y) {
            return;
        }
        this.textElement.setSize(new Size(args.location.x - this.point1.x, args.location.y - this.point1.y));
        this.controller.invalidate();
        this.textElement = null;
        this.isCreating = false;
    }

    cancel() {
        this.cancelled = true;
        this.model.remove(this.textElement);
        this.controller.invalidate();
        this.textElement = null;
        this.isCreating = false;
    }
}
