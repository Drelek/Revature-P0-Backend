import { UpdateItemInput, DeleteItemInput } from 'aws-sdk/clients/dynamodb';

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

    constructor(items: number[], receipt?: number, user?: string, total?: number, timestamp?: string) {
        if (receipt != undefined) this.receipt = receipt;
        if (user != undefined) this.user = user;
        this.items = items;
        if (total != undefined) this.total = total;
        if (timestamp != undefined) this.timestamp = timestamp;
    }

    public getItemsString(): string[] {
        const newItems: string[] = [];
        for (let item of this.items) newItems.push(String(item));
        return newItems;
    }

    public placeSchema(apiKey: string): UpdateItemInput {
        return {
            ExpressionAttributeNames: {
                "#O": "orders"
            },
            ExpressionAttributeValues: {
                ":o": {
                    L: [{
                        M: {
                            "receipt": {N: `${this.receipt}`},
                            "user": {S: this.user},
                            "items": {NS: this.getItemsString()},
                            "total": {N: `${this.total}`},
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

    public static getSchema(apiKey: string) {
        return {
            TableName: "Users",
            Key: {
                "apiKey": apiKey
            },
            ProjectionExpression: "orders"
        }
    }

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