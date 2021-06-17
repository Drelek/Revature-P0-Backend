import { Router } from 'express';
import { getUser, createUser, updateUser, removeUser, promoteUser,  } from './Users';
import { createItem, getItem, getAllItems, getTaggedItems, updateItem, removeItem } from './Items';


// User-route
const userRouter = Router();
userRouter.get('/:apiKey', getUser);
userRouter.post('/', createUser);
userRouter.put('/', updateUser);
userRouter.delete('/:apiKey', removeUser);
userRouter.put('/promote/', promoteUser);


// Item-route
const itemRouter = Router();
itemRouter.post('/', createItem);
itemRouter.get('/:id', getItem);
itemRouter.get('/', getAllItems);
itemRouter.get('/tagged/:tag', getTaggedItems);
itemRouter.put('/', updateItem);
itemRouter.delete('/', removeItem);


// Export the base-router
const baseRouter = Router();
baseRouter.use('/user', userRouter);
baseRouter.use('/item', itemRouter);
export default baseRouter;
