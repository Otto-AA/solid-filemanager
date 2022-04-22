import React from 'react';
import ReactDOM from 'react-dom';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux'
import reducer from './Reducers/reducer'
import * as serviceWorker from './serviceWorker';
import App from './App';
import './index.css';
import 'typeface-roboto';

const store = createStore(reducer, applyMiddleware(thunk));

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider >
    , document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
// see issue https://github.com/Otto-AA/solid-filemanager/issues/26
serviceWorker.unregister();
/*
serviceWorker.register({
    onUpdate: (config) => {
        console.group('serviceWorker.onUpdate');
        console.log(config);
        console.groupEnd();
    },
    onSuccess: (config) => {
        console.group('serviceWorker.onSuccess');
        console.log(config);
        console.groupEnd();
    }
});
*/