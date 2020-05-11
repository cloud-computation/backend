export interface IPost {
    id?: number;
    authorId: number;
    title: string;
    text: string;
    background: string;
    views?: number;
}

export interface ICreatePost {
    title: string;
    text: string;
}

export interface IPostView {
    postId: number;
    userAgent: string;
    ip: string;
    date: string;
}
