export class ControllerEventArgs {
    /**
      DOM Event
    */
    event: Event;

    /**
      @param event - DOM event
    */
    constructor(event: Event) {
        this.event = event;
    }
}
