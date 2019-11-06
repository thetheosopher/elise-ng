import { DesignTool } from './design-tool';
import { Point } from '../../core/point';
import { Size } from '../../core/size';
import { ModelElement } from '../../elements/model-element';
import { MouseLocationArgs } from '../../core/mouse-location-args';

export class ModelElementTool extends DesignTool {
    point1: Point;
    source: string;
    modelElement: ModelElement = null;

    cancelled: boolean;

    constructor() {
        super();
        this.setModelSource = this.setModelSource.bind(this);
    }

    mouseDown(args: MouseLocationArgs): void {
        this.cancelled = false;
        this.point1 = Point.create(args.location.x, args.location.y);
        this.modelElement = ModelElement.create(this.source, args.location.x, args.location.y, 0, 0);
        if (this.opacity !== 255) {
            this.modelElement.setOpacity(this.opacity / 255.0);
        }
        if (this.stroke) {
            this.modelElement.setStroke(this.stroke);
        }
        this.modelElement.setInteractive(true).addTo(this.model);
        this.controller.invalidate();
        this.isCreating = true;
    }

    mouseMove(args: MouseLocationArgs) {
        if (this.cancelled) {
            return;
        }
        if (this.modelElement == null) {
            return;
        }
        if (args.location.x < this.point1.x || args.location.y < this.point1.y) {
            return;
        }
        this.modelElement.setSize(new Size(args.location.x - this.point1.x, args.location.y - this.point1.y));
        this.controller.invalidate();
    }

    mouseUp(args: MouseLocationArgs) {
        if (this.cancelled) {
            return;
        }
        if (this.modelElement == null) {
            return;
        }
        if (args.location.x < this.point1.x || args.location.y < this.point1.y) {
            return;
        }
        this.modelElement.setSize(new Size(args.location.x - this.point1.x, args.location.y - this.point1.y));
        this.controller.invalidate();
        this.modelElement = null;
        this.isCreating = false;
    }

    cancel() {
        this.cancelled = true;
        this.model.remove(this.modelElement);
        this.controller.invalidate();
        this.modelElement = null;
        this.isCreating = false;
    }

    setModelSource(source: string) {
        this.source = source;
        const resource = this.model.resourceManager.get(this.source);
        if (!resource.available) {
            this.model.resourceManager.register(this.source);
            this.model.resourceManager.load();
        }
    }
}
