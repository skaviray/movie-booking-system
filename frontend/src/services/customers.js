import http from './service';
import config from '../config.json'
const LocationsDashboardEndpoint = `${config.apiEndpoint}/api/customers`

export const addCustomer = async (info) => {
    console.log(LocationsDashboardEndpoint)
    console.log(info)
  const response = await http.post(LocationsDashboardEndpoint, info);
  return response.data;
}