import Order from '@entities/Order';
import Response from '@entities/Response';
import UserDao from '@daos/UserDao';
import * as AWS from 'aws-sdk';

AWS.config.credentials = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
}
AWS.config.region = process.env.AWS_REGION;
const dynamo = new AWS.DynamoDB();

const userDao = new UserDao();

export interface IOrderDao {
    place: (apiKey: string, order: Order) => Promise<Response>;
}

class OrderDao implements IOrderDao {


    /**
     * Places an order for the specified user.
     * 
     * @param apiKey the user to place the order for
     * @param order the order object to be placed
     */
    public async place(apiKey: string, order: Order): Promise<Response> {
        try {
            const exists = await userDao.get(apiKey);
            if (!exists.data) return new Response(false, "User does not exist.");
            const result = await dynamo.updateItem(order.placeSchema(apiKey)).promise();
            if (!result.Attributes) return new Response(false, "An unknown error has occured.");
            return new Response(true, result);
        } catch (err) {
            return new Response(false, err);
        }
    }
}

export default OrderDao;