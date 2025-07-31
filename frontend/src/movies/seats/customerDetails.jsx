import React, { useState } from 'react'
import Input from '../common/input'
import Joi, { schema }  from 'joi-browser'
import { useNavigate, useLocation } from 'react-router'


export default function CustomerDetails({email, mobile}) {
    const navigate = useNavigate()
    const location = useLocation()
    const from = location.state?.from?.pathname || "/"
    const [account, setAccount] = useState({
        "email": "",
        "phone": ""
    })
    // const [accessToken, setAccessToken] = useState("")

    const [errors, setErrors] = useState({})
    schema = {
      email: Joi.string().email().required().label("Username"),
      phone: Joi.string().regex(/^[6-9]\d{9}$/).required().label("Phone"),
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
        email(account.email)
        mobile(account.phone)
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
    <div onSubmit={handleSubmit}>
    <form className="form-inline d-flex align-items-center">
    <div className="form-group mx-sm-3 mb-2 customer-details-input">
        <Input name="email" value={account.email} type="text" errors={errors} className="form-control" id="inputPassword2"  onChange={handleChange} placeholder="Email address"/>
    </div>
    <div className="form-group mx-sm-3 mb-2 customer-details-input">
        <Input name="phone" value={account.phone} type="text" errors={errors} className="form-control" id="mobile" onChange={handleChange} placeholder="Mobile number"/>
    </div>
    <button type="submit" className="btn btn-primary mb-2" style={{margin: "20px 30px"}} disabled={validate()}>Continue</button>
    </form>
    </div>
  )
}
