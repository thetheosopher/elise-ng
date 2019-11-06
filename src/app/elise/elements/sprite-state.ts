export class SpriteState {
    /**
      Visual transition in effect
    */
    transition: string;

    /**
      Offset into transition in the range of 0-1
    */
    offset: number;

    /**
      Source frame index
    */
    frame1: number;

    /**
      Target frame index
    */
    frame2: number;

    /**
      Constructs a sprite state
      @classdesc Represents the transition state of a sprite element
      @param transition - Visual transition
      @param offset - Offset into transition in the range of 0-1
      @param frame1 - Source frame index
      @param frame2 - Target frame index
    */
    constructor(transition: string, offset: number, frame1: number, frame2: number) {
        this.transition = transition;
        this.offset = offset;
        this.frame1 = frame1;
        this.frame2 = frame2;
    }
}
