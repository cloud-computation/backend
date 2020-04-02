import * as express from "express";
import { Request, Response } from "express";
import { UserController } from "../controllers";
import {checkForgotPassword, checkSignIn, checkSignUp} from "../middleware";

const router = express.Router();

enum Actions {
    USER = "",
    AVATAR = "/avatar"
}

const controller = new UserController();

router.get(
    Actions.USER,
    (req: Request, res: Response) => {
        const token = req.header("token");
        controller.getUser(token, res);
    },
);

router.put(
    Actions.USER,
    (req: Request, res: Response) => {
        const token = req.header("token");
        controller.updateUser(token, req.body, res);
    },
);

router.put(
    Actions.AVATAR,
    (req: Request, res: Response) => {
        controller.uploadAvatar(req, res);
    },
);

router.delete(
    Actions.AVATAR,
    (req: Request, res: Response) => {
        const token = req.header("token");
        controller.deleteAvatar(token, res);
    },
);

export const user = router;
