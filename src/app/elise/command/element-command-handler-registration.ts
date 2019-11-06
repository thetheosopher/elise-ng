import { ICommandHandlerMethod } from './command-handler';
import { ElementBase } from '../elements/element-base';

export class ElementCommandHandlerRegistration {
    command: string;
    handler: ICommandHandlerMethod<ElementBase>;

    constructor(command: string, handler: ICommandHandlerMethod<ElementBase>) {
        this.command = command;
        this.handler = handler;
    }
}
