import * as express from "express";
import * as http from "http";
import * as dotenv from "dotenv";

const app = express();
const server = http.createServer(app);

dotenv.config({ path: ".env" });
app.use(express.json());
app.get("/", (req, res, next) => {
    res.send(`I'm alive`);
    return next();
});

server.listen(process.env.PORT, () => {
    console.log("Server connected on", process.env.PORT);
});
