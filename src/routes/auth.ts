import * as express from "express";
import { Request, Response } from "express";
import { UserController } from "../controllers";
import {checkForgotPassword, checkSignIn, checkSignUp} from "../middleware";

const router = express.Router();

enum Actions {
    SIGN_UP = "/signUp",
    SIGN_IN = "/signIn",
    FORGOT_PASSWORD = "/forgotPassword",
    LOGIN = "/login",
}

const controller = new UserController();

router.post(
    Actions.SIGN_UP,
    async (req, res, next) => await checkSignUp(req, res, next),
    (req: Request, res: Response) => {
        controller.createUser(req.body, res);
    },
);

router.post(
    Actions.SIGN_IN,
    async (req, res, next) => await checkSignIn(req, res, next),
    (req: Request, res: Response) => {
        controller.signIn(req.body, res);
    },
);

router.post(
    Actions.FORGOT_PASSWORD,
    async (req, res, next) => await checkForgotPassword(req, res, next),
    (req: Request, res: Response) => {
        controller.forgotPassword(req.body.email, res);
    },
);

router.post(
    Actions.LOGIN,
    (req: Request, res: Response) => {
        const token = req.header("token");
        controller.login(token, res);
    },
);

export const auth = router;
