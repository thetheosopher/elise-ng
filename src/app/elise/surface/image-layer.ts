import { LayeredSurfaceElement } from './layered-surface-element';
import { CommonEvent } from '../core/common-event';
import { EliseException } from '../core/elise-exception';
import { Surface } from './surface';

export class ImageLayer extends LayeredSurfaceElement {
    /**
      Image source
    */
    source: string;

    /**
      Clicked event
    */
    clicked: CommonEvent<ImageLayer> = new CommonEvent<ImageLayer>();

    /**
      HTML image element
    */
    element: HTMLImageElement;

    /**
      Constructs an image layer
      @classdesc Renders an image into an HTML image element
      @extends Elise.Player.LayeredSurfaceElement
      @param id - Image layer id
      @param left - Layout area x coordinate
      @param top - Layout area y coordinate
      @param width - Layout area width
      @param height - Layout area height
      @param source - Image source URL
      @param clickListener - Click event listener
    */
    constructor(
        id: string,
        left: number,
        top: number,
        width: number,
        height: number,
        source: string,
        clickListener: (image: ImageLayer) => void
    ) {
        super(id, left, top, width, height);
        this.source = source;
        if (clickListener) {
            this.clicked.add(clickListener);
        }
    }

    /**
      Creates an image layer
      @method Elise.Player.Surface#addImage
      @param id - Image id
      @param left - Layout area x coordinate
      @param top - Layout area y coordinate
      @param width - Layout area width
      @param height - Layout area height
      @param source - Image source URL
      @param clickListener - Click event listener
      @returns New image layer
    */
    static create(
        id: string,
        left: number,
        top: number,
        width: number,
        height: number,
        source: string,
        clickListener: (image: ImageLayer) => void
    ) {
        const layer = new ImageLayer(id, left, top, width, height, source, clickListener);
        return layer;
    }

    /**
      Adds image layer to parent surface
      @param surface - Parent surface
    */
    addToSurface(surface: Surface) {
        this.surface = surface;

        // If no source
        if (!this.source) {
            throw new EliseException('No source defined.');
        }

        // Create Image element
        const imageLayer = document.createElement('img');
        imageLayer.setAttribute('id', this.id + '_image');
        imageLayer.style.position = 'absolute';
        imageLayer.style.left = this.translateX + this.left * surface.scale + 'px';
        imageLayer.style.top = this.translateY + this.top * surface.scale + 'px';
        imageLayer.style.width = this.width * surface.scale + 'px';
        imageLayer.style.height = this.height * surface.scale + 'px';
        imageLayer.style.opacity = (this.surface.opacity * this.opacity).toString();
        this.element = imageLayer;
    }

    /**
      Sets image source and attaches click event handler
      @param callback - Completion callback (success: boolean)
    */
    prepare(callback: (success: boolean) => void) {
        const self = this;
        const imageLayer = self.element;
        self.surface.div.appendChild(self.element);
        self.element.src = self.source;
        imageLayer.onclick = function() {
            self.clicked.trigger(self);
        };
        self.isPrepared = true;
        if (callback) {
            callback(true);
        }
    }

    /**
      Unloads image layer and destroys visual elements
    */
    destroy() {
        if (this.element) {
            this.element.parentElement.removeChild(this.element);
            delete this.element;
        }
        delete this.surface;
    }

    /**
      Sets rendering scale
    */
    setScale(scale: number) {
        if (!this.element) { return; }
        const layer = this.element as HTMLImageElement;
        layer.style.left = this.translateX + this.left * scale + 'px';
        layer.style.top = this.translateY + this.top * scale + 'px';
        layer.style.width = this.width * scale + 'px';
        layer.style.height = this.height * scale + 'px';
        return this;
    }

    /**
      Sets rendering opacity
    */
    setOpacity(opacity: number) {
        this.opacity = opacity;
        if (this.element) {
            this.element.style.opacity = (this.surface.opacity * this.opacity).toString();
        }
        return this;
    }

    /**
      Sets X translation
      @method Elise.Player.ImageLayer#setTranslateX
    */
    setTranslateX(translateX: number) {
        this.translateX = translateX;
        if (this.element) {
            this.element.style.left = (this.translateX + this.left) * this.surface.scale + 'px';
        }
        return this;
    }

    /**
      Sets Y translation
      @method Elise.Player.ImageLayer#setTranslateY
    */
    setTranslateY(translateY: number) {
        this.translateY = translateY;
        if (this.element) {
            this.element.style.top = (this.translateY + this.top) * this.surface.scale + 'px';
        }
        return this;
    }

    addTo(surface: Surface) {
        surface.layers.push(this);
        return this;
    }
}
