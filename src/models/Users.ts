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
    }
}, { timestamps: true });

UserSchema.set('toJSON', {
    transform: (_document, returnedObject: UserReturnedObject) => {
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        returnedObject.id = `${returnedObject._id}`;
        delete returnedObject._id;
        delete returnedObject.__v;
        // Eliminamos el password para que no se devuelva y exponga la contraseña
        delete returnedObject.passwordHash;
    }
});

const User = model<UserTypes>('User', UserSchema);

export default User;