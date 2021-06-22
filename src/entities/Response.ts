// All data returned by the API should be in the form of a response.

export interface IResponse {
    success: boolean;
    message?: string;
    data?: any;
}

class Response implements IResponse {
    success: boolean;
    message?: string;
    data?: any;

    constructor(success: boolean, ...details: (string | unknown)[]) {
        this.success = success;
        for (const item of details) {
            if (typeof item === 'string') this.message = item;
            else this.data = item;
        }
    }
}

export default Response;