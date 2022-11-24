import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import connect from './mongo';
import registerRouter from './controllers/register';
import { handleErrors } from './midlewares/handleErrors';
import loginRouter from './controllers/login';
import userRouter from './controllers/user';
import productRouter from './controllers/products';
import cartRouter from './controllers/carts';
import orderRouter from './controllers/order';

const app = express();

app.use(express.json());
app.use(cors());
dotenv.config();

const { PORT } = process.env;
app.use('/api/register', registerRouter);
app.use('/api/login', loginRouter);
app.use('/api/users', userRouter);
app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);
app.use('/api/orders', orderRouter);

app.use(handleErrors);

app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);
    void await connect();
});
