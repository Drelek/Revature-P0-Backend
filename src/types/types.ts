// File contains all of the classes to be used.

import { Boolean } from "aws-sdk/clients/codebuild";
import { PutItemInput } from "aws-sdk/clients/dynamodb";

/**
 * Used for describing a user's information.
 */
export class User {
    apiKey?: string;
    firstName: string;
    lastName: string;
    email: string;
    admin?: boolean;
}

/**
 * Used for describing a purchaseable item.
 */
export class Item {
    id: number;
    name: string;
    description: string;
    price: number;
    tags: string[];
}

/**
 * Used for describing an order.
 */
export class Order {
    id: number;
    user: string;
    items: number[];
}

/**
 * Used for providing feedback to an operation, be it success or error.
 */
export class Response {
    success: boolean;
    message?: string;
    data?: object;
}

export function createUserSchema(user: User, apiKey: string): PutItemInput {
    return {
        Item: {
            "firstName": {
                S: user.firstName
            },
            "lastName": {
                S: user.lastName
            },
            "email": {
                S: user.email
            },
            "admin": {
                BOOL: false
            },
            "apiKey": {
                S: apiKey
            }
        },
        TableName: "Users"
    }
}