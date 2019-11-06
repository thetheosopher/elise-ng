import { Model } from '../core/model';
import { ResourceLoaderState } from './resource-loader-state';

export class Resource {
    /**
      Resource type tag
    */
    type: string;

    /**
      Resource key
    */
    key: string;

    /**
      Optional resource locale
    */
    locale: string;

    /**
      Resource URI
    */
    uri: string;

    /**
      Resource manager
    */
    resourceManager: ResourceManager;

    /**
      True if registered for retrieval
    */
    registered: boolean;

    /**
      True if downloaded and available
    */
    available: boolean;

    /**
      True if error during retrieval
    */
    error: boolean;

    /**
      Constructs a resource
      @classdesc Resource base class
    */
    constructor() {
        this.clone = this.clone.bind(this);
        this.cloneTo = this.cloneTo.bind(this);
        this.parse = this.parse.bind(this);
        this.serialize = this.serialize.bind(this);
        this.load = this.load.bind(this);
        this.matchesFull = this.matchesFull.bind(this);
        this.matchesGeneric = this.matchesGeneric.bind(this);
        this.matchesKey = this.matchesKey.bind(this);
        this.matchesLanguage = this.matchesLanguage.bind(this);
    }

    /**
      Clones this resource to a new instance
      @returns Cloned resource instance
    */
    clone(): Resource {
        const o: Resource = ResourceFactory.create(this.type);
        this.cloneTo(o);
        return o;
    }

    /**
      Clones properties of this resource to another resource
      @param o - Target resource for property copy
    */
    cloneTo(o: any): void {
        if (this.type) {
            o.type = this.type;
        }
        if (this.key) {
            o.key = this.key;
        }
        if (this.locale) {
            o.locale = this.locale;
        }
        if (this.uri) {
            o.uri = this.uri;
        }
    }

    /**
      Clones properties from another resource to this resource
      @param o - Source resource for property copy
    */
    parse(o: any): void {
        if (o.key) {
            this.key = o.key;
        }
        if (o.locale) {
            this.locale = o.locale;
        }
        if (o.uri) {
            this.uri = o.uri;
        }
    }

    /**
      Clones serializable properties from this resource to a new resource
      @returns Serialized resource instance
    */
    serialize(): any {
        const o: any = {};
        o.type = this.type;
        if (this.key) {
            o.key = this.key;
        }
        if (this.locale) {
            o.locale = this.locale;
        }
        if (this.uri) {
            o.uri = this.uri;
        }
        return o;
    }

    /**
      Retrieves a resource from an http(s) source
      @param url - Resource source URL
      @param callback - Retrieval callback (result: boolean)
    */
    load(url: string, callback?: (result: boolean) => void): void {
        if (callback) {
            callback(true);
        }
    }

    /**
      Determines if this resource fully matches a request for a desired localized
      resource including key and locale (e.g. en-US)
      @param key - Resource key
      @param locale - Desired resource locale identifier
      @returns True if both key and locale id match
    */
    matchesFull(key: string, locale: string): boolean {
        if (this.key.toLowerCase() !== key.toLowerCase()) {
            return false;
        }
        if (this.locale && locale) {
            return this.locale.toLowerCase() === locale.toLowerCase();
        }
        return false;
    }

    /**
      Determines if this resource matches a request for a desired localized
      resource including key and language part of locale ID (e.g. en part of en-US)
      @param key - Resource key
      @param language - Desired resource locale identifier
      @returns True if both key and language of requested locale match
    */
    matchesLanguage(key: string, language: string): boolean {
        if (this.key.toLowerCase() !== key.toLowerCase()) {
            return false;
        }
        if (this.locale && language) {
            return this.locale.toLowerCase().slice(0, language.length + 1) === language.toLowerCase() + '-';
        }
        return false;
    }

    /**
      Determines if this resource matches a request for a desired
      resource key and is a generic resource without a locale designation
      @param key - Resource key
      @returns True if key matches resource request and resource is generic
    */
    matchesGeneric(key: string): boolean {
        if (this.key.toLowerCase() !== key.toLowerCase()) {
            return false;
        }
        if (!this.locale || this.locale === null) {
            return true;
        }
        return false;
    }

    /**
      Determines if this resource matches a request for a desired
      resource key regardless of requested locale or resource locale
      @method Elise.Drawing.Resource#matchesKey
      @param key - Resource key
      @returns True if key matches resource request
    */
    matchesKey(key: string): boolean {
        return this.key.toLowerCase() === key.toLowerCase();
    }

    initialize() {}

    addTo(model: Model) {
        model.resourceManager.merge(this);
        return this;
    }
}

export class ResourceManagerEvent<T> {
    listeners: ((resourceManager: ResourceManager, data?: T) => void)[] = [];

    /**
      Constructs resource manager event
      @classdesc Resource manager event
    */
    constructor() {
        this.add = this.add.bind(this);
        this.trigger = this.trigger.bind(this);
        this.hasListeners = this.hasListeners.bind(this);
    }

    /**
      Add a new event listener
      @param listener - Resource manager event listener (resourceManager: ResourceManager, data?: T)
    */
    public add(listener: (resourceManager: ResourceManager, data?: T) => void) {
        this.listeners.push(listener);
    }

    /**
      Removes an event listener
      @param listener - Resource manager event listener (resourceManager: ResourceManager, data?: T)
    */
    public remove(listener: (resourceManager: ResourceManager, data?: T) => void) {
        const index = this.listeners.indexOf(listener);
        if (index !== -1) {
            this.listeners.splice(index, 1);
        }
    }

    /**
      Clears all event listeners
    */
    public clear() {
        this.listeners = [];
    }

    /**
      Triggers event and calls listeners
      @param rm - Resource manager
      @param data - Event data
    */
    public trigger(rm: ResourceManager, data?: T) {
        this.listeners.slice(0).forEach((h) => h(rm, data));
    }

    /**
     Returns true if any registered listeners
     @returns True if any registered listeners
    */
    public hasListeners() {
        return this.listeners.length > 0;
    }
}

export class ResourceState {
    /**
      Constructs a resource state
      @classdesc Indicates state of loaded resources
      @param numberLoaded - Number of resources loaded
      @param totalResources - Total number of resource to load
      @param code - Resource loader state enumeration
      @param status - Status string
    */
    constructor(
        public numberLoaded: number,
        public totalResources: number,
        public code: ResourceLoaderState,
        public status: string
    ) {
        this.toString = this.toString.bind(this);
    }

    /**
      Describes resource state as string
      @returns Description
    */
    toString(): string {
        return '[' + this.numberLoaded + '/' + this.totalResources + '] ' + this.code + '-' + this.status;
    }
}

export class ResourceManager {
    /**
      Local resource path for model level resources
    */
    localResourcePath: string;

    /**
      Current locale ID to use for localized resource lookups
    */
    currentLocaleId: string;

    /**
      Array of resources not yet downloaded
    */
    pendingResources: Resource[] = [];

    /**
      Number of resources not yet downloaded
    */
    pendingResourceCount: number;

    /**
      Total number of resources
    */
    totalResourceCount: number;

    /**
      Number of loaded resources
    */
    numberLoaded: number;

    /**
      Registered manager event listeners
    */
    listenerEvent: ResourceManagerEvent<ResourceState> = new ResourceManagerEvent<ResourceState>();

    /**
      Load completion callback - Multi event listener
    */
    loadCompleted: ResourceManagerEvent<boolean> = new ResourceManagerEvent<boolean>();

    /**
      Load completion callback - Final callback
    */
    completionCallback: (result: boolean) => void;

    /**
      Resource loading failed flag
    */
    resourceFailed: boolean;

    /**
      Reference to model containing resources to manage
    */
    model: Model;

    /**
      Constructs a new resource manager
      @classdesc Manages resource download, lookup and localization
      @param model - Model with resources to manage
    */
    constructor(model: Model) {
        this.pendingResourceCount = 0;
        this.totalResourceCount = 0;
        this.numberLoaded = 0;
        this.model = model;
        this.add = this.add.bind(this);
        this.merge = this.merge.bind(this);
        this.findBestResource = this.findBestResource.bind(this);
        this.get = this.get.bind(this);
        this.register = this.register.bind(this);
        this.unregister = this.unregister.bind(this);
        this.oncomplete = this.oncomplete.bind(this);
        this.load = this.load.bind(this);
        this.loadNext = this.loadNext.bind(this);
    }

    /**
      Adds a resource to managed resources
      @param res - Resource to add
    */
    add(res: Resource): void {
        res.resourceManager = this;
        this.model.resources.push(res);
    }

    /**
      Merges (adds or updates) a managed resource
      @param res - Resource to merge
    */
    merge(res: Resource): void {
        let replaced: Resource;
        if (res.locale) {
            this.model.resources.forEach(function(existing) {
                if (existing.key === res.key) {
                    if (existing.locale && existing.locale === res.locale) {
                        replaced = existing;
                        replaced.uri = res.uri;
                    }
                }
            });
        }
        else {
            this.model.resources.forEach(function(existing) {
                if (existing.key === res.key) {
                    if (!existing.locale) {
                        replaced = existing;
                        replaced.uri = res.uri;
                    }
                }
            });
        }
        if (!replaced) {
            res.resourceManager = this;
            this.model.resources.push(res);
        }
    }

    /**
      Returns to closest matching localized resource for a
      given key using fallback rules
      @param key - Resource key
      @param locale - Desired resource locale (e.g. en-US)
      @returns Best available resource
     */
    findBestResource(key: string, locale: string): Resource {
        let compare: Resource;
        let language: string;
        const localeSpecified = locale && locale.length > 0;
        const rl = this.model.resources.length;

        // Try to find exact locale match if locale was specified
        if (localeSpecified) {
            for (let i = 0; i < rl; i++) {
                compare = this.model.resources[i];
                if (compare.matchesFull(key, locale)) {
                    return compare;
                }
            }
        }

        // If locale was specified
        if (localeSpecified) {
            // Return generic locale match if available
            if (locale.indexOf('-') !== -1) {
                language = locale.substring(0, locale.indexOf('-'));
                for (let i = 0; i < rl; i++) {
                    compare = this.model.resources[i];
                    if (compare.matchesFull(key, language)) {
                        return compare;
                    }
                }
            }

            // Return other language variant if available
            if (locale.indexOf('-') !== -1) {
                language = locale.substring(0, locale.indexOf('-'));
                for (let i = 0; i < rl; i++) {
                    compare = this.model.resources[i];
                    if (compare.matchesLanguage(key, language)) {
                        return compare;
                    }
                }
            }

            // If generic locale requested, return any matching specific locale
            if (locale.indexOf('-') === -1) {
                for (let i = 0; i < rl; i++) {
                    compare = this.model.resources[i];
                    if (compare.matchesLanguage(key, language)) {
                        return compare;
                    }
                }
            }
        }

        // Return unspecified locale id if available
        for (let i = 0; i < rl; i++) {
            compare = this.model.resources[i];
            if (compare.matchesGeneric(key)) {
                return compare;
            }
        }

        // Return anything matching key
        for (let i = 0; i < rl; i++) {
            compare = this.model.resources[i];
            if (compare.matchesKey(key)) {
                return compare;
            }
        }

        return null;
    }

    /**
      Returns to closest matching localized resource for a
      given key using fallback rules
      @param key - Resource key
      @param localeID - Desired resource locale (e.g. en-US)
      @returns Best available resource
    */
    get(key: string, localeId?: string): Resource {
        let locale: string = null;
        if (!localeId) {
            locale = this.currentLocaleId;
        }
        else {
            locale = localeId;
        }
        return this.findBestResource(key, locale);
    }

    /**
      Registers best available resource for download
      @param key - Resource key
    */
    register(key: string): void {
        const res = this.get(key, this.currentLocaleId);
        if (res) {
            if(!res.resourceManager) {
                res.resourceManager = this;
            }
            if (res.type === 'text' && !res.uri) {
                return;
            }
            if (!res.registered) {
                res.registered = true;
                this.pendingResources.push(res);
                this.pendingResourceCount++;
                this.totalResourceCount++;
            }
        }
    }

    /**
      Unregisters a downloaded resource
      @param res - Resource downloaded
      @param success - True if resource downloaded successfully
    */
    unregister(res: Resource, success: boolean): void {
        // Remove resource from registered resources
        let state: ResourceState;
        const pl = this.pendingResources.length;
        for (let i = 0; i < pl; i++) {
            if (this.pendingResources[i] === res) {
                this.pendingResources.splice(i, 1);
                res.registered = false;
                this.pendingResourceCount--;
                if (success) {
                    res.available = true;
                    this.numberLoaded++;
                }
                else {
                    res.error = true;
                    this.resourceFailed = true;
                }
                break;
            }
        }

        // Notify any event listeners
        if (this.listenerEvent.hasListeners()) {
            if (success) {
                state = new ResourceState(
                    this.numberLoaded,
                    this.totalResourceCount,
                    ResourceLoaderState.ResourceComplete,
                    res.uri || res.key
                );
                this.listenerEvent.trigger(this, state);
            }
            else {
                state = new ResourceState(
                    this.numberLoaded,
                    this.totalResourceCount,
                    ResourceLoaderState.ResourceFailed,
                    res.uri || res.key
                );
                this.listenerEvent.trigger(this, state);
            }
        }

        // If all done, call oncomplete
        if (this.pendingResourceCount === 0) {
            this.oncomplete(this.resourceFailed ? false : true);
            return;
        }

        // Load next resource if not done
        this.loadNext();
    }

    /**
      Notify listeners and completion callbacks
      @param success - Success or failure indication
    */
    oncomplete(success: boolean): void {
        let state: ResourceState;
        if (success) {
            state = new ResourceState(
                this.numberLoaded,
                this.totalResourceCount,
                ResourceLoaderState.Idle,
                'All Resources Loaded.'
            );
        }
        else {
            state = new ResourceState(
                this.numberLoaded,
                this.totalResourceCount,
                ResourceLoaderState.Idle,
                'One or More Resources Failed To Load.'
            );
        }
        this.listenerEvent.trigger(this, state);
        this.loadCompleted.trigger(this, success);
        if (this.completionCallback) {
            this.completionCallback(success);
        }
    }

    /**
      Loads all resource registered for download
      @method Elise.Drawing.ResourceManager#load
      @param callback - Success or failure completion callback (result: boolean)
     */
    load(callback?: (result: boolean) => void): void {
        const rm = this;
        rm.resourceFailed = false;
        rm.completionCallback = callback;
        if (rm.pendingResourceCount === 0) {
            rm.oncomplete(true);
            return;
        }
        if (this.listenerEvent.hasListeners()) {
            const state = new ResourceState(
                rm.numberLoaded,
                rm.totalResourceCount,
                ResourceLoaderState.Loading,
                'Starting Resource Load'
            );
            this.listenerEvent.trigger(this, state);
        }
        rm.loadNext();
    }

    /**
      Request next registered resource
      @method Elise.Drawing.ResourceManager#loadNext
    */
    loadNext(): void {
        let state: ResourceState;
        const self = this;
        if (self.pendingResourceCount === 0) {
            this.oncomplete(this.resourceFailed ? false : true);
            return;
        }

        // Get remaining pending resources
        const toLoad: Resource[] = [];
        let pendingResource: Resource;
        self.pendingResourceCount = 0;
        const pl = self.pendingResources.length;
        for (let i = 0; i < pl; i++) {
            pendingResource = self.pendingResources[i];
            if (!pendingResource.available) {
                toLoad.push(pendingResource);
                self.pendingResourceCount++;
            }
        }

        // If no pending resource, notify completion
        if (self.pendingResourceCount === 0) {
            self.oncomplete(true);
            return;
        }

        // Get next resource to load
        const resourceToLoad = toLoad[0];

        // Notify listeners of request
        if (self.listenerEvent.hasListeners()) {
            state = new ResourceState(
                self.numberLoaded,
                self.totalResourceCount,
                ResourceLoaderState.ResourceStart,
                resourceToLoad.uri || resourceToLoad.key
            );
            self.listenerEvent.trigger(self, state);
        }

        // Initialize resource
        resourceToLoad.initialize();
    }
}

export interface IResourceCreator {
    /**
      Create a resource
      @returns New resource
    */
    create(...p: any[]): Resource;
}

export class ResourceCreatorRegistration {
    /**
      Constructs a ResourceCreatorRegistration
      @classdesc Resource creator registration
      @param name - Resource type name
      @param creator - Resource creation function
    */
    constructor(public name: string, public creator: IResourceCreator) {
        this.name = name;
        this.creator = creator;
    }
}

export class ResourceFactory {
    /**
      Shared resource factory
      @classdesc Resource factory
    */
    constructor() {}

    /**
      Array of resource creators
    */
    static ResourceCreators: ResourceCreatorRegistration[] = [];

    /**
      Registers a resource creator
      @param name - Resource type tag
      @param creator - Resource creation function
    */
    static registerCreator(name: string, creator: IResourceCreator) {
        ResourceFactory.ResourceCreators.push(new ResourceCreatorRegistration(name, creator));
    }

    /**
      Creates a new registered resource instance given a type tag
      @param name - Resource type tag
      @returns New resource
    */
    static create(name: string): Resource {
        for (let i = 0; i < ResourceFactory.ResourceCreators.length; i++) {
            const rc = ResourceFactory.ResourceCreators[i];
            if (rc.name === name) {
                return rc.creator.create();
            }
        }
        return undefined;
    }
}
