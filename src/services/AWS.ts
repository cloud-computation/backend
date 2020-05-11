import * as dotenv from "dotenv";
import * as AWSSDK from "aws-sdk";

dotenv.config({ path: ".env" });

export class AWS {
    private readonly credentials = new AWSSDK.Credentials({
        accessKeyId: process.env.AWS_ID,
        secretAccessKey: process.env.AWS_SECRET,

    });

    private readonly s3 = new AWSSDK.S3({
        credentials: this.credentials,
    });

    private readonly dynamoDB = new AWSSDK.DynamoDB.DocumentClient({
        credentials: this.credentials,
        region: "eu-west-3"
    });

    getS3(): AWSSDK.S3 {
        return this.s3;
    }

    getDynamoDB(): AWSSDK.DynamoDB.DocumentClient {
        return this.dynamoDB;
    }
}
