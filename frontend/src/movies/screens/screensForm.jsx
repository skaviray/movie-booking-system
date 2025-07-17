import React, { useEffect, useState } from 'react'
import Joi, { schema }  from 'joi-browser'
import Input from '../common/input'
import { useNavigate } from 'react-router'
import { toast } from 'react-toastify'
import Select from '../common/select'
import { fetchTheatres } from '../../services/theatreService';
import { addScreen } from '../../services/screensService'
export default function  ScreensForm() {
    const [data, setData] = useState({
        "theatre": "",
        "name": "",
    })
    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(true)
    const [theatres, setTheatres] = useState([])
    const navigate = useNavigate()
    schema = {
      theatre: Joi.string().required().label("Theatre"),
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
    useEffect(() => {
      const loadTheatres = async () => {
        const data = await fetchTheatres()
        console.log(data)
        setTheatres(data)
        setLoading(false)
      }
      loadTheatres()
    },[])

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
        const theatre = theatres.find(t => t.name.toLowerCase() === data.theatre)
        console.log(theatre)
      const screen = {
        name: data.name,
        theater_id: theatre.id,
      }
      await addScreen(screen)
      navigate("/screens")
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
    if (loading) return null
  return (
    <div>
        <h1>Screens Form</h1>
        <form onSubmit={handleSubmit}>
            <Input name="name" label="Name" value={data.city} type="text" errors={errors} onChange={handleChange} />
            <Select name="theatre"  label="Theatre" value={data.theatre} items={theatres} errors={errors} onChange={handleChange} />
            <button className="btn btn-primary" disabled={validate()}>Save</button>
        </form> 
    </div>
  )
}
