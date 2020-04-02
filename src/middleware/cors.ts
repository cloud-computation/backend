import * as cors from "cors";
import { CorsOptions } from "cors";
import * as dotenv from "dotenv";
import { RequestHandler } from "express";

dotenv.config({path: ".env"});

export function corsMiddleware(): RequestHandler {
    const whiteList = [process.env.FRONTEND_LOCAL, process.env.FRONTEND];
    const corsOptions: CorsOptions = {
        origin: (origin, callback) => {
            if (whiteList.indexOf(origin) >= 0) {
                callback(null, true)
            } else {
                throw "Not allowed by CORS"
            }
        }
    };
    return cors(corsOptions);
}
