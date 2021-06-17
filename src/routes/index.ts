import { Router } from 'express';
import { getUser, createUser, updateUser, removeUser, promoteUser,  } from './Users';


// User-route
const userRouter = Router();
userRouter.get('/:apiKey', getUser);
userRouter.post('/', createUser);
userRouter.put('/', updateUser);
userRouter.delete('/:apiKey', removeUser);
userRouter.put('/promote/', promoteUser);


// Export the base-router
const baseRouter = Router();
baseRouter.use('/users', userRouter);
export default baseRouter;
