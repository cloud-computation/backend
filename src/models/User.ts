import * as sequelize from "sequelize";
import { ISignUpData, IUser } from "../entity";
import { Repository } from "../repository/Repository";

export class User {
    private readonly repository = new Repository<IUser>(
        "user",
        {
            id: {
                type: sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                field: "id"
            },
            login: { type: sequelize.STRING },
            email: { type: sequelize.STRING },
            avatar: { type: sequelize.STRING },
            password: { type: sequelize.STRING },
        },
        "users",
    );

    async registerUser(data: ISignUpData): Promise<void> {
        await this.repository.add(data);
    }
}
