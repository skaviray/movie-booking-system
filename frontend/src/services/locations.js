import http from './service';
import config from '../config.json'
const LocationsDashboardEndpoint = `${config.apiEndpoint}/api/locations`

export const fetchLocations = async () => {
    console.log(LocationsDashboardEndpoint)
  const response = await http.get(LocationsDashboardEndpoint);
  return response.data;
}

export const fetchLocationWithId = async (id)=> {
  const getEndpoint = LocationsDashboardEndpoint + '/' + id
  console.log(getEndpoint)
  const response = await http.get(getEndpoint);
  return response.data
}
export const addLocation = async (obj) => {
  const response = await http.post(LocationsDashboardEndpoint, obj);
  return response.data;
}

export const deleteLocation = async (obj) => {
    const deleteEndpoint = LocationsDashboardEndpoint + '/' + obj.id
    console.log(deleteEndpoint)
  const response = await http.delete(deleteEndpoint);
  return response.data;
}

export const updateLocation = async (obj) => {
    const updateEndpoint = LocationsDashboardEndpoint + '/' + obj.id
  const response = await http.put(updateEndpoint, obj);
  return response.data;
}

export const getTheatersByLocId = async (obj) => {
  const getEndpoint = LocationsDashboardEndpoint + '/' + obj.id + '/theaters'
  console.log(getEndpoint)
  const response = await http.get(getEndpoint);
  return response.data
}