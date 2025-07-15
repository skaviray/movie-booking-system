import React, { useEffect, useState } from 'react'
import Joi, { schema }  from 'joi-browser'
import Input from './common/input'
// import { getGenres } from '../services/fakeGenreService'
import { fetchGenres } from '../services/genreService'
import Select from './common/select'
import { useNavigate } from 'react-router'
import { addMovie } from '../services/movieService'
import { toast } from 'react-toastify'
import { addTheatre } from '../services/theatreService'
export default function  TheatreForm() {
    const [data, setData] = useState({
        "name": "",
        "rows": "",
        "columns": ""
    })
    // const [loading, setLoading] = useState(true)
    const [errors, setErrors] = useState({})
    const navigate = useNavigate()
    // useEffect(() => {
    //   const loadGenres = async () => {
    //     const fetchedGenres = await fetchGenres()
    //   }
    //   loadGenres()

    // }, [])
    // if (loading) return <div>Loading...</div>
    // const genreList  = genres.map(item => item.name.toLocaleLowerCase())

    schema = {
      name: Joi.string().required().label("Name"),
      rows: Joi.number().integer().required().label("Rows"),
      columns: Joi.number().integer().required().label("Columns")
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
      const theatre = {
        name: data.name,
        rows: parseInt(data.rows),
        columns: parseInt(data.columns)
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
            <Input name="name" label="Name" value={data.name} type="text" errors={errors} onChange={handleChange} />
            <Input name="rows" label="Rows" value={data.rows} type="text" errors={errors} onChange={handleChange} />
            <Input name="columns" label="Columns" value={data.columns} type="text" errors={errors} onChange={handleChange} />
            <button className="btn btn-primary" disabled={validate()}>Save</button>
        </form> 
    </div>
  )
}
