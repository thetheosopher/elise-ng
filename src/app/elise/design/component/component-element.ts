import { ModelElement } from '../../elements/model-element';
import { Size } from '../../core/size';
import { Point } from '../../core/point';
import { Component } from './component';

export class ComponentElement extends ModelElement {
    /**
      Element component
    */
    component: Component;

    /**
      True if component accepts drag/drop
    */
    acceptsDrag: boolean;

    /**
      Extra, arbitrary component properties
    */
    props: any;

    /**
      Constructs a component element
      @classdesc Extends Elise.Drawing.ModelElement to add Component property
      @extends Elise.Drawing.ModelElement
      @param source - Model element ID used as resource key in parent model
      @param left - Element X coordinate
      @param top - Element Y coordinate
      @param width - Element width
      @param height - Element height
    */
    constructor(source: string, left: number, top: number, width: number, height: number) {
        super();
        this.source = source;
        this.setSize(new Size(width, height));
        this.setLocation(new Point(left, top));
    }
}
