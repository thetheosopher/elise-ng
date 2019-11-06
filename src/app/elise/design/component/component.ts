import { LinearGradientFill } from '../../fill/linear-gradient-fill';
import { RadialGradientFill } from '../../fill/radial-gradient-fill';
import { ComponentElement } from './component-element';
import { ElementCreationProps } from '../../elements/element-creation-props';
import { ComponentEvent } from './component-event';
import { ElementDragArgs } from '../../elements/element-drag-args';
import { ElementSizeProps } from '../../elements/element-size-props';
import { UploadCompletionProps } from '../../elements/upload-completion-props';
import { UploadProgressProps } from '../../elements/upload-progress-props';
import { ComponentProps } from './component-props';
import { ModelResource } from '../../resource/model-resource';
import { Model } from '../../core/model';
import { RectangleElement } from '../../elements/rectangle-element';

export class Component {

    static baseImagePath: string;

    /**
      Name
    */
    name: string = null;

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
      Constructs a component
      @classdesc Element component template
      @param name - Component name
      @param props - Component properties
    */
    constructor(name: string, props: ComponentProps) {
        this.name = name;
        if (props.fill) {
            this.fill = props.fill;
        }
        if (props.stroke) {
            this.stroke = props.stroke;
        }
        if (props.selectedFill) {
            this.selectedFill = props.selectedFill;
        }
        if (props.selectedStroke) {
            this.selectedStroke = props.selectedStroke;
        }
        if (props.acceptsDrag) {
            this.acceptsDrag = props.acceptsDrag;
            if (props.fileExtensions) {
                this.fileExtensions = props.fileExtensions;
            }
            else {
                this.fileExtensions = [ '*' ];
            }
        }
        else {
            this.acceptsDrag = false;
        }
        if (props.initialize) {
            this.initialize = props.initialize;
        }
        this.initialized = props.initialized;
        if (props.create != null) {
            this.create = props.create;
        }
        if (props.setCreationFill) {
            this.setCreationFill = props.setCreationFill;
        }
        if (props.getFillImage) {
            this.getFillImage = props.getFillImage;
        }
        if (props.select.hasListeners()) {
            props.select.copyTo(this.select);
        }
        else {
            this.select.add(Component.defaultSelect);
        }
        if (props.deselect.hasListeners()) {
            props.deselect.copyTo(this.deselect);
        }
        else {
            this.deselect.add(Component.defaultDeselect);
        }
        if (props.dragEnter.hasListeners()) {
            props.dragEnter.copyTo(this.dragEnter);
        }
        else {
            this.dragEnter.add(Component.defaultDragEnter);
        }
        if (props.dragLeave.hasListeners()) {
            props.dragLeave.copyTo(this.dragLeave);
        }
        else {
            this.dragLeave.add(Component.defaultDragLeave);
        }
        if (props.size.hasListeners()) {
            props.size.copyTo(this.size);
        }
        if (props.uploadStart.hasListeners()) {
            props.uploadStart.copyTo(this.uploadStart);
        }
        if (props.uploadComplete.hasListeners()) {
            props.uploadComplete.copyTo(this.uploadComplete);
        }
        if (props.uploadProgress.hasListeners()) {
            props.uploadProgress.copyTo(this.uploadProgress);
        }
        this.CreateElement = this.CreateElement.bind(this);
        this.GetFillImage = this.GetFillImage.bind(this);
        this.onSize = this.onSize.bind(this);
        this.onSelect = this.onSelect.bind(this);
        this.onDeselect = this.onDeselect.bind(this);
        this.onUploadStart = this.onUploadStart.bind(this);
        this.onUploadComplete = this.onUploadComplete.bind(this);
    }

    /**
      Default component element selection handler
      @param component - Component
      @param el - Component element
    */
    static defaultSelect(component: Component, el: ComponentElement): void {
        return;
    }

    /**
      Default component element deselection handler
      @param component - Component
      @param el - Component element
    */
    static defaultDeselect(component: Component, el: ComponentElement): void {
        return;
    }

    /**
      Default component element drag enter handler
      @param component - Component
      @param args - Element drag args
    */
    static defaultDragEnter(component: Component, args: ElementDragArgs): void {
        const el = args.element;
        const mr: ModelResource = el.model.resourceManager.get(el.id) as ModelResource;
        const model: Model = mr.model;
        model.setStroke(null);
        let dragRect = model.elementWithId('dragrect');
        if (!dragRect) {
            dragRect = RectangleElement.create(0, 0, model.getSize().width, model.getSize().height)
                .setStroke('#88ff0000,9')
                .setFill('#88ffd700')
                .addTo(model);
            dragRect.id = 'dragrect';
        }
    }

    /**
      Default component element drag leave handler
      @param component - Component
      @param args - Element drag args
    */
    static defaultDragLeave(component: Component, args: ElementDragArgs): void {
        const el = args.element;
        const mr: ModelResource = el.model.resourceManager.get(el.id) as ModelResource;
        const model = mr.model;
        model.setStroke('Black');
        const dragRect = model.elementWithId('dragrect');
        if (dragRect) {
            model.remove(dragRect);
        }
    }

    /**
      Creates a component element
      @param model - Target model for new component element
      @param id - New element id
      @param left - X coordinate
      @param top - Y coordinate
      @param width - Width
      @param height - Height
      @param props - Extra element properties
    */
    CreateElement(model: Model, id: string, left: number, top: number, width: number, height: number, props: any) {
        let el = null;
        if (this.create) {
            el = this.create(new ElementCreationProps(model, id, left, top, width, height, props));
        }
        else {
            const elProps = new ElementCreationProps(model, id, left, top, width, height, props);
            const componentProps = new ComponentProps();
            el = componentProps.defaultCreate(elProps);
            model.add(el);
        }
        el.id = id;
        if (this.acceptsDrag) {
            el.acceptsDrag = true;
        }
        el.component = this;
        if (props) {
            el.props = props;
        }
        return el;
    }

    /**
      Fill image provider function
      @param callback - Image provider callback function (image: HTMLImageElement)
    */
    GetFillImage(callback: (image: HTMLImageElement) => void): void {
        if (this.getFillImage) {
            this.getFillImage(callback);
        }
    }

    /**
      Triggers component element size handler
      @param props - Element size props
    */
    onSize(props: ElementSizeProps): void {
        this.size.trigger(this, props);
    }

    /**
      Triggers component element selection handler
      @param el - Element being selected
    */
    onSelect(el: ComponentElement): void {
        this.select.trigger(this, el);
    }

    /**
      Triggers component element deselection handler
      @param el - Element being deselected
    */
    onDeselect(el: ComponentElement): void {
        this.deselect.trigger(this, el);
    }

    /**
      Triggers component element upload start handler
      @param el - Element with upload starting
    */
    onUploadStart(el: ComponentElement): void {
        this.uploadStart.trigger(this, el);
    }

    /**
      Triggers component element upload completion handler
      @param el - Element with upload completed
      @param success - Upload completion status
    */
    onUploadComplete(el: ComponentElement, success: boolean): void {
        if (this.uploadComplete.hasListeners()) {
            this.uploadComplete.trigger(this, new UploadCompletionProps(el, success));
        }
    }

    /**
      Triggers component element upload progress handler
      @param el - Element with upload progressing
      @param percent - Percent of upload complete
    */
    onComponentUploadProgress(el: ComponentElement, percent: number): void {
        if (this.uploadProgress.hasListeners()) {
            this.uploadProgress.trigger(this, new UploadProgressProps(el, percent));
        }
    }
}
