import { ElementCommandHandler } from '../command/element-command-handler';
import { CommonEvent } from '../core/common-event';
import { Model } from '../core/model';
import { Utility } from '../core/utility';
import { ElementBase } from '../elements/element-base';
import { ImageElement } from '../elements/image-element';
import { SpriteElement } from '../elements/sprite-element';
import { BitmapResource } from '../resource/bitmap-resource';
import { ResourceManager, ResourceManagerEvent, ResourceState } from '../resource/resource';
import { ElementStates } from './element-states';
import { LayeredSurfaceElement } from './layered-surface-element';
import { SurfaceButton } from './surface-button';
import { SurfaceElement } from './surface-element';
import { SurfaceViewController } from './surface-view-controller';
import { Text } from './text';
import { Video } from './video';

export class Surface {
    /**
      Surface width
    */
    width: number;

    /**
      Surface height
    */
    height: number;

    /**
      Surface id
    */
    id: string;

    /**
      Rendering scale
    */
    scale: number;

    /**
      Rendering opacity (0-1)
    */
    opacity: number;

    /**
      Error event handler
    */
    error: CommonEvent<string> = new CommonEvent<string>();

    /**
      Background color as string
    */
    backgroundColor: string = null;

    /**
      Normal state image URL
    */
    normalImageSource: string = null;

    /**
      Selected state image URL
    */
    selectedImageSource: string = null;

    /**
      Highlighted state image URL
    */
    highlightedImageSource: string = null;

    /**
      Disabled state image URL
    */
    disabledImageSource: string = null;

    /**
      Base model layer elements
    */
    elements: SurfaceElement[] = [];

    /**
      Base model layer elements
    */
    layers: LayeredSurfaceElement[] = [];

    /**
      Loaded event called when all resources have been loaded or have failed (success: boolean)
    */
    loaded: CommonEvent<boolean> = new CommonEvent<boolean>();

    /**
      Loaded event called after controller has been initialized
    */
    initialized: CommonEvent<SurfaceViewController> = new CommonEvent<SurfaceViewController>();

    /**
      Hosting HTML div
    */
    hostDiv: HTMLDivElement;

    /**
      Resource state listener (rm: Elise.ResourceManager, state: Elise.ResourceState)
    */
    resourceListenerEvent: ResourceManagerEvent<ResourceState> = new ResourceManagerEvent<ResourceState>();

    /**
      Surface view controller
    */
    controller: SurfaceViewController;

    /**
      Surface div element
    */
    div: HTMLDivElement;

    /**
      Surface drawing model
    */
    model: Model;

    /**
      True if child surface of another surface
    */
    isChild: boolean;

    /**
      X translation
    */
    translateX: number;

    /**
      Y translation
    */
    translateY: number;

    /**
      Constructs a player surface
      @classdesc Base elements derived from surface images and layered media elements
      @class Elise.Player.Surface
      @param {number} width - Surface width
      @param {number} height - Surface height
      @param {string} id - Surface id
      @param {number} scale - Rendering scale
    */
    constructor(width: number, height: number, id?: string, scale?: number) {
        this.width = width;
        this.height = height;
        if (id) {
            this.id = id;
        }
        else {
            this.id = Utility.guid();
        }
        if (scale !== undefined && scale > 0) {
            this.scale = scale;
        }
        else {
            this.scale = 1.0;
        }
        this.opacity = 1;
        this.translateX = 0;
        this.translateY = 0;

        this.createDiv = this.createDiv.bind(this);
        this.initializeController = this.initializeController.bind(this);
        this.elementWithId = this.elementWithId.bind(this);
        this.layerWithId = this.layerWithId.bind(this);
        this.bind = this.bind.bind(this);
        this.unbind = this.unbind.bind(this);
        this.scaledValue = this.scaledValue.bind(this);
        this.createModel = this.createModel.bind(this);
        this.loadResources = this.loadResources.bind(this);
        this.onErrorInternal = this.onErrorInternal.bind(this);
        this.addResourceListener = this.addResourceListener.bind(this);
        this.setOpacity = this.setOpacity.bind(this);
        this.setTranslateX = this.setTranslateX.bind(this);
        this.setTranslateY = this.setTranslateY.bind(this);
        this.startVideos = this.startVideos.bind(this);
    }

    /**
      Surface factory function
      @member Elise.Player.Surface#create
      @param {number} width - Surface width
      @param {number} height - Surface height
      @param {string} id - Surface id
      @param {number} scale - Rendering scale
      @returns {Elise.Player.Surface} New surface
    */
    static create(width: number, height: number, id: string, scale: number) {
        return new Surface(width, height, id, scale);
    }

    /**
     *
    */
    createDiv(onBottom?: boolean) {
        const div = document.createElement('div');
        div.id = this.id + '_div';
        this.div = div;
        if (this.isChild) {
            div.style.position = 'absolute';
            div.style.left = this.translateX * this.scale + 'px';
            div.style.top = this.translateY * this.scale + 'px';
        }
        else {
            div.style.position = 'relative';
        }
        div.style.opacity = this.opacity.toString();
        if (onBottom) {
            this.hostDiv.insertBefore(this.div, this.hostDiv.firstElementChild);
        }
        else {
            this.hostDiv.appendChild(this.div);
        }
    }

    /**
      Initializes host HTML div, view controller and command handlers
    */
    initializeController() {
        const self = this;

        self.controller = new SurfaceViewController();
        self.controller.setModel(self.model);
        self.controller.setScale(self.scale);
        self.controller.bindTarget(self.div);
        self.controller.surface = self;

        const ech = new ElementCommandHandler();
        ech.attachController(this.controller);
        ech.addHandler('pushFrame', ElementCommandHandler.pushFrame);
        ech.addHandler('popFrame', ElementCommandHandler.popFrame);

        // Bind command handler event handlers to element event trigger functions
        ech.addHandler(SurfaceButton.BUTTON_CLICK, function(
            c: SurfaceViewController,
            el: SpriteElement,
            command: string,
            trigger: string,
            parameters: any
        ) {
            const button = c.surface.elementWithId(el.id) as SurfaceButton;
            button.onClicked();
        });

        ech.addHandler(Text.TEXT_CLICK, function(
            c: SurfaceViewController,
            el: ElementBase,
            command: string,
            trigger: string,
            parameters: any
        ) {
            const text = c.surface.elementWithId(el.id) as Text;
            text.onClicked();
        });

        self.layers.forEach(function(layer) {
            if (layer.element) {
                self.div.appendChild(layer.element);
            }
        });

        self.initialized.trigger(self.controller);
    }

    /**
      Returns first element found with given ID
      @returns Element with given ID or null if not found
    */
    elementWithId(id: string) {
        for (let i = 0; i < this.elements.length; i++) {
            const el = this.elements[i];
            if (el.id === id) {
                return el;
            }
        }
        return null;
    }

    /**
      Returns first layered element found with given ID
      @returns Layered element with given ID or null if not found
    */
    layerWithId(id: string) {
        for (let i = 0; i < this.elements.length; i++) {
            const layer = this.layers[i];
            if (layer.id === id) {
                return layer;
            }
        }
        return null;
    }

    /**
      Creates internal model if necessary, binds to host element and calls completion callback
      @param hostDiv - Hosting div element
      @callback Completion callback (surface: Surface)
    */
    bind(hostDiv: HTMLDivElement, callback: (surface: Surface) => void, onBottom: boolean) {
        const self = this;
        if (self.controller) {
            self.onErrorInternal('Surface is already bound.');
            return;
        }
        self.hostDiv = hostDiv;
        self.createDiv(onBottom);
        if (self.model) {
            self.initializeController();
            if (callback) {
                callback(self);
            }
        }
        else {
            self.createModel(function() {
                if (self.model) {
                    self.initializeController();
                    if (callback) {
                        callback(self);
                    }
                }
            });
        }
    }

    /**
      Unbinds from and destroys host element
    */
    unbind() {
        if (!this.controller) {
            return;
        }

        if (this.div) {
            this.hostDiv.removeChild(this.div);
        }

        // Destroy layer elements
        this.layers.forEach(function(layer) {
            layer.destroy();
        });

        // Clear event handlers
        this.resourceListenerEvent.clear();
        this.controller.mouseEnteredElement.clear();
        this.controller.mouseLeftElement.clear();
        this.controller.mouseDownElement.clear();
        this.controller.mouseUpElement.clear();
        this.controller.elementClicked.clear();
        this.controller.commandHandler = null;
        this.controller.timer = null;
        this.controller.detach();
        delete this.controller;
        delete this.div;
        delete this.hostDiv;
    }

    /**
      Called after all resources have been loaded to initialize surface elements
    */
    onload() {
        // Call onload on all layer elements
        this.layers.forEach(function(layer) {
            layer.onload();
        });
    }

    /**
      Called when surface is being unloaded to unload resources
    */
    onunload() {
        // Call onunload on all layer elements
        this.layers.forEach(function(layer) {
            layer.onunload();
        });
    }

    /**
      Sets rendering scale
    */
    setScale(scale: number) {
        this.scale = scale;
        if(this.controller) {
            this.controller.setScale(this.scale);
        }
        this.layers.forEach(function(layer) {
            layer.setScale(scale);
        });
        return this;
    }

    /**
      Sets rendering opacity
    */
    setOpacity(opacity: number) {
        this.opacity = opacity;
        if (this.div) {
            this.div.style.opacity = this.opacity.toString();
        }
        this.layers.forEach(function(layer) {
            layer.setOpacity(opacity);
        });
        return this;
    }

    /**
      Sets X translation
    */
    setTranslateX(translateX: number) {
        this.translateX = translateX;
        if (this.div) {
            this.div.style.left = this.translateX * this.scale + 'px';
        }
        return this;
    }

    /**
      Sets Y translation
    */
    setTranslateY(translateY: number) {
        this.translateY = translateY;
        if (this.div) {
            this.div.style.top = this.translateY * this.scale + 'px';
        }
        return this;
    }

    /**
      Returns a numeric value scaled by the current scale factor
    */
    scaledValue(value: number) {
        return value * this.scale;
    }

    /**
      Creates internal drawing model and layered elements, loads resources and calls callback
      @param callback - Completion event listener
    */
    createModel(callback: (result: boolean) => void) {
        const self = this;

        // Create model and attach resource listeners
        const model = Model.create(self.width, self.height);
        self.model = model;
        if (self.resourceListenerEvent.hasListeners()) {
            self.resourceListenerEvent.listeners.forEach((listener) => {
                self.model.resourceManager.listenerEvent.add(listener);
            });
        }

        // Set color if defined
        if (self.backgroundColor) {
            model.setFill(self.backgroundColor);
        }

        // Add defined image resources
        if (self.normalImageSource) {
            BitmapResource.create(ElementStates.NORMAL, self.normalImageSource).addTo(model);
            ImageElement.create(ElementStates.NORMAL, 0, 0, self.width, self.height).addTo(model);
        }
        if (self.selectedImageSource) {
            BitmapResource.create(ElementStates.SELECTED, self.selectedImageSource).addTo(model);
        }
        if (self.highlightedImageSource) {
            BitmapResource.create(ElementStates.HIGHLIGHTED, self.highlightedImageSource).addTo(model);
        }
        if (self.disabledImageSource) {
            BitmapResource.create(ElementStates.DISABLED, self.disabledImageSource).addTo(model);
        }

        // Add base layer elements
        let l = self.elements.length;
        for (let i = 0; i < l; i++) {
            const el = self.elements[i];
            el.surface = self;
            el.addToModel(model);
        }

        // Add layered elements
        l = self.layers.length;
        for (let i = 0; i < l; i++) {
            const layer = self.layers[i];
            layer.surface = self;
            layer.addToSurface(self);
        }

        // Set completion callback and load resources
        if (callback) {
            self.loaded.add(callback);
        }
        self.loadResources();
    }

    /**
      Loads all required resources and calls completion callback
    */
    loadResources() {
        const self = this;

        // Find next unprepared layer
        for (let i = 0; i < self.layers.length; i++) {
            const layer = self.layers[i];
            if (!layer.isPrepared) {
                layer.prepare(function(success) {
                    self.loadResources();
                });
                return;
            }
        }

        // Prepare resources and return model
        self.model.prepareResources(null, function(success) {
            if (success) {
                self.loaded.trigger(true);
            }
            else {
                self.onErrorInternal('One or more resources failed to load.');
                self.loaded.trigger(false);
            }
        });
    }

    /**
      Internal error handling/logging method
      @param {string} message - Error message
    */
    onErrorInternal(message: string) {
        this.error.trigger(message);
    }

    /**
      Simulates a button click
    */
    clickButton(buttonId: string) {
        const button = this.elementWithId(buttonId) as SurfaceButton;
        if (button) {
            button.onClicked();
        }
    }

    startVideos() {
        this.layers.forEach(function(layer) {
            if (layer instanceof Video) {
                if (layer.autoPlay) {
                    layer.element.play();
                }
            }
        });
    }

    /**
      Registers a resource listener
      @method Elise.Player.Surface#addResourceListener
      @param {function} listener - Resource listener function (rm: ResourceManager, state: ResourceState)
    */
    addResourceListener(listener: (rm: ResourceManager, state: ResourceState) => void) {
        this.resourceListenerEvent.add(listener);
        if (this.model) {
            this.model.resourceManager.listenerEvent.add(listener);
        }
    }
}
