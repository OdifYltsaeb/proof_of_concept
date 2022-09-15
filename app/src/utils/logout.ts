import Router from 'next/router';
// import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import axiosInstance from './axios';

const logUserOut = () => {
    const toastId = 'logOutToast';
    toast('Please wait...', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        progress: undefined,
        toastId,
    });
    axiosInstance({
        method: 'POST',
        url: '/api/user/logout',
    })
        .then(() => {
            toast.update(toastId, {
                render: "You're successfully logged out",
                type: 'success',
                isLoading: false,
            });
            // Cookies.set('authState', 'False', { sameSite: 'Strict', secure: true });
            Router.push('/login');
        })
        .catch(() => {
            toast.update(toastId, {
                render: 'Something went wrong. Please try again',
                type: 'error',
                isLoading: false,
            });
        });
};

export default logUserOut;
