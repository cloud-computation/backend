import * as express from "express";
import { Request, Response } from "express";
import { PostController } from "../controllers";
import {
    checkDeletePost,
    checkEditPost,
    checkEditPostBackground,
    checkExistingUserByToken,
} from "../middleware";

const router = express.Router();

enum Actions {
    POST = "",
    POST_ID = "/:id",
    BACKGROUND = "/:id/background"
}

const controller = new PostController();

router.get(
    Actions.POST,
    (req: Request, res: Response) => {
        controller.getPostList(res);
    },
);

router.post(
    Actions.POST,
    async (req, res, next) => await checkExistingUserByToken(req, res, next),
    (req: Request, res: Response) => {
        controller.createPost(req, res);
    },
);

router.get(
    Actions.POST_ID,
    (req: Request, res: Response) => {
        controller.getPost(Number(req.params.id), res);
    },
);

router.put(
    Actions.POST_ID,
    async (req, res, next) => await checkExistingUserByToken(req, res, next),
    async (req, res, next) => await checkEditPost(req, res, next),
    (req: Request, res: Response) => {
        controller.editPost(Number(req.params.id), req.body, res);
    },
);

router.put(
    Actions.BACKGROUND,
    async (req, res, next) => await checkExistingUserByToken(req, res, next),
    async (req, res, next) => await checkEditPostBackground(req, res, next),
    (req: Request, res: Response) => {
        controller.editPostBackground(req, res);
    },
);

router.delete(
    Actions.POST_ID,
    async (req, res, next) => await checkExistingUserByToken(req, res, next),
    async (req, res, next) => await checkDeletePost(req, res, next),
    (req: Request, res: Response) => {
        controller.deletePost(Number(req.params.id), res);
    },
);

export const post = router;
