import React, { useEffect, useState } from 'react'
import Joi, { schema }  from 'joi-browser'
import Input from '../common/input'
import { useNavigate } from 'react-router'
import { toast } from 'react-toastify'
import { addGenre } from '../../services/genreService'
export default function  GenresForm() {
    const [data, setData] = useState({
        "name": "",
    })
    const [errors, setErrors] = useState({})
    const navigate = useNavigate()
    schema = {
      name: Joi.string().required().label("Name"),
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
        name: data.name,
      }
      await addGenre(location)
      navigate("/genres")
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
        <h1>Genres Form</h1>
        <form onSubmit={handleSubmit}>
            <Input name="name" label="Name" value={data.name} type="text" errors={errors} onChange={handleChange} />
            <button className="btn btn-primary" disabled={validate()}>Save</button>
        </form> 
    </div>
  )
}
