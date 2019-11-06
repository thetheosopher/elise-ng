export class GradientFillStop {
    /**
      Stop color as string
    */
    color: string;

    /**
      Stop offset (0-1)
    */
    offset: number;

    /**
     * Clones gradient stop collection
     * @param stops Stops to clone
     */
    static cloneStops(stops: GradientFillStop[]): GradientFillStop[] {
        const cloned = [];
        for (let i = 0; i < stops.length; i++) {
            cloned.push(stops[i].clone());
        }
        return cloned;
    }

    /**
      Fill stop factory function
      @param color - Stop color represented as a string
      @param offset - Stop offset in the range of 0 to 1
      @returns New fill stop
    */
    static create(color: string, offset: number) {
        return new GradientFillStop(color, offset);
    }

    /**
      Constructs a gradient fill stop
      @classdev Represents a radial or linear gradient color fill stop
      @param color - Stop color represented as a string
      @param offset - Stop offset in the range of 0 to 1
    */
    constructor(color: string, offset: number) {
        this.color = color;
        this.offset = offset;
    }

    clone(): GradientFillStop {
        const stop = new GradientFillStop(this.color, this.offset);
        return stop;
    }
}
