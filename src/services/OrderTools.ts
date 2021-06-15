// File contains all of the functions pertaining to orders.

/**
 * Places an order for a given user.
 * @param order the order to be placed
 * @returns a response object
 */
export function place (apiKey, order) {

}

/**
 * Cancels a given order if it was placed within the past ten minutes.
 * @param orderId the ID of the order to be cancelled
 * @returns a response object
 */
export function cancel (apiKey, orderId) {

}

/**
 * Returns the entire order history of a given user.
 * @returns an array of orders
 */
export function getHistory (apiKey) {

}

export default {place, cancel, getHistory};