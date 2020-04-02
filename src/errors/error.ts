import { EHTTPStatus } from "../config";

export interface IAPIError {
    status: number;
    code: number;
    message: string;
}

export class APIError extends Error {
    status: number;
    code: number;
    title: string;
    
    constructor(status: number, title: string, code: number) {
        super(title);
        this.status = status;
        this.code = code;
        this.title = title;
    }
}

export const errorList = {
    unauthorized: new APIError(EHTTPStatus.UNAUTHORIZED, "Unauthorized", 1),
    wrongUserData: new APIError(EHTTPStatus.BAD, "Введены неверные данные", 2),
    userNotFound: new APIError(EHTTPStatus.NOT_FOUND, "Пользователь не найден", 3),
    serverError: new APIError(EHTTPStatus.BAD, "Ошибка сервера. Обратитесь к администратору или повторите попытку спустя время.", 4),
    wrongPassword: new APIError(EHTTPStatus.BAD, "Неверный пароль", 5),
    currentPasswordEntered: new APIError(EHTTPStatus.BAD, "Введен текущий пароль", 6),
    incorrectPassword: new APIError(EHTTPStatus.BAD, "Пароль должен содержать минимум 6 символов", 7),
    emptyPassword: new APIError(EHTTPStatus.BAD, "Пароль не должен быть пустым", 8),
    newAndRepeatPasswordsNotEqual: new APIError(EHTTPStatus.BAD, "Новый пароль и повтор пароля должны совпадать", 9),
    accessDenied: new APIError(EHTTPStatus.FORBIDDEN, "Нет доступа", 10),
    pageNotFound: new APIError(EHTTPStatus.NOT_FOUND, "Страница не найдена", 11),
    UploadError: new APIError(EHTTPStatus.BAD, "Ошибка загрузки", 12),
    IncreasedSizeOfFile: new APIError(EHTTPStatus.BAD, "К сожалению, этот файл слишком много весит и не может быть отправлен.", 13),
    WrongTypeFile: new APIError(EHTTPStatus.BAD, "К сожалению, файл такого типа не может быть загружен.", 14),
    FakeTypeFile: new APIError(EHTTPStatus.BAD, "Настоящий тип файла и его расширение не сходятся.", 15),
    wrongEmailContact: new APIError(EHTTPStatus.BAD, "Невалидный E-mail", 16),
    emailAlreadyExist: new APIError(EHTTPStatus.BAD, "Данный E-mail уже зарегистрирован", 17),
};
