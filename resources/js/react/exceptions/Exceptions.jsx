export class ValidationError extends Error
{
    constructor(message, extraData) {
        super(message);
        this.extraData = extraData;
    }
}
