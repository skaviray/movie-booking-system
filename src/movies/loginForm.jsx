import React, { useState } from 'react'
import Input from './common/input'
import Joi, { schema }  from 'joi-browser'


export default function LoginForm() {
    const [account, setAccount] = useState({
        "username": "",
        "password": ""
    })

    const [errors, setErrors] = useState({})
    schema = {
      username: Joi.string().required().label("Username"),
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
    const handleSubmit = e => {
        e.preventDefault()
        const validationErrors = validate()
        setErrors(validationErrors || {})
        doSubmit()

    }

    const doSubmit = () => {
      console.log("Submitted")
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
    <div>
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
            <Input name="username" label="Username" value={account.username} type="text" errors={errors} onChange={handleChange} />
            <Input name="password" label="Password" value={account.password} type="password" errors={errors} onChange={handleChange} />
            <button className="btn btn-primary" disabled={validate()}>Login</button>
        </form>
    </div>
  )
}
