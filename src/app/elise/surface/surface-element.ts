import { Model } from '../core/model';
import { Utility } from '../core/utility';
import { Surface } from './surface';

export class SurfaceElement {
    /**
      Element id
    */
    id: string;

    /**
      Element X coordinate
    */
    left: number;

    /**
      Element Y coordinate
    */
    top: number;

    /**
      Element width
    */
    width: number;

    /**
      Element height
    */
    height: number;

    /**
      Parent surface
    */
    surface: Surface;

    /**
      Constructs a surface element
      @classdesc Base class for surface elements
      @param id - Item id
      @param left - Layout area x coordinate
      @param top - Layout area y coordinate
      @param width - Layout area width
      @param height - Layout area height
    */
    constructor(id: string, left: number, top: number, width: number, height: number) {
        if (id) {
            this.id = id;
        }
        else {
            this.id = Utility.guid();
        }
        this.left = left;
        this.top = top;
        this.width = width;
        this.height = height;
    }

    /**
      Adds item to surface model
      @param model - Surface model
    */
    addToModel(model: Model) {}
}
