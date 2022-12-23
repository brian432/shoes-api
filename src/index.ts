import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import connect from './mongo';
import registerRouter from './routes/register';
import { handleErrors } from './midlewares/handleErrors';
import loginRouter from './routes/login';
import userRouter from './routes/user';
import productRouter from './routes/products';
import cartRouter from './routes/carts';
import orderRouter from './routes/order';
import stripeRouter from './routes/stripe';


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
app.use('/api/payment', stripeRouter);


app.use(handleErrors);

app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);
    void await connect();
});