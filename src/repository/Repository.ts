import { IRepository } from "./IRepository";
import { Database } from "../services";
import { Model, ModelAttributes } from "sequelize";
import { ModelCtor } from "sequelize/types/lib/model";

export class Repository<T extends object> implements Partial<IRepository<T>> {
    private readonly database = new Database();
    private readonly model: ModelCtor<Model<T>>;

    constructor(modelName: string, schema: ModelAttributes, tableName) {
        this.database.getConnection().define(modelName, schema, { tableName });
        this.model = this.database.getConnection().models[modelName];
    }

    async getList(params: Partial<T>): Promise<T[]> {
        const t = await this.model.findAll(params);
        console.log(t);
        return [];
    }

    async add(data: T): Promise<void> {
        await this.model.create(data);
    }
}
