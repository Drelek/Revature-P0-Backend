import User from "@entities/User";

declare module 'express' {
    export interface Request  {
        body: {
            apiKey?: string
            promoteKey?: string
            user?: User
        };
    }
}
