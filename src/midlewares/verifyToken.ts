import jwt from 'jsonwebtoken';
import { NextFunction, Response } from 'express';
import { RequestExtend } from '../types';
const { SECRET } = process.env;

type FuncNext = () => void;

//Con estas dos funciones el usuario podra utilizar todas los routers disponibles a partir del token para actualizar SUS datos.
//El administrador tambien podra actualizar los datos de otros usuarios.

/*Verify token explicacion:
1)Si el header authorization existe y comienza con el string bearer vamos a verificar el token con el token almacenado con jwt
2)A la funcion verify le pasamos el token y la la variable de entorno SECRET para compara si coinciden, como tercer parametro le pasamos una funcion
  Si el token no coincide con la variable de entorno, el parametro "err" sera = true y se ejecutara la respuesta.
3)Si coinciden le agregamos una propiedad al parametro req con el valor de user. user = a todo lo que almacena el token (recordemos que en el router login le pasamos las propiedades isAdmin y id al token)  
4)Si authorization no existe o existe pero no comienza con el string "bearer" respondemos con un error
*/
export const verifyToken = (req: RequestExtend, res: Response, next: FuncNext) => {  
    const { headers: { authorization } } = req;
    if (authorization && (authorization as string).toLowerCase().startsWith('bearer ')) {  //1)
        const token = (authorization as string).substring(7);
        jwt.verify(token, SECRET as string, (err, user): any => { //2)
            if (err) {                                         
                res.status(403).json({
                    status_code: 403,
                    error: "Token missing or invalid!"
                });
            };

            req.user = user; //3
            next();                                        
        });
    } else {      // 4)                                      
        res.status(401).json({
            status_code: 401,
            error: "You are not authenticated!"
        })
    };
};

/*
verifyTokenAndAuthorization explicacion:

1)Lamamos a la funcion verifyToken y como tercer parametri le pasamos una funcion, Si esta funcion en algun momento es llamada
  va a verficar que el user id, creado en el paso 3 de la funcion verifytoken, coincide con el id recibido como parametro,
  o si el user.isAdmin es === true. Si alguna de estas dos condicionales se cumple, el usuario estara autorizado a actualizar
  sus datos dentro de la base de datos.

*/

export const verifyTokenAndAuthorization = (req: RequestExtend, res: Response, next: NextFunction) => {
    verifyToken(req, res, () => { //1)
        if (req.user.id === req.params.id || req.user.isAdmin) { 
            next()
        } else {
            res.status(403).json({
                status_code: 403,
                error: "You are not alowed!"
            });
        };
    });
};

//------------------------------------------------------------------------

//Con esta funcion podremos actualizar los productos que solo lo puede hacer el administrador

/*
    1)Si el usuario es administrador podremos utilizar el router
*/


export const verifyTokenAndAdmin = (req: RequestExtend, res: Response, next: NextFunction) => {
    verifyToken(req, res, () => { //1)
        if (req.user.isAdmin) { 
            next()
        } else {
            res.status(403).json({
                status_code: 403,
                error: "You are not alowed!"
            });
        };
    });
};

