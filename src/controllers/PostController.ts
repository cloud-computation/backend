import { IPost } from "../entity";
import { Response } from "express";
import { sendErrorMessage, sendSuccessMessage } from "../ustils";
import { Request } from "express";
import { Post } from "../models";

export class PostController {
    private readonly post = new Post();

    getPostList(response: Response): void {
        this.post
            .getPostList()
            .then((res) => sendSuccessMessage(response, res))
            .catch((error) => sendErrorMessage(error, response));
    }

    getPost(request: Request, response: Response): void {
        this.post
            .getPost(request)
            .then((res) => sendSuccessMessage(response, res))
            .catch((error) => sendErrorMessage(error, response));
    }

    createPost(request: Request, response: Response): void {
        this.post
            .createPost(request)
            .then((res) => sendSuccessMessage(response, res))
            .catch((error) => sendErrorMessage(error, response));
    }

    editPost(id: number, data: Partial<IPost>, response: Response): void {
        this.post
            .editPost(id, data)
            .then((res) => sendSuccessMessage(response, res))
            .catch((error) => sendErrorMessage(error, response));
    }

    editPostBackground(request: Request, response: Response): void {
        this.post
            .editPostBackground(request)
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
