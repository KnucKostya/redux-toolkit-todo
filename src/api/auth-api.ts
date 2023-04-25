import {instance} from "api/todolists-api";


export const authAPI = {
    login(data: LoginParamsType) {
        return instance.post<ResponseType<{userId?: number}>>('auth/login', data);
    },
    logout() {
        return instance.delete<ResponseType<{userId?: number}>>('auth/login');
    },
    me() {
        return instance.get<ResponseType<{id: number; email: string; login: string}>>('auth/me');
    }
}

//types
export type LoginParamsType = {
    email: string
    password: string
    rememberMe: boolean
    captcha?: string
}

export type ResponseType<D = {}> = {
    resultCode: number
    messages: Array<string>
    data: D
    fieldsErrors:[{field:string,error:string}]
}

export const ResultCode = {
    Success: 0,
    Failed: 1,
    Captcha: 10
}