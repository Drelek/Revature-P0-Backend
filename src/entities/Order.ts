import { UpdateItemInput } from 'aws-sdk/clients/dynamodb';

export interface IOrder {
    receipt?: number;
    user?: string;
    items: number[];
    total?: number;
    timestamp?: string;
}

class Order implements IOrder {
    public receipt?: number;
    public user?: string;
    public items: number[];
    public total?: number;
    public timestamp?: string;

    // eslint-disable-next-line max-len
    constructor(items: number[], receipt?: number, user?: string, total?: number, timestamp?: string) {
        if (receipt != undefined) this.receipt = receipt;
        if (user != undefined) this.user = user;
        this.items = items;
        if (total != undefined) this.total = total;
        if (timestamp != undefined) this.timestamp = timestamp;
    }

    
    /**
     * Transforms the items array into an array of strings
     *  for DynamoDB compatibility.
     * 
     * @returns 
     */
    public getItemsString(): string[] {
        const newItems: string[] = [];
        for (const item of this.items) newItems.push(String(item));
        return newItems;
    }


    /**
     * Creates the DynamoDB parameters necessary for placing an order.
     * 
     * @param apiKey 
     * @returns 
     */
    public placeSchema(apiKey: string): UpdateItemInput {
        return {
            ExpressionAttributeNames: {
                "#O": "orders"
            },
            ExpressionAttributeValues: {
                ":o": {
                    L: [{
                        M: {
                            "receipt": {N: `${this.receipt || 0}`},
                            "user": {S: this.user},
                            "items": {NS: this.getItemsString()},
                            "total": {N: `${this.total || 0}`},
                            "timestamp": {S: this.timestamp}
                        }
                    }]                   
                }
            },
            Key: {
                "apiKey": {S: apiKey}
            },
            TableName: "Users",
            UpdateExpression: "SET #O = list_append(#O, :o)",
            ReturnValues: "UPDATED_NEW"            
        }
    }


    /**
     * Creates the DynamoDB parameters for a get operation.
     * 
     * @param apiKey 
     * @returns 
     */
    public static getSchema(apiKey: string) {
        return {
            TableName: "Users",
            Key: {
                "apiKey": apiKey
            },
            ProjectionExpression: "orders"
        }
    }


    /**
     * Creates the DynamoDB parameters necessary for cancelling an order.
     * 
     * @param apiKey 
     * @param orders 
     * @returns 
     */
    public static cancelSchema(apiKey: string, orders: any[]) {
        return {
            ExpressionAttributeNames: {
                "#O": "orders"
            },
            ExpressionAttributeValues: {
                ":o": orders
            },
            Key: {
                "apiKey": apiKey
            },
            TableName: "Users",
            UpdateExpression: "SET #O = :o",
            ReturnValues: "UPDATED_NEW"            
        }
    }


    /**
     * Creates a new order object from an untyped object.
     * 
     * @param obj 
     * @returns 
     */
    public static createFromObject(obj: any): Order {
        return new Order(
            obj.items,
            obj.receipt,
            obj.user,
            obj.total,
            obj.timestamp
        );
    }
}

export default Order;