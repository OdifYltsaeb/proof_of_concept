import { HYDRATE } from 'next-redux-wrapper';

const SET_USER = 'state/SET_USER';
const CLEAR_USER = 'state/CLEAR_USER';

const initialState = {}

// eslint-disable-next-line default-param-last
export default function reducer(state = initialState, action) {
    switch (action.type) {
        case HYDRATE: {
            return {
                ...state,
                ...action.payload.auth,
            };
        }

        case SET_USER: {
            return {
                ...action.data,
            };
        }

        case CLEAR_USER: {
            return initialState;
        }

        default:
            return state;
    }
}

export const isAuthenticated = (state) => 'id' in state.auth; // does nothing for now. Just serves as an example
export const getUser = (state) => state.auth;

export const setAuthenticatedUser = (data) => ({ type: SET_USER, data });
export const clearAuthenticatedUser = () => ({ type: CLEAR_USER });
