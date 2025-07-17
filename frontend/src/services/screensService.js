import http from './service';
import config from '../config.json'
const screensEndpoint = `${config.apiEndpoint}/api/screens`

export const fetchScreens = async () => {
    console.log(screensEndpoint)
  const response = await http.get(screensEndpoint);
  return response.data;
}

export const fetchScreenWithId = async (id)=> {
  const getEndpoint = screensEndpoint + '/' + id
  console.log(getEndpoint)
  const response = await http.get(getEndpoint);
  return response.data
}
export const addScreen = async (obj) => {
  const response = await http.post(screensEndpoint, obj);
  return response.data;
}

export const deleteScreen = async (obj) => {
    const deleteEndpoint = screensEndpoint + '/' + obj.id
    console.log(deleteEndpoint)
  const response = await http.delete(deleteEndpoint);
  return response.data;
}

export const updateScreen = async (obj) => {
    const updateEndpoint = screensEndpoint + '/' + obj.id
  const response = await http.put(updateEndpoint, obj);
  return response.data;
}