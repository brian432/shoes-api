import { Schema, model } from "mongoose";
import { OrderTypes, OrderReturnedObject } from "../types";

const OrderSchema = new Schema<OrderTypes>({
    title: String,
    productId: String,
    quantity: {
        type: Number,
        default: 1
    },
    color: String,
    img: String,
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
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