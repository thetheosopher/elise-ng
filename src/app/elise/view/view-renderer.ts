import { ViewController } from './view-controller';
import { Region } from '../core/region';
import { ElementBase } from '../elements/element-base';
import { FillFactory } from '../fill/fill-factory';

export class ViewRenderer {
    /**
      View controller
    */
    controller: ViewController;

    /**
      Constructs a new view renderer
      @classdesc Renders model content for viewing
      @param controller - Associated view controller
    */
    constructor(controller: ViewController) {
        this.controller = controller;
    }

    /**
      Renders controller model to provided 2d canvas context at specified scale
      @param c - Rendering context
      @param scale - Optional rendering scale. Default is 1.
    */
    renderToContext(c: CanvasRenderingContext2D, scale?: number): void {
        const model = this.controller.model;
        const w = model.getSize().width;
        const h = model.getSize().height;

        // Begin rendering context and render base model
        this.beginRender(c, scale);

        // Render elements
        const modelBounds = new Region(this.controller.offsetX, this.controller.offsetY, w, h);
        for (let i = 0; i < model.elements.length; i++) {
            const element = model.elements[i];
            if (this.shouldRender(element, modelBounds)) {
                element.draw(c);
            }
        }

        // End rendering context
        this.endRender(c);
    }

    beginRender(c: CanvasRenderingContext2D, scale?: number) {
        const model = this.controller.model;

        // Save context state
        c.save();

        if (arguments.length > 1 && scale !== 1) {
            c.scale(scale, scale);
        }

        // If transformed
        if (model.transform !== undefined) {
            model.setRenderTransform(c, model.transform, model.getLocation());
        }

        // Fill
        if (FillFactory.setElementFill(c, model)) {
            const w = model.getSize().width;
            const h = model.getSize().height;
            c.fillRect(0, 0, w, h);
        }
    }

    renderElement(c: CanvasRenderingContext2D, el: ElementBase) {
        el.draw(c);
    }

    endRender(c: CanvasRenderingContext2D) {
        const model = this.controller.model;

        // Stroke
        if (model.setElementStroke(c, model)) {
            const w = model.getSize().width;
            const h = model.getSize().height;
            c.strokeRect(0, 0, w, h);
        }

        // Restore context state
        c.restore();
    }

    /**
      Determines if element intersect rendering region and should be rendered or is out of bounds
      @param el - Rendered element
      @param bounds - Rendering region
      @returns True if element should be rendered
    */
    shouldRender(el: ElementBase, bounds: Region): boolean {
        // If no transform, check bounds
        if (!el.transform) {
            const b = el.getBounds();
            return b.intersectsWith(bounds);
        }
        else {
            // If transform, always render
            // TODO - Compute transformed bounds
            return true;
        }
    }
}
