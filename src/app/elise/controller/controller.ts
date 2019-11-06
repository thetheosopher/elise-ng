import { Model } from '../core/model';
import { IControllerEvent } from './controller-event';
import { ElementCommandHandler } from '../command/element-command-handler';
import { ElementBase } from '../elements/element-base';
import { TimerParameters } from '../core/timer-parameters';

export interface IController {
    model: Model;

    modelUpdated: IControllerEvent<Model>;
    enabledChanged: IControllerEvent<boolean>;
    commandHandler: ElementCommandHandler;

    mouseEnteredElement: IControllerEvent<ElementBase>;
    mouseLeftElement: IControllerEvent<ElementBase>;
    mouseDownElement: IControllerEvent<ElementBase>;
    mouseUpElement: IControllerEvent<ElementBase>;
    elementClicked: IControllerEvent<ElementBase>;
    timer: IControllerEvent<TimerParameters>;

    draw(): void;
    invalidate(): void;
}
