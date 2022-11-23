import { Schema, model } from "mongoose";
import { OrderTypes, OrderReturnedObject } from "../types";

const OrderSchema = new Schema<OrderTypes>({
    userId: { type: String, required: true },
    products: [
        {
            productId: {
                type: String
            },
            quantity: {
                type: Number,
                default: 1
            }
        }
    ],
    amount: { type: String, required: true },
    address: { type: Object, required: true },
    status: { type: String, default: "pending" }
}, { timestamps: true });


OrderSchema.set('toJSON', {
    transform: (_document, returnedObject: OrderReturnedObject) => {
        returnedObject.id = `${returnedObject._id}`;
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});

const Order = model<OrderTypes>('Order', OrderSchema);

export default Order;