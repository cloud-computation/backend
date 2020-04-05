import { Repository } from "../repository/Repository";
import { IComment, ICreatePost, IPost } from "../entity";
import { postSchema } from "../schemas";
import * as dotenv from "dotenv";
import { FileService, S3, TokenService } from "../services";
import { omit, get } from "lodash";
import { Request } from "express";
import { v4 } from "uuid";
import * as fs from "fs";
import { errorList } from "../errors";
import { commentSchema } from "../schemas/commentSchema";

dotenv.config({ path: ".env" });

export class Post {
    private readonly repository = new Repository<IPost>("post", postSchema, "posts");
    private readonly commentRepository = new Repository<IComment>(
        "comment",
        commentSchema,
        "comments",
    );
    private readonly tokenService = new TokenService();
    private readonly fileService = new FileService({
        maxFileSize: 1048576,
        maxNumberOfFiles: 1,
        whiteList: ["png", "jpg", "pdf", "gif", "jpeg"],
    });
    private readonly s3 = new S3();

    async getPostList(): Promise<IPost[]> {
        const list = await this.repository.getList();
        return list.map((item) => ({
            ...item,
            background: item.background ? `${process.env.STORAGE}/${item.background}` : null,
        }));
    }

    async getPost(id: number): Promise<IPost> {
        const post = await this.repository.getOneById(id);
        return {
            ...post,
            background: post.background ? `${process.env.STORAGE}/${post.background}` : null,
        };
    }

    async createPost(request: Request): Promise<{ id: number }> {
        const token = request.header("token");
        const { userId } = this.tokenService.getTokenData(
            token,
            process.env.SECRET_ACCESS_TOKEN,
            process.env.CRYPT_ACCESS_TOKEN_SECRET,
        );
        const folderName = v4();
        await this.fileService.creatDir(folderName);
        const body = await new Promise((resolve) =>
            this.fileService.getDataFromRequest(request, resolve, folderName),
        );
        const data: ICreatePost = get(body, "fields");
        const isTitleExist = await this.repository.getOne({ title: data.title });
        if (isTitleExist) {
            throw errorList.postAlreadyExist;
        }
        const filePath = get(body, "files.file.path");
        const bodyContent = fs.readFileSync(filePath);
        const type = this.fileService.getExtension(filePath);
        await this.repository.add({
            authorId: userId,
            text: data.text,
            title: data.title,
            background: `posts/${folderName}.${type}`,
        });
        await this.s3.upload({
            key: `posts/${folderName}.${type}`,
            body: bodyContent,
        });
        const post = await this.repository.getOne({
            authorId: userId,
            title: data.title,
        });
        await this.fileService.deleteDir(folderName);
        return { id: post.id };
    }

    async editPost(id: number, data: Partial<IPost>): Promise<void> {
        await this.repository.update(id, omit(data, ["id"]));
    }

    async editPostBackground(request: Request): Promise<void> {
        const postId = Number(request.params.id);
        const post = await this.repository.getOneById(postId);
        await this.s3.delete(post.background);
        const folderName = v4();
        await this.fileService.creatDir(folderName);
        const body = await new Promise((resolve) =>
            this.fileService.getDataFromRequest(request, resolve, folderName),
        );
        const filePath = get(body, "files.file.path");
        const bodyContent = fs.readFileSync(filePath);
        const type = this.fileService.getExtension(filePath);
        await this.s3.upload({
            key: `posts/${folderName}.${type}`,
            body: bodyContent,
        });
        await this.repository.update(post.id, {
            background: `posts/${folderName}.${type}`,
        });
    }

    async deletePost(id: number): Promise<void> {
        const comments = await this.commentRepository.getList({ postId: id });
        for (let i = 0; i < comments.length; i++) {
            await this.commentRepository.delete(comments[i].id);
        }
        const post = await this.repository.getOneById(id);
        await this.s3.delete(post.background);
        await this.repository.delete(id);
    }
}
