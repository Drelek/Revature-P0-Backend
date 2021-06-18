import StatusCodes from 'http-status-codes';
import { Request, Response } from 'express';

import Order from '@entities/Order';

import OrderDao from '@daos/OrderDao';
import { paramMissingError } from '@shared/constants';

const orderDao = new OrderDao();
const { BAD_REQUEST, CREATED, OK } = StatusCodes;



/**
 * Place an order.
 * 
 * @param req 
 * @param res 
 * @returns 
 */
export async function placeOrder(req: Request, res: Response) {
    if (!req.body.order || !req.body.apiKey) {
        return res.status(BAD_REQUEST).json({
            error: paramMissingError
        });
    }
    const order = Order.createFromObject(req.body.order);
    const response = await orderDao.place(req.body.apiKey, order);
    return res.status(OK).json(response);
}