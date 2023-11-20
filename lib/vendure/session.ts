'use server'

import { cookies } from "next/headers";

const AUTH_TOKEN_KEY = 'auth_token';

export async function token(newAuthToken:string) {
    cookies().set(AUTH_TOKEN_KEY, newAuthToken);
}