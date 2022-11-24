import { NextFunction, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { Validation } from '../src/types';

export const arrayValidation = (args: Validation): Array<any> => {
    return [...args].map(prop => {
        if (prop === 'price') {
            return body(prop)
                .exists().withMessage('required field')
                .notEmpty().withMessage('should not be empty')
                .isNumeric().withMessage('must contain a number')
        }
        else if (prop === "email") {
            return body(prop)
                .exists().withMessage('required field')
                .notEmpty().withMessage('should not be empty')
                .isString().withMessage('must contain a string')
                .isEmail().withMessage('requires a valid email')
        } else {
            return body(prop) //mapeamos el array y agregamos las validaciones con sus respectivos mensajes
                .exists().withMessage('required field')
                .notEmpty().withMessage('should not be empty')
                .isString().withMessage('must contain a string')
                .isLength({ min: 3 }).withMessage('must be at least 3 chars long')
        }
    }
    )
};

export const validateProps = (array: Validation): Array<any> => {

    return [
        arrayValidation(array),
        (req: Request, res: Response, next: NextFunction) => {
            if (Object.keys(req.body).length > array.length) {
                throw new Error("extra fields not permited");
            }
            try {
                validationResult(req).throw() //
                return (next())
            } catch (err: any) {
                return res.status(400).send({
                    status_code: 400,
                    errors: err.mapped()
                })
            }
        }
    ]
};


const arrayRegisterProperties: Validation = ['username', 'email', 'password']; //Creamos un array que contiene las propiedades que necesitamos validar
const arrayLoginProperties: Validation = ['username', 'password'];
const arrayProductProperties: Validation = ['title', 'desc', 'img', 'size', 'color', 'price'];

export const validateRegister = validateProps(arrayRegisterProperties);
export const validateLogin = validateProps(arrayLoginProperties);
export const validateProduct = validateProps(arrayProductProperties);