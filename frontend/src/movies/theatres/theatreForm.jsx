import React, { useEffect, useState } from 'react'
import Joi, { schema }  from 'joi-browser'
import Input from '../common/input'
import Select from './select'
import { useNavigate } from 'react-router'
import { toast } from 'react-toastify'
import DatePicker from 'react-datepicker';
import { addTheatre } from '../../services/theatreService'
import { fetchLocations } from '../../services/locations'


export default function  TheatreForm() {
    const [data, setData] = useState({
        "name": "",
        "location": "",
    })
    const [releaseDate, setReleaseDate] = useState(new Date());
    const [loading, setLoading] = useState(true)
    const [locations, setLocations] = useState([])
    const [errors, setErrors] = useState({})
    const navigate = useNavigate()
    useEffect(() => {
      const loadLocations = async () => {
        const fetchedLocations = await fetchLocations()
        setLocations(fetchedLocations)
        setLoading(false)
      }
      loadLocations()

    }, [])
    if (loading) return <div>Loading...</div>
    const locationsList  = locations.map(item => item.city.toLocaleLowerCase())
    schema = {
      name: Joi.string().required().label("Name"),
      location: Joi.string().valid(locationsList).required().label("Genre"),
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
      console.log("Submitted")
      console.log(locations)
      const location = locations.find(g => g.city.toLowerCase() === data.location)
      console.log(location)
      const theatre = {
        name: data.name,
        location: location.id
      }
      console.log(theatre)
      await addTheatre(theatre)
      navigate("/theatres")
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
    console.log(data)
    setData(prev => ({
      ...prev,
      [name]: value
    }))
    }
  return (
    <div className="mb-3">
        <h1>Movies Form</h1>
        <form onSubmit={handleSubmit}>
            <Input name="name" label="Name" value={data.name} type="text" errors={errors} onChange={handleChange} />
            <Select name="location"  label="Location" value={data.location} items={locations} errors={errors} onChange={handleChange} />
            <button className="btn btn-primary" disabled={validate()}>Save</button>
        </form> 
    </div>
  )
}
