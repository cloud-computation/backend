import * as express from "express";
import { Request, Response } from "express";
import { UserController } from "../controllers";
import {checkForgotPassword, checkSignIn, checkSignUp} from "../middleware";
import {checkChangePassword, checkChangeUserData, checkExistingUserByToken} from "../middleware/user";

const router = express.Router();

enum Actions {
    USER = "",
    AVATAR = "/avatar",
    PASSWORD = "/password"
}

const controller = new UserController();

router.get(
    Actions.USER,
    async (req, res, next) => await checkExistingUserByToken(req, res, next),
    (req: Request, res: Response) => {
        const token = req.header("token");
        controller.getUser(token, res);
    },
);

router.put(
    Actions.USER,
    async (req, res, next) => await checkExistingUserByToken(req, res, next),
    async (req, res, next) => await checkChangeUserData(req, res, next),
    (req: Request, res: Response) => {
        const token = req.header("token");
        controller.updateUser(token, req.body, res);
    },
);

router.put(
    Actions.AVATAR,
    async (req, res, next) => await checkExistingUserByToken(req, res, next),
    (req: Request, res: Response) => {
        controller.uploadAvatar(req, res);
    },
);

router.delete(
    Actions.AVATAR,
    async (req, res, next) => await checkExistingUserByToken(req, res, next),
    (req: Request, res: Response) => {
        const token = req.header("token");
        controller.deleteAvatar(token, res);
    },
);

router.put(
    Actions.PASSWORD,
    async (req, res, next) => await checkExistingUserByToken(req, res, next),
    async (req, res, next) => await checkChangePassword(req, res, next),
    (req: Request, res: Response) => {
        const token = req.header("token");
        controller.changePassword(token, req.body, res);
    },
);

export const user = router;
