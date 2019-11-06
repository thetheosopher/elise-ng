import { SurfaceViewController } from './surface-view-controller';
import { Animation } from './animation';

export class AnimationViewController extends SurfaceViewController {
    /**
      Controlled animation
    */
    animation: Animation;

    /**
      @classdesc Extends SurfaceViewController to add animation property
      @extends Elise.Player.SurfaceViewController
    */
    constructor() {
        super();
    }
}
