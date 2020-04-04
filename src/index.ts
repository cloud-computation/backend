import * as express from "express";
import * as http from "http";
import * as dotenv from "dotenv";
import { Database } from "./services";
import { auth, user } from "./routes";
import { NextFunction, Request, Response } from "express";
import { corsMiddleware, errorLogger } from "./middleware";
import { APIError } from "./errors";
import {post} from "./routes/post";

const app = express();
const server = http.createServer(app);
const database = new Database();

database.connect();
dotenv.config({ path: ".env" });
app.use(express.json());
app.use(corsMiddleware());

app.use((req: Request, res: Response, next: NextFunction) => {
    const allowedOrigins = [process.env.FRONTEND_LOCAL, process.env.FRONTEND];

    const origin = req.headers.origin;
    if (allowedOrigins.indexOf(origin as string) > -1) {
        res.setHeader("Access-Control-Allow-Origin", origin);
    }
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, RESEND");
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,content-type");
    next();
});

app.use("/auth", auth);
app.use("/user", user);
app.use("/post", post);

app.get("/", (req, res, next) => {
    res.send(`I'm alive`);
    return next();
});

app.use((err: APIError, req: Request, res: Response, next: NextFunction) =>
    errorLogger(err, req, res, next),
);

server.listen(process.env.PORT, () => {
    console.log("Server connected on", process.env.PORT);
});
