import * as dotenv from "dotenv";
import { Sequelize } from "sequelize";

dotenv.config({ path: ".env" });

export class Database {
    private readonly instance = new Sequelize(
        process.env.DATABASE_NAME,
        process.env.DATABASE_USERNAME,
        process.env.DATABASE_PASSWORD,
        {
            host: process.env.DATABASE_HOST,
            port: 5432,
            dialect: "postgres"
        },
    );

    connect(): void {
        this.instance
            .authenticate()
            .then(() => {
                console.log("Connection has been established successfully.");
            })
            .catch((err) => {
                console.error("Unable to connect to the database:", err);
            });
    }

    getConnection() {
        return this.instance;
    }
}
