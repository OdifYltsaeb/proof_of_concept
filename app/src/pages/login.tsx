import Link from 'next/link';
import React from 'react';
import {connect} from "react-redux";

import { useRouter } from 'next/router';
import SEO from '../components/atoms/SEO';
import LoginForm from '../components/forms/LoginForm';
import {setAuthenticatedUser} from "../stores/authentication";


const LogIn = function ({ setUserData }) {
    const { query } = useRouter();

    return (
        <>
            <SEO title="Log in" />
            <div className="px-7 py-10 w-full">
                <h1 className="text-xl">Welcome back!</h1>
                <hr />
                <LoginForm next={query.return} setUserData={setUserData} />
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

const mapDispatchToProps = (dispatch) => ({
    setUserData: (data) => dispatch(setAuthenticatedUser(data)),
});

const connectedLogin = connect(null, mapDispatchToProps)(LogIn)

export default connectedLogin;
