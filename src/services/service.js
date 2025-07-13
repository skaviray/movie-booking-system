import axios from "axios";
import { toast } from "react-toastify";

const axiosInstance = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com'
});

axiosInstance.interceptors.response.use(null, error => {
  const expectedError =
    error.response &&
    error.response.status >= 400 &&
    error.response.status < 500;

  if (!expectedError) {
    console.log('Logging the error', error);
    toast.error('An unexpected error occurred.')
    // alert('An unexpected error occurred.');
  }

  return Promise.reject(error);
});

export default axiosInstance;