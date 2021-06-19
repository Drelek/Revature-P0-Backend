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


/**
 * Get info about an order.
 * 
 * @param req 
 * @param res 
 */
export async function getOrder(req: Request, res: Response) {
    const apiKey = req.params.apiKey;
    const receipt = Number(req.params.receipt);
    const response = await orderDao.get(apiKey, receipt);
    return res.status(OK).json(response);
}


/**
 * Get info about all of a user's orders.
 * 
 * @param req 
 * @param res 
 */
export async function getAllOrders(req: Request, res: Response) {
    const apiKey = req.params.apiKey;
    const response = await orderDao.getAll(apiKey);
    return res.status(OK).json(response);
}


/**
 * Cancels a user's order, given it was placed in the last ten minutes.
 * 
 * @param req 
 * @param res 
 */
export async function cancelOrder(req: Request, res: Response) {
    if (req.body.apiKey == undefined || req.body.receipt == undefined) {
        return res.status(BAD_REQUEST).json({
            error: paramMissingError
        });
    }
    const response = await orderDao.cancel(req.body.apiKey, req.body.receipt);
    return res.status(OK).json(response);
}