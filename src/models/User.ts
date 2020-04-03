import { IChangePassword, ISignInData, ISignUpData, IUser, TUserClient } from "../entity";
import { Repository } from "../repository/Repository";
import { cryptPassword } from "../ustils";
import { userSchema } from "../schemas";
import { FileService, S3, TokenService } from "../services";
import { v4 } from "uuid";
import { Sender } from "../services/Sender";
import { omit } from "lodash";
import * as dotenv from "dotenv";
import * as fs from "fs";
import { Request } from "express";
import { get } from "lodash";

dotenv.config({ path: ".env" });

export class User {
    private readonly repository = new Repository<IUser>("user", userSchema, "users");
    private readonly tokenService = new TokenService();
    private readonly sender = new Sender();
    private readonly s3 = new S3();
    private readonly fileService = new FileService({
        maxFileSize: 1048576,
        maxNumberOfFiles: 1,
        whiteList: ["png", "jpg", "pdf", "gif", "jpeg"],
    });

    async registerUser(data: ISignUpData): Promise<void> {
        data.password = cryptPassword(data.password);
        await this.repository.add({ ...data, ident: v4() });
    }

    async signIn(data: ISignInData): Promise<{ token: string }> {
        const user = await this.repository.getOne({
            email: data.email,
            password: cryptPassword(data.password),
        });
        await this.tokenService.setToken({ userId: user.id, userIdent: user.ident });
        return {
            token: this.tokenService.getToken(),
        };
    }

    async forgotPassword(email: string): Promise<void> {
        const user = await this.repository.getOne({ email });
        this.sender.setEmail(email);
        const newPassword = v4();
        await this.sender.sendForgotPasswordMessage(user.login, newPassword);
        await this.repository.update(user.id, { password: cryptPassword(newPassword) });
    }

    async getUser(token: string): Promise<TUserClient> {
        const tokenData = this.tokenService.getTokenData(
            token,
            process.env.SECRET_ACCESS_TOKEN,
            process.env.CRYPT_ACCESS_TOKEN_SECRET,
        );
        const user = await this.repository.getOneById(tokenData.userId);
        return omit(
            {
                ...user,
                avatar: user.avatar
                    ? `${process.env.STORAGE}/avatar/${user.id}/${user.avatar}`
                    : null,
            },
            ["password", "ident"],
        );
    }

    async updateUser(token: string, data: Partial<IUser>): Promise<TUserClient> {
        const tokenData = this.tokenService.getTokenData(
            token,
            process.env.SECRET_ACCESS_TOKEN,
            process.env.CRYPT_ACCESS_TOKEN_SECRET,
        );
        await this.repository.update(tokenData.userId, omit(data, ["id"]));
        return await this.getUser(token);
    }

    async uploadAvatar(request: Request): Promise<TUserClient> {
        const token = String(request.header("token"));
        const { userId } = this.tokenService.getTokenData(
            token,
            process.env.SECRET_ACCESS_TOKEN,
            process.env.CRYPT_ACCESS_TOKEN_SECRET,
        );
        const user = await this.repository.getOneById(userId);
        if (user.avatar) {
            await this.s3.delete(`avatar/${userId}/${user.avatar}`);
        }
        const folderName = v4();
        await this.fileService.creatDir(folderName);
        const body = await new Promise((resolve) =>
            this.fileService.getDataFromRequest(request, resolve, folderName),
        );
        const filePath = get(body, "files.avatar.path");
        const bodyContent = fs.readFileSync(filePath);
        const type = this.fileService.getExtension(filePath);
        await this.s3.upload({
            key: `avatar/${userId}/${folderName}.${type}`,
            body: bodyContent,
        });
        await this.repository.update(userId, { avatar: `${folderName}.${type}` });
        this.fileService.deleteDir(folderName);
        return await this.getUser(token);
    }

    async deleteAvatar(token: string): Promise<TUserClient> {
        const { userId } = this.tokenService.getTokenData(
            token,
            process.env.SECRET_ACCESS_TOKEN,
            process.env.CRYPT_ACCESS_TOKEN_SECRET,
        );
        const user = await this.repository.getOneById(userId);
        if (user.avatar) {
            await this.s3.delete(`avatar/${userId}/${user.avatar}`);
            await this.repository.update(userId, { avatar: null });
        }
        return this.getUser(token);
    }

    async changePassword(token: string, data: IChangePassword): Promise<void> {
        const { userId } = this.tokenService.getTokenData(
            token,
            process.env.SECRET_ACCESS_TOKEN,
            process.env.CRYPT_ACCESS_TOKEN_SECRET,
        );
        await this.repository.update(userId, { password: cryptPassword(data.newPassword) });
    }
}
