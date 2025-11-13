import './App.css';
import MoviesDashboard from './movies/dashoards/moviesDashboard';
import NavBar from './movies/navBar';
import { Routes, Route } from 'react-router-dom';
import React, { Component } from 'react';
import NotFound from './movies/notFound';
import RegisterForm from './movies/registerForm';
import { ToastContainer } from 'react-toastify';
import Logout from './movies/logout';
import auth from './services/auth';
import RequireAuth from './utils/RequireAuth';
import SeatLayout from './movies/dashoards/seatLayoutDashboard';
import AdminNavbar from './movies/admin/navBar';
import ShowTimesDashboardByMovieId from './movies/dashoards/movieShowTimesDashboard.jsx';
import BookingSuccess from './movies/dashoards/bookingSuccess.jsx';
import Success from './movies/dashoards/checkout/stripe-checkout/success.jsx';
import Cancelled from './movies/dashoards/checkout/stripe-checkout/cancel.jsx';
import Checkout from './movies/dashoards/checkout/checkout.jsx';
class App extends Component {
  state = {
    user: null,
    loading: true
  }
  async componentDidMount() { 
    const user = await auth.getCurrentUser()
    this.setState({user: user, loading: false})
   }

  render() { 
    const {user} = this.state
    console.log(user)
    if (this.state.loading) return null
    return (
       <div className='super-container'>
        <div className='nav-bar-menu'>
          <NavBar handleUserState={(user) => this.setState(user)} user={user}/>
          <ToastContainer />
        </div>
        <div className='main'>
            <Routes>
              <Route path="/logout" element={<Logout/>} />
              <Route path="/register" element={<RegisterForm/>} />
              <Route path='/movies' element={<MoviesDashboard key={user?.username || "guest"} user={user}/>} />
              <Route path='/movies/:id/showtimes' exact element={<ShowTimesDashboardByMovieId/>}/>
              <Route path='/movies/:id/screens/:screen_id/seat-layout/:showtime_id' exact element={<SeatLayout/>}/>  
              <Route path='/admin'
                       element={
                        <RequireAuth user={user}>
                          {<AdminNavbar user={user} />}
                        </RequireAuth>
                       } /> 
              <Route path='/booking-success' element={<BookingSuccess />} />
              <Route path='/success' element={<Success />} />
              <Route path='/cancel' element={<Cancelled />} />
              <Route path='/' exact element={<MoviesDashboard/>}/>
              <Route path='*' element={<NotFound/>}/>
              <Route path='/checkout' element={<Checkout />} />
            </Routes>
        </div>
        <div className='footer'>
        </div>
       </div>
    );
  }
}
 
export default App;

