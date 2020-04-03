export interface IUser {
    id?: number;
    login: string;
    email: string;
    avatar?: string;
    password: string;
    ident: string;
}

export type TUserClient = Omit<IUser, "ident" | "password">;

export interface IChangePassword {
    password: string;
    newPassword: string;
    repeatPassword: string;
}
