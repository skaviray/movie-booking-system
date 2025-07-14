import axios from "axios";
import { toast } from "react-toastify";

const axiosInstance = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com'
});

const setToken = (token) => {
  axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`
}

axiosInstance.interceptors.response.use(null, error => {
  const expectedError =
    error.response &&
    error.response.status >= 400 &&
    error.response.status < 500;
    // toast.error('An unexpected error occurred.')
  if (!expectedError) {
    console.log('Logging the error', error);
    toast.error('An unexpected error occurred.')
    // alert('An unexpected error occurred.');
  }

  return Promise.reject(error);
});


const http = {
  axiosInstance,
  get: axiosInstance.get,
  post: axiosInstance.post,
  put: axiosInstance.put,
  delete: axiosInstance.delete,
  setToken
}
export default http