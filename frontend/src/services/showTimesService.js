import http from './service';
import config from '../config.json'
const showtimeEndpoint = `${config.apiEndpoint}/api/showtimes`

export const fetchShowTimes = async () => {
    console.log(showtimeEndpoint)
  const response = await http.get(showtimeEndpoint);
  return response.data;
}

export const addShowTime = async (show) => {
  const response = await http.post(showtimeEndpoint, show);
  return response.data;
}

export const deleteShowTime = async (show) => {
    const deleteEndpoint = showtimeEndpoint + '/' + show.id
    console.log(deleteEndpoint)
  const response = await http.delete(deleteEndpoint);
  return response.data;
}

export const updateShowTime = async (show) => {
    const updateEndpoint = showtimeEndpoint + '/' + show.id
    console.log(updateEndpoint)
  const response = await http.put(updateEndpoint, show);
  return response.data;
}