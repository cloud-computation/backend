import * as sequelize from "sequelize";
import { ISignUpData, IUser } from "../entity";
import { Repository } from "../repository/Repository";
import { cryptPassword } from "../ustils";
import { userSchema } from "../schemas";

export class User {
    private readonly repository = new Repository<IUser>("user", userSchema, "users");

    async registerUser(data: ISignUpData): Promise<void> {
        data.password = cryptPassword(data.password);
        await this.repository.add({ ...data });
    }
}
