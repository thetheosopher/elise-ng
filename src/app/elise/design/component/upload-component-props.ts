import { ImageBasedComponentProps} from './image-based-component-props';
import { ElementCreationProps } from '../../elements/element-creation-props';
import { ElementSizeProps } from '../../elements/element-size-props';
import { Model } from '../../core/model';
import { BitmapResource } from '../../resource/bitmap-resource';
import { Component } from '../component/component';
import { RectangleElement } from '../../elements/rectangle-element';
import { Point } from '../../core/point';
import { Size } from '../../core/size';
import { ModelResource } from '../../resource/model-resource';
import { ComponentElement } from './component-element';
import { UploadCompletionProps } from '../../elements/upload-completion-props';
import { UploadProgressProps } from '../../elements/upload-progress-props';

export class ProgressRectangle extends RectangleElement {

    percent: number;

    constructor() {
        super();
    }
}

export class UploadComponentProps extends ImageBasedComponentProps {

    fileExtensions: string[] = ['*'];

   constructor() {
        super();
        this.imageTag = 'upload';
        this.acceptsDrag = true;

        this.onUploadStart = this.onUploadStart.bind(this);
        this.onUploadProgress = this.onUploadProgress.bind(this);
        this.onUploadComplete = this.onUploadComplete.bind(this);

        this.initialize = this.onInitialize;
        this.create = this.onCreate;
        this.setCreationFill = this.onSetCreationFill;
        this.getFillImage = this.onGetFillImage;
        this.size.add(this.onSize);
        this.uploadStart.add(this.onUploadStart);
        this.uploadProgress.add(this.onUploadProgress);
        this.uploadComplete.add(this.onUploadComplete);
    }

    /**
      Handles component element creation
    */
    onCreate(props: ElementCreationProps) {
        const m = Model.create(props.width, props.height);
        BitmapResource.create(this.imageTag, Component.baseImagePath + this.imageTag + '.png').addTo(m);
        m.stroke = 'Black';
        // m.fill = '#c0ffffff';
        const rect = RectangleElement.create(0, 0, props.width, props.height).setFill('image(0.75;' + this.imageTag + ')').addTo(m);
        rect.id = 'r';

        // Upload indicator
        const upframe = RectangleElement.create(0, props.height - 8, props.width, 8).setFill('#00000000').setStroke('#00000000').addTo(m);
        upframe.id = 'upframe';
        const upind = new ProgressRectangle();
        upind.setLocation(Point.create(0, props.height - 8)).setSize(Size.create(0, 8))
            .setFill('#00000000').setStroke('#00000000').addTo(m);
        upind.id = 'upind';
        upind.percent = 0;

        ModelResource.create(props.id, m).addTo(props.model);
        const el = new ComponentElement(props.id, props.left, props.top, props.width, props.height);
        props.model.add(el);
        return el;
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
        const upframe = res.model.elementWithId('upframe');
        upframe.setSize(Size.create(size.width, 8));
        upframe.setLocation(Point.create(0, size.height - 8));
        const upind = res.model.elementWithId('upind') as ProgressRectangle;
        upind.setSize(Size.create(size.width * upind.percent, 8));
        upind.setLocation(Point.create(0, size.height - 8));
    }

    onUploadStart(c: Component, el: ComponentElement) {
        const res = el.model.resourceManager.get(el.id) as ModelResource;
        const upframe = res.model.elementWithId('upframe');
        upframe.setStroke('Black').setFill('#80000080');
        const upind = res.model.elementWithId('upind') as ProgressRectangle;
        upind.setSize(Size.create(0, 8));
        upind.setFill('#ffff00');
    }

    onUploadComplete(c: Component, props: UploadCompletionProps) {
        const el = props.element;
        const res = el.model.resourceManager.get(el.id) as ModelResource;
        const upframe = res.model.elementWithId('upframe');
        upframe.setStroke('#00000000').setFill('#00000000');
        const upind = res.model.elementWithId('upind');
        upind.setSize(Size.create(0, 8));
        upind.setFill('#00000000');
    }

    onUploadProgress(c: Component, props: UploadProgressProps) {
        const el = props.element;
        const res = el.model.resourceManager.get(el.id) as ModelResource;
        const upind = res.model.elementWithId('upind') as ProgressRectangle;
        const upframe = res.model.elementWithId('upframe');
        upind.percent = props.percent / 100;
        upind.setSize(Size.create(upframe.getSize().width * upind.percent, 8));
    }
}
