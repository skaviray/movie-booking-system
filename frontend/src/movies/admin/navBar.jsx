import React from 'react'
import { NavLink } from 'react-router'

export default function AdminNavbar() {
  return (
    <div className='nav-bar'>
    <ul class="nav nav-pills">
    <li class="nav-item">
        <NavLink className="nav-link" to="/genres">Genres</NavLink>
    </li>
    <li class="nav-item">
        <NavLink className="nav-link" to="/showtimes">Showtimes</NavLink>
    </li>
    <li class="nav-item">
        <NavLink className="nav-link" to="/screens">Screens</NavLink>
    </li>
    <li class="nav-item">
        <NavLink className="nav-link" to="/theatres">Theatres</NavLink>
    </li>
    <li class="nav-item">
        <NavLink className="nav-link" to="/locations">Locations</NavLink>
    </li>
    </ul>
    </div>
  )
}
