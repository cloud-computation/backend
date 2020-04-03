import { Repository } from "../repository/Repository";
import { IChangePassword, IUser } from "../entity";
import { userSchema } from "../schemas";
import { NextFunction, Request, Response } from "express";
import { errorList } from "../errors";
import * as dotenv from "dotenv";
import { TokenService } from "../services";
import { cryptPassword } from "../ustils";

dotenv.config({ path: ".env" });

const userRepository = new Repository<IUser>("user", userSchema, "users");
const tokenService = new TokenService();

export async function checkExistingUserByToken(
    request: Request,
    response: Response,
    next: NextFunction,
) {
    const token = request.header("token");
    const { userId } = tokenService.getTokenData(
        token,
        process.env.SECRET_ACCESS_TOKEN,
        process.env.CRYPT_ACCESS_TOKEN_SECRET,
    );
    const user = await userRepository.getOneById(userId);
    if (!user) {
        next(errorList.userNotFound);
    } else {
        next();
    }
}

export async function checkChangeUserData(
    request: Request,
    response: Response,
    next: NextFunction,
) {
    const data: Partial<IUser> = request.body;
    const token = request.header("token");
    const { userId } = tokenService.getTokenData(
        token,
        process.env.SECRET_ACCESS_TOKEN,
        process.env.CRYPT_ACCESS_TOKEN_SECRET,
    );
    const isEmailExisted = await userRepository.getOne({ email: data.email });
    const isLoginExisted = await userRepository.getOne({ login: data.login });
    if (isLoginExisted && isLoginExisted.id !== userId) {
        next(errorList.loginAlreadyExist);
    } else if (isEmailExisted && isEmailExisted.id !== userId) {
        next(errorList.emailAlreadyExist);
    } else {
        next();
    }
}

export async function checkChangePassword(
    request: Request,
    response: Response,
    next: NextFunction,
) {
    const data: IChangePassword = request.body;
    const token = request.header("token");
    const { userId } = tokenService.getTokenData(
        token,
        process.env.SECRET_ACCESS_TOKEN,
        process.env.CRYPT_ACCESS_TOKEN_SECRET,
    );
    const user = await userRepository.getOneById(userId);
    if (data.newPassword.length < 6 || data.password.length < 6 || data.repeatPassword.length < 6) {
        next(errorList.incorrectPassword);
    } else if (user.password !== cryptPassword(data.password)) {
        next(errorList.wrongPassword);
    } else if (data.newPassword !== data.repeatPassword) {
        next(errorList.newAndRepeatPasswordsNotEqual);
    } else if (user.password === cryptPassword(data.newPassword)) {
        next(errorList.currentPasswordEntered);
    } else {
        next();
    }
}
