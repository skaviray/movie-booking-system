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
import RegisterForm from './movies/registerForm';
import MovieForm from './movies/movieForm';
import { ToastContainer } from 'react-toastify';
import Profile from './movies/profile';
import Logout from './movies/logout';
import auth from './services/auth';

// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'font-awesome/css/font-awesome.css';

class App extends Component {
  state = {}
  async componentDidMount() { 
    const user = await auth.getCurrentUser()
    this.setState({user}, () => {
      console.log(this.state)
    })
   }
  render() { 
    return (
       <React.Fragment>
       <ToastContainer />
        <NavBar user={this.state.user}/>
        <main className="container">
          <Routes>
            <Route path="/login" element={<LoginForm/>} />
            <Route path="/logout" element={<Logout/>} />
            <Route path='/profile' element={<Profile user={this.state.user}/>} />
            <Route path="/register" element={<RegisterForm/>} />
            <Route path='/movies' element={<MoviesDashboard/>}/>
            <Route path='/movies/new' element={<MovieForm/>}/>
            <Route path='/movies/:id' exact element={<MoviesDetails/>}/>
            <Route path='/customers' element={<Customers/>}/>
            <Route path='/rentals' element={<Rentals/>}/>
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

