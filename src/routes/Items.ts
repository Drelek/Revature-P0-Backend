import StatusCodes from 'http-status-codes';
import { Request, Response } from 'express';

import Item from '@entities/Item';
import { checkAdmin } from '@daos/UserDao';

import ItemDao from '@daos/ItemDao';
import { paramMissingError } from '@shared/constants';

const itemDao = new ItemDao();
const { BAD_REQUEST, CREATED, OK } = StatusCodes;



/**
 * Add an item.
 * 
 * @param req 
 * @param res 
 */
export async function createItem(req: Request, res: Response) {
    if (!req.body.item || !req.body.apiKey) {
        return res.status(BAD_REQUEST).json({
            error: paramMissingError
        });
    }
    if (!await checkAdmin(req.body.apiKey)) return res.status(BAD_REQUEST).json({error: "Requesting user must be an admin"});
    const item = Item.createFromObject(req.body.item);
    const response = await itemDao.create(item);
    return res.status(CREATED).json(response);
}


/**
 * Get an item.
 * 
 * @param req 
 * @param res 
 */
export async function getItem(req: Request, res: Response) {
    const id = Number(req.params.id);
    const response = await itemDao.get(id);
    res.status(OK).json(response);
}


/**
 * Get all items.
 * 
 * @param req 
 * @param res 
 */
export async function getAllItems(req: Request, res: Response) {
    const response = await itemDao.getAll();
    res.status(OK).json(response);
}


/**
 * Get all items with a given tag.
 * 
 * @param req 
 * @param res 
 */
export async function getTaggedItems(req: Request, res: Response) {
    const tag = req.params.tag;
    const response = await itemDao.getTagged(tag);
    res.status(OK).json(response);
}


/**
 * Update a given item.
 * 
 * @param req 
 * @param res 
 * @returns 
 */
export async function updateItem(req: Request, res: Response) {
    if (!req.body.apiKey || req.body.id == undefined || !req.body.item) {
        return res.status(BAD_REQUEST).json({
            error: paramMissingError
        });
    }
    if (!await checkAdmin(req.body.apiKey)) return res.status(BAD_REQUEST).json({error: "Requesting user must be an admin"});
    const item = Item.createFromObject(req.body.item);
    const response = await itemDao.update(req.body.id, item);
    res.status(OK).json(response);
}


/**
 * Remove an item.
 * 
 * @param req 
 * @param res 
 * @returns 
 */
export async function removeItem(req: Request, res: Response) {
    if (!req.body.apiKey || req.body.id == undefined) {
        return res.status(BAD_REQUEST).json({
            error: paramMissingError
        });
    }
    if (!await checkAdmin(req.body.apiKey)) return res.status(BAD_REQUEST).json({error: "Requesting user must be an admin"});
    const response = await itemDao.remove(req.body.id);
    res.status(OK).json(response);
}