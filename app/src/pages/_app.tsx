import { useEffect } from 'react';
import { AppProps } from 'next/app'
import { ToastContainer } from 'react-toastify';
import { injectStyle } from 'react-toastify/dist/inject-style';
import { Provider } from "react-redux";

import { wrapper } from '../stores';
import SEO from '../components/atoms/SEO';
import '../styles/index.css'
import NavBar from "../components/molecules/NavBar";

function MyApp({Component, ...rest}: AppProps) {
    useEffect(() => {
        injectStyle();
    }, []);

    const { store, props } = wrapper.useWrappedStore(rest);
    return (
        <Provider store={store}>
            <ToastContainer />
            <SEO key="header" />
            <NavBar />
            <Component {...props.pageProps} />
        </Provider>
    )
}

export default MyApp;
