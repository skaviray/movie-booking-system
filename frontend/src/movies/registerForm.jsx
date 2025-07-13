import React, { useState } from 'react'
import Joi, { schema }  from 'joi-browser'
import Input from './common/input'
import validate from '../utils/validate'
import validateInputs from '../utils/validateInputs'
import { registerUser } from '../services/userService'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router'

export default function RegisterForm() {
    const [data, setData] = useState({
        "username": "",
        "email": "",
        "password": "",
        "full_name": ""
    })
    const [errors, setErrors] = useState({})
    const navigate = useNavigate()
    schema = {
      username: Joi.string().required().label("Username"),
      email: Joi.string().email().required().label("Email"),
      password: Joi.string().min(5).max(10).required().label("Password"),
      full_name: Joi.string().required().label("Name"),
    }
    const handleSubmit = async e => {
        e.preventDefault()
        const validationErrors = validate(data,schema)
        setErrors(validationErrors || {})
        console.log(data)
        try {
          await registerUser(data)
          toast.success("user created successfully !!")
          navigate("/login")
        } catch (ex) {
          if( ex.response && ex.response.status === 400) {
            setErrors({username: `A user already exists with email ${data.email}`})
            // errors.username = 
            // toast.error(`A user already exists with email ${data.email}` )
          }
        }
       
    }

   const handleChange = e => {
    const { name, value } = e.target
    console.log(name,value)
    const errorMessage = validateInputs(e.target,schema)
    errors[name] = errorMessage
    if (errorMessage) {    
      setErrors( prev => ({
        ...prev,
        [name]: errorMessage
      }))}
    else delete errors[name]
    // console.log(errors)
    setData(prev => ({
      ...prev,
      [name]: value
    }))
    }
  return (
    <div>
        <h1>Register</h1>
        <form onSubmit={handleSubmit}>
            <Input name="username" label="Username" value={data.username} type="text" errors={errors} onChange={handleChange} />
            <Input name="email" label="Email" value={data.email} type="text" errors={errors} onChange={handleChange} />
            <Input name="password" label="Password" value={data.password} type="password" errors={errors} onChange={handleChange} />
            <Input name="full_name" label="Full Name" value={data.full_name} type="text" errors={errors} onChange={handleChange} />
            <button className="btn btn-primary" disabled={validate(data,schema)}>Register</button>
        </form>
    </div>
  )
}
