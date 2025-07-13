// import axios from 'axios';
import axios from './service';
import config from '../config.json'
const usersEndpoint = `${config.apiEndpoint}/auth/users`

export const registerUser = async (user) => {
    console.log(usersEndpoint)
  const response = await axios.post(usersEndpoint,user);
  return response.data;
}

// export const addMovie = async (obj) => {
//   const response = await axios.post(moviesEndpoint, obj);
//   return response.data;
// }

// export const deleteMovie = async (movie) => {
//     const deleteEndpoint = moviesEndpoint + '/' + movie.id
//     console.log(deleteEndpoint)
//   const response = await axios.delete(deleteEndpoint);
//   return response.data;
// }

// export const updateMovie = async (movie) => {
//     const updateEndpoint = moviesEndpoint + '/' + movie.id
//     console.log(updateEndpoint)
//   const response = await axios.put(updateEndpoint, movie);
//   return response.data;
// }