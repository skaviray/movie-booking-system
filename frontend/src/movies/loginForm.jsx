import React, { useState } from 'react'
import Input from './common/input'
import Joi, { schema }  from 'joi-browser'
import { useNavigate, useLocation, redirect } from 'react-router'

import auth from '../services/auth'
export default function LoginForm({handleUserState}) {
    const navigate = useNavigate()
    const location = useLocation()
    const from = location.state?.from?.pathname || "/"
    const [account, setAccount] = useState({
        "email": "",
        "password": ""
    })
    const [errors, setErrors] = useState({})
    schema = {
      email: Joi.string().email().required().label("Username"),
      password: Joi.string().required().label("Password"),
    }
    const validate = () => {
      const result = Joi.validate(account, schema, {abortEarly: false})
      if (!result.error) return null
      const validationErrors = {}
      for (let item of result.error.details)
        validationErrors[item.path[0]] = item.message
      console.log(validationErrors)
      return validationErrors

    }

    const validateInputs = ({name, value})=> {
      const obj = {[name]: value}
      const objSchema = {[name]: schema[name]}
      const {error} = Joi.validate(obj, objSchema )
      return error ? error.details[0].message : null

    }
    const handleSubmit = async e => {
        e.preventDefault()
        const validationErrors = validate()
        setErrors(validationErrors || {})
        try {
          const {data: response, headers} = await auth.loginUser(account)
          const user = await auth.getCurrentUser()
          handleUserState({user: user, loading: false})
          console.log(user)
          if (user.is_admin) {
            console.log("admin")
            navigate("/admin")
          } else {
            navigate("/movies")
          }
          // window.location = from
        } catch(ex) {
          if (ex.response && (ex.response.status === 400 || ex.response.status === 401)){
            setErrors({email: ex.response.data.error})
          } 
      }
    }

    const handleChange = e => {
    const { name, value } = e.target
    const errorMessage = validateInputs(e.target)
    errors[name] = errorMessage
    if (errorMessage) {    
      setErrors( prev => ({
        ...prev,
        [name]: errorMessage
      }))}
    else delete errors[name]
    console.log(errors)
    setAccount(prev => ({
      ...prev,
      [name]: value
    }))
    }
  return (
    <div className='loginForm'>
        <form onSubmit={handleSubmit} className='form'>
           <img src='/eww.png' className='login-form-image' />
            <div className='login-form-input'>
              <Input  name="email" label="Email" value={account.email} type="text" errors={errors} onChange={handleChange} />
            </div>
            <div className='login-form-input'>
              <Input  name="password" label="Password" value={account.password} type="password" errors={errors} onChange={handleChange} />
              </div>
            <button className="btn btn-primary login-form-button" disabled={validate()}>Login</button>
        </form>
    </div>
  )
}
