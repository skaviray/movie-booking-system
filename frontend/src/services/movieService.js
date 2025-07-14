import http from './service';
import config from '../config.json'
const moviesEndpoint = `${config.apiEndpoint}/auth/movies`

export const fetchMovies = async () => {
    console.log(moviesEndpoint)
  const response = await http.get(moviesEndpoint);
  return response.data;
}

export const addMovie = async (obj) => {
  const response = await http.post(moviesEndpoint, obj);
  return response.data;
}

export const deleteMovie = async (movie) => {
    const deleteEndpoint = moviesEndpoint + '/' + movie.id
    console.log(deleteEndpoint)
  const response = await http.delete(deleteEndpoint);
  return response.data;
}

export const updateMovie = async (movie) => {
    const updateEndpoint = `${config.apiEndpoint}/movies/` + movie.id
    console.log(updateEndpoint)
  const response = await http.put(updateEndpoint, movie);
  return response.data;
}