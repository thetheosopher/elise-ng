import { Model } from '../../core/model';
import { LinearGradientFill } from '../../fill/linear-gradient-fill';
import { RadialGradientFill } from '../../fill/radial-gradient-fill';
import { MouseLocationArgs } from '../../core/mouse-location-args';
import { DesignController } from '../design-controller';

export class DesignTool {
    model: Model;
    controller: DesignController;
    opacity: number;
    stroke: string;
    fill: string | LinearGradientFill | RadialGradientFill;
    fillScale: number;
    fillOffsetX: number;
    fillOffsetY: number;
    isCreating: boolean;
    mouseDown(args: MouseLocationArgs): void {}
    mouseMove(args: MouseLocationArgs): void {}
    mouseUp(args: MouseLocationArgs): void {}
    cancel(): void {}

    constructor() {
        this.opacity = 255;
        this.fillScale = 1;
        this.fillOffsetX = 0;
        this.fillOffsetY = 0;
        this.cancel = this.cancel.bind(this);
        this.mouseDown = this.mouseDown.bind(this);
        this.mouseMove = this.mouseMove.bind(this);
        this.mouseUp = this.mouseUp.bind(this);
    }

    setFill(fill: string | LinearGradientFill | RadialGradientFill) {
        if (typeof fill === 'string') {
            this.fill = fill;
        }
        else {
            this.fill = fill.clone();
        }
    }
}
