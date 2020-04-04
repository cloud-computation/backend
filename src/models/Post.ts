import { Repository } from "../repository/Repository";
import { ICreatePost, IPost } from "../entity";
import { postSchema } from "../schemas";
import * as dotenv from "dotenv";
import { TokenService } from "../services";
import { omit } from "lodash";

dotenv.config({ path: ".env" });

export class Post {
    private readonly repository = new Repository<IPost>("post", postSchema, "posts");
    private readonly tokenService = new TokenService();

    async getPostList(): Promise<IPost[]> {
        return await this.repository.getList();
    }

    async getPost(id: number): Promise<IPost> {
        return await this.repository.getOneById(id);
    }

    async createPost(token: string, data: ICreatePost): Promise<{ id: number }> {
        const { userId } = this.tokenService.getTokenData(
            token,
            process.env.SECRET_ACCESS_TOKEN,
            process.env.CRYPT_ACCESS_TOKEN_SECRET,
        );
        await this.repository.add({
            authorId: userId,
            text: data.text,
            title: data.title,
        });
        const user = await this.repository.getOne({
            authorId: userId,
            title: data.title,
        });
        return { id: user.id  };
    }

    async editPost(id: number, data: Partial<IPost>): Promise<void> {
        await this.repository.update(id, omit(data, ["id"]));
    }

    async deletePost(id: number): Promise<void> {
        await this.repository.delete(id);
    }
}
