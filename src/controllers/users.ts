import User from '../models/Users';
import express, { NextFunction, Request, Response } from 'express';
import { UserTypes } from '../types';
import bcrypt from 'bcrypt';
import { validateCreate } from '../../utils/validator';

const usersRouter = express.Router();

usersRouter.post('/', validateCreate, async (req: Request, res: Response, next: NextFunction): Promise<void>=> {
    const { body: { username, name, password } } = req;
    try {
        //bcrypt seccion
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds); //encriptamos el password
        //-------------
        
        const user = new User<UserTypes>({ //Creamos el usuario a partir de nuestro esquema y en vez del password del body, enviamos el password encriptado
            username,
            name,
            passwordHash
        });
        const savedUser = await user.save(); //Guardamos el nuevo usuario en la base de datos
        
        res.status(201).json({ //enviamos una respuesta al frontend con el estus 201(created) y el usuario creado sin el password y con el id retornados por el esquema 
            status_code: 201,
            user: savedUser
        });
    } catch (err) {//Si ocurre un error lo enviamos al middleware encargado de los errores
        next(err)
    }
});

usersRouter.get('/', async (_req:Request, _res:Response)=>{
    await User.deleteMany({})
})

export default usersRouter;