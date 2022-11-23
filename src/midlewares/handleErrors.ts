import { ErrorRequestHandler, Response, Request, NextFunction } from "express";

export const handleErrors = (err: ErrorRequestHandler, _req: Request, res: Response, _next: NextFunction): Response => {
    console.log(err.name)
    if (err instanceof Error) {
        return res.status(400).send({
            status_code: 400,
            errors: err.message
        })
    };
    return res.status(400).end();
}