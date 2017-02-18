export class PlaygroundError extends Error {
    constructor(type, message, data) {
        super(message);
        this.type = type;
        this.data = data;
    }
}
