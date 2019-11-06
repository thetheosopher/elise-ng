import { LayeredSurfaceElement } from './layered-surface-element';
import { CommonEvent } from '../core/common-event';
import { Surface } from './surface';

export class HiddenLayer extends LayeredSurfaceElement {
    /**
      Clicked event
    */
    clicked: CommonEvent<HiddenLayer> = new CommonEvent<HiddenLayer>();

    /**
      HTML div element
    */
    element: HTMLDivElement;

    /**
      Constructs a hidden layer
      @classdesc Renders a transparent HTML div element for capturing click event
      @param id - Layer id
      @param left - Layout area x coordinate
      @param top - Layout area y coordinate
      @param width - Layout area width
      @param height - Layout area height
      @param clickListener - Click event listener
    */
    constructor(
        id: string,
        left: number,
        top: number,
        width: number,
        height: number,
        clickListener: (hiddenLayer: HiddenLayer) => void
    ) {
        super(id, left, top, width, height);
        if (clickListener) {
            this.clicked.add(clickListener);
        }
    }

    /**
      Creates a hidden div layer
      @method Elise.Player.Surface#addHidden
      @param id - Hidden layer id
      @param left - Layout area x coordinate
      @param top - Layout area y coordinate
      @param width - Layout area width
      @param height - Layout area height
      @param source - Image source URL
      @param clickListener - Click event listener
      @returns New hidden layer
    */
    static create(
        id: string,
        left: number,
        top: number,
        width: number,
        height: number,
        clickListener: (hiddenLayer: HiddenLayer) => void
    ) {
        const layer = new HiddenLayer(id, left, top, width, height, clickListener);
        return layer;
    }

    /**
      Adds hidden layer to parent surface
      @param surface - Parent surface
    */
    addToSurface(surface: Surface) {
        this.surface = surface;

        // Create div element
        const hiddenLayer = document.createElement('div');
        hiddenLayer.setAttribute('id', this.id + '_div');
        hiddenLayer.style.position = 'absolute';
        hiddenLayer.style.left = this.translateX + this.left * surface.scale + 'px';
        hiddenLayer.style.top = this.translateY + this.top * surface.scale + 'px';
        hiddenLayer.style.width = this.width * surface.scale + 'px';
        hiddenLayer.style.height = this.height * surface.scale + 'px';
        this.element = hiddenLayer;
    }

    /**
      Attaches click event handler
      @param callback - Completion callback (success: boolean)
    */
    prepare(callback: (success: boolean) => void) {
        const self = this;
        self.surface.div.appendChild(self.element);
        self.element.onclick = function() {
            self.clicked.trigger(self);
        };
        self.isPrepared = true;
        if (callback) {
            callback(true);
        }
    }

    /**
      Unloads div element
      @method Elise.Player.HiddenLayer#destroy
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
        const layer = this.element as HTMLDivElement;
        layer.style.left = this.translateX + this.left * scale + 'px';
        layer.style.top = this.translateY + this.top * scale + 'px';
        layer.style.width = this.width * scale + 'px';
        layer.style.height = this.height * scale + 'px';
        return this;
    }

    /**
      Sets X translation
      @method Elise.Player.HiddenLayer#setTranslateX
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
      @method Elise.Player.HiddenLayer#setTranslateY
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
