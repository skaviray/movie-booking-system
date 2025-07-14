// import axios from 'axios';
import http from './service';
import config from '../config.json'
const usersEndpoint = `${config.apiEndpoint}/auth/users`

export const registerUser = async (user) => {
    console.log(usersEndpoint)
  const response = await http.post(usersEndpoint,user);
  console.log(response)
  return response.data;
}

export const getUserInfo = async (token) => {
  console.log(`${config.apiEndpoint}/auth/userinfo`)
  const response = await http.get(`${config.apiEndpoint}/auth/userinfo`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  console.log(response)
  return response;
}
// export const addMovie = async (obj) => {
//   const response = await http.post(moviesEndpoint, obj);
//   return response.data;
// }

// export const deleteMovie = async (movie) => {
//     const deleteEndpoint = moviesEndpoint + '/' + movie.id
//     console.log(deleteEndpoint)
//   const response = await http.delete(deleteEndpoint);
//   return response.data;
// }

// export const updateMovie = async (movie) => {
//     const updateEndpoint = moviesEndpoint + '/' + movie.id
//     console.log(updateEndpoint)
//   const response = await http.put(updateEndpoint, movie);
//   return response.data;
// }