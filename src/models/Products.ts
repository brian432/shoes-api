import { Schema, model } from "mongoose";
import { ProductsReturnedObject, ProductsTypes } from "../types";

const ProductSchema = new Schema<ProductsTypes>({
    title: { type: String, required: true, unique: true },
    desc: { type: String, required: true },
    category: { type: String, required: true },
    img: { type: Array, required: true },
    size: { type: Array, required: true },
    color: { type: Array, required: true },
    price: { type: Number, required: true },
    inStock: { type: Boolean, default: true, required: true }
}, { timestamps: true }
);

ProductSchema.set('toJSON', {
    transform: (_document, returnedObject: ProductsReturnedObject) => {
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        returnedObject.id = `${returnedObject._id}`;
        delete returnedObject._id;
        delete returnedObject.__v;
        // Eliminamos el password para que no se devuelva y exponga la contraseña
    }
});

const Product = model<ProductsTypes>('Products', ProductSchema);

export default Product;