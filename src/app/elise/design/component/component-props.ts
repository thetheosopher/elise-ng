import { LinearGradientFill } from '../../fill/linear-gradient-fill';
import { RadialGradientFill } from '../../fill/radial-gradient-fill';
import { ElementCreationProps } from '../../elements/element-creation-props';
import { ComponentElement } from './component-element';
import { ComponentEvent } from './component-event';
import { ElementSizeProps } from '../../elements/element-size-props';
import { UploadCompletionProps } from '../../elements/upload-completion-props';
import { UploadProgressProps } from '../../elements/upload-progress-props';
import { Model } from '../../core/model';
import { ModelResource } from '../../resource/model-resource';
import { ElementDragArgs } from '../../elements/element-drag-args';
import { Component } from './component';

export class ComponentProps {

   /**
     Base image path for image based components
   */
   static baseImagePath: string;

   /**
     Standard element creation fill (default - Half transparent Gold #7fffd700)
   */
   static standardFill = '#7fffd700';

   /**
     Standard element creation stroke (default - Solid Red)
   */
   static standardStroke = 'Red';

    /**
      Constructs a component props
      @classdesc Describes element component design template
    */
    constructor() {
        this.defaultCreate = this.defaultCreate.bind(this);
        this.defaultResize = this.defaultResize.bind(this);
        this.defaultSelect = this.defaultSelect.bind(this);
        this.defaultDeselect = this.defaultDeselect.bind(this);
    }

    /**
      Name
    */
    name: string;

    /**
      Normal state fill
    */
    fill: string | LinearGradientFill | RadialGradientFill;

    /**
      Normal state stroke
    */
    stroke: string;

    /**
      Selected state fill
    */
    selectedFill: string | LinearGradientFill | RadialGradientFill;

    /**
      Selected state stroke
    */
    selectedStroke: string;

    /**
      True if component accepts file drag and drop
    */
    acceptsDrag: boolean;

    /**
      Array of file extensions component supports
    */
    fileExtensions: string[];

    /**
      Component element initialization (callback:(success: boolean)=>void)=>void
    */
    initialize: (callback: (success: boolean) => void) => void = null;

    /**
      Initialized flag.  True after initialization
    */
    initialized: boolean;

    /**
      Component element creation handler (props: ElementCreationProps)=>ComponentElement
    */
    create: (props: ElementCreationProps) => ComponentElement = null;

    /**
      Component element set canvas creation fill function (controller: DesignController, c: CanvasRenderingContext2D)
    */
    setCreationFill: (c: CanvasRenderingContext2D) => void = null;

    /**
      Component element fill image provider function (callback:(image: HTMLImageElement)=>void)=>void
    */
    getFillImage: (callback: (image: HTMLImageElement) => void) => void = null;

    /**
      Component element selection event
    */
    select: ComponentEvent<ComponentElement> = new ComponentEvent<ComponentElement>();

    /**
      Component element deselection event
    */
    deselect: ComponentEvent<ComponentElement> = new ComponentEvent<ComponentElement>();

    /**
      Component element drag enter event
    */
    dragEnter: ComponentEvent<ElementDragArgs> = new ComponentEvent<ElementDragArgs>();

    /**
      Component element drag leave event
    */
    dragLeave: ComponentEvent<ElementDragArgs> = new ComponentEvent<ElementDragArgs>();

    /**
      Component element size event
    */
    size: ComponentEvent<ElementSizeProps> = new ComponentEvent<ElementSizeProps>();

    /**
      Component element upload start event
    */
    uploadStart: ComponentEvent<ComponentElement> = new ComponentEvent<ComponentElement>();

    /**
      Component element upload complete event
    */
    uploadComplete: ComponentEvent<UploadCompletionProps> = new ComponentEvent<UploadCompletionProps>();

    /**
      Component element upload progress event
    */
    uploadProgress: ComponentEvent<UploadProgressProps> = new ComponentEvent<UploadProgressProps>();

    /**
      Default element creation function for elements with simple properties
      @method Elise.Drawing.Design.ComponentProps#defaultCreate
      @param props - Element creation props
      @returns New component element
    */
    defaultCreate(props: ElementCreationProps) {
        const m = Model.create(props.width, props.height);
        if (this.stroke !== undefined) {
            m.stroke = this.stroke;
        }
        else {
            m.stroke = ComponentProps.standardStroke;
        }
        if (this.fill !== undefined) {
            m.fill = this.fill;
        }
        else {
            m.fill = ComponentProps.standardFill;
        }
        ModelResource.create(props.id, m).addTo(props.model);
        const el = new ComponentElement(props.id, props.left, props.top, props.width, props.height);
        props.model.add(el);
        return el;
    }

    /**
      Default element resizing function for elements with simple properties
      @method Elise.Drawing.Design.ComponentProps#defaultResize
      @param component - Component
      @param props - Element resizing properties
    */
    defaultResize(c: Component, props: ElementSizeProps) {
        const res = props.element.model.resourceManager.get(props.element.id) as ModelResource;
        res.model.setSize(props.size);
    }

    defaultSelect(c: Component, el: ComponentElement) {
        const resource = el.model.resourceManager.get(el.id) as ModelResource;
        const model = resource.model;
        if (c.selectedFill) {
            model.fill = c.selectedFill;
        }
        if (c.selectedStroke) {
            model.stroke = c.selectedStroke;
        }
    }

    defaultDeselect(c: Component, el: ComponentElement) {
        const resource = el.model.resourceManager.get(el.id) as ModelResource;
        const model = resource.model;
        model.fill = c.fill;
        model.stroke = c.stroke;
    }
}
