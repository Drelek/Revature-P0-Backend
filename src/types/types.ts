// File contains all of the classes to be used.

/**
 * Used for describing a user's information.
 */
export class User {

}

/**
 * Used for describing a purchaseable item.
 */
export class Item {

}

/**
 * Used for describing an order.
 */
export class Order {

}

/**
 * Used for providing feedback to an operation, be it success or error.
 */
export class Response {
    type: string;
    message: string;
    data: object;
}