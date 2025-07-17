import logo from './logo.svg';
import './App.css';
import MoviesDashboard from './movies/moviesDashboard_fn';
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
import RequireAuth from './utils/RequireAuth';
import TheatreDashboard from './movies/theatres/theatreDashboard';
import TheatreForm from './movies/theatres/theatreForm';
import LocationsForm from './movies/locations/locationsForm';
import LocationsDashboard from './movies/locations/locationsDashboard';
import ScreensDashboard from './movies/screens/screensDashboard';
import ScreensForm from './movies/screens/screensForm';
import GenresDashboard from './movies/genres/genresDashboard';
import GenresForm from './movies/genres/genresForm';
import ShowTimesDashboard from './movies/showtimes/showTimesDashboard'
import ShowTimeForm from './movies/showtimes/showTimeForm'
import BookingDashboard from './movies/bookings/bookingDashboard';

class App extends Component {
  state = {
    user: {},
    loading: true
  }
  async componentDidMount() { 
    const user = await auth.getCurrentUser()
    // this.setState({user}, () => {
    //   console.log(this.state)
    // })
    this.setState({user: user, loading: false})
    // this.setState({loading: false})
   }
  render() { 
    const {user} = this.state
    console.log(user)
    if (this.loading) return null
    return (
       <React.Fragment>
       <ToastContainer />
        <NavBar user={user}/>
        <main className="container">
          <Routes>
            <Route path="/login" element={<LoginForm/>} />
            <Route path="/logout" element={<Logout/>} />
            <Route path='/profile' element={<Profile user={user}/>} />
            <Route path="/register" element={<RegisterForm/>} />
            <Route path='/movies' element={<MoviesDashboard key={user?.username || "guest"} user={user}/>} />
  
            <Route path='/movies/new' 
                     element={
                      <RequireAuth user={this.state.user}>
                        {<MovieForm user={this.state.user} />}
                      </RequireAuth>
                     } />
            <Route path='/movies/:id' exact element={<MoviesDetails/>}/>
            <Route path='/movies/:id/bookings' exact element={<BookingDashboard/>}/>
            <Route path='/theatres' element={<TheatreDashboard key={user?.username || "guest"} user={user}/>} />
            <Route path='/theatres/new' 
                     element={
                      <RequireAuth user={this.state.user}>
                        {<TheatreForm user={this.state.user} />}
                      </RequireAuth>
                     } />

            <Route path='/locations/new' 
                     element={
                      <RequireAuth user={this.state.user}>
                        {<LocationsForm user={this.state.user} />}
                      </RequireAuth>
                     } />
             
             <Route path='/locations' 
                     element={
                      <RequireAuth user={this.state.user}>
                        {<LocationsDashboard user={this.state.user} />}
                      </RequireAuth>
                     } />
             <Route path='/screens' 
                     element={
                      <RequireAuth user={this.state.user}>
                        {<ScreensDashboard user={this.state.user} />}
                      </RequireAuth>
                     } />

             <Route path='/screens/new' 
                     element={
                      <RequireAuth user={this.state.user}>
                        {<ScreensForm user={this.state.user} />}
                      </RequireAuth>
                     } />
             <Route path='/genres' 
                     element={
                      <RequireAuth user={this.state.user}>
                        {<GenresDashboard user={this.state.user} />}
                      </RequireAuth>
                     } />
             <Route path='/genres/new' 
                     element={
                      <RequireAuth user={this.state.user}>
                        {<GenresForm user={this.state.user} />}
                      </RequireAuth>
                     } />
             <Route path='/showtimes' 
                     element={
                      <RequireAuth user={this.state.user}>
                        {<ShowTimesDashboard user={this.state.user} />}
                      </RequireAuth>
                     } />
             <Route path='/showtimes/new' 
                     element={
                      <RequireAuth user={this.state.user}>
                        {<ShowTimeForm user={this.state.user} />}
                      </RequireAuth>
                     } />
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

