import { IRepository } from "./IRepository";
import { Database } from "../services";
import { Model, ModelAttributes } from "sequelize";
import { ModelCtor } from "sequelize/types/lib/model";

export class Repository<T extends object> implements IRepository<T> {
    private readonly database = new Database();
    private readonly model: ModelCtor<Model<T>>;

    constructor(modelName: string, schema: ModelAttributes, tableName) {
        this.database.getConnection().define(modelName, schema, { tableName });
        this.model = this.database.getConnection().models[modelName];
    }

    async getList(params?: Partial<T>): Promise<T[]> {
        const response = await this.model.findAll({ where: { ...params } });
        return response.map((item) => JSON.parse(JSON.stringify(item)));
    }

    async add(data: T): Promise<void> {
        await this.model.create(data);
    }

    async getOne(params: Partial<T>): Promise<T> {
        const response = await this.model.findOne({ where: { ...params } });
        return JSON.parse(JSON.stringify(response));
    }

    async getOneById(id: number): Promise<T> {
        const response = await this.model.findByPk(id);
        return JSON.parse(JSON.stringify(response));
    }

    async update(id: number, data: Partial<T>): Promise<void> {
        await this.model.update(data, {
            where: {
                id,
            },
        });
    }
    async updateByField(params: Partial<T>, data: T): Promise<void> {
        await this.model.update(data, {
            where: { ...params },
        });
    }

    async delete(id: number): Promise<void> {
        await this.model.destroy({
            where: { id },
        });
    }

    async deleteByField(params: Partial<T>): Promise<void> {
        await this.model.destroy({
            where: { ...params },
        });
    }

    async count(params: Partial<T>): Promise<number> {
        const response = await this.model.findAndCountAll({
            where: { ...params },
        });
        return response.count;
    }
}
