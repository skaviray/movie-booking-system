import config from "../config.json"
import axios from './service';
const loginEndpoint = `${config.apiEndpoint}/auth/login`

export const loginUser = async (user) => {
    console.log(loginEndpoint)
    console.log(user)
    const obj = {
        email: user.email,
        password: user.password
    }
    const {data} = await axios.post(loginEndpoint, obj)
    return data
}

