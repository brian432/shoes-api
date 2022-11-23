import express, { NextFunction, Response } from "express";
import { verifyTokenAdmin, verifyTokenAndAuthorization } from "../midlewares/verifyToken";
import { RequestExtend } from "../types";
import bcrypt from 'bcrypt';
import User from "../models/Users";

const userRouter = express.Router();

/*PUT UerRouter: Router para actualizar los datos de los usuarios; Cambiar contraseñas, emails, etc. El administrador tambien podra hacerlo
                 con todos los usuarios
*/
userRouter.put('/:id', verifyTokenAndAuthorization, async (req: RequestExtend, res: Response, next: NextFunction) => {
    const { params: { id } } = req;

    if (req.body.password) {
        req.body.password = await bcrypt.hash(req.body.password, 10);
    };
    try {
        const updateUser = await User.findByIdAndUpdate(id, {
            $set: req.body
        }, { new: true });
        res.status(200).json({
            status_code: 200,
            user: updateUser
        });

    } catch (err) {
        next(err)
    };
});

userRouter.delete('/:id', verifyTokenAndAuthorization, async (req: RequestExtend, res: Response, next: NextFunction): Promise<void> => {
    const { params: { id } } = req;
    try {
        await User.findByIdAndDelete(id);
        res.status(200).json({
            status_code: 200,
            user: "User has been deleted..."
        });
    } catch (err) {
        next(err)
    };
});

userRouter.get('/:id', verifyTokenAdmin, async (req: RequestExtend, res: Response, next: NextFunction): Promise<void> => {
    const { params: { id } } = req;
    try {
        const user = await User.findById(id);
        res.status(200).json({
            status_code: 200,
            user: user
        });
    } catch (err) {
        next(err)
    };
});


export default userRouter;