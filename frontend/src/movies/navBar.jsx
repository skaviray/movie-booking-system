
import React, { useState } from 'react'
import { Link, NavLink } from 'react-router'

export default function NavBar({user}) {
    // const {user} = props
    console.log(user)
    const [active, setActive] = useState("movies")
    const handleSelect = (item) => {
        setActive(item)
        // if (item === "logout") {
        // localStorage.removeItem('x-auth-token')
        // // console.log(localStorage.getItem("x-auth-token"))
        //  window.location = "/"
    // }
    }
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
    <Link className="navbar-brand" to="/">Vidly</Link>
    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
    </button>
    <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav">
        <li className={ active === "movies" ? "nav-item active" : "nav-item"} onClick={() => handleSelect("movies")}>
            <NavLink className="nav-link" to="/movies">Movies <span className="sr-only">(current)</span></NavLink>
        </li>
        <li className={ active === "customers" ? "nav-item active" : "nav-item"} onClick={() => handleSelect("customers")}>
            <NavLink className="nav-link" to="/customers">Coustomers</NavLink>
        </li>
        <li className={ active === "rentals" ? "nav-item active" : "nav-item"} onClick={() => handleSelect("rentals")}>
            <NavLink className="nav-link" to="/rentals">Rentals</NavLink>
        </li>
        {/* <li className={ active === "login" ? "nav-item active" : "nav-item"} onClick={() => handleSelect("login")}>
            <NavLink className="nav-link" to="/login">Login</NavLink>
        </li> */}
        {user && (<React.Fragment>
            <li className={ active === "logout" ? "nav-item active" : "nav-item"} onClick={() => handleSelect("logout")}>
            <NavLink className="nav-link" to="/logout">LogOut</NavLink>
            </li>
            <li className={ active === "profile" ? "nav-item active" : "nav-item"} onClick={() => handleSelect("profile")}>
                <NavLink className="nav-link" to="/profile">{user.username}</NavLink>
            </li>
        </React.Fragment>)}
        {!user && ( <React.Fragment>
            <li className={ active === "register" ? "nav-item active" : "nav-item"} onClick={() => handleSelect("register")}>
            <NavLink className="nav-link" to="/login">Login</NavLink>
            </li>
            <li className={ active === "register" ? "nav-item active" : "nav-item"} onClick={() => handleSelect("register")}>
                <NavLink className="nav-link" to="/register">Register</NavLink>
            </li>
        </React.Fragment>)}
        </ul>
    </div>
    </nav>
  )
}
