export interface IComment {
    id?: number;
    postId: number;
    parentId: number;
    authorId: number;
    text: string;
    createdAt: string;
    updatedAt: string;
}

export interface ICommentForClient extends IComment {
    login: string;
    avatar?: string;
}

export type TCreateComment = Pick<IComment, "postId" | "authorId" | "text">;
