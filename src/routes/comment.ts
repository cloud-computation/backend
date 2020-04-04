import * as express from "express";
import { Request, Response } from "express";
import { CommentController } from "../controllers";
import {
    checkExistingUserByToken,
} from "../middleware";

const router = express.Router();

enum Actions {
    LIST = "/:id/list",
    COMMENT = "/:id",
    CREATE = "",
}

const controller = new CommentController();

router.get(Actions.LIST, (req: Request, res: Response) => {
    controller.getCommentList(Number(req.params.id), res);
});

router.post(
    Actions.CREATE,
    async (req, res, next) => await checkExistingUserByToken(req, res, next),
    (req: Request, res: Response) => {
        controller.createComment(req.body, res);
    },
);

router.put(
    Actions.COMMENT,
    async (req, res, next) => await checkExistingUserByToken(req, res, next),
    (req: Request, res: Response) => {
        controller.editComment(Number(req.params.id), req.body, res);
    },
);

router.delete(
    Actions.COMMENT,
    async (req, res, next) => await checkExistingUserByToken(req, res, next),
    (req: Request, res: Response) => {
        controller.deleteComment(Number(req.params.id), res);
    },
);

export const comment = router;
