import http from './service';
import config from '../config.json'
const moviesEndpoint = `${config.apiEndpoint}/api/movies`

export const fetchMovies = async () => {
    console.log(moviesEndpoint)
  const response = await http.get(moviesEndpoint);
  return response.data;
}

export const fetchMovieWithId = async (id)=> {
  const getEndpoint = moviesEndpoint + '/' + id
  console.log(getEndpoint)
  const response = await http.get(getEndpoint);
  return response.data
}

export const fetchMovieShowTimes = async (id) => {
    const updateEndpoint = moviesEndpoint + '/' + id + '/showtimes'
    console.log(updateEndpoint)
  const response = await http.get(updateEndpoint);
  return response.data;
}


export const addMovie = async (movie) => {
  const response = await http.post(moviesEndpoint, movie);
  return response.data;
}

export const deleteMovie = async (movie) => {
    const deleteEndpoint = moviesEndpoint + '/' + movie.id
    console.log(deleteEndpoint)
  const response = await http.delete(deleteEndpoint);
  return response.data;
}

export const updateMovie = async (movie) => {
    const updateEndpoint = moviesEndpoint + '/' + movie.id
    console.log(updateEndpoint)
  const response = await http.put(updateEndpoint, movie);
  return response.data;
}

