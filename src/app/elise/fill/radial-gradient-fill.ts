import { GradientFillStop } from './gradient-fill-stop';

export class RadialGradientFill {
    /**
      Gradient type tag (radialGradient)
    */
    type: string;

    /**
      Gradient center point as string
    */
    center: string;

    /**
      Gradient focal point as string
    */
    focus: string;

    /**
      Gradient horizontal radius
    */
    radiusX: number;

    /**
      Gradient vertical radius
    */
    radiusY: number;

    /**
      Array of gradient fill stops
    */
    stops: GradientFillStop[];

    /**
      Radial gradient factory function
      @param center - Gradient center point serialized as string
      @param focus - Gradient focal point serialized as string
      @param radiusX - Horizontal radius
      @param radiusY - Vertical radius
      @returns New radial gradient fill
    */
    static create(center: string, focus: string, radiusX: number, radiusY: number) {
        return new RadialGradientFill(center, focus, radiusX, radiusY);
    }

    /**
      Constructs a new radial gradient fill
      @classdesc Represents a radial gradient fill
      @param center - Gradient center point serialized as string
      @param focus - Gradient focal point serialized as string
      @param radiusX - Horizontal radius
      @param radiuxY - Vertical radius
    */
    constructor(center: string, focus: string, radiusX: number, radiusY: number) {
        this.center = center;
        this.focus = focus;
        this.radiusX = radiusX;
        this.radiusY = radiusY;
        this.stops = [];
        this.type = 'radialGradient';
        this.addFillStop = this.addFillStop.bind(this);
    }

    /**
      Adds a fill stop to the gradient fill stops array
      @param color - Fill stop color
      @param offset - Fill stop offset
    */
    addFillStop(color: string, offset: number) {
        this.stops.push(new GradientFillStop(color, offset));
    }

    clone(): RadialGradientFill {
        const rgf = new RadialGradientFill(this.center, this.focus, this.radiusX, this.radiusY);
        for (let i = 0; i < this.stops.length; i++) {
            rgf.addFillStop(this.stops[i].color, this.stops[i].offset);
        }
        return rgf;
    }
}
