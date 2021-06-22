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

    
    /**
     * Creates the DynamoDB parameters for a put operation.
     * 
     * @param id 
     * @returns 
     */
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


    /**
     * Creates the DynamoDB parameters for an update operation.
     * 
     * @param id 
     * @returns 
     */
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


    /**
     * Creates the DynamoDB parameters for a get operation.
     * 
     * @param id 
     * @returns 
     */
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


    /**
     * Creates the DynamoDB parameters for a scan operation.
     * 
     * @returns 
     */
    public static getAllSchema(): ScanInput {
        return {
            TableName: "Items"
        }
    }


    /**
     * Creates the DynamoDB parameters for a specific scam operation.
     * 
     * @param tag 
     * @returns 
     */
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


    /**
     * Creates the DynamoDB parameters for a delete operation.
     * 
     * @param id 
     * @returns 
     */
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


    /**
     * Creates an Item object from an object of any type.
     * 
     * @param obj 
     * @returns 
     */
    public static createFromObject(obj: any): Item {
        return new Item(obj.name, obj.description, obj.price, obj.id, ...obj.tags);
    }
}

export default Item;