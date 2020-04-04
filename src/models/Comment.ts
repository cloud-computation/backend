import { Repository } from "../repository/Repository";
import {IComment, ICommentForClient, IUser, TCreateComment} from "../entity";
import { commentSchema } from "../schemas/commentSchema";
import { userSchema } from "../schemas";
import { omit } from "lodash";

export class Comment {
    private readonly commentRepository = new Repository<IComment>(
        "comment",
        commentSchema,
        "comments",
    );
    private readonly userRepository = new Repository<IUser>("user", userSchema, "users");

    async getCommentList(postId: number): Promise<ICommentForClient[]> {
        const comments = await this.commentRepository.getList({ postId: postId });
        const users = await this.userRepository.getList();
        return comments.map((item) => {
            const avatar = users.find((user) => user.id === item.authorId).avatar;
            return {
                ...item,
                login: users.find((user) => user.id === item.authorId).login,
                avatar: avatar ? `${process.env.STORAGE}/avatar/${item.authorId}/${avatar}` : null
            }
        })
    }

    async createComment(data: TCreateComment): Promise<void> {
        await this.commentRepository.add(data);
    }

    async editComment(id: number, data: Partial<IComment>): Promise<void> {
        await this.commentRepository.update(id, omit(data, ["id"]));
    }

    async deleteComment(id: number): Promise<void> {
        await this.commentRepository.delete(id);
    }
}
