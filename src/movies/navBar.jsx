
import React, { useState } from 'react'
import { Link, NavLink } from 'react-router'

export default function NavBar() {
    const [active, setActive] = useState("movies")
    const handleSelect = (item) => {
        setActive(item)
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
        </ul>
    </div>
    </nav>
  )
}
