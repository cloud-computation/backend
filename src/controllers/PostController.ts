import {IChangePassword, ICreatePost, IPost, ISignInData, ISignUpData, IUser} from "../entity";
import { Response } from "express";
import { sendErrorMessage, sendSuccessMessage } from "../ustils";
import { Request } from "express";
import {Post} from "../models";

export class PostController {
    private readonly post = new Post();

    getPostList(response: Response): void {
        this.post
            .getPostList()
            .then((res) => sendSuccessMessage(response, res))
            .catch((error) => sendErrorMessage(error, response));
    }

    createPost(token: string, data: ICreatePost, response: Response): void {
        this.post
            .createPost(token, data)
            .then((res) => sendSuccessMessage(response, res))
            .catch((error) => sendErrorMessage(error, response));
    }

    editPost(id: number, data: Partial<IPost>, response: Response): void {
        this.post
            .editPost(id, data)
            .then((res) => sendSuccessMessage(response, res))
            .catch((error) => sendErrorMessage(error, response));
    }

    deletePost(id: number, response: Response): void {
        this.post
            .deletePost(id)
            .then((res) => sendSuccessMessage(response, res))
            .catch((error) => sendErrorMessage(error, response));
    }
}
