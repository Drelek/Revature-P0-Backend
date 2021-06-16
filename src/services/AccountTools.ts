// File contains all of the functions pertaining to user accounts.
// All functions other than create will return an error if the user is not logged in.

import * as AWS from 'aws-sdk';
import * as types from '../types/types';
import { v4 as uuid } from 'uuid';
import { UpdateItemInput } from 'aws-sdk/clients/dynamodb';

AWS.config.loadFromPath(process.cwd() + '/config/aws-credentials.json');
const dynamo = new AWS.DynamoDB();

/**
 * Creates a new user.
 * @param user the user object to add to the database
 * @returns a response object containing the full user object
 */
export async function create(user: types.User): Promise<types.Response> {
    try {
        const newId = uuid();
        const result = await dynamo.putItem(types.createUserSchema(user, newId)).promise();
        if (result.Attributes) {
            const newUser: types.User = {
                apiKey: result.Attributes.apiKey.S,
                firstName: result.Attributes.firstName.S,
                lastName: result.Attributes.lastName.S,
                email: result.Attributes.email.S,
                admin: result.Attributes.admin.BOOL
            }
            const response: types.Response = {
                success: true,
                message: "Please take good care of your API key, you can't get it back after this.",
                data: newUser
            }
            return response;
        } else {
            const response: types.Response = {
                success: false,
                message: "An unknown error has occurred."
            }
            return response;
        }
    } catch (err) {
        const response: types.Response = {
            success: false,
            data: err
        }
        return response;
    }
}

/**
 * Gets information about a given user.
 * @param apiKey the API key for the user to fetch
 * @returns a response object containing a user object
 */
export async function get(apiKey: string): Promise<types.Response> {
    try {
        const result = await dynamo.getItem({ TableName: "Users", Key: { "apiKey": { S: apiKey } } }).promise();
        if (result.Item) {
            const user: types.User = {
                apiKey: result.Item.apiKey.S,
                firstName: result.Item.firstName.S,
                lastName: result.Item.lastName.S,
                email: result.Item.email.S,
                admin: result.Item.admin.BOOL
            }
            const response: types.Response = {
                success: true,
                data: user
            }
            return response;
        } else {
            const response: types.Response = {
                success: false,
                message: "A user with that API key was not found."
            }
            return response;
        }
    } catch (err) {
        const response: types.Response = {
            success: false,
            data: err
        }
        return response;
    }
}

/**
 * Updates information about a given user.
 * @param apiKey the user to update
 * @param user the information to update to
 * @returns a response object containing the updated user object
 */
export async function update(apiKey: string, user: types.User): Promise<types.Response> {
    try {
        const input: UpdateItemInput = {
            ExpressionAttributeNames: {
                "#F": "firstName",
                "#L": "lastName",
                "#E": "email"
            },
            ExpressionAttributeValues: {
                ":f": {S: user.firstName},
                ":l": {S: user.lastName},
                ":e": {S: user.email}
            }, 
            Key: {
                "apiKey": {S: apiKey}
            },
            ReturnValues: "ALL_NEW",
            TableName: "Users",
            UpdateExpression: "SET #F = :f, #L = :l, #E = :e"
        }
        const result = await dynamo.updateItem(input).promise();
        if (result.Attributes) {
            const newUser = {
                apiKey: result.Attributes.apiKey.S,
                firstName: result.Attributes.firstName.S,
                lastName: result.Attributes.lastName.S,
                email: result.Attributes.email.S,
                admin: result.Attributes.admin.BOOL
            }
            const response: types.Response = {
                success: true,
                message: "User was updated as follows.",
                data: newUser
            }
            return response;
        } else {
            const response: types.Response = {
                success: false,
                message: "User does not exist."
            }
            return response;
        }
    } catch (err) {
        const response: types.Response = {
            success: false,
            data: err
        }
        return response;
    }
}

/**
 * Removes a given user.
 * @param apiKey the user to remove
 * @returns a response object
 */
export async function remove(apiKey: string): Promise<types.Response> {
    try {
        const result = await dynamo.deleteItem({ TableName: "Users", Key: { "apiKey": { S: apiKey } }, ReturnValues: "ALL_OLD" }).promise();
        if (result.Attributes) {
            const response: types.Response = {
                success: true,
                message: "User was deleted successfully.",
            }
            return response;
        } else {
            const response: types.Response = {
                success: false,
                message: "User does not exist.",
                data: { EnteredKey: apiKey }
            }
            return response;
        }
    } catch (err) {
        const response: types.Response = {
            success: false,
            data: err
        }
        return response;
    }

}

/**
 * Promotes a given user to administrator.
 * @param fromKey the API key for the user performing the promote operation
 * @param promoteKey the API key for the user to promote
 * @returns a response object containing a user object
 */
export async function promote(fromKey: string, promoteKey: string) {
    if (await checkAdmin(fromKey)) {
        try {
            const input: UpdateItemInput = {
                ExpressionAttributeNames: {
                    "#a": "admin"
                },
                ExpressionAttributeValues: {
                    ":a": {BOOL: true}
                }, 
                Key: {
                    "apiKey": {S: promoteKey}
                },
                ReturnValues: "ALL_NEW",
                TableName: "Users",
                UpdateExpression: "SET #a = :a"
            }
            const result = await dynamo.updateItem(input).promise();
            if (result.Attributes) {
                const newUser = {
                    apiKey: result.Attributes.apiKey.S,
                    firstName: result.Attributes.firstName.S,
                    lastName: result.Attributes.lastName.S,
                    email: result.Attributes.email.S,
                    admin: result.Attributes.admin.BOOL
                }
                const response: types.Response = {
                    success: true,
                    message: "User was promoted successfully.",
                    data: newUser
                }
                return response;
            } else {
                const response: types.Response = {
                    success: false,
                    message: "User to promote does not exist."
                }
                return response;
            }
        } catch (err) {
            const response: types.Response = {
                success: false,
                data: err
            }
            return response;
        }
    } else {
        const response: types.Response = {
            success: false,
            message: "'From' user does not exist or is not an administrator."
        }
        return response;
    }
}

/**
 * Checks whether a given user is an administrator.
 * @param apiKey the user to check
 * @returns a boolean value
 */
export async function checkAdmin(apiKey: string): Promise<boolean> {
    const result = await get(apiKey);
    if (result.data) return result.data["admin"];
    else return false;
}

export default { create, get, update, remove, promote, checkAdmin };