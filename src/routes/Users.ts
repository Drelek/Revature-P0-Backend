import StatusCodes from 'http-status-codes';
import { Request, Response } from 'express';

import User from '@entities/User';

import UserDao from '@daos/UserDao';
import { paramMissingError } from '@shared/constants';

const userDao = new UserDao();
const { BAD_REQUEST, CREATED, OK } = StatusCodes;

/**
 * Get a user.
 *
 * @param req
 * @param res
 * @returns
 */
export async function getUser(req: Request, res: Response) {
  const { apiKey } = req.params;
  const response = await userDao.get(apiKey);
  res.status(OK).json(response);
}

/**
 * Add a user.
 *
 * @param req
 * @param res
 * @returns
 */
export async function createUser(req: Request, res: Response) {
  if (!req.body.user) {
    return res.status(BAD_REQUEST).json({
      error: paramMissingError,
    });
  }
  const user = User.createFromObject(req.body.user);
  const response = await userDao.create(user);
  return res.status(CREATED).json(response);
}

/**
 * Update a user.
 *
 * @param req
 * @param res
 * @returns
 */
export async function updateUser(req: Request, res: Response) {
  if (!req.body.user || !req.body.user.apiKey) {
    return res.status(BAD_REQUEST).json({
      error: paramMissingError,
    });
  }
  const user = User.createFromObject(req.body.user);
  const response = await userDao.update(req.body.user.apiKey, user);
  return res.status(OK).json(response);
}

/**
 * Delete a user.
 *
 * @param req
 * @param res
 * @returns
 */
export async function removeUser(req: Request, res: Response) {
  const { apiKey } = req.params;
  const response = await userDao.remove(apiKey);
  return res.status(OK).json(response);
}

/**
 * Promote a user.
 *
 * @param req
 * @param res
 */
export async function promoteUser(req: Request, res: Response) {
  if (!req.body.apiKey || !req.body.promoteKey) {
    return res.status(BAD_REQUEST).json({
      error: paramMissingError,
    });
  }
  const response = await userDao.promote(req.body.apiKey, req.body.promoteKey);
  return res.status(OK).json(response);
}
