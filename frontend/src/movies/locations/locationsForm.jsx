import React, { useEffect, useState } from 'react'
import Joi, { schema }  from 'joi-browser'
import Input from '../common/input'
import { useNavigate } from 'react-router'
import { toast } from 'react-toastify'
import { addLocation, addTheatre } from '../../services/locations'
export default function  LocationsForm() {
    const [data, setData] = useState({
        "city": "",
        "state": "",
        "country": "",
        "address": ""
    })
    const [errors, setErrors] = useState({})
    const navigate = useNavigate()
    schema = {
      city: Joi.string().required().label("City"),
      state: Joi.string().required().label("State"),
      country: Joi.string().required().label("Country"),
      address: Joi.string().required().label("Address")
    }
    const validate = () => {
      const result = Joi.validate(data, schema, {abortEarly: false})
      if (!result.error) return null
      const validationErrors = {}
      for (let item of result.error.details)
        validationErrors[item.path[0]] = item.message
      console.log(validationErrors)
      return validationErrors

    }

    const validateInputs = ({name, value})=> {
      console.log(name,value)
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

    const doSubmit =  async () => {
      try {
      const location = {
        city: data.city,
        state: data.state,
        country: data.country,
        address: data.address
      }
      await addLocation(location)
      navigate("/locations")
      }catch (ex) {
        if (ex.response && ex.response.status === 400){
          toast.error(ex.message)
        }
        else {
          toast.error("Unexpected error occured..")
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
    // console.log(data)
    setData(prev => ({
      ...prev,
      [name]: value
    }))
    }
  return (
    <div>
        <h1>Movies Form</h1>
        <form onSubmit={handleSubmit}>
            <Input name="city" label="City" value={data.city} type="text" errors={errors} onChange={handleChange} />
            <Input name="state" label="State" value={data.state} type="text" errors={errors} onChange={handleChange} />
            <Input name="country" label="Country" value={data.country} type="text" errors={errors} onChange={handleChange} />
            <Input name="address" label="Address" value={data.address} type="text" errors={errors} onChange={handleChange} />
            <button className="btn btn-primary" disabled={validate()}>Save</button>
        </form> 
    </div>
  )
}
