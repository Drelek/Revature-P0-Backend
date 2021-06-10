// File contains all of the functions related to purchasable items.

/**
 * Gets all of the items available for purchase.
 * @returns an array of item objects
 */
export function getAll () {

}

/**
 * Gets all of the information about a single item.
 * @param itemId the ID of the item to get
 * @returns an item object
 */
export function get (itemId) {

}

/**
 * Gets all of the items with a given tag.
 * @param tag the tag to search for
 * @returns an array of item objects
 */
export function getTagged (tag) {

}

/**
 * Adds an item to the list of purchasable items.
 * User must be logged in and administrator.
 * @param item the item to add
 * @returns a response object
 */
export function add (item) {

}

/**
 * Removes an item from the list of purchaseable items.
 * User must be logged in and administrator.
 * @param itemId the ID of the item to remove
 * @returns a response object
 */
export function remove (itemId) {

}

export default {getAll, get, getTagged, add, remove};