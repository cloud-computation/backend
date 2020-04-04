import { Request } from "express";
import * as formidable from "formidable";
import { Fields } from "formidable";
import { Files } from "formidable";

export function getDataFromFormData<T>(request: Request, resolve: (data: any) => void): void {
    const form = new formidable.IncomingForm();
    form.parse(request, (err, fields: Fields, files: Files) => {
        resolve({
            fields: (fields as unknown) as T,
            files
        });
    });
}
