export interface IResponse {
    success: boolean;
    message?: string;
    data?: object;
}

class Response implements IResponse {
    success: boolean;
    message?: string;
    data?: object;

    constructor(success: boolean, ...details: (string | object)[]) {
        this.success = success;
        for (let item of details) {
            if (typeof item === 'string') this.message = item;
            else this.data = item;
        }
    }
}

export default Response;