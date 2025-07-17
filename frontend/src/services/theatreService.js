import http from './service';
import config from '../config.json'
const theatreEndpoint = `${config.apiEndpoint}/api/theatres`

export const fetchTheatres = async () => {
    console.log(theatreEndpoint)
  const response = await http.get(theatreEndpoint);
  return response.data;
}

export const addTheatre = async (theatre) => {
    const addEndpoint = theatreEndpoint
  const response = await http.post(addEndpoint, theatre);
  return response.data;
}

export const deleteTheatre = async (theatre) => {
    const deleteEndpoint = theatreEndpoint + '/' + theatre.id
    console.log(deleteEndpoint)
  const response = await http.delete(deleteEndpoint);
  return response.data;
}

export const updateTheatre = async (theatre) => {
    const updateEndpoint = theatreEndpoint + '/' + theatre.id
    console.log(updateEndpoint)
  const response = await http.put(updateEndpoint, theatre);
  return response.data;
}