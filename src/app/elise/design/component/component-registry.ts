import { Component } from './component';
import { ComponentProps } from './component-props';
import { EliseException } from '../../core/elise-exception';
import { Model } from '../../core/model';

export class ComponentRegistry {
    /**
      @classdesc Central design component registry
    */
    constructor() {}

    /**
      Registered component array
    */
    static components: Component[] = [];

    static initializeAllCallback: (success: boolean) => void = null;

    /**
      Registers a component type
      @param name - Component type name
      @param props - Component template props
    */
    static registerComponent(name: string, props: ComponentProps) {
        ComponentRegistry.unregisterComponent(name);
        const component = new Component(name, props);
        ComponentRegistry.components.push(component);
    }

    /**
      Unregisters a component type
      @param name - Component type name
    */
    static unregisterComponent(name: string) {
        const index = ComponentRegistry.getComponentIndex(name);
        if (index !== -1) {
            ComponentRegistry.components.splice(index, 1);
        }
    }

    /**
      Retrieves index of registered component name or -1 if not found
      @param name - Component type name
      @returns Component index or -1 if not found
    */
    static getComponentIndex(name: string): number {
        for (let i = 0; i < ComponentRegistry.components.length; i++) {
            if (ComponentRegistry.components[i].name === name) {
                return i;
            }
        }
        return -1;
    }

    /**
      Retrieves component by type name
      @param name - Component type name
      @returns Component or null if not found
    */
    static getComponent(name: string): Component {
        const index = ComponentRegistry.getComponentIndex(name);
        if (index !== -1) {
            return ComponentRegistry.components[index];
        }
        return null;
    }

    /**
      Determines if component type name is registered
      @param name - Component type name
      @returns True if component type name is registered
    */
    static isComponentRegistered(name: string): boolean {
        return ComponentRegistry.getComponentIndex(name) !== -1;
    }

    /**
      Throws component not registered exception
      @param name - Component type name
    */
    static componentNotRegistered(name: string): void {
        throw new EliseException('Component type ' + name + ' Not Registered.');
    }

    /**
      Creates element of a component type
      @param model - Target model for element
      @param type - Component type name
      @param id - New element ID
      @param left - X coordinate
      @param top - Y coordinate
      @param width - Width
      @param height - Height
      @param props - Extra element properties
    */
    static createComponentElement(
        model: Model,
        type: string,
        id: string,
        left: number,
        top: number,
        width: number,
        height: number,
        props: any
    ) {
        const component = ComponentRegistry.getComponent(type);
        if (!component) {
            ComponentRegistry.componentNotRegistered(type);
        }
        const el = component.CreateElement(model, id, left, top, width, height, props);
        return el;
    }

    /**
      Calls fill image retrieval function to retrieve fill image
      @param type - Component type name
      @param callback - Image callback function (image: HTMLImageElement)
    */
    static getComponentFillImage(type: string, callback: (image: HTMLImageElement) => void): void {
        const component = ComponentRegistry.getComponent(type);
        if (!component) {
            ComponentRegistry.componentNotRegistered(type);
        }
        component.GetFillImage(callback);
    }

    static initializeAll(callback: (success: boolean) => void) {
        ComponentRegistry.initializeAllCallback = callback;

        for (let i = 0; i < ComponentRegistry.components.length; i++) {
            const component = ComponentRegistry.components[i];
            if (!component.initialized && component.initialize) {
                component.initialize(function(success) {
                    if (success) {
                        component.initialized = true;
                        ComponentRegistry.initializeAll(ComponentRegistry.initializeAllCallback);
                    }
                    else {
                        if (ComponentRegistry.initializeAllCallback) {
                            ComponentRegistry.initializeAllCallback(false);
                            ComponentRegistry.initializeAllCallback = null;
                        }
                    }
                });
                return;
            }
        }

        if (ComponentRegistry.initializeAllCallback) {
            ComponentRegistry.initializeAllCallback(true);
            ComponentRegistry.initializeAllCallback = null;
        }
    }
}
