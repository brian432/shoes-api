import express, { Request, Response, NextFunction } from 'express';
import { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } from '../midlewares/verifyToken';
import Order from '../models/Order';
import User from '../models/Users';
import { OrderTypes, RequestMasPropUser } from '../types';

const orderRouter = express.Router();

//Crear orders

orderRouter.post('/', verifyToken, async (req: RequestMasPropUser, res: Response, next: NextFunction): Promise<void> => {
    if (req.user !== undefined) {
        const newOrder = new Order({
            ...req.body,
            user: req.user.id
        });
        try {
            const user = await User.findById(req.user.id);
            const savedOrder: OrderTypes = await newOrder.save();

            if (user?.orders != undefined) {
                user.orders = user.orders.concat(savedOrder._id)
            }
            await user?.save();
            res.status(200).json({
                status_code: 200,
                data: savedOrder
            });
        } catch (err) {
            next(err)
        };
    }
});

//Actualizar orders

orderRouter.put('/:id', verifyTokenAndAdmin, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { params: { id } } = req;
    try {
        const updateOrder = await Order.findByIdAndUpdate(id, {
            $set: req.body
        }, { new: true });
        res.status(200).json({
            status_code: 200,
            data: updateOrder
        });
    } catch (err) {
        next(err)
    };
});

//Eliminar order por el id

orderRouter.delete('/:id', verifyTokenAndAdmin, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { params: { id } } = req;
    try {
        await Order.findByIdAndDelete(id);
        res.status(200).json({
            status_code: 200,
            data: "order has been deleted..."
        });
    } catch (err) {
        next(err)
    };
});

//Hacemos una estadisticas de las ventas de este mes en comparacion con el anterior

orderRouter.get("/income", verifyTokenAndAdmin, async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    const date: Date = new Date();
    const lastMonth: Date = new Date(date.setMonth(date.getMonth() - 1));
    const previousMonth: Date = new Date(date.setMonth(lastMonth.getMonth() - 1));

    try {
        const income: OrderTypes[] = await Order.aggregate([
            {
                $match: { createdAt: { $gte: previousMonth } }
            },
            {
                $project: {
                    month: { $month: "$createdAt" },
                    sales: "$amount"
                }
            },
            {
                $group: {
                    _id: "$month",
                    total: { $sum: "$sales" }
                }
            }

        ]);
        res.status(200).json({
            status_code: 200,
            data: income
        });
    } catch (err) {
        next(err)
    };
});

//GEt user orders

orderRouter.get('/:id', verifyTokenAndAuthorization, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { params: { id } } = req;
    try {
        const orders = await Order.findOne({ userId: id });
        res.status(200).json({
            status_code: 200,
            data: orders
        });
    } catch (err) {
        next(err)
    };
});


orderRouter.get("/", verifyToken, async (req: RequestMasPropUser, res: Response, next: NextFunction): Promise<void> => {
    if (req.user !== undefined) {
        const id = req.user.id;
        try {
            const user = await User.findById(id).populate('orders');
            res.status(200).json({
                status_code: 200,
                data: user?.orders
            })
        } catch (err) {
            next(err)
        }
    }
});

//Get all for dashboard admin
orderRouter.get("/all", verifyTokenAndAdmin, async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const orders = await Order.find();
        res.status(200).json({
            status_code: 200,
            data: orders
        })
    } catch (err) {
        next(err)
    }
});

export default orderRouter;