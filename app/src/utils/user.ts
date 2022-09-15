import { useRouter } from 'next/router';
import useSWR from 'swr';
// import Cookies from 'js-cookie';
import { fetcher } from './axios';

const withUser = () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { data, error, mutate } = useSWR('/api/user/me', fetcher);

    if (error && 'response' in error && error.response.status === 401) {
        // Cookies.set('authState', 'False', { sameSite: 'Strict', secure: true });
    }

    return {
        user: data,
        isLoading: !error && !data,
        isError: error,
        mutate,
    };
};

export default withUser;
