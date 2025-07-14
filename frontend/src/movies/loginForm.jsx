import React, { useState } from 'react'
import Input from './common/input'
import Joi, { schema }  from 'joi-browser'
import auth from '../services/auth'
import { useNavigate } from 'react-router'


export default function LoginForm() {
    const navigate = useNavigate()
    const [account, setAccount] = useState({
        "email": "",
        "password": ""
    })
    // const [accessToken, setAccessToken] = useState("")

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
          // console.log(response)
          // setAccessToken(response.access_token)
          // console.log(response,headers)
          // localStorage.setItem("x-auth-token", headers['x-auth-token'])

          window.location = "/"
        } catch(ex) {
          if (ex.response && (ex.response.status === 400 || ex.response.status === 401)){
            // setErrors({username: `user ${account.username} does not exist, please register...`})
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
    <div>
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
            <Input name="email" label="Email" value={account.email} type="text" errors={errors} onChange={handleChange} />
            <Input name="password" label="Password" value={account.password} type="password" errors={errors} onChange={handleChange} />
            <button className="btn btn-primary" disabled={validate()}>Login</button>
        </form>
    </div>
  )
}
