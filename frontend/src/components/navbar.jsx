import React, { Component } from 'react';
import Counters from './Counters';


const NavBar = ({totalCounters}) => {
    return (
    <nav className="navbar navbar-light bg-light">
      <a className="navbar-brand" href="#">
        Navbar
        <span className="badge bg-pill bg-secondary m-2">{totalCounters}</span>
      </a>
    </nav>
    );

}
 
export default NavBar;