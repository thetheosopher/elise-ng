import { LayeredSurfaceElement } from './layered-surface-element';
import { CommonEvent } from '../core/common-event';
import { EliseException } from '../core/elise-exception';
import { Surface } from './surface';

export class Video extends LayeredSurfaceElement {
    /**
      Video source
    */
    source: string;

    /**
      If true, loop video
    */
    loop: boolean;

    /**
      If true, auto play video on load
    */
    autoPlay: boolean;

    /**
      If true, display native control strip
    */
    nativeControls: boolean;

    /**
      True when video is ready to play
    */
    canPlay: boolean;

    /**
      True when surface has been loaded
    */
    isLoaded: boolean;

    /**
      Video started event (video: Video)
    */
    started: CommonEvent<Video> = new CommonEvent<Video>();

    /**
      Video stopped event (video: Video)
    */
    stopped: CommonEvent<Video> = new CommonEvent<Video>();

    /**
      HTML video element
    */
    element: HTMLVideoElement;

    /**
      Constructs a video item
      @classdesc Renders a video into an HTML video element
      @extends Elise.Player.LayeredSurfaceElement
      @param id - Video id
      @param left - Layout area x coordinate
      @param top - Layout area y coordinate
      @param width - Layout area width
      @param height - Layout area height
      @param source - Video source URL
    */
    constructor(id: string, left: number, top: number, width: number, height: number, source: string) {
        super(id, left, top, width, height);
        this.loop = false;
        this.autoPlay = false;
        this.nativeControls = true;
        this.canPlay = false;
        this.source = source;
    }

    /**
      Constructs a video item
      @classdesc Renders a video into an HTML video element
      @extends Elise.Player.LayeredSurfaceElement
      @param id - Video id
      @param left - Layout area x coordinate
      @param top - Layout area y coordinate
      @param width - Layout area width
      @param height - Layout area height
      @param source - Video source URL
    */
    static create(id: string, left: number, top: number, width: number, height: number, source: string) {
        const video = new Video(id, left, top, width, height, source);
        return video;
    }

    /**
      Adds video to parent surface
      @param surface - Parent surface
    */
    addToSurface(surface: Surface) {
        this.surface = surface;

        // If no source
        if (!this.source) {
            throw new EliseException('No source defined.');
        }

        // Create video element
        const video = document.createElement('video') as HTMLVideoElement;
        video.setAttribute('id', this.id + '_video');
        video.style.position = 'absolute';
        video.style.left = this.translateX + this.left * surface.scale + 'px';
        video.style.top = this.translateY + this.top * surface.scale + 'px';
        video.style.width = this.width * surface.scale + 'px';
        video.style.height = this.height * surface.scale + 'px';
        video.style.opacity = (this.surface.opacity * this.opacity).toString();
        this.element = video;
    }

    /**
      Sets video source and attaches callback for video ready to play
      @param callback - Completion callback (success: boolean)
    */
    prepare(callback: (success: boolean) => void) {
        const self = this;
        const video = self.element;
        if (self.loop) {
            video.setAttributeNode(document.createAttribute('loop'));
        }
        if (self.nativeControls) {
            video.setAttributeNode(document.createAttribute('controls'));
        }

        self.surface.div.appendChild(self.element);
        self.element.src = self.source;
        video.oncanplay = function() {
            self.canPlay = true;
            if (self.isLoaded && self.autoPlay) {
                video.play();
            }
            delete video.oncanplay;
        };
        self.isPrepared = true;
        if (callback) {
            callback(true);
        }
    }

    /**
      Unloads video and destroys visual elements
    */
    destroy() {
        if (this.element) {
            this.element.parentElement.removeChild(this.element);
            delete this.element;
        }
        delete this.surface;
    }

    /**
      Onload initialization
    */
    onload() {
        const video = this.element;
        this.isLoaded = true;
        if (this.canPlay && this.autoPlay) {
            video.currentTime = 0;
            video.play();
        }
    }

    /**
      Onunload teardown
    */
    onunload() {
        if (this.element) {
            const video = this.element;
            video.pause();
        }
    }

    /**
      Sets rendering scale
    */
    setScale(scale: number) {
        if (!this.element) { return; }
        const layer = this.element as HTMLVideoElement;
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
