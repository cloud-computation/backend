import * as dotenv from "dotenv";

dotenv.config({path: ".env"});

export const EmailConfig = {
    pool: true,
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    }
};
