import React, { useState } from 'react'
import Joi, { schema }  from 'joi-browser'
import Input from './common/input'
import validate from '../utils/validate'
import validateInputs from '../utils/validateInputs'

export default function RegisterForm() {
    const [data, setData] = useState({
        "username": "",
        "password": "",
        "name": ""
    })
    const [errors, setErrors] = useState({})
    schema = {
      username: Joi.string().email().required().label("Username"),
      password: Joi.string().min(5).max(10).required().label("Password"),
      name: Joi.string().required().label("Name"),
    }
    const handleSubmit = e => {
        e.preventDefault()
        const validationErrors = validate(data,schema)
        setErrors(validationErrors || {})
        doSubmit()

    }

    const doSubmit = () => {
      console.log("Registered")
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
            <Input name="password" label="Password" value={data.password} type="password" errors={errors} onChange={handleChange} />
            <Input name="name" label="name" value={data.name} type="text" errors={errors} onChange={handleChange} />
            <button className="btn btn-primary" disabled={validate(data,schema)}>Register</button>
        </form>
    </div>
  )
}
