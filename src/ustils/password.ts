import * as CryptoJS from "crypto-js";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env" });

export function cryptPassword(password: string): string {
    return CryptoJS.SHA256(
        CryptoJS.SHA512(`${process.env.PASSWORD_SECRET}${password}`).toString(),
    ).toString();
}
