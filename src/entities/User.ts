import { PutItemInput, UpdateItemInput, DeleteItemInput, GetItemInput } from 'aws-sdk/clients/dynamodb';

export interface IUser {
    apiKey?: string;
    firstName: string;
    lastName: string;
    email: string;
    admin?: boolean;
}

class User implements IUser {

    public apiKey?: string;
    public firstName: string;
    public lastName: string;
    public email: string;
    public admin?: boolean; 

    constructor(firstName: string, lastName: string, email: string, apiKey?: string, admin?: boolean) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        if (apiKey) this.apiKey = apiKey;
        if (admin) this.admin = admin;
    }

    public createSchema(apiKey: string): PutItemInput {
        return {
            Item: {
                "firstName": {
                    S: this.firstName
                },
                "lastName": {
                    S: this.lastName
                },
                "email": {
                    S: this.email
                },
                "admin": {
                    BOOL: false 
                },
                "apiKey": {
                    S: apiKey
                },
                "orders": {
                    L: []
                }
            },
            TableName: "Users"
        }
    }

    public updateSchema(apiKey: string): UpdateItemInput {
        return {
            ExpressionAttributeNames: {
                "#F": "firstName",
                "#L": "lastName",
                "#E": "email"
            },
            ExpressionAttributeValues: {
                ":f": {S: this.firstName},
                ":l": {S: this.lastName},
                ":e": {S: this.email}
            }, 
            Key: {
                "apiKey": {S: apiKey}
            },
            ReturnValues: "ALL_NEW",
            TableName: "Users",
            UpdateExpression: "SET #F = :f, #L = :l, #E = :e",
            ConditionExpression: "attribute_exists(apiKey)"
        }
    }

    public static getSchema(apiKey: string): GetItemInput {
        return {
            TableName: "Users",
            Key: {
                "apiKey": {
                    S: apiKey
                }
            }
        }
    }

    public static removeSchema(apiKey: string): DeleteItemInput {
        return {
            TableName: "Users",
            Key: {
                "apiKey": {
                    S: apiKey
                }
            },
            ReturnValues: "ALL_OLD"
        }
    }

    public static promoteSchema(apiKey: string): UpdateItemInput {
        return {
            ExpressionAttributeNames: {
                "#a": "admin"
            },
            ExpressionAttributeValues: {
                ":a": {BOOL: true}
            }, 
            Key: {
                "apiKey": {S: apiKey}
            },
            ReturnValues: "ALL_NEW",
            TableName: "Users",
            UpdateExpression: "SET #a = :a",
            ConditionExpression: "attribute_exists(apiKey)"
        }
    }

    public static createFromObject(obj: any): User {
        return new User(obj.firstName, obj.lastName, obj.email);
    }
}

export default User;
