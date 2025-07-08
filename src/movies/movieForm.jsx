import React, { useState } from 'react'
import Joi, { schema }  from 'joi-browser'
import Input from './common/input'
import { getGenres } from '../services/fakeGenreService'
import Select from './common/select'
import { useNavigate } from 'react-router'
import { saveMovie } from '../services/fakeMovieService'
export default function  MovieForm() {
    const genres = getGenres()
    const navigate = useNavigate()
    const [data, setData] = useState({
        "title": "",
        "genre": "",
        "numberInStock": "",
        "rent": ""
    })
    const genreList  = genres.map(item => item.name.toLocaleLowerCase())
    const [errors, setErrors] = useState({})
    schema = {
      title: Joi.string().required().label("Title"),
      genre: Joi.string().valid(genreList).required().label("Genre"),
      numberInStock: Joi.number().integer().required().label("Number in Stock"),
      rent: Joi.number().required().label("Rent Value"),
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

    const doSubmit = () => {
      console.log("Submitted")
      saveMovie(data)
      console.log()
      navigate("/movies")
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
    <div>
        <h1>Movies Form</h1>
        <form onSubmit={handleSubmit}>
            <Input name="title" label="Username" value={data.username} type="text" errors={errors} onChange={handleChange} />
            <Select name="genre"  label="Genre" value={data.genre} items={genres} errors={errors} onChange={handleChange} />
            <Input name="numberInStock" label="Number in Stock" value={data.numberInStock} type="text" errors={errors} onChange={handleChange} />
            <Input name="rent" label="Rate" value={data.rent} type="text" errors={errors} onChange={handleChange} />
            <button className="btn btn-primary" disabled={validate()}>Save</button>
        </form> 
    </div>
  )
}
