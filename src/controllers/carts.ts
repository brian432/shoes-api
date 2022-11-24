import express, { Request, Response, NextFunction } from 'express';
import { verifyToken, verifyTokenAndAdmin, verifyTokenAndAuthorization } from '../midlewares/verifyToken';
import Cart from '../models/Carts';
import { CartTypes } from '../types';

const cartRouter = express.Router();


//Crear carts

cartRouter.post('/', verifyToken, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const newCart = new Cart(req.body);
    try {
        const savedCart: CartTypes = await newCart.save()
        res.status(200).json({
            status_code: 200,
            data: savedCart
        });
    } catch (err) {
        next(err)
    };
});

//Actualizar carts

cartRouter.put('/:id', verifyTokenAndAuthorization, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { params: { id } } = req;
    try {
        const updateCart = await Cart.findByIdAndUpdate(id, {
            $set: req.body
        }, { new: true });
        res.status(200).json({
            status_code: 200,
            data: updateCart
        });
    } catch (err) {
        next(err)
    };
});

//Eliminar cart por el id

cartRouter.delete('/:id', verifyTokenAndAuthorization, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { params: { id } } = req;
    try {
        await Cart.findByIdAndDelete(id);
        res.status(200).json({
            status_code: 200,
            data: "cart has been deleted..."
        });
    } catch (err) {
        next(err)
    };
});

//Buscar cart por el id

cartRouter.get('/:userId', verifyTokenAndAuthorization, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { params: { id } } = req;
    try {
        const cart = await Cart.findOne({ userId: id });
        res.status(200).json({
            status_code: 200,
            data: cart
        });
    } catch (err) {
        next(err)
    };
});

//Get all

cartRouter.get("/", verifyTokenAndAdmin, async (_req: Request, res: Response, next: NextFunction):Promise<void> => {
    try {
        const carts = await Cart.find();
        res.status(200).json({
            status_code: 200,
            data: carts
        })
    } catch (err) {
        next(err)
    }
})

export default cartRouter;