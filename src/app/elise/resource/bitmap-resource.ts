import { Resource, ResourceFactory } from './resource';
import { Size } from '../core/size';
import { Utility } from '../core/utility';

export class BitmapResource extends Resource {
    /**
      Bitmap dimensions
    */
    size: Size;

    /**
      Retrieved image resource
    */
    image: HTMLImageElement;

    /**
      Bitmap resource factory function
      @param key - Resource key
      @param uriOrImage - Resource URI or existing image object
      @param locale - Optional resource local (e.g. en-US)
    */
    static create(key: string, uriOrImage: string | HTMLImageElement, locale?: string): BitmapResource {
        const br = new BitmapResource();
        if (arguments.length >= 2) {
            br.key = key;
            if (typeof uriOrImage === 'string') {
                br.uri = uriOrImage;
            }
            else {
                br.image = uriOrImage;
            }
        }
        if (arguments.length >= 3) {
            br.locale = locale;
        }
        return br;
    }

    /**
      Constructs a bitmap resource
      @classdesc Bitmap image resource
    */
    constructor() {
        super();
        this.type = 'bitmap';
    }

    /**
      Clones this resource to a new instance
      @returns Cloned bitmap resource
    */
    clone(): BitmapResource {
        let o: BitmapResource = null;
        if (this.image) {
            o = BitmapResource.create(this.key, this.image, this.locale);
        }
        else {
            o = BitmapResource.create(this.key, this.uri, this.locale);
        }
        super.cloneTo(o);
        if (this.size) {
            o.size = this.size;
        }
        return o;
    }

    /**
      Copies properties of another bitmap resource
      @param o - Source bitmap resource
    */
    parse(o: any): void {
        super.parse(o);
        if (o.size) {
            this.size = Size.parse(o.size);
        }
    }

    /**
      Serializes resource to a new instance
      @returns Serialized resource instance
    */
    serialize(): any {
        const o = super.serialize();
        if (this.size) {
            o.size = this.size.toString();
        }
        return o;
    }

    /**
      Retrieves image resource
      @param url - Image URL
      @param callback - Retrieval callback (result: boolean)
    */
    load(url: string, callback: (result: boolean) => void): void {
        const image = new Image();
        this.image = image;
        image.src = url;
        image.onload = (e) => {
            if (callback) {
                callback(true);
            }
        };
        image.onabort = (e) => {
            if (callback) {
                callback(false);
            }
        };
        image.onerror = (e) => {
            if (callback) {
                callback(false);
            }
        };
    }

    initialize() {
        const self = this;

        // If embedded image, just unregister
        if (self.image) {
            self.resourceManager.unregister(self, true);
        }
        else {
            // Image Resource Assumed
            const imagePath = self.uri;
            const imagePathLowered = imagePath.toLowerCase();

            // Local (Server) Image
            if (imagePath.charAt(0) === ':') {
                const url = imagePath.substring(1, imagePath.length);
                self.load(url, function(success) {
                    self.resourceManager.unregister(self, success);
                });
            }
            else if (imagePath.charAt(0) === '/') {
                // Shared Image
                self.load(Utility.joinPaths(self.resourceManager.model.basePath, imagePath), function(success) {
                    self.resourceManager.unregister(self, success);
                });
            }
            else if (imagePathLowered.indexOf('http://') === 0 || imagePathLowered.indexOf('https://') === 0) {
                // Remote / External Image (http:// or https://)
                self.load(imagePath, function(success) {
                    self.resourceManager.unregister(self, success);
                });
            }
            else {
                // Embedded Image
                self.load(Utility.joinPaths(self.resourceManager.localResourcePath, imagePath), function(success) {
                    self.resourceManager.unregister(self, success);
                });
            }
        }
    }
}

/* Register type creator */
ResourceFactory.registerCreator('bitmap', BitmapResource);
