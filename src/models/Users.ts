import { Schema, model } from "mongoose";
import { UserReturnedObject, UserTypes } from "../types";

const UserSchema = new Schema<UserTypes>({ //Creamos el esquema con el tipo UserTypes, si se agrega una propiedad o se quita alguna TypeScript arrojara un error
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true
    },
    passwordHash: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    carts: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Cart'
        }
    ]
}, { timestamps: true });

UserSchema.set('toJSON', { //Al retornar el json luego de agregar un usuario, modificamos este retorno eliminando el password y propiedades que no necesitamos devolver
    transform: (_document, returnedObject: UserReturnedObject) => {
        returnedObject.id = `${returnedObject._id}`; //creamos una nueva propiedad que almacena el ._id de mongoDB transformada a string
        delete returnedObject._id;
        delete returnedObject.__v;
        delete returnedObject.passwordHash;
    }
});

const User = model<UserTypes>('User', UserSchema);

export default User;