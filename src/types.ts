import { Document } from "mongoose";

export interface UserTypes {
    username: string,
    name: string,
    passwordHash: string
}

export interface UserReturnedObject extends Document{
    username:string,
    name:string,
    passwordHash:string | undefined,
    id?:string
}