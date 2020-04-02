import * as fs from "fs";
import * as path from "path";
import { Files, File, Fields } from "formidable";
import { mapValues, last } from "lodash";
import * as fileType from "file-type";
import * as readChunk from "read-chunk";
import * as rimraf from "rimraf";
import { errorList } from "../errors";
import * as formidable from "formidable";
import { Request } from "express";

export interface IFileServiceParams {
    maxNumberOfFiles: number;
    maxFileSize: number;
    whiteList: string[];
}

export interface IFile {
    name: string;
    path: string;
    size: number;
}

export class FileService {
    private static readonly archiveMaxSize = 26214400;
    constructor(params: IFileServiceParams) {
        this.params = params;
    }
    private readonly params: IFileServiceParams;
    private files: IFile[] = [];

    async creatDir(dirName: string): Promise<void> {
        await fs.promises.mkdir(`${path.resolve()}/files/${dirName}`);
    }

    deleteDir(dirName: string): void {
        const pathname = `${path.resolve()}/files/${dirName}`;
        rimraf(pathname, () => {
            return;
        });
    }

    getDirPath(dirName: string): string {
        return `${path.resolve()}/files/${dirName}`;
    }

    handleFiles(files: Files): void {
        this.setFiles(files);
        this.checkFiles();
    }

    reset(): void {
        this.files = [];
    }

    getDataFromRequest<T>(request: Request, resolve: (data: any) => void, folderName: string): void {
        const form = new formidable.IncomingForm();
        form.keepExtensions = true;
        form.uploadDir = `${path.resolve()}/files/${folderName}`;
        form.parse(request, (err, fields: Fields, files: Files) => {
            resolve({
                fields: (fields as unknown) as T,
                files
            });
        });
    }

    private setFiles(files: Files): void {
        mapValues(files, (value: File, key) => {
            this.files.push({
                name: value.name,
                path: value.path,
                size: value.size
            });
        });
    }

    private checkFiles(): void {
        this.files.map((file: IFile, index: number) => {
            const ext = this.getExtension(file.path);
            if (this.params.whiteList.indexOf(ext) < 0) {
                throw errorList.WrongTypeFile;
            }
            if (file.size > this.params.maxFileSize) {
                throw errorList.IncreasedSizeOfFile;
            }
            if (this.getUnsafeExtension(file.name) !== ext) {
                throw errorList.FakeTypeFile;
            }
        });
    }

    getExtension(pathname: string): string {
        const buffer = readChunk.sync(pathname, 0, fileType.minimumBytes);
        return fileType(buffer).ext;
    }

    private getUnsafeExtension(name: string): string {
        return (last(name.split(".")) || "").toLowerCase();
    }
}
