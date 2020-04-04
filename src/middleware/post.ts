import { NextFunction, Request, Response } from "express";
import { Repository } from "../repository/Repository";
import { IPost } from "../entity";
import { postSchema } from "../schemas";
import { errorList } from "../errors";
import * as dotenv from "dotenv";
import {TokenService} from "../services";

dotenv.config({ path: ".env" });

const repository = new Repository<IPost>("post", postSchema, "posts");
const tokenService = new TokenService();

export async function checkPost(request: Request, response: Response, next: NextFunction) {
    const post = await repository.getOne({ title: request.body.title });
    if (post) {
        next(errorList.postAlreadyExist);
    } else {
        next();
    }
}

export async function checkDeletePost(request: Request, response: Response, next: NextFunction) {
    const postId = Number(request.params.id);
    const token = request.header("token");
    const { userId } = tokenService.getTokenData(
        token,
        process.env.SECRET_ACCESS_TOKEN,
        process.env.CRYPT_ACCESS_TOKEN_SECRET,
    );
    const post = await repository.getOneById(postId);
    if (post.authorId !== userId) {
        next(errorList.postCanBeDeletedByOwner);
    } else {
        next();
    }
}
