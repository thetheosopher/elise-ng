import { SurfaceElement } from './surface-element';
import { Surface } from './surface';

export class LayeredSurfaceElement extends SurfaceElement {
    /**
      True after item has been initialized
    */
    isPrepared: boolean;

    /**
      DOM Element
    */
    element: HTMLElement;

    /**
      Layer opacity
    */
    opacity: number;

    /**
      Layer X Translation
    */
    translateX: number;

    /**
      Layer Y Translation
    */
    translateY: number;

    /**
      Constructs a layered surface element
      @classdesc Base class for layered surface elements
      @extends Elise.Player.SurfaceElement
      @param id - Item id
      @param left - Layout area x coordinate
      @param top - Layout area y coordinate
      @param width - Layout area width
      @param height - Layout area height
    */
    constructor(id: string, left: number, top: number, width: number, height: number) {
        super(id, left, top, width, height);
        this.isPrepared = false;
        this.opacity = 1;
        this.translateX = 0;
        this.translateY = 0;
        this.addToSurface = this.addToSurface.bind(this);
        this.prepare = this.prepare.bind(this);
        this.destroy = this.destroy.bind(this);
        this.onload = this.onload.bind(this);
        this.onunload = this.onunload.bind(this);
        this.setScale = this.setScale.bind(this);
        this.setOpacity = this.setOpacity.bind(this);
        this.setTranslateX = this.setTranslateX.bind(this);
        this.setTranslateY = this.setTranslateY.bind(this);
    }

    /**
      Adds layer to parent surface
      @param surface - Parent surface
    */
    addToSurface(surface: Surface) {}

    /**
      Loads required requires and calls completion callback
    */
    prepare(callback: (result: boolean) => void) {}

    /**
      Tears down and destroys visual elements
    */
    destroy() {}

    /**
      Onload initialization
    */
    onload() {}

    /**
      Onunload teardown
    */
    onunload() {}

    /**
      Sets rendering scale
    */
    setScale(scale: number) {
        return this;
    }

    /**
      Sets rendering opacity
    */
    setOpacity(opacity: number) {
        this.opacity = opacity;
        return this;
    }

    /**
      Sets X translation
    */
    setTranslateX(translateX: number) {
        this.translateX = translateX;
        return this;
    }

    /**
      Sets Y translation
    */
    setTranslateY(translateY: number) {
        this.translateY = translateY;
        return this;
    }
}
