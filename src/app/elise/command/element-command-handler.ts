import { ICommandHandler } from './command-handler';
import { ElementBase } from '../elements/element-base';
import { ElementCommandHandlerRegistration } from './element-command-handler-registration';
import { IController } from '../controller/controller';
import { CommandEventTrigger } from './command-event-trigger';
import { Model } from '../core/model';
import { TimerParameters } from '../core/timer-parameters';
import { ModelResource } from '../resource/model-resource';
import { ModelElement } from '../elements/model-element';
import { ElementCommand } from './element-command';
import { ICommandHandlerMethod } from './command-handler';
import { SpriteElement } from '../elements/sprite-element';

export class ElementCommandHandler implements ICommandHandler<ElementBase> {
    static PUSH_FILL = 'pushFill';
    static POP_FILL = 'popFill';
    static PUSH_STROKE = 'pushStroke';
    static POP_STROKE = 'popStroke';
    static PUSH_FRAME = 'pushFrame';
    static POP_FRAME = 'popFrame';

    registrations: ElementCommandHandlerRegistration[] = [];

    static pushFill(c: IController, el: ElementBase, command: string, trigger: string, parameters: string) {
        if (!el.fillStack) {
            el.fillStack = [];
        }
        if (el.fill) {
            el.fillStack.push(el.fill);
        }
        else {
            el.fillStack.push('');
        }
        const ec: ElementCommand = ElementCommand.parse(command);
        el.setFill(ec.parameter);
        c.draw();
    }

    static popFill(c: IController, el: ElementBase, command: string, trigger: string, parameters: string) {
        if (!el.fillStack) {
            return;
        }
        if (el.fillStack.length > 0) {
            el.fill = el.fillStack.pop();
        }
        if (el.fillStack.length === 0) {
            delete el.fillStack;
        }
        c.draw();
    }

    static pushStroke(c: IController, el: ElementBase, command: string, trigger: string, parameters: string) {
        if (!el.strokeStack) {
            el.strokeStack = [];
        }
        if (el.stroke) {
            el.strokeStack.push(el.stroke);
        }
        else {
            el.strokeStack.push('');
        }
        const ec: ElementCommand = ElementCommand.parse(command);
        el.stroke = ec.parameter;
        c.draw();
    }

    static popStroke(c: IController, el: ElementBase, command: string, trigger: string, parameters: any) {
        if (!el.strokeStack) {
            return;
        }
        if (el.strokeStack.length > 0) {
            el.stroke = el.strokeStack.pop();
        }
        if (el.strokeStack.length === 0) {
            delete el.strokeStack;
        }
        c.draw();
    }

    static pushFrame(c: IController, el: SpriteElement, command: string, trigger: string, parameters: any) {
        if (!el.frameStack) {
            el.frameStack = [];
        }
        el.frameStack.push(el.frameIndex);
        const ec: ElementCommand = ElementCommand.parse(command);
        el.frameIndex = parseInt(ec.parameter, 10);
        c.draw();
    }

    static popFrame(c: IController, el: SpriteElement, command: string, trigger: string, parameters: any) {
        if (!el.frameStack) {
            return;
        }
        if (el.frameStack.length > 0) {
            el.frameIndex = el.frameStack.pop();
        }
        if (el.frameStack.length === 0) {
            delete el.frameStack;
        }
        c.draw();
    }

    constructor() {
        this.attachController = this.attachController.bind(this);
        this.elementMouseEntered = this.elementMouseEntered.bind(this);
        this.elementMouseLeft = this.elementMouseLeft.bind(this);
        this.elementMouseDown = this.elementMouseDown.bind(this);
        this.elementMouseUp = this.elementMouseUp.bind(this);
        this.elementClicked = this.elementClicked.bind(this);
        this.callElementTimers = this.callElementTimers.bind(this);
        this.timer = this.timer.bind(this);
        this.onElementCommandFired = this.onElementCommandFired.bind(this);
    }

    attachController(controller: IController): void {
        controller.commandHandler = this;

        controller.mouseEnteredElement.add(this.elementMouseEntered);
        controller.mouseLeftElement.add(this.elementMouseLeft);
        controller.mouseDownElement.add(this.elementMouseDown);
        controller.mouseUpElement.add(this.elementMouseUp);
        controller.elementClicked.add(this.elementClicked);
        controller.timer.add(this.timer);
    }

    elementMouseEntered(c: IController, el?: ElementBase) {
        if (el.mouseEnter) {
            c.commandHandler.onElementCommandFired(c, el, el.mouseEnter, CommandEventTrigger.MouseEnter, null);
        }
    }

    elementMouseLeft(c: IController, el: ElementBase) {
        if (el.mouseLeave) {
            c.commandHandler.onElementCommandFired(c, el, el.mouseLeave, CommandEventTrigger.MouseLeave, null);
        }
    }

    elementMouseDown(c: IController, el: ElementBase) {
        if (el.mouseDown) {
            c.commandHandler.onElementCommandFired(c, el, el.mouseDown, CommandEventTrigger.MouseDown, null);
        }
    }

    elementMouseUp(c: IController, el: ElementBase) {
        if (el.mouseUp) {
            c.commandHandler.onElementCommandFired(c, el, el.mouseUp, CommandEventTrigger.MouseUp, null);
        }
    }

    elementClicked(c: IController, el: ElementBase) {
        if (el.click) {
            c.commandHandler.onElementCommandFired(c, el, el.click, CommandEventTrigger.Click, null);
        }
    }

    callElementTimers(m: Model, controller: IController, params: TimerParameters) {
        let l = m.elements.length;
        for (let i = 0; i < l; i++) {
            const e = m.elements[i];
            if (e) {
                if (e.timer) {
                    controller.commandHandler.onElementCommandFired(
                        controller,
                        e,
                        e.timer,
                        CommandEventTrigger.Timer,
                        params
                    );
                }
                if (e.type === 'model') {
                    let innerModel: Model = null;
                    const modelElement = e as ModelElement;
                    if (!modelElement.sourceModel) {
                        const res = m.resourceManager.get(modelElement.source) as ModelResource;
                        innerModel = res.model;
                    }
                    else {
                        innerModel = modelElement.sourceModel;
                    }
                    if (innerModel) {
                        this.callElementTimers(innerModel, controller, params);
                    }
                }
            }
        }
        l = m.resources.length;
        for (let i = 0; i < l; i++) {
            const r = m.resources[i];
            if (r.type === 'model') {
                const mr = r as ModelResource;
                if (mr.model) {
                    this.callElementTimers(mr.model, controller, params);
                }
            }
        }
    }

    timer(controller: IController, params: TimerParameters) {
        const m = controller.model;
        this.callElementTimers(m, controller, params);
    }

    onElementCommandFired(controller: IController, el: ElementBase, command: string, trigger: string, parameters: any) {
        const ec = ElementCommand.parse(command);
        const reg = this.getRegistration(ec.name);
        if (!reg) {
            return false;
        }
        reg.handler(controller, el, command, trigger, parameters);
        return true;
    }

    getRegistration(command: string) {
        for (let i = 0; i < this.registrations.length; i++) {
            const reg = this.registrations[i];
            if (reg.command === command) {
                return reg;
            }
        }
        return null;
    }

    addHandler(command: string, handler: ICommandHandlerMethod<ElementBase>) {
        const found: ElementCommandHandlerRegistration = this.getRegistration(command);
        if (!found) {
            this.registrations.push(new ElementCommandHandlerRegistration(command, handler));
        }
        else {
            found.handler = handler;
        }
    }

    removeHandler(command: string) {
        const found: ElementCommandHandlerRegistration = this.getRegistration(command);
        if (found) {
            this.registrations.splice(this.registrations.indexOf(found), 1);
        }
    }

    clearHandlers() {
        this.registrations = [];
    }
}
