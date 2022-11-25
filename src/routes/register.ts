import User from '../models/Users';
import express, { NextFunction, Request, Response } from 'express';
import { UserTypes } from '../types';
import bcrypt from 'bcrypt';
import { validateRegister} from '../../utils/validator';

const registerRouter = express.Router();

registerRouter.post('/', validateRegister, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { body: { username, email, password } } = req;

    //bcrypt
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds); //encriptamos el password
    //-------------

    const user = new User<UserTypes>({ //Creamos el usuario a partir de nuestro esquema y en vez del password del body, enviamos el password encriptado
        username,
        email,
        passwordHash
    });
    try {
        const savedUser: UserTypes = await user.save(); //Guardamos el nuevo usuario en la base de datos
        res.status(201).json({ //enviamos una respuesta al frontend con el estus 201(created) y el usuario creado sin el password y con el id retornados por el esquema 
            status_code: 201,
            data: savedUser
        });
    } catch (err) {//Si ocurre un error lo enviamos al middleware encargado de los errores
        next(err)
    }
});

export default registerRouter;