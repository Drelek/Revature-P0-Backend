// File contains all of the functions pertaining to orders.

/**
 * Places an order for the current user.
 * User must be logged in.
 * @param order the order to be placed
 * @returns a response object
 */
export function place (order) {

}

/**
 * Cancels a given order if it was placed within the past ten minutes.
 * @param orderId the ID of the order to be cancelled
 * @returns a response object
 */
export function cancel (orderId) {

}

/**
 * Returns the entire order history of the current user.
 * @returns an array of orders
 */
export function getHistory () {

}

export default {place, cancel, getHistory};