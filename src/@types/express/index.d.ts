import User from "@entities/User";
import Item from "@entities/Item";
import Order from "@entities/Order";

declare module 'express' {
    export interface Request  {
        body: {
            apiKey?: string;
            promoteKey?: string;
            user?: User;
            item?: Item;
            id?: number;
            order?: Order;
        };
    }
}
