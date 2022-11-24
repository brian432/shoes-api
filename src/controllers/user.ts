import express, { NextFunction, Response } from "express";
import { verifyTokenAndAdmin, verifyTokenAndAuthorization } from "../midlewares/verifyToken";
import { RequestExtend, UserTypes } from "../types";
import bcrypt from 'bcrypt';
import User from "../models/Users";

const userRouter = express.Router();

/*PUT UerRouter: Router para actualizar los datos de los usuarios; Cambiar contraseñas, emails, etc. El administrador tambien podra hacerlo
                 con todos los usuarios
*/
userRouter.put('/:id', verifyTokenAndAuthorization, async (req: RequestExtend, res: Response, next: NextFunction): Promise<void> => { //1)
    const { params: { id } } = req;

    if (req.body.password) { //2
        req.body.password = await bcrypt.hash(req.body.password, 10);
    };
    try {
        const updateUser = await User.findByIdAndUpdate(id, { //3
            $set: req.body
        }, { new: true });
        res.status(200).json({
            status_code: 200,
            data: updateUser
        });

    } catch (err) {
        next(err)
    };
});

/*
1)verifyTokenAndAuthorization= El propio usuario y el administrador podra cambiar los datos (contraseña, usuario, email, etc) de su cuenta, la funcion verifyToken
2)Si el password esta incluido en la actualizacion que envia el usuario desde el front, hasheamos el password para almacenarlo 
3)Buscamos en la coleccion User de nuestra base de datos el usuario por el id, y mediante la funcion $set de mongoDB actualizamos las propiedades sean iguales a las propiedades que vienen en el body de la request
*/

//-----------------------------------------

//Delete para eliminar un usuario

userRouter.delete('/:id', verifyTokenAndAuthorization, async (req: RequestExtend, res: Response, next: NextFunction): Promise<void> => { //1)
    const { params: { id } } = req;
    try {
        await User.findByIdAndDelete(id);
        res.status(200).json({
            status_code: 200,
            data: "User has been deleted..."
        });
    } catch (err) {
        next(err)
    };
});
/*
1)Otra vez verifyTokenAndAuthorization analizara el token y cada usuario podra eliminar su cuenta y tambien el administrador podra hacer lo mismo con cualquier cuenta
*/

//GET users stats  el orden de los routers afecta a las request este router devuelve los usuarios registrados por mes
userRouter.get('/stats', verifyTokenAndAdmin, async (_req: RequestExtend, res: Response, next: NextFunction): Promise<void> => {

    const date: Date = new Date();
    const lastYear: Date = new Date(date.setFullYear(date.getFullYear() - 1)); //devuelve la fecha de hoy pero del año pasado
    try {
        const data: UserTypes[] = await User.aggregate([
            {
                $match: { createdAt: { $gte: lastYear } } //buscar en la base de datos los documentos que haya sido creados el año pasado 
            },
            {
                $project: { //pasa a la seccion group un nuevo documento solo con las propied
                    month: { $month: "$createdAt" }
                }
            },
            {
                $group: {
                    _id: "$month",
                    total: { $sum: 1 }
                }
            }
        ]);
        res.status(200).json({
            status_code: 200,
            data: data
        });
    } catch (err) {
        next(err)
    };
});
//----------------------

//GET users for id

userRouter.get('/:id', verifyTokenAndAdmin, async (req: RequestExtend, res: Response, next: NextFunction): Promise<void> => {

    const { params: { id } } = req;
    try {
        const user = await User.findById(id);
        res.status(200).json({
            status_code: 200,
            data: user
        });
    } catch (err) {
        next(err)
    };
});
//----------------------



//GET all users

userRouter.get('/', verifyTokenAndAdmin, async (_req: RequestExtend, res: Response, next: NextFunction): Promise<void> => {
    try {
        const user = await User.find();
        res.status(200).json({
            status_code: 200,
            data: user
        });
    } catch (err) {
        next(err)
    };
});

//---------------------


export default userRouter;