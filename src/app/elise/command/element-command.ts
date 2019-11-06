export class ElementCommand {
    /**
      Command name
    */
    name: string;

    /**
      Command parameter
    */
    parameter: string;

    /**
      Constructs an element command
      @classdesc Describes an element command and optional parameter
      @param name - Command name
      @param parameter - Command parameter
     */
    constructor(name: string, parameter: string) {
        this.name = name;
        this.parameter = parameter;
    }

    /**
      Parses string into element command
      @param commandString - Command string
      @returns Parsed element command
     */
    static parse(commandString: string): ElementCommand {
        if (commandString.indexOf('(') !== -1) {
            const commandName = commandString.substring(0, commandString.indexOf('('));
            const commandParameter = commandString.substring(commandString.indexOf('(') + 1, commandString.length - 1);
            return new ElementCommand(commandName, commandParameter);
        }
        return new ElementCommand(commandString, '');
    }
}
