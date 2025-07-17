import config from "../config.json"
import http from './service';
import { getUserInfo } from './userService';

const loginEndpoint = `${config.apiEndpoint}/api/login`
const tokenKey = "x-auth-token"



export const loginUser = async (user) => {
    console.log(loginEndpoint)
    console.log(user)
    const obj = {
        email: user.email,
        password: user.password
    }
    const {data: response,headers } = await http.post(loginEndpoint, obj)
    localStorage.setItem(tokenKey, headers[tokenKey])
    console.log(localStorage.getItem(tokenKey))
    return response
}


export const getCurrentUser = async () => {
    try {
    const token = localStorage.getItem(tokenKey)
    const {data: user} = await getUserInfo(token)
    return user
    } catch (ex) {
        return null
    }
}

export const getToken = () => {
    return localStorage.getItem(tokenKey)
}

http.setToken(getToken())

export const logout = () => {
    localStorage.removeItem(tokenKey)
}

const auth = {
    loginUser, 
    logout,
    getCurrentUser,
    getToken
}

export default auth