// File contains all of the functions pertaining to user accounts.
// All functions other than create will return an error if the user is not logged in.

/**
 * Creates a new user and logs them in.
 * @param user the user object to add to the database
 * @returns the created user object
 */
export function create (user) {

}

/**
 * Gets information about the current user.
 * User must be logged in.
 * If an API key is provided and the current user is an administrator,
 * gets information about the user with the given API key instead.
 * @param key (optional) the API key for the user to fetch
 * @returns a user object
 */
export function get (key) {

}

/**
 * Updates information about the current user.
 * User must be logged in.
 * @param user a user object to update to
 * @returns the updated user object
 */
export function update (user) {

}

/**
 * Removes the current user and logs them out.
 * @returns a response object
 */
export function remove () {

}

/**
 * Promotes another user to administrator.
 * User must be logged in and administrator.
 * @param key the API key for the user to promote
 * @returns a response object
 */
export function promote (key) {

}

export default {create, get, update, remove, promote};