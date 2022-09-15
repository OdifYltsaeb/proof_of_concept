import React from 'react';
import { Form, withFormik } from 'formik';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import Router from 'next/router';
import { connect } from 'react-redux';

import PropTypes from 'prop-types';
import FormField from './fields/FormField';
import Alert from '../atoms/Alert';
import { getFormPropTypes } from '../../types/forms';
import { tNoop } from '../../utils/text';
import axiosInstance from '../../utils/axios';
import { formErrorsHandler } from '../../utils/formErrors';
import {setAuthenticatedUser} from "../../stores/authentication";
import axios from "../../utils/axios";

const Login = function ({ status, isSubmitting }) {
    return (
        <Form>
            <FormField
                id="email"
                name="email"
                type="text"
                label="Email"
                placeholder="Enter email"
                disabled={isSubmitting}
                labelSize={4}
            />
            <FormField
                id="password"
                name="password"
                type="password"
                label="Password"
                placeholder="Enter your password"
                disabled={isSubmitting}
                labelSize={4}
            />

            {status !== undefined && (
                <Alert
                    className="mt-3"
                    type={status.color === undefined ? 'info' : status.color}
                    text={status.message}
                />
            )}

            <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-md btn-block btn-primary my-3"
            >
                Log in
            </button>
        </Form>
    );
};

Login.defaultProps = {
    next: '/',
    setUserData: () => {}
};
Login.propTypes = {
    ...getFormPropTypes(['email', 'password']),
    next: PropTypes.string, // eslint-disable-line react/no-unused-prop-types
    setUserData: PropTypes.func,
};

const getUser = (setCallback) => {
    axios.get('/api/user/me').then((response) => {
        setCallback(response.data);
    }).catch(() => {});
}

const LoginForm = withFormik({
    mapPropsToValues: () => ({
        email: '',
        password: '',
    }),
    validationSchema: Yup.object().shape({
        email: Yup.string()
            .email(tNoop('Invalid email address'))
            .required(tNoop('Email is required')),
        password: Yup.string().required(tNoop('Password is required')),
    }),

    handleSubmit: (values, { props, ...formik }) => {
        const toastId = 'loginToast';
        toast('Please wait...', {
            position: 'top-right',
            autoClose: 10000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            progress: undefined,
            toastId,
        });
        axiosInstance({
            data: values,
            method: 'POST',
            url: '/api/user/login',
        })
            .then(() => {
                const { next, setUserData } = props;
                formik.setSubmitting(false);
                toast.update(toastId, {
                    render: 'Welcome back!',
                    type: 'success',
                    isLoading: false,
                });
                getUser(setUserData);
                Router.push(next || '/');
            })
            .catch((error) => {
                formik.setSubmitting(false);
                formErrorsHandler(error, formik);
                // display errors
                toast.update(toastId, {
                    render: 'Something went wrong. Please try again',
                    type: 'error',
                    isLoading: false,
                });
            })
            .then(() => {
                // Something something
                // console.log('clear');
            });
    },

    displayName: 'LoginForm', // helps with React DevTools
})(Login);

export default LoginForm;
