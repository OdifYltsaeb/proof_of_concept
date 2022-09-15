import Link from 'next/link';
import React from 'react';

import { useRouter } from 'next/router';
import SEO from '../components/atoms/seo';
import LoginForm from '../components/forms/LoginForm';

const LogIn = function () {
    const { query } = useRouter();

    return (
        <>
            <SEO title="Log in" />
            <div className="px-7 py-10 w-full">
                <h1 className="text-xl">Welcome back!</h1>
                <hr />
                <LoginForm next={query.return} />
                <ul>
                    <li>
                        Did you forget the password?&nbsp;
                        <Link href="/forgot-password" className="pt-2">
                            <a className="text-blue">Click here to fix the issue.</a>
                        </Link>
                    </li>
                </ul>
            </div>
        </>
    );
};

LogIn.layout = 'auth';

export default LogIn;
