import { IRepository } from "./IRepository";
import { AWS } from "../services/AWS";

export class DynamoRepository<T> implements Partial<IRepository<T>> {
    private readonly database = new AWS().getDynamoDB();
    private readonly table: string = "";

    constructor(table: string) {
        this.table = table;
    }

    async add(data: T): Promise<void> {
        await this.database
            .put({
                TableName: this.table,
                Item: data,
            })
            .promise();
    }

    async getList(params: object): Promise<T[]> {
        const list = await this.database.scan({
            TableName: this.table,
            FilterExpression: "postId = :postid",
            ExpressionAttributeValues: {
                ":postid": params["postId"]
            },
        });
        const result = await list.promise();
        return result.Items as T[];
    }

    async getOne(params: object): Promise<T> {
        const response = await this.database.get({
            TableName: this.table,
            Key: params,
        });
        const result = await response.promise();
        return result.Item as T;
    }
}
