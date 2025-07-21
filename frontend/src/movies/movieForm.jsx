import React, { useEffect, useState } from 'react'
import Joi, { schema }  from 'joi-browser'
import Input from './common/input'
// import { getGenres } from '../services/fakeGenreService'
import { fetchGenres } from '../services/genreService'
import Select from './common/select'
import { useNavigate } from 'react-router'
import { addMovie } from '../services/movieService'
import { toast } from 'react-toastify'
import DatePicker from 'react-datepicker';
export default function  MovieForm() {
    const [data, setData] = useState({
        "title": "",
        "description": "",
        "poster": "",
        "trailer": "",
        "duration_minutes": "",
        "language": "",
        "genre": ""
    })
    const [releaseDate, setReleaseDate] = useState(new Date());
    const [loading, setLoading] = useState(true)
    const [genres, setGenres] = useState([])
    const [errors, setErrors] = useState({})
    // const genres = getGenres()
    const navigate = useNavigate()
    useEffect(() => {
      const loadGenres = async () => {
        const fetchedGenres = await fetchGenres()
        const genreList  = fetchedGenres.map(item => item.name.toLocaleLowerCase())
        setGenres(fetchedGenres)
        setLoading(false)
      }
      loadGenres()

    }, [])

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
      const genre = genres.find(g => g.name.toLowerCase() === data.genre)
      console.log(genre)
      const movie = {
        title: data.title,
        description: data.description,
        poster: data.poster,
        trailer: data.trailer,
        duration_minutes: Number(data.duration_minutes),
        language: data.language,
        release_date: releaseDate,
        genre_id: genre.id
      }
      console.log(movie)
      await addMovie(movie)
      navigate("/movies")
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
  if (loading) return <div>Loading...</div>
  console.log(genres)
    const genreList  = genres.map(item => item.name.toLocaleLowerCase())
    schema = {
      title: Joi.string().required().label("Title"),
      description: Joi.string().required().label("Description"),
      poster: Joi.string().uri().required().label("Poster"),
      trailer: Joi.string().uri().required().label("Trailer"),
      genre: Joi.string().valid(genreList).required().label("Genre"),
      duration_minutes: Joi.number().integer().required().label("DurationMinutes"),
      language: Joi.string().required().label("Language")
    }

  return (
    <div className="mb-3">
        <h1>Movies Form</h1>
        <form onSubmit={handleSubmit}>
            <Input name="title" label="Tittle" value={data.username} type="text" errors={errors} onChange={handleChange} />
            <Input name="description" label="Description" value={data.description} type="text" errors={errors} onChange={handleChange} />
            <Input name="poster" label="Poster" value={data.poster} type="text" errors={errors} onChange={handleChange} />
            <Input name="trailer" label="Trailer" value={data.trailer} type="text" errors={errors} onChange={handleChange} />
            <Input name="language" label="Language" value={data.language} type="text" errors={errors} onChange={handleChange} />
            <Input name="duration_minutes" label="DurationMinutes" value={data.duration_minutes} type="text" errors={errors} onChange={handleChange} />
            <Select name="genre"  label="Genre" value={data.genre} items={genres} errors={errors} onChange={handleChange} />
            <label className="form-label">ReleaseDate:</label>
              <DatePicker
                selected={releaseDate}
                onChange={(date) => setReleaseDate(date)}
                className="form-control"
                dateFormat="yyyy-MM-dd"
              />
            <button className="btn btn-primary" disabled={validate()}>Save</button>
        </form> 
    </div>
  )
}
