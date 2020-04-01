import * as express from "express";
import { Request, Response } from "express";
import { UserController } from "../controllers";

const router = express.Router();

enum Actions {
    SIGN_UP = "/signUp",
}

const controller = new UserController();

router.post(Actions.SIGN_UP, (req: Request, res: Response) => {
    controller.createUser(req.body, res);
});

export const auth = router;
