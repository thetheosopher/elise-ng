import { Resource, ResourceFactory, ResourceManager } from './resource';
import { Utility } from '../core/utility';
import { Model } from '../core/model';

export class TextResource extends Resource {
    /**
      Resource text
    */
    text: string;

    /**
      Text resource factory function
      @returns New text resource
    */
    static create(): TextResource {
        return new TextResource();
    }

    /**
     Creates text resource from text string
    @param key - Resource key
    @param text - Resource text
    @param locale - Optional resource locale ID (e.g. en-US)
    @returns New text resource
    */
    static createFromText(key: string, text: string, locale?: string): TextResource {
        const tr = new TextResource();
        if (arguments.length >= 2) {
            tr.key = key;
            tr.text = text;
        }
        if (arguments.length >= 3) {
            tr.locale = locale;
        }
        return tr;
    }

    /**
     Creates text resource from http(s) source URI
    @param key - Resource key
    @param uri - Resource URI
    @param locale - Optional resource locale ID (e.g. en-US)
    @returns New text resource
    */
    static createFromUri(key: string, uri: string, locale?: string): TextResource {
        const tr = new TextResource();
        if (arguments.length >= 2) {
            tr.key = key;
            tr.uri = uri;
        }
        if (arguments.length >= 3) {
            tr.locale = locale;
        }
        return tr;
    }

    /**
      Constructs a text resource
      @classdesc String text resource
    */
    constructor() {
        super();
        this.type = 'text';
    }

    /**
      Clones this resource to a new instance
      @returns Cloned text resource
    */
    clone(): TextResource {
        const o: TextResource = new TextResource();
        super.cloneTo(o);
        if (this.text) {
            o.text = this.text;
        }
        return o;
    }

    /**
      Copies properties of another text resource
      @param o - Source text resource
    */
    parse(o: any): void {
        super.parse(o);
        if (o.text) {
            this.text = o.text;
        }
    }

    /**
      Serializes resource to a new instance
      @returns Serialized resource instance
    */
    serialize(): any {
        const o = super.serialize();
        if (this.text) {
            o.text = this.text;
        }
        return o;
    }

    /**
      Retrieves text resource from an http(s) source
      @param url - Text source URL
      @param callback - Retrieval callback (result: boolean)
    */
    load(url: string, callback: (result: boolean) => void): void {
        const self = this;
        Utility.getRemoteText(url, function(text) {
            if (text) {
                self.text = text;
                callback(true);
            }
            else {
                callback(false);
            }
        });
    }

    initialize() {
        const self = this;

        // If embedded text, no need to retrieve file
        if (this.text) {
            self.resourceManager.unregister(self, true);
        }
        else {
            // Text Resource type
            const resourcePath = self.uri;
            const resourcePathLowered = resourcePath.toLowerCase();

            // Local (Server) Image
            if (resourcePath.charAt(0) === ':') {
                const url = resourcePath.substring(1, resourcePath.length);
                self.load(url, function(success) {
                    self.resourceManager.unregister(self, success);
                });
            }
            else if (resourcePath.charAt(0) === '/') {
                // Shared Text Resource
                self.load(Utility.joinPaths(self.resourceManager.model.basePath, resourcePath), function(success) {
                    self.resourceManager.unregister(self, success);
                });
            }
            else if (resourcePathLowered.indexOf('http://') === 0 || resourcePathLowered.indexOf('https://') === 0) {
                // Remote / External Image (http:// or https://)
                self.load(resourcePath, function(success) {
                    self.resourceManager.unregister(self, success);
                });
            }
            else {
                // Embedded Text Resource
                self.load(Utility.joinPaths(self.resourceManager.localResourcePath, resourcePath), function(success) {
                    self.resourceManager.unregister(self, success);
                });
            }
        }
    }
}

// Register type creator
ResourceFactory.registerCreator('text', TextResource);
