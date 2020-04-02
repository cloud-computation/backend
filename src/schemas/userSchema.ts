import { ModelAttributes } from "sequelize";
import * as sequelize from "sequelize";

export const userSchema: ModelAttributes = {
    id: {
        type: sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        field: "id",
    },
    login: { type: sequelize.STRING },
    email: { type: sequelize.STRING },
    avatar: { type: sequelize.STRING },
    password: { type: sequelize.STRING },
};
