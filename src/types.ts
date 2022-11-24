import { Document, Types } from "mongoose";
import { Request } from "express";

//UserTypes

export interface UserTypes {
    username: string,
    email: string,
    passwordHash: string,
    isAdmin?: boolean
};

export interface UserReturnedObject extends Document {
    username: string,
    email: string,
    passwordHash: string | undefined,
    isAdmin: boolean,
    id?: string
};

export type UserToken = {
    id: Types.ObjectId,
    isAdmin?: boolean
};

//-------------------------------

//Product types

export interface ProductsTypes {
    title: string,
    desc: string,
    img: string,
    size: string,
    color: string,
    price: number
};

export interface ProductsReturnedObject extends Document {
    title: string,
    desc: string,
    img: string,
    size: string,
    color: string,
    price: number,
    id?: string
};

//---------------------------

//Cart types

interface ProductArray {
    productId: string,
    quantity: number
};

export interface CartReturnedObject extends Document {
    userId: string,
    products: Array<ProductArray>,
    id?: string
}

export interface CartTypes {
    userId: string,
    products: Array<ProductArray>
};

//-------------------------------

//Order types
export interface OrderReturnedObject extends Document {
    userId: string,
    products: Array<ProductArray>,
    amount: string,
    address: Object,
    status: string
}
export interface OrderTypes extends CartTypes {
    amount: string,
    address: Object,
    status: string
};



//verifyToken
export interface RequestExtend extends Request {
    user?: any 
};

//--------------


//validator types

export type Validation = Array<string>;