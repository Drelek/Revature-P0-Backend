import User from '@entities/User';
import Response from '@entities/Response';
import { v4 as uuid } from 'uuid';
import * as AWS from 'aws-sdk';

//AWS.config.credentials = {
//    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
//    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
//}
AWS.config.region = 'us-east-2';
const dynamo = new AWS.DynamoDB();

export interface IUserDao {
    get: (apiKey: string) => Promise<Response>;
    create: (user: User) => Promise<Response>;
    update: (apiKey: string, user: User) => Promise<Response>;
    remove: (apiKey: string) => Promise<Response>;
    promote: (fromKey: string, promoteKey: string) => Promise<Response>;
}

class UserDao implements IUserDao {
    

    /**
     * Creates a new user.
     * 
     * @param user the user object to add to the database
     * @returns a response object containing the full user object
     */
    public async create(user: User): Promise<Response> {
        try {
            const newId = uuid();
            await dynamo.putItem(user.createSchema(newId)).promise();
            const result = await dynamo.getItem(User.getSchema(newId)).promise();
            if (result.Item) {
                const newUser = new User(
                    result.Item.firstName.S || '',
                    result.Item.lastName.S || '',
                    result.Item.email.S || '',
                    result.Item.apiKey.S,
                    result.Item.admin.BOOL
                );
                return new Response(
                    true,
                    "Please take good care of your API key, you can't get it back after this.",
                    newUser
                );
            } else {
                return new Response(
                    false,
                    "An unknown error has occurred."
                );
            }
        } catch (err) {
            return new Response(
                false,
                err
            );
        }
    }


    /**
     * Gets information about a given user.
     * 
     * @param apiKey the API key for the user to fetch
     * @returns a response object containing a user object
     */
    public async get(apiKey: string): Promise<Response> {
        try {
            const result = await dynamo.getItem(User.getSchema(apiKey)).promise();
            if (result.Item) {
                const user = new User(
                    result.Item.firstName.S || '',
                    result.Item.lastName.S || '',
                    result.Item.email.S || '',
                    result.Item.apiKey.S,
                    result.Item.admin.BOOL
                );
                return new Response(
                    true,
                    user
                );
            } else {
                return new Response(
                    false,
                    "A user with that API key was not found."
                );
            }
        } catch (err) {
            return new Response(
                false,
                err
            );
        }
    }


    /**
     * Updates information about a given user.
     * 
     * @param apiKey the user to update
     * @param user the information to update to
     * @returns a response object containing the updated user object
     */
    public async update(apiKey: string, user: User): Promise<Response> {
        try {
            const exists = await this.get(apiKey);
            if (exists.data) {
                const result = await dynamo.updateItem(user.updateSchema(apiKey)).promise();
                if (result.Attributes) {
                    const newUser = new User(
                        result.Attributes.firstName.S || '',
                        result.Attributes.lastName.S || '',
                        result.Attributes.email.S || '',
                        result.Attributes.apiKey.S,
                        result.Attributes.admin.BOOL
                    );
                    return new Response(
                        true,
                        "User was updated as follows.",
                        newUser
                    );
                } else {
                    return new Response(
                        false,
                        "User does not exist."
                    );
                }                
            } else {
                return new Response(
                    false,
                    "User does not exist."
                );
            }
        } catch (err) {
            return new Response(
                false,
                err
            );
        }
    }


    /**
     * Removes a given user.
     * 
     * @param apiKey the user to remove
     * @returns a response object
     */
    public async remove(apiKey: string): Promise<Response> {
        try {
            const result = await dynamo.deleteItem(User.removeSchema(apiKey)).promise();
            if (result.Attributes) {
                return new Response(
                    true,
                    "User was deleted successfully."
                );
            } else {
                return new Response(
                    false,
                    "User does not exist."
                );
            }
        } catch (err) {
            return new Response(
                false,
                err
            );
        }
    }


    /**
     * Promotes a given user to administrator.
     * 
     * @param fromKey the API key for the user performing the promote operation
     * @param promoteKey the API key for the user to promote
     * @returns a response object containing a user object
     */
    public async promote(fromKey: string, promoteKey: string): Promise<Response> {
        if (await checkAdmin(fromKey)) {
            try {
                const exists = await this.get(promoteKey);
                if (exists.data) {
                    await dynamo.updateItem(User.promoteSchema(promoteKey)).promise();
                    return new Response(
                        true,
                        "User was promoted successfully."
                    );
                } else {
                    return new Response(
                        false,
                        "User to promote does not exist."
                    );
                }
            } catch (err) {
                return new Response(
                    false,
                    err
                );
            }
        } else {
            return new Response(
                false,
                "'From' user does not exist or is not an administrator."
            );
        }
    }

}


/**
 * Checks whether a given user is an administrator.
 * 
 * @param apiKey the user to check
 * @returns a boolean value
 */
export async function checkAdmin(apiKey: string): Promise<boolean> {
    const result = await dynamo.getItem(User.getSchema(apiKey)).promise();
    if (result.Item) return result.Item.admin.BOOL || false;
    else return false;
}

export default UserDao;
