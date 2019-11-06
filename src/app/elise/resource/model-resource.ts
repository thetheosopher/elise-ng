import { Resource, ResourceFactory } from './resource';
import { Model } from '../core/model';
import { Size } from '../core/size';
import { Utility } from '../core/utility';

export class ModelResource extends Resource {
    /**
      Model dimensions
    */
    size: Size;

    /**
      Resource model
    */
    model: Model;

    /**
      Creates model resource from string model URI (referenced) or exising model object (embedded)
      @method Elise.Drawing.ModelResource#create
      @param key - Resource key
      @param uriOrModel - Model URI or existing model object
      @param locale - Optional resource locale ID (e.g. en-US)
      @returns New model resource
    */
    static create(key: string, uriOrModel: string | Model, locale?: string): ModelResource {
        const r = new ModelResource();
        if (arguments.length >= 2) {
            r.key = key;
            if (typeof uriOrModel === 'string') {
                r.uri = uriOrModel;
            }
            else {
                r.model = uriOrModel.clone();
            }
        }
        if (arguments.length >= 3) {
            r.locale = locale;
        }
        return r;
    }

    /**
      Constructs a model resource
      @classdesc Embedded or externally referenced model resource
    */
    constructor() {
        super();
        this.type = 'model';
    }

    /**
      Clones this resource to a new instance
      @returns Cloned model resource
    */
    clone(): ModelResource {
        let o: ModelResource = null;
        if (this.model) {
            o = ModelResource.create(this.key, this.model, this.locale);
        }
        else {
            o = ModelResource.create(this.key, this.uri, this.locale);
        }
        super.cloneTo(o);
        if (this.size) {
            o.size = this.size;
        }
        return o;
    }

    /**
      Copies properties of another model resource
      @param o - Source model resource
    */
    parse(o: any): void {
        super.parse(o);
        if (o.model) {
            this.model = Model.parse(JSON.stringify(o.model));
        }
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
        if (this.model && !this.uri) {
            o.model = JSON.parse(JSON.stringify(this.model.serialize()));
        }
        if (this.size) {
            o.size = this.size.toString();
        }
        return o;
    }

    /**
      Retrieves model resource from an http(s) source
      @param url - Model source URL
      @param callback - Retrieval callback (result: boolean)
    */
    load(url: string, callback: (result: boolean) => void): void {
        const res = this;
        const basePath = res.resourceManager.model.basePath;
        const relUrl = url.substring(basePath.length, url.length);
        Model.load(basePath, relUrl, function(model) {
            if (model) {
                res.model = model;
                res.model.prepareResources(res.resourceManager.currentLocaleId, function() {
                    callback(true);
                });
            }
            else {
                callback(false);
            }
        });
    }

    initialize() {
        const self = this;

        // If embedded model, no need to retrieve, but init resources
        if (this.model && this.resourceManager.model) {
            this.model.basePath = this.resourceManager.model.basePath;
            this.model.prepareResources(this.resourceManager.currentLocaleId, function(success) {
                self.resourceManager.unregister(self, success);
            });
        }
        else {
            // Get model source URI
            const modelPath = this.uri;

            // Local (Server) Model
            if (modelPath.charAt(0) === ':') {
                const url = modelPath.substring(1, modelPath.length);
                this.load(url, function(success) {
                    self.resourceManager.unregister(self, success);
                });
            }
            else if (modelPath.charAt(0) === '/') {
                // Shared model resource relative to model base path
                this.load(Utility.joinPaths(self.resourceManager.model.basePath, modelPath), function(success) {
                    self.resourceManager.unregister(self, success);
                });
            }
            else {
                // Embedded model resource
                self.load(Utility.joinPaths(self.resourceManager.localResourcePath, modelPath), function(success) {
                    self.resourceManager.unregister(self, success);
                });
            }
        }
    }
}

/* Register type creator */
ResourceFactory.registerCreator('model', ModelResource);
