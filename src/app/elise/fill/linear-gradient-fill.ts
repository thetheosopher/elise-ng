import { GradientFillStop } from './gradient-fill-stop';

export class LinearGradientFill {
    /**
      Gradient type tag (linearGradient)
    */
    type: string;

    /**
      Gradient start point as string
    */
    start: string;

    /**
      Gradient end point as string
    */
    end: string;

    /**
      Array of gradient fill stops
    */
    stops: GradientFillStop[];

    /**
      Linear gradient factory function
      @param start - Start point serialized as a string
      @param end - End point serialized as a string
      @returns New linear gradient fill
    */
    static create(start: string, end: string) {
        return new LinearGradientFill(start, end);
    }

    /**
      Constructs a new linear gradient fill
      @classdec Represents a linear gradient fill
      @param start - Start point serialized as a string
      @param end - End point serialized as a string
    */
    constructor(start: string, end: string) {
        this.start = start;
        this.end = end;
        this.stops = [];
        this.type = 'linearGradient';
        this.addFillStop = this.addFillStop.bind(this);
    }

    clone(): LinearGradientFill {
        const lgr = new LinearGradientFill(this.start, this.end);
        for (let i = 0; i < this.stops.length; i++) {
            lgr.addFillStop(this.stops[i].color, this.stops[i].offset);
        }
        return lgr;
    }

    /**
      Adds a fill stop to the gradient fill stops array
      @method Elise.Drawing.LinearGradientFill#addFillStop
      @param color - Fill stop color
      @param offset - Fill stop offset
    */
    addFillStop(color: string, offset: number) {
        this.stops.push(new GradientFillStop(color, offset));
    }
}
