import Order from '@entities/Order';
import Item from '@entities/Item';
import User from '@entities/User'
import Response from '@entities/Response';
import UserDao from '@daos/UserDao';
import ItemDao from '@daos/ItemDao';
import * as AWS from 'aws-sdk';

//AWS.config.credentials = {
//    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
//    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
//}
AWS.config.region = 'us-east-2';
const dynamo = new AWS.DynamoDB();
const dynamoDoc = new AWS.DynamoDB.DocumentClient();

const userDao = new UserDao();
const itemDao = new ItemDao();

// Ten minutes in MS
const TEN_MINUTES = 1000 * 60 * 10;

export interface IOrderDao {
    place: (apiKey: string, order: Order) => Promise<Response>;
    get: (apiKey: string, receipt: number) => Promise<Response>;
    getAll: (apiKey: string) => Promise<Response>;
    cancel: (apiKey: string, receipt: number) => Promise<Response>;
}

class OrderDao implements IOrderDao {


    /**
     * Places an order for the specified user.
     * Automatically fills in all relevant information, requiring only an array of item ids.
     * 
     * @param apiKey the user to place the order for
     * @param order the order object to be placed
     * @returns a response object containing the order details
     */
    public async place(apiKey: string, order: Order): Promise<Response> {
        try {
            const orderTimestamp = Date();
            const orderReceipt = Date.parse(orderTimestamp);

            let total = 0;
            for (const item of order.items) {
                const itemResult = await itemDao.get(item);
                if (itemResult.data == undefined) 
                    return new Response(false, "Invalid item ID: " + item);
                const itemInfo = Item.createFromObject(itemResult.data);
                total += itemInfo.price;
            }

            const userResult = await userDao.get(apiKey);
            if (userResult.data == undefined) return new Response(false, "User does not exist.");
            const user = User.createFromObject(userResult.data);

            const orderToPlace = new Order(
                order.items,
                orderReceipt,
                user.firstName + " " + user.lastName,
                total,
                orderTimestamp
            );

            const result = await dynamo.updateItem(orderToPlace.placeSchema(apiKey)).promise();
            if (!result.Attributes) return new Response(false, "An unknown error has occurred.");

            return new Response(
                true, 
                "Order has been placed as follows. Keep your receipt!", 
                orderToPlace
            );
        } catch (err) {
            return new Response(false, err);
        }
    }


    /**
     * Gets detailed information about an order.
     * 
     * @param apiKey the user who placed the order
     * @param receipt the receipt ID for the order
     * @returns a response object containing an order object
     */
    public async get(apiKey: string, receipt: number): Promise<Response> {
        try {
            const orders = await dynamoDoc.get(Order.getSchema(apiKey)).promise();
            if (orders.Item == undefined) return new Response(false, "User does not exist.");
            
            let order: Order | undefined = undefined;
            for (const item of orders.Item.orders) {
                if (item.receipt == receipt) order = Order.createFromObject(item);
            }
            if (order == undefined) return new Response(false, "Invalid receipt.");

            return new Response(true, order);
        } catch (err) {
            return new Response(false, err);
        }
    }


    /**
     * Gets detailed information about all of a user's orders.
     * 
     * @param apiKey the user who placed the orders
     * @returns a response object containing an array of order objects
     */
    public async getAll(apiKey: string): Promise<Response> {
        try {
            const orders = await dynamoDoc.get(Order.getSchema(apiKey)).promise();
            if (orders.Item == undefined) return new Response(false, "User does not exist.");
            return new Response(true, orders.Item);
        } catch (err) {
            return new Response(false, err);
        }
    }


    /**
     * Cancels an order.
     * Order must have been placed within the last 10 minutes.
     * 
     * @param apiKey the user who originally placed the order
     * @param receipt the receipt number for the order
     * @returns a response object containing the order object that was cancelled
     */
    public async cancel(apiKey: string, receipt: number): Promise<Response> {
        try {
            const time = Date.now();
            
            const order = await this.get(apiKey, receipt);
            if (order.data == undefined) return order;

            if (time - receipt > TEN_MINUTES) 
                return new Response(false, "Order was placed more than ten minutes ago.");

            const orders = await this.getAll(apiKey);
            const newOrders = [];
            for (const item of orders.data.orders) {
                if (item.receipt != receipt) newOrders.push(item);
            }

            const result = await dynamoDoc.update(Order.cancelSchema(apiKey, newOrders)).promise();
            if (result.Attributes == undefined) 
                return new Response(false, "An unknown error has occured.");
            return new Response(true, "Order has been cancelled successfully.", order.data);
        } catch (err) {
            return new Response(false, err);
        }
    }
}

export default OrderDao;