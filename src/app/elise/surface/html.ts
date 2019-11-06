import { LayeredSurfaceElement } from './layered-surface-element';
import { EliseException } from '../core/elise-exception';
import { Surface } from './surface';

export class HTML extends LayeredSurfaceElement {
    /**
      HTML IFrame source
    */
    source: string;

    /**
      HTML IFrame scrolling attribute
    */
    scrolling: string;

    /**
      If true HTML IFrame sandbox is enabled
    */
    sandbox: boolean;

    /**
      If true HTML IFrame contents is scaled to parent surface scale factor
    */
    scaleContent: boolean;

    /**
      Host HTML IFrame element
    */
    element: HTMLIFrameElement;

    /**
      Constructs an HTML item
      @classdesc Renders HTML content into an IFrame element
      @extends Elise.Player.LayeredSurfaceElement
      @param id - HTML layer id
      @param left - Layout area x coordinate
      @param top - Layout area y coordinate
      @param width - Layout area width
      @param height - Layout area height
      @param source - HTML source URL
    */
    constructor(id: string, left: number, top: number, width: number, height: number, source: string) {
        super(id, left, top, width, height);
        this.scrolling = 'auto';
        this.sandbox = true;
        this.source = source;
        this.scaleContent = true;
    }

    /**
      Creates an HTML item
      @param id - Hidden layer id
      @param left - Layout area x coordinate
      @param top - Layout area y coordinate
      @param width - Layout area width
      @param height - Layout area height
      @param source - HTML source URL
      @returns New HTML layer
    */
    static create(id: string, left: number, top: number, width: number, height: number, source: string) {
        const layer = new HTML(id, left, top, width, height, source);
        return layer;
    }

    /**
      Adds HTML layer to parent surface
      @param surface - Parent surface
    */
    addToSurface(surface: Surface) {
        this.surface = surface;

        // If no source
        if (!this.source) {
            throw new EliseException('No source defined.');
        }

        // Create iFrame for content
        const iframe = document.createElement('iframe');
        iframe.setAttribute('id', this.id + '_iframe');
        if (this.sandbox) {
            iframe.setAttribute('sandbox', 'allow-forms allow-popups allow-same-origin allow-scripts');
        }
        iframe.style.position = 'absolute';
        iframe.style.left = this.translateX + this.left * surface.scale + 'px';
        iframe.style.top = this.translateY + this.top * surface.scale + 'px';
        if (this.scaleContent) {
            iframe.style.width = this.width + 'px';
            iframe.style.height = this.height + 'px';
        }
        else {
            iframe.style.width = this.width * surface.scale + 'px';
            iframe.style.height = this.height * surface.scale + 'px';
        }
        iframe.style.border = '0px';

        if (this.scaleContent) {
            iframe.style.transform = 'scale(' + surface.scale + ')';
            iframe.style.transformOrigin = '0 0';
        }
        iframe.style.opacity = (this.surface.opacity * this.opacity).toString();
        iframe.scrolling = this.scrolling;
        this.element = iframe;
    }

    /**
      Sets HTML source and adds element to DOM
      @param callback - Completion callback (success: boolean)
    */
    prepare(callback: (success: boolean) => void) {
        this.surface.div.appendChild(this.element);
        this.element.src = this.source;
        this.isPrepared = true;
        if (callback) {
            callback(true);
        }
    }

    /**
      Unloads HTML layer and destroys visual elements
      @method Elise.Player.HTML#destroy
    */
    destroy() {
        if (this.element) {
            this.element.parentElement.removeChild(this.element);
            delete this.element;
        }
        delete this.surface;
    }

    /**
      Onload initialization. Sets IFrame source
      @method Elise.Player.HTML#onload
    */
    onload() {
        if (this.element) {
            this.element.src = this.source;
        }
    }

    /**
      Onunload teardown
      @method Elise.Player.HTML#onunload
    */
    onunload() {
        if (this.element) {
            this.element.src = 'about:blank';
        }
    }

    /**
      Sets rendering scale
    */
    setScale(scale: number) {
        if (!this.element) { return; }
        const iframe = this.element as HTMLIFrameElement;
        iframe.style.left = this.translateX + this.left * scale + 'px';
        iframe.style.top = this.translateY + this.top * scale + 'px';
        if (this.scaleContent) {
            iframe.style.width = this.width + 'px';
            iframe.style.height = this.height + 'px';
        }
        else {
            iframe.style.width = this.width * scale + 'px';
            iframe.style.height = this.height * scale + 'px';
        }
        iframe.style.border = '0px';

        if (this.scaleContent) {
            iframe.style.transform = 'scale(' + scale + ')';
            iframe.style.transformOrigin = '0 0';
        }
        return this;
    }

    /**
      Sets rendering opacity
      @method Elise.Player.HTML#setOpacity
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
      @method Elise.Player.HTML#setTranslateX
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
      @method Elise.Player.HTML#setTranslateY
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
