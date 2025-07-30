
import React, { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router'

export default function NavBar({user}) {
    // const {user} = props
    const navigate = useNavigate()
    console.log(user)
    const [active, setActive] = useState("movies")
    const handleSelect = (item) => {
        setActive(item)
    }
    const handleSignIn = () => {
        navigate("/login")
    }
    const handleLogOut = () => {
        navigate("/logout")
    }
    const handleProfile = () => {
        navigate("/profile")
    }
  return (
    <div className='nav-bar'>
    <Link className="navbar-brand" to="/">Eww!</Link>
    {/* {user && (
    <div className="dropdown">
        <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown"  aria-haspopup="true" aria-expanded="false">
            Dropdown button
        </button>
        <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
            <NavLink className="nav-link" to="/logout">Log out</NavLink>
            <NavLink className="nav-link" to="/profile">{user.username}</NavLink>
        </div>
    </div>
)} */}
    {user && ( <button type="button" className="btn btn-success logout">Profile</button>)}
    {user && ( <button type="button" className="btn btn-success logout" onClick={handleLogOut}>Log out</button>)}
    {!user && ( <button type="button" className="btn btn-success logout" onClick={handleSignIn}>Sign in</button>)}
    </div>
  )
}
