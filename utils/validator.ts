import { NextFunction, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

const arrayUsersProperties: string[] = ['username', 'name', 'password']; //Creamos un array que contiene las propiedades que necesitamos validar

const arrayValidation = arrayUsersProperties.map(prop => body(prop) //mapeamos el array y agregamos las validaciones con sus respectivos mensajes
    .exists().withMessage('required field')
    .notEmpty().withMessage('should not be empty')
    .isString().withMessage('must contain a string')
    .isLength({ min: 3 }).withMessage('must be at least 3 chars long'));

export const validateCreate = [ //Creamos la funcion validadora que utilizaremos en el router de user post
    ...arrayValidation,  //propagamos el array validation y luego seguimos los pasos para terminar la validacion
    (req: Request, res: Response, next: NextFunction) => {
        if (Object.keys(req.body).length > arrayUsersProperties.length) {
            throw new Error("extra fields not permited");
        }  
        try {
            validationResult(req).throw() //
            return (next())
        } catch (err: any) {
            res.status(400).send({
                status_code: 400,
                errors: err.mapped()
            })
        }
    }
]
