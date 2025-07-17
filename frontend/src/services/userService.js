// import axios from 'axios';
import http from './service';
import config from '../config.json'
const usersEndpoint = `${config.apiEndpoint}/api/users`

export const registerUser = async (user) => {
    console.log(usersEndpoint)
  const response = await http.post(usersEndpoint,user);
  console.log(response)
  return response.data;
}

export const getUserInfo = async (token) => {
  console.log(`${config.apiEndpoint}/api/userinfo`)
  const response = await http.get(`${config.apiEndpoint}/api/userinfo`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  console.log(response)
  return response;
}