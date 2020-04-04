import { ModelAttributes } from "sequelize";
import * as sequelize from "sequelize";

export const postSchema: ModelAttributes = {
    id: {
        type: sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        field: "id",
    },
    authorId: { type: sequelize.NUMBER },
    title: { type: sequelize.STRING },
    text: { type: sequelize.STRING },
    background: { type: sequelize.STRING },
};
