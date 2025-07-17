// import axios from 'axios';
import axios from './service';
import config from '../config.json'
const genreEndpoint = `${config.apiEndpoint}/api/genres`

export const fetchGenres = async () => {
    console.log(genreEndpoint)
  const response = await axios.get(genreEndpoint);
  return response.data;
}

export const addGenre = async (genre) => {
  const response = await axios.post(genreEndpoint, genre);
  return response.data;
}

export const deleteGenre = async (genre) => {
    const deleteEndpoint = genreEndpoint + '/' + genre.id
    console.log(deleteEndpoint)
  const response = await axios.delete(deleteEndpoint);
  return response.data;
}

export const updateGenre = async (genre) => {
    const updateEndpoint = genreEndpoint + '/' + genre.id
  const response = await axios.put(updateEndpoint, genre);
  return response.data;
}