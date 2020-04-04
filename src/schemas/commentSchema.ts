import { ModelAttributes } from "sequelize";
import * as sequelize from "sequelize";

export const commentSchema: ModelAttributes = {
    id: {
        type: sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        field: "id",
    },
    authorId: { type: sequelize.NUMBER },
    parentId: { type: sequelize.NUMBER },
    postId: { type: sequelize.NUMBER },
    text: { type: sequelize.STRING },
};
