import logo from './logo.svg';
import './App.css';
import MoviesDashboard from './movies/moviesDashboard';
import { BrowserRouter } from 'react-router-dom';
import Sidebar from './front-end-components/sidebar';
// import NavBar from './components/navbar';
import NavBar from './movies/navBar';
import Counters from './components/Counters';
import ListGroup from './movies/common/listGroup';
import { Routes, Route } from 'react-router-dom';

import React, { Component } from 'react';
import Customers from './movies/customers';
import MoviesDetails from './movies/moviesDetal';
import Rentals from './movies/rentals';
import NotFound from './movies/notFound';

class App extends Component {
  render() { 
    return (
       <React.Fragment>
        <NavBar/>
        <Routes>
          <Route path='/movies' element={<MoviesDashboard/>}/>
          <Route path='/movies/:id' element={<MoviesDetails/>}/>
          <Route path='/customers' element={<Customers/>}/>
          <Route path='/rentals' element={<Rentals/>}/>
          <Route path='/' exact element={<MoviesDashboard/>}/>
          {/* <Route path="/not-found" element={<NotFound/>} /> */}
          <Route path='*' element={<NotFound/>}/>
        </Routes>
       </React.Fragment>

      // <MoviesDashboard></MoviesDashboard>
    );
  }
}
 
export default App;

