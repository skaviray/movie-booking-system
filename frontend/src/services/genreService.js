// import axios from 'axios';
import axios from './service';
import config from '../config.json'
const genreEndpoint = `${config.apiEndpoint}/auth/genres`

export const fetchGenres = async () => {
    console.log(genreEndpoint)
  const response = await axios.get(genreEndpoint);
  return response.data;
}

export const addGenre = async (obj) => {
  const response = await axios.post(genreEndpoint, obj);
  return response.data;
}

export const deleteGenre = async (post) => {
    const deleteEndpoint = genreEndpoint + '/' + post.id
    console.log(deleteEndpoint)
  const response = await axios.delete(deleteEndpoint);
  return response.data;
}

export const updateGenre = async (post) => {
    const updateEndpoint = genreEndpoint + '/' + post.id
  const response = await axios.put(updateEndpoint, post);
  return response.data;
}