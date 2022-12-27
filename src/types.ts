import { Document, ObjectId, Types } from "mongoose";
import { Request } from "express";

//UserTypes

export interface UserTypes {
    username: string
    email: string
    passwordHash: string
    isAdmin?: boolean
    carts?: ObjectId[]
    orders?: ObjectId[]
};

export interface UserReturnedObject extends Document {
    username: string
    email: string
    passwordHash: string | undefined
    isAdmin: boolean
    id?: string
    carts?: ObjectId[]
};

export type UserToken = {
    id: Types.ObjectId
    isAdmin?: boolean
};

//-------------------------------

//Product types

export interface ProductsTypes {
    title: string
    desc: string
    category: string
    img: typeof Array
    size: typeof Array
    color: typeof Array
    price: number
    inStock: boolean
};

export interface ProductsReturnedObject extends Document {
    title: string
    desc: string
    category: string
    img: typeof Array
    size: typeof Array
    color: typeof Array
    price: number
    inStock: boolean
    id?: string
};

//---------------------------

//Cart types

export interface CartReturnedObject extends Document {
    title: string
    price: number
    productId: string
    quantity: number
    color: string
    img: string
    size: string
    user: ObjectId
    id?: string
}

export interface CartTypes {
    title: string
    price: number
    productId: string
    quantity: number
    color: string
    img: string
    size: string
    user: ObjectId
    _id: ObjectId
};

export interface RequestMasPropUser extends Request {
    user?: {
        id: string
        isAdmin: boolean
        iat: number
        exp: number
    }
}

//-------------------------------

//Order types
export interface OrderReturnedObject extends Document {
    products: ProductOrder[]
    user: ObjectId
    amount: string
    address: Object
    status: string
}

export type ProductOrder = {
    title: string
    productId: string
    color: string
    img: string
    size: number
    quantity: number
}
export interface OrderTypes {
    products: ProductOrder[]
    user: ObjectId
    amount: number
    address: Object
    status: string
    _id: ObjectId
};



//verifyToken
export interface RequestExtend extends Request {
    user?: any
};

//--------------


//validator types

export type Validation = Array<string>;

