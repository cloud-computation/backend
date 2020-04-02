import { User } from "../models/User";
import {ISignInData, ISignUpData} from "../entity";
import { Response } from "express";
import {sendErrorMessage, sendSuccessMessage} from "../ustils";

export class UserController {
    private readonly user = new User();

    createUser(data: ISignUpData, response: Response): void {
        this.user
            .registerUser(data)
            .then((res) => sendSuccessMessage(response, res))
            .catch((error) => sendErrorMessage(error, response));
    }

    signIn(data: ISignInData, response: Response): void {
        this.user
            .signIn(data)
            .then((res) => sendSuccessMessage(response, res))
            .catch((error) => sendErrorMessage(error, response));
    }

    forgotPassword(data: string, response: Response): void {
        this.user
            .forgotPassword(data)
            .then((res) => sendSuccessMessage(response, res))
            .catch((error) => sendErrorMessage(error, response));

    }

    login(token: string, response: Response): void {
        this.user
            .login(token)
            .then((res) => sendSuccessMessage(response, res))
            .catch((error) => sendErrorMessage(error, response));

    }
}
