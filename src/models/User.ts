import { ISignInData, ISignUpData, IUser } from "../entity";
import { Repository } from "../repository/Repository";
import { cryptPassword } from "../ustils";
import { userSchema } from "../schemas";
import { TokenService } from "../services";
import { v4 } from "uuid";
import { Sender } from "../services/Sender";
import { omit } from "lodash";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env" });

export class User {
    private readonly repository = new Repository<IUser>("user", userSchema, "users");
    private readonly tokenService = new TokenService();
    private readonly sender = new Sender();

    async registerUser(data: ISignUpData): Promise<void> {
        data.password = cryptPassword(data.password);
        await this.repository.add({ ...data });
    }

    async signIn(data: ISignInData): Promise<{ token: string }> {
        const user = await this.repository.getOne({
            email: data.email,
            password: cryptPassword(data.password),
        });
        await this.tokenService.setToken({ userId: user.id, email: user.email });
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

    async login(token: string): Promise<Omit<IUser, "password">> {
        const tokenData = this.tokenService.getTokenData(
            token,
            process.env.SECRET_ACCESS_TOKEN,
            process.env.CRYPT_ACCESS_TOKEN_SECRET,
        );
        const user = await this.repository.getOne({
            id: tokenData.userId,
            email: tokenData.email
        });
        return omit(user, "password");
    }
}
