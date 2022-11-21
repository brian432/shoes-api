import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import connect from './mongo';
import usersRouter from './controllers/users';
import { handleErrors } from './midlewares/handleErrors';

const app = express();

app.use(express.json());
app.use(cors());
dotenv.config();

const { PORT } = process.env;
app.use('/api/users', usersRouter);

app.use(handleErrors);

app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);
    void await connect();
});
