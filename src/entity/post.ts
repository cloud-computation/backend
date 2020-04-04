export interface IPost {
    id?: number;
    authorId: number;
    title: string;
    text: string;
}

export interface ICreatePost {
    title: string;
    text: string;
}
