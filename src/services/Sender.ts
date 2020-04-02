import { EmailConfig } from "../config";
import * as nodemailer from "nodemailer";
import * as Mail from "nodemailer/lib/mailer";
import { getForgotPasswordMessage } from "../helpers";
import * as dotenv from "dotenv";
import { errorList } from "../errors";

dotenv.config({path: ".env"});

export class Sender {
    private readonly transporter = nodemailer.createTransport({
        host: EmailConfig.host,
        port: EmailConfig.port,
        secure: EmailConfig.secure,
        auth: {
            user: EmailConfig.auth.user,
            pass: EmailConfig.auth.pass,
        }
    });
    
    private email: string;
    
    setEmail(email: string): void {
        this.email = email;
    }
    
    sendForgotPasswordMessage(name: string, newPassword: string) {
        return this.transporter.sendMail(this.getOptionsForForgotPasswordMessage(name, newPassword)).catch((err) => {
            if (err) {
                throw errorList.serverError;
            }
        });
    }

    private getOptionsForForgotPasswordMessage(name: string, newPassword: string): Mail.Options {
        return {
            from: process.env.EMAIL,
            to: this.email,
            subject: "Cloud computation",
            text: "Cloud computation",
            html: getForgotPasswordMessage(name, newPassword)
        };
    }

}
