import { IResponseMessage } from "../entity";
import { Response } from "express";
import {APIError} from "../errors";

function getSuccessMessage(data?: any): IResponseMessage {
    return {
        success: true,
        data
    };
}

function getErrorMessage(error?: APIError): IResponseMessage {
    return {
        success: false,
        error
    };
}

export function sendErrorMessage(error: APIError, response: Response): void {
    const date = new Date();
    const dateString = `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
    console.log(dateString, ": ", error.message);
    response.status(error.status).send(getErrorMessage(error));
}

export function sendSuccessMessage(response: Response, data?: any): void {
    response.send(getSuccessMessage(data));
}
