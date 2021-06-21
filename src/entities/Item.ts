// eslint-disable-next-line max-len
import { PutItemInput, UpdateItemInput, DeleteItemInput, GetItemInput, ScanInput } from 'aws-sdk/clients/dynamodb';

export interface IItem {
    id?: number;
    name: string;
    description: string;
    price: number;
    tags: string[];
}

class Item implements IItem {
    public id?: number;
    public name: string;
    public description: string;
    public price: number;
    public tags: string[];

    constructor(name: string, description: string, price: number, ...idAndTags: (string|number)[]) {
        this.name = name;
        this.description = description;
        this.price = price;
        this.tags = [];
        for (const thing of idAndTags) {
            if (typeof thing == 'number') this.id = thing;
            else this.tags.push(thing);
        }
    }

    public createSchema(id: number): PutItemInput {
        return {
            Item: {
                "id": {
                    N: '' + id
                },
                "name": {
                    S: this.name
                },
                "description": {
                    S: this.description
                },
                "price": {
                    N: '' + this.price
                },
                "tags": {
                    SS: this.tags
                }
            },
            TableName: "Items"
        }
    }

    public updateSchema(id: number): UpdateItemInput {
        return {
            ExpressionAttributeNames: {
                "#N": "name",
                "#D": "description",
                "#P": "price",
                "#T": "tags"
            },
            ExpressionAttributeValues: {
                ":n": {S: this.name},
                ":d": {S: this.description},
                ":p": {N: ''+this.price},
                ":t": {SS: this.tags}
            }, 
            Key: {
                "id": {N: ''+id}
            },
            ReturnValues: "ALL_NEW",
            TableName: "Items",
            UpdateExpression: "SET #N = :n, #D = :d, #P = :p, #T = :t",
            ConditionExpression: "attribute_exists(id)"
        }
    }

    public static getSchema(id: number): GetItemInput {
        return {
            TableName: "Items",
            Key: {
                "id": {
                    N: ''+id
                }
            }
        }
    }

    public static getAllSchema(): ScanInput {
        return {
            TableName: "Items"
        }
    }

    public static getTaggedSchema(tag: string): ScanInput {
        return {
            TableName: "Items",
            ExpressionAttributeNames: {
                "#T": "tags"
            },
            ExpressionAttributeValues: {
                ":t": {
                    S: tag
                }
            },
            FilterExpression: "contains(#T, :t)"
        }
    }

    public static removeSchema(id: number): DeleteItemInput {
        return {
            TableName: "Items",
            Key: {
                "id": {
                    N: ''+id
                }
            },
            ReturnValues: "ALL_OLD"
        }
    }

    public static createFromObject(obj: any): Item {
        return new Item(obj.name, obj.description, obj.price, obj.id, ...obj.tags);
    }
}

export default Item;