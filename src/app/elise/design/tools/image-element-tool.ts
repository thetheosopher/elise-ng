import { DesignTool } from './design-tool';
import { Point } from '../../core/point';
import { Size } from '../../core/size';
import { ImageElement } from '../../elements/image-element';
import { MouseLocationArgs } from '../../core/mouse-location-args';

export class ImageElementTool extends DesignTool {
    point1: Point;
    source: string;
    imageElement: ImageElement = null;

    cancelled: boolean;

    constructor() {
        super();
        this.setImageSource = this.setImageSource.bind(this);
    }

    mouseDown(args: MouseLocationArgs): void {
        this.cancelled = false;
        this.point1 = Point.create(args.location.x, args.location.y);
        this.imageElement = ImageElement.create(this.source, args.location.x, args.location.y, 0, 0);
        if (this.opacity !== 255) {
            this.imageElement.setOpacity(this.opacity / 255.0);
        }
        if (this.stroke) {
            this.imageElement.setStroke(this.stroke);
        }
        this.imageElement.setInteractive(true).addTo(this.model);
        this.controller.invalidate();
        this.isCreating = true;
    }

    mouseMove(args: MouseLocationArgs) {
        if (this.cancelled) {
            return;
        }
        if (this.imageElement == null) {
            return;
        }
        if (args.location.x < this.point1.x || args.location.y < this.point1.y) {
            return;
        }
        this.imageElement.setSize(new Size(args.location.x - this.point1.x, args.location.y - this.point1.y));
        this.controller.invalidate();
    }

    mouseUp(args: MouseLocationArgs) {
        if (this.cancelled) {
            return;
        }
        if (this.imageElement == null) {
            return;
        }
        if (args.location.x < this.point1.x || args.location.y < this.point1.y) {
            return;
        }
        this.imageElement.setSize(new Size(args.location.x - this.point1.x, args.location.y - this.point1.y));
        this.controller.invalidate();
        this.imageElement = null;
        this.isCreating = false;
    }

    cancel() {
        this.cancelled = true;
        this.model.remove(this.imageElement);
        this.controller.invalidate();
        this.imageElement = null;
        this.isCreating = false;
    }

    setImageSource(source: string) {
        this.source = source;
        const resource = this.model.resourceManager.get(this.source);
        if (!resource.available) {
            this.model.resourceManager.register(this.source);
            this.model.resourceManager.load();
        }
    }
}
