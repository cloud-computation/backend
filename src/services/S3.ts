import * as dotenv from "dotenv";
import { PutObjectRequest } from "aws-sdk/clients/s3";
import { errorList } from "../errors";
import { AWS } from "./AWS";

dotenv.config({ path: ".env" });

export interface IUploadFileData {
    body: Buffer;
    key: string;
}

export class S3 {
    private readonly aws = new AWS();

    async upload(data: IUploadFileData): Promise<void> {
        const params: PutObjectRequest = {
            Bucket: process.env.BUCKET,
            Key: data.key,
            Body: data.body,
            ContentEncoding: "base64",
        };
        await this.aws.getS3().upload(params, (err, sendData) => {
            if (err) {
                throw errorList.UploadError;
            }
        });
    }

    async delete(key: string): Promise<void> {
        await this.aws.getS3().deleteObject(
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
