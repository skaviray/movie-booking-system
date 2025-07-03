import logo from './logo.svg';
import './App.css';
import MoviesDashboard from './movies/moviesDashboard';
import { BrowserRouter } from 'react-router-dom';
import Sidebar from './front-end-components/sidebar';
// import NavBar from './components/navbar';
import NavBar from './movies/navBar';
import { Routes, Route } from 'react-router-dom';

import React, { Component } from 'react';
import Customers from './movies/customers';
import MoviesDetails from './movies/moviesDetal';
import Rentals from './movies/rentals';
import LoginForm from './movies/loginForm';
import NotFound from './movies/notFound';

// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'font-awesome/css/font-awesome.css';

class App extends Component {
  render() { 
    return (
       <React.Fragment>
        <NavBar/>
        <main className="container">
          <Routes>
            <Route path='/movies' element={<MoviesDashboard/>}/>
            <Route path='/movies/:id' element={<MoviesDetails/>}/>
            <Route path='/customers' element={<Customers/>}/>
            <Route path='/rentals' element={<Rentals/>}/>
            <Route path="/login" element={<LoginForm/>} />
            <Route path='/' exact element={<MoviesDashboard/>}/>
            {/* <Route path="/not-found" element={<NotFound/>} /> */}
            <Route path='*' element={<NotFound/>}/>
          </Routes>
        </main>
       </React.Fragment>

      // <MoviesDashboard></MoviesDashboard>
    );
  }
}
 
export default App;

