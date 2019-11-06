export class Logging {
    static enabled = false;

    static log(message: string) {
        if (Logging.enabled) {
            console.log(message);
        }
    }
}
