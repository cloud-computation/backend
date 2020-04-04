import { NextFunction, Request, Response } from "express";
import { Repository } from "../repository/Repository";
import { ICreatePost, IPost } from "../entity";
import { postSchema } from "../schemas";
import { errorList } from "../errors";
import * as dotenv from "dotenv";
import { TokenService } from "../services";
import { get } from "lodash";
import { getDataFromFormData } from "../ustils";

dotenv.config({ path: ".env" });

const repository = new Repository<IPost>("post", postSchema, "posts");
const tokenService = new TokenService();

export async function checkCreatePost(request: Request, response: Response, next: NextFunction) {
    const body = await new Promise((resolve) => getDataFromFormData(request, resolve));
    const data: ICreatePost = get(body, "fields");
    const post = await repository.getOne({ title: data.title });
    if (post) {
        next(errorList.postAlreadyExist);
    } else {
        next();
    }
}

export async function checkEditPost(request: Request, response: Response, next: NextFunction) {
    const token = request.header("token");
    const { userId } = tokenService.getTokenData(
        token,
        process.env.SECRET_ACCESS_TOKEN,
        process.env.CRYPT_ACCESS_TOKEN_SECRET,
    );
    const postId = Number(request.params.id);
    const data: Partial<IPost> = request.body;
    const post = await repository.getOne({ title: data.title });
    if (post && postId !== post.id) {
        next(errorList.postAlreadyExist);
    } else if (post.authorId !== userId) {
        next(errorList.postCanBeEditedByOwner);
    } else {
        next();
    }
}

export async function checkEditPostBackground(
    request: Request,
    response: Response,
    next: NextFunction,
) {
    const token = request.header("token");
    const { userId } = tokenService.getTokenData(
        token,
        process.env.SECRET_ACCESS_TOKEN,
        process.env.CRYPT_ACCESS_TOKEN_SECRET,
    );
    const postId = Number(request.params.id);
    const post = await repository.getOneById(postId);
    if (post.authorId !== userId) {
        next(errorList.postCanBeEditedByOwner);
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
