
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import {CameraVideo} from 'react-bootstrap-icons'
import LoginPopup from './common/modal';
import auth from '../services/auth'
import Joi  from 'joi-browser';

export default function NavBar({handleUserState, user}) {
    // const {user} = props
    const schema = {
      email: Joi.string().email().required().label("Email"),
      password: Joi.string().min(5).required().label("Password")
    }
    const handleSignIn = async(e, formData, setErrors) => {
        try {
          await auth.loginUser(formData)
          const user = await auth.getCurrentUser()
          handleUserState({user: user, loading: false})
          console.log(user)
          if (user.is_admin) {
            console.log("admin")
            navigate("/admin")
          } else {
            navigate("/movies")
          }
        } catch(ex) {
          if (ex.response && (ex.response.status === 400 || ex.response.status === 401)){
            setErrors({email: ex.response.data.error})
          } 
      }
    }
    const components = [
      {
        type: "text",
        value: "email",
        label: "Email",
        key: "email",
        placeholder: "Email",
        form_type: "control"
      },
      {
        type: "password",
        value: "password",
        label: "Password",
        key: "password",
        placeholder: "Password",
        form_type: "control"
      }
    ]
    const [show, setShow] = useState(false);
    const handleShow = () => setShow(true);
    const navigate = useNavigate()
    console.log(user)
    const handleLogOut = () => {
        navigate("/logout")
    }
  return (
    <div className='nav-bar'>

    <div>
        <Link className="navbar-brand funky-badge" to="/">
        <CameraVideo size={40} color="black" />
        Eww!
        </Link>
  </div>
    {user && ( <button type="button" className="btn btn-success logout" onClick={handleLogOut}>Logout</button>)}
    {!user && ( <button type="button" className="btn btn-success logout" onClick={handleShow}>Login</button>)}
    {!user && <LoginPopup modalLabel="Login" buttonLabel="Login" setShow={setShow} show={show} componentSchema={schema} components={components} handleSubmit={handleSignIn}/>}
    </div>
  )
}
