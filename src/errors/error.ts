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
    userIsBlocked: new APIError(EHTTPStatus.BAD, "Пользователь заблокирован", 4),
    userIsDeleted: new APIError(EHTTPStatus.BAD, "Пользователь удален", 5),
    serverError: new APIError(EHTTPStatus.BAD, "Ошибка сервера. Обратитесь к администратору или повторите попытку спустя время.", 6),
    wrongPassword: new APIError(EHTTPStatus.BAD, "Неверный пароль", 7),
    currentPasswordEntered: new APIError(EHTTPStatus.BAD, "Введен текущий пароль", 8),
    incorrectPassword: new APIError(EHTTPStatus.BAD, "Пароль должен содержать минимум 6 символов", 9),
    emptyPassword: new APIError(EHTTPStatus.BAD, "Пароль не должен быть пустым", 10),
    newAndRepeatPasswordsNotEqual: new APIError(EHTTPStatus.BAD, "Новый пароль и повтор пароля должны совпадать", 11),
    accessDenied: new APIError(EHTTPStatus.FORBIDDEN, "Нет доступа", 12),
    pageAlreadyExists: new APIError(EHTTPStatus.BAD, "Страница с таким названием уже существует", 13),
    linkAlreadyExists: new APIError(EHTTPStatus.BAD, "Страница с такой ссылкой уже существует", 14),
    changePageStatusProhibited: new APIError(EHTTPStatus.BAD, "Нельзя изменить статус страницы, т.к. эта страница используется в навигации", 15),
    deletePublishedPageIsProhibited: new APIError(EHTTPStatus.BAD, "Нельзя удалить опубликованную страницу", 16),
    publishingProhibitedBecauseLinkIsEmpty: new APIError(EHTTPStatus.BAD, "Нельзя опубликовать страницу т.к. ссылка пустая", 17),
    deletePublishedBlockIsProhibited: new APIError(EHTTPStatus.BAD, "Нельзя удалить опубликованный блок", 18),
    pageNotFound: new APIError(EHTTPStatus.NOT_FOUND, "Страница не найдена", 19),
    UploadError: new APIError(EHTTPStatus.BAD, "Ошибка загрузки", 20),
    IncorrectNumberFiles: new APIError(EHTTPStatus.BAD, "Превышен лимит загрузки файлов", 21),
    IncreasedSizeOfFile: new APIError(EHTTPStatus.BAD, "К сожалению, этот файл слишком много весит и не может быть отправлен.", 22),
    WrongTypeFile: new APIError(EHTTPStatus.BAD, "К сожалению, файл такого типа не может быть загружен.", 23),
    FakeTypeFile: new APIError(EHTTPStatus.BAD, "Настоящий тип файла и его расширение не сходятся.", 24),
    InvalidSumOfFiles: new APIError(EHTTPStatus.BAD, "Сумма размеров всех файлов не должна превышать 25мб", 25),
    ContactExisted: new APIError(EHTTPStatus.BAD, "Такой контакт уже существует", 26),
    wrongEmailContact: new APIError(EHTTPStatus.BAD, "Невалидный E-mail", 27),
    wrongPhone: new APIError(EHTTPStatus.BAD, "Неверый формат телефона", 28),
    emailAlreadyExist: new APIError(EHTTPStatus.BAD, "Данный E-mail уже зарегистрирован", 29),
    editPageCanOnlyCreator: new APIError(EHTTPStatus.BAD, "Редактировать страницу может только создатель страницы", 30),
    deletePageCanOnlyCreator: new APIError(EHTTPStatus.BAD, "Удалить страницу может только создатель страницы", 31),
    cannotDeleteUsedFilterPack: new APIError(EHTTPStatus.BAD, "Нельзя удалить используемый набор фильтров", 32),
    cannotDeleteUsedFilter: new APIError(EHTTPStatus.BAD, "Нельзя удалить используемый фильтр", 33),
};
