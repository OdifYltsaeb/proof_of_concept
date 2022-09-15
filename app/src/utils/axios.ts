import axios from 'axios';

// Create axios instance.
const axiosInstance = axios.create({
    baseURL: process.env.API_URL,
    withCredentials: true,
    xsrfCookieName: 'csrftoken',
    xsrfHeaderName: 'X-CSRFToken',
});

export default axiosInstance;

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
