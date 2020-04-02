export function getForgotPasswordMessage(name: string, newPassword: string): string {
    return (`
        <div>
            <div>Привет, <b>${name}</b></div>
            <div>Ваш новый пароль: <b>${newPassword}</b></div>
        </div>
    `);
}

export function getCreateUserMessage(password: string): string {
    return (`
        <div>
            <div>Привет, </div>
            <div>Теперь Вы один из админов сайта Omega-R</div>
            <div>Ваш новый пароль: <b>${password}</b></div>
        </div>
    `);
}

