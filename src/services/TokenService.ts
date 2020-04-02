import * as jsonwebtoken from "jsonwebtoken";
import * as CryptoJS from "crypto-js";
import { ITokenData } from "../entity";
import * as dotenv from "dotenv";
import { errorList } from "../errors";

dotenv.config({ path: ".env" });

export class TokenService {
    private token = "";

    setToken(data: ITokenData): void {
        const accessToken = jsonwebtoken.sign(data, process.env.SECRET_ACCESS_TOKEN, {
            algorithm: process.env.TOKEN_ALGORITHM as jsonwebtoken.Algorithm,
        });
        this.token = TokenService.cryptToken(
            accessToken,
            process.env.CRYPT_ACCESS_TOKEN_SECRET,
        )
    }

    getToken(): string {
        return this.token;
    }

    getTokenData(tokenString: string, tokenSecret: string, cryptTokenSecret: string): ITokenData {
        let data: ITokenData = { userIdent: "", userId: 0 };
        const decryptedToken = TokenService.decryptToken(tokenString, cryptTokenSecret);
        jsonwebtoken.verify(
            decryptedToken,
            tokenSecret,
            { algorithms: [process.env.TOKEN_ALGORITHM as jsonwebtoken.Algorithm] },
            (err, decoded) => {
                if (err) {
                    throw errorList.unauthorized;
                }
                data = decoded as ITokenData;
            },
        );
        return data;
    }

    static cryptToken(token: string, secret: string): string {
        return CryptoJS.AES.encrypt(token, secret).toString();
    }

    static decryptToken(cryptedToken: string, secret: string): string {
        try {
            const bytes = CryptoJS.AES.decrypt(cryptedToken, secret);
            return bytes.toString(CryptoJS.enc.Utf8);
        } catch (e) {
            throw errorList.unauthorized;
        }
    }
}
