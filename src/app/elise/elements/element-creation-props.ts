import { Model } from '../core/model';

export class ElementCreationProps {
    /**
      Model to which element should be added
    */
    model: Model;

    /**
      New element ID
    */
    id: string;

    /**
      X coordinate
    */
    left: number;

    /**
      Y coordinate
    */
    top: number;

    /**
      Width
    */
    width: number;

    /**
      Height
    */
    height: number;

    /**
      Extra element properties
    */
    props: any;

    /**
      Constructs an ElementCreationProps
      @classdesc Provides properties for element creation
      @param model - Model to which element should be added
      @param id - Element id
      @param left - X coordinate
      @param top - Y coordinate
      @param width - Width
      @param height - Height
      @param props - Extra properties object
    */
    constructor(model: Model, id: string, left: number, top: number, width: number, height: number, props: any) {
        this.model = model;
        this.id = id;
        this.left = left;
        this.top = top;
        this.width = width;
        this.height = height;
        this.props = props;
    }
}
