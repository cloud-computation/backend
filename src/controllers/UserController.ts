import { User } from "../models/User";
import { ISignUpData } from "../entity";
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
}
