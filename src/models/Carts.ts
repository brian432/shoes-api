import { Schema, model } from "mongoose";
import { CartTypes, CartReturnedObject } from "../types";

const CartSchema = new Schema<CartTypes>({
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
    ]
});

CartSchema.set('toJSON', {
    transform: (_document, returnedObject: CartReturnedObject) => {
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        returnedObject.id = `${returnedObject._id}`;
        delete returnedObject._id;
        delete returnedObject.__v;
        // Eliminamos el password para que no se devuelva y exponga la contraseña
    }
});

const Cart = model<CartTypes>('Cart', CartSchema);

export default Cart;