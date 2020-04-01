import { APIError } from "../errors";

interface ISuccess {
    success: boolean;
}

export interface IResponseMessage extends ISuccess {
    data?: any;
    error?: APIError;
}
