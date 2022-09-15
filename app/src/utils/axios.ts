import axios from 'axios';
import Router from 'next/router'
import { store } from '../stores';
import { clearAuthenticatedUser } from '../stores/authentication';

// Create axios instance.
const axiosInstance = axios.create({
    baseURL: process.env.API_URL,
    withCredentials: true,
    xsrfCookieName: 'csrftoken',
    xsrfHeaderName: 'X-CSRFToken',
});

export default axiosInstance;

axiosInstance.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  }, function (error) {
    const { pathname } = Router;
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    store.dispatch(clearAuthenticatedUser());
    Router.push(`/login?return=${pathname}`);
    return Promise.reject(error);
  });

type fetcherOptions = {
    url: string,
    method: string,
}

const fetcherWithOptions = ({ url, method }: fetcherOptions) => {
    switch (method) {
        case 'options': {
            return axiosInstance.options(url).then((res) => res.data);
        }
        default:
            return axiosInstance.get(url).then((res) => res.data);
    }
};

const fetcher = (url: string) => axiosInstance.get(url).then((res) => res.data);
export { fetcher, fetcherWithOptions };
