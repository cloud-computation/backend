import { APIError } from "../errors";
import { NextFunction, Request, Response } from "express";
import { sendErrorMessage } from "../ustils";

export function errorLogger(err: APIError, req: Request, res: Response, next: NextFunction) {
    if (err) {
        sendErrorMessage(err, res);
    }
    next();
}
