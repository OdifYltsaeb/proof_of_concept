import { useRouter } from 'next/router';
import useSWR from 'swr';
import { fetcher } from './axios';

const withUser = () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { data, error, mutate } = useSWR('/api/user/me', fetcher);

    return {
        user: data,
        isLoading: !error && !data,
        isError: error,
        mutate,
    };
};

export default withUser;
