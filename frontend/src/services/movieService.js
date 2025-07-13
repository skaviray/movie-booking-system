// import axios from 'axios';
import axios from './service';
import config from '../config.json'
const moviesEndpoint = `${config.apiEndpoint}/auth/movies`

export const fetchMovies = async () => {
    console.log(moviesEndpoint)
  const response = await axios.get(moviesEndpoint);
  return response.data;
}

export const addMovie = async (obj) => {
  const response = await axios.post(moviesEndpoint, obj);
  return response.data;
}

export const deleteMovie = async (movie) => {
    const deleteEndpoint = moviesEndpoint + '/' + movie.id
    console.log(deleteEndpoint)
  const response = await axios.delete(deleteEndpoint);
  return response.data;
}

export const updateMovie = async (movie) => {
    const updateEndpoint = moviesEndpoint + '/' + movie.id
    console.log(updateEndpoint)
  const response = await axios.put(updateEndpoint, movie);
  return response.data;
}