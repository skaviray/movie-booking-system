import http from './service';
import config from '../config.json'
const LocationsDashboardEndpoint = `${config.apiEndpoint}/api/book-seats`

export const bookSeats = async (info) => {
    console.log(LocationsDashboardEndpoint)
    console.log(info)
  const response = await http.post(LocationsDashboardEndpoint, info);
  return response.data;
}