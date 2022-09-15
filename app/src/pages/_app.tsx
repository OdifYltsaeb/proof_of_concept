import { useEffect } from 'react';

import Head from 'next/head'
import {AppProps} from 'next/app'
import { ToastContainer } from 'react-toastify';
import { injectStyle } from 'react-toastify/dist/inject-style';

import SEO from '../components/atoms/seo';
import '../styles/index.css'
import NavBar from "../components/molecules/NavBar";

function MyApp({Component, pageProps}: AppProps) {
    useEffect(() => {
        injectStyle();
    }, []);

    return (
        <>
            <ToastContainer />
            <SEO key="header" />
            <NavBar />
            <Component {...pageProps} />
        </>
    )
}

export default MyApp
