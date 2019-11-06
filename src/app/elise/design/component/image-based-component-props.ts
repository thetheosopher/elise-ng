import { ComponentProps } from './component-props';
import { Component } from './component';
import { ElementCreationProps } from '../../elements/element-creation-props';
import { Model } from '../../core/model';
import { BitmapResource } from '../../resource/bitmap-resource';
import { ModelResource } from '../../resource/model-resource';
import { RectangleElement } from '../../elements/rectangle-element';
import { ComponentElement } from '../component/component-element';
import { ElementSizeProps } from '../../elements/element-size-props';
import { Size } from '../../core/size';

export class ImageBasedComponentProps extends ComponentProps {

    constructor() {
        super();
        this.onInitialize = this.onInitialize.bind(this);
        this.onCreate = this.onCreate.bind(this);
        this.onSetCreationFill = this.onSetCreationFill.bind(this);
        this.onGetFillImage = this.onGetFillImage.bind(this);
        this.onSize = this.onSize.bind(this);

        this.initialize = this.onInitialize;
        this.create = this.onCreate;
        this.setCreationFill = this.onSetCreationFill;
        this.getFillImage = this.onGetFillImage;
        this.size.add(this.onSize);
        this.imageTag = 'push-button';
    }

    imageTag: string;

    fillImage: HTMLImageElement;

    onInitialize(callback: (success: boolean) => void) {
        const self = this;
        const image = new Image();
        console.log('onInitialize: ' + this.imageTag);
        image.onload = function (e) {
            self.fillImage = image;
            if (callback) {
                callback(true);
            }
        };
        image.onerror = function(e) {
            self.fillImage = null;
            if(callback) {
                callback(false);
            }
        };
        if(Component.baseImagePath.substr(0, 1) === ':') {
            image.src = Component.baseImagePath.substr(1) + this.imageTag + '.png';
        }
        else {
            image.src = Component.baseImagePath + this.imageTag + '.png';
        }
    }

    onCreate(props: ElementCreationProps) {
        const m = Model.create(props.width, props.height);
        BitmapResource.create('navigate', Component.baseImagePath + this.imageTag + '.png').addTo(m);
        m.stroke = 'Black';
        // m.fill = '#c0ffffff';
        const rect = RectangleElement.create(0, 0, props.width, props.height).setFill('image(0.75;' + this.imageTag + ')').addTo(m);
        rect.id = 'r';
        ModelResource.create(props.id, m).addTo(props.model);
        const el = new ComponentElement(props.id, props.left, props.top, props.width, props.height);
        props.model.add(el);
        return el;
    }

    onSetCreationFill(c: CanvasRenderingContext2D): void {
        const pattern = c.createPattern(this.fillImage, 'repeat');
        c.fillStyle = pattern;
    }

    onGetFillImage(callback: (image: HTMLImageElement) => void) {
        if(this.fillImage) {
            if(callback) {
                callback(this.fillImage);
            }
        }
        else {
            const image = new Image();
            image.onload = function (e) {
                if (callback) {
                    callback(image);
                }
            };
            if(Component.baseImagePath.substr(0, 1) === ':') {
                image.src = Component.baseImagePath.substr(1) + this.imageTag + '.png';
            }
            else {
                image.src = Component.baseImagePath + this.imageTag + '.png';
            }
        }
    }

    onSize(c: Component, props: ElementSizeProps) {
        const el = props.element;
        const size = props.size;
        const res = el.model.resourceManager.get(el.id) as ModelResource;
        res.model.setSize(size);
        const r = res.model.elementWithId('r');
        if (r) {
            r.setSize(Size.create(size.width, size.height));
        }
    }
}
