import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
// import Counter from './components/counterComponent';
import 'bootstrap/dist/css/bootstrap.css'
import 'font-awesome/css/font-awesome.css'

import Counters from './components/Counters';
import Sidebar from './front-end-components/sidebar';
import Pannel from './front-end-components/pannels';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <Pannel/>
  // <Counters/>
  <React.StrictMode>
    <App />
  </React.StrictMode>

);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
