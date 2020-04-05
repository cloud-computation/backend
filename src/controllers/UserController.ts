import { User } from "../models/User";
import {IChangePassword, ISignInData, ISignUpData, IUser} from "../entity";
import { Response } from "express";
import { sendErrorMessage, sendSuccessMessage } from "../ustils";
import { Request } from "express";

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
            .getUser(token)
            .then((res) => sendSuccessMessage(response, res))
            .catch((error) => sendErrorMessage(error, response));
    }

    getUser(token: string, response: Response): void {
        this.user
            .getUser(token)
            .then((res) => sendSuccessMessage(response, res))
            .catch((error) => sendErrorMessage(error, response));
    }

    updateUser(token: string, user: Partial<IUser>, response: Response): void {
        this.user
            .updateUser(token, user)
            .then((res) => sendSuccessMessage(response, res))
            .catch((error) => sendErrorMessage(error, response));
    }

    uploadAvatar(request: Request, response: Response): void {
        this.user
            .uploadAvatar(request)
            .then((res) => sendSuccessMessage(response, res))
            .catch((error) => sendErrorMessage(error, response));
    }

    deleteAvatar(token: string, response: Response): void {
        this.user
            .deleteAvatar(token)
            .then((res) => sendSuccessMessage(response, res))
            .catch((error) => sendErrorMessage(error, response));
    }

    changePassword(token: string, data: IChangePassword, response: Response): void {
        this.user
            .changePassword(token, data)
            .then((res) => sendSuccessMessage(response, res))
            .catch((error) => sendErrorMessage(error, response));
    }

    getUserPosts(token: string, response: Response): void {
        this.user
            .getUserPosts(token)
            .then((res) => sendSuccessMessage(response, res))
            .catch((error) => sendErrorMessage(error, response));
    }
}
