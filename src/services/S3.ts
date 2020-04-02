import * as AWS from "aws-sdk";
import * as dotenv from "dotenv";
import { PutObjectRequest } from "aws-sdk/clients/s3";
import { errorList } from "../errors";

dotenv.config({ path: ".env" });

export interface IUploadFileData {
    body: Buffer;
    key: string;
}

export class S3 {
    private readonly credentials = new AWS.Credentials({
        accessKeyId: process.env.AWS_ID,
        secretAccessKey: process.env.AWS_SECRET,
    });
    private readonly s3 = new AWS.S3({
        credentials: this.credentials,
    });

    async upload(data: IUploadFileData): Promise<void> {
        const params: PutObjectRequest = {
            Bucket: process.env.BUCKET,
            Key: data.key,
            Body: data.body,
            ContentEncoding: "base64",
        };
        await this.s3.upload(params, (err, sendData) => {
            if (err) {
                throw errorList.UploadError;
            }
        });
    }

    async delete(key: string): Promise<void> {
        await this.s3.deleteObject(
            {
                Bucket: process.env.BUCKET,
                Key: key,
            },
            (err) => {
                console.log(err);
            },
        );
    }
}
