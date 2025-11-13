import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
// import Counter from './components/counterComponent';

import { BrowserRouter } from 'react-router-dom';
// import 'bootstrap/dist/css/bootstrap.min.css'
import "react-datepicker/dist/react-datepicker.css"
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'font-awesome/css/font-awesome.css'
import {Elements} from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js';
// import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import CartContextProvider from './movies/context/cartContext';
const root = ReactDOM.createRoot(document.getElementById('root'));
const stripePromise = loadStripe(process.env.REACT_APP_PUBLISHABLE_KEY)
console.log(process.env.REACT_APP_PUBLISHABLE_KEY)
root.render(
    <BrowserRouter>
    <CartContextProvider>
        <Elements stripe={stripePromise}>
            <App />
        </Elements>
    </CartContextProvider>
    </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
