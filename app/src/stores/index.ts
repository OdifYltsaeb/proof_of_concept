import { createStore, applyMiddleware } from 'redux';
import { createWrapper, Context } from 'next-redux-wrapper';
import { composeWithDevTools } from 'redux-devtools-extension';
import reducers from './reducers';


const bindMiddleware = (middleware) => {
    if (process.env.NODE_ENV !== 'production') {
        return composeWithDevTools(applyMiddleware(...middleware));
    }
    return applyMiddleware(...middleware);
};

export const store = createStore(reducers, bindMiddleware([]))

export const wrapper = createWrapper((context: Context) => store);
