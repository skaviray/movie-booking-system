
import React, { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router'
import {Film, CameraVideo} from 'react-bootstrap-icons'

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

    <div>
        <Link className="navbar-brand funky-badge" to="/">
        <CameraVideo size={40} color="black" />
        Eww!
        </Link>
  </div>
    {user && ( <button type="button" className="btn btn-success logout">Profile</button>)}
    {user && ( <button type="button" className="btn btn-success logout" onClick={handleLogOut}>Logout</button>)}
    {!user && ( <button type="button" className="btn btn-success logout" onClick={handleSignIn}>Login</button>)}
    </div>
  )
}
