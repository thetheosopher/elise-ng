import { Model } from './model';

export class ModelEvent<T> {
    /**
      @classdesc Model event type
    */
    constructor() {
        this.add = this.add.bind(this);
        this.trigger = this.trigger.bind(this);
    }

    /**
      Listener array
    */
    private listeners: ((model: Model, data?: T) => void)[] = [];

    /**
      Add a new listener
      @param listener - Listener function (c: Model, data?: T)
    */
    public add(listener: (c: Model, data?: T) => void) {
        this.listeners.push(listener);
    }

    /**
      Removes a listener
      @param listener - Listener function (c: Model, data?: T)
    */
    public remove(listener: (c: Model, data?: T) => void) {
        const index = this.listeners.indexOf(listener);
        if (index !== -1) {
            this.listeners.splice(index, 1);
        }
    }

    /**
      Clears listeners
    */
    public clear() {
        this.listeners = [];
    }

    /**
      Trigger event
       @param model - Event model
       @param Event data
    */
    public trigger(model: Model, data?: T) {
        this.listeners.slice(0).forEach((h) => h(model, data));
    }
}
