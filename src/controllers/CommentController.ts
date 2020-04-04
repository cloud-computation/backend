import { Comment } from "../models";
import { IComment, TCreateComment } from "../entity";
import { Response } from "express";
import { sendErrorMessage, sendSuccessMessage } from "../ustils";

export class CommentController {
    private readonly comment = new Comment();

    getCommentList(postId: number, response: Response): void {
        this.comment
            .getCommentList(postId)
            .then((res) => sendSuccessMessage(response, res))
            .catch((error) => sendErrorMessage(error, response));
    }

    createComment(data: TCreateComment, response: Response): void {
        this.comment
            .createComment(data)
            .then((res) => sendSuccessMessage(response, res))
            .catch((error) => sendErrorMessage(error, response));
    }

    editComment(id: number, data: Partial<IComment>, response: Response): void {
        this.comment
            .editComment(id, data)
            .then((res) => sendSuccessMessage(response, res))
            .catch((error) => sendErrorMessage(error, response));
    }

    deleteComment(id: number, response: Response): void {
        this.comment
            .deleteComment(id)
            .then((res) => sendSuccessMessage(response, res))
            .catch((error) => sendErrorMessage(error, response));
    }
}
