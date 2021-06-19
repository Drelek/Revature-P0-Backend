import { Router } from 'express';
import { getUser, createUser, updateUser, removeUser, promoteUser,  } from './Users';
import { createItem, getItem, getAllItems, getTaggedItems, updateItem, removeItem } from './Items';
import { placeOrder, getOrder, getAllOrders, cancelOrder } from './Orders';


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


// Order-route
const orderRouter = Router();
orderRouter.post('/', placeOrder);
orderRouter.get('/:apiKey', getAllOrders);
orderRouter.get('/:apiKey/:receipt', getOrder);
orderRouter.delete('/', cancelOrder);


// Export the base-router
const baseRouter = Router();
baseRouter.use('/user', userRouter);
baseRouter.use('/item', itemRouter);
baseRouter.use('/order', orderRouter);
export default baseRouter;
