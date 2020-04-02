import { NextFunction, Request, Response } from "express";
import { Repository } from "../repository/Repository";
import { ISignInData, ISignUpData, IUser } from "../entity";
import { userSchema } from "../schemas";
import { errorList } from "../errors";
import { cryptPassword } from "../ustils";

const userRepository = new Repository<IUser>("user", userSchema, "users");

export async function checkSignUp(request: Request, response: Response, next: NextFunction) {
    const data: ISignUpData = request.body;
    const isEmailExisted = await userRepository.getOne({ email: data.email });
    const isLoginExisted = await userRepository.getOne({ login: data.login });
    if (isEmailExisted) {
        next(errorList.emailAlreadyExist);
    } else if (isLoginExisted) {
        next(errorList.loginAlreadyExist);
    } else {
        next();
    }
}

export async function checkSignIn(request: Request, response: Response, next: NextFunction) {
    const data: ISignInData = request.body;
    const isUserExisted = await userRepository.getOne({
        email: data.email,
        password: cryptPassword(data.password),
    });
    if (!isUserExisted) {
        next(errorList.wrongUserData);
    } else {
        next();
    }
}

export async function checkForgotPassword(
    request: Request,
    response: Response,
    next: NextFunction,
) {
    const email = request.body.email;
    const isUserExisted = await userRepository.getOne({ email });
    if (!isUserExisted) {
        next(errorList.userNotFound);
    } else {
        next();
    }
}
