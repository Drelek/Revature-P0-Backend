// File contains all of the functions pertaining to user accounts.
// All functions other than create will return an error if the user is not logged in.

import * as AWS from 'aws-sdk';
import * as types from '../types/types';
import {v4 as uuid} from 'uuid';

AWS.config.loadFromPath(process.cwd() + '/config/aws-credentials.json');
const dynamo = new AWS.DynamoDB();

/**
 * Creates a new user and logs them in.
 * @param user the user object to add to the database
 * @returns the created user object
 */
export async function create (user: types.User): Promise<types.User> {
    const newId = uuid();
    const result = await dynamo.putItem(types.createUserSchema(user, newId)).promise();
    user.admin = false;
    user.apiKey = newId;
    return user;
}

/**
 * Gets information about the current user.
 * User must be logged in.
 * If an API key is provided and the current user is an administrator,
 * gets information about the user with the given API key instead.
 * @param key (optional) the API key for the user to fetch
 * @returns a user object
 */
export async function get (apiKey: string): Promise<types.Response> {
    const result = await dynamo.getItem({TableName: "Users", Key: {"apiKey": {S: apiKey}}}).promise();
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
}

/**
 * Updates information about the current user.
 * User must be logged in.
 * @param user a user object to update to
 * @returns the updated user object
 */
export function update (apiKey, user) {

}

/**
 * Removes the current user and logs them out.
 * @returns a response object
 */
export function remove (apiKey) {

}

/**
 * Promotes another user to administrator.
 * @param key the API key for the user to promote
 * @returns a response object
 */
export function promote (fromKey, promoteKey) {

}

export default {create, get, update, remove, promote};