import { loginApi } from "../api/auth.api";

import type {
    LoginPayload
} from "../types/auth.types";


export const loginService = async (
    payload: LoginPayload
) => {


    const data =
        await loginApi(payload);


    /*
       لاحقاً:
       - save user
       - update auth store
       - analytics
    */


    return data;

};