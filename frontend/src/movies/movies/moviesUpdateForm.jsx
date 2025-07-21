import React, { useEffect, useState } from 'react'
import Joi, { schema }  from 'joi-browser'
import Input from '../common/input'
import { fetchGenres } from '../../services/genreService'
import Select from '../common/select'
import { useNavigate, useParams } from 'react-router'
import { updateMovie, fetchMovieWithId } from '../../services/movieService'
import { toast } from 'react-toastify'
import DatePicker from 'react-datepicker';
export default function  MovieUpdateForm() {
    const [movie, setMovie] = useState({
        "id": "",
        "description": "",
        "duration_minutes": "",
        "language": "",
        "genre_id": "",
        "release_date": ""
    })
    const [data, setData] = useState({
        "title": "",
        "poster": "",
        "trailer": "",
    })

    const [genres, setGenres] = useState([])
    const [loading, setLoading] = useState(true)
    const [errors, setErrors] = useState({})
    const {id} = useParams()
    // const genres = getGenres()
    const navigate = useNavigate()
    useEffect(() => {
      const loadMovie = async () => {
        const fetchedGenres = await fetchGenres()
        const fetchedMovie = await fetchMovieWithId(id)
        console.log(fetchedMovie)
        setGenres(fetchedGenres)
        setMovie({
            id: fetchedMovie.id,
            description: fetchedMovie.description,
            duration_minutes: fetchedMovie.duration_minutes,
            language: fetchedMovie.language,
            genre_id: fetchedMovie.genre_id,
            release_date: fetchedMovie.release_data
            })
        setData({
            title: fetchedMovie.title,
            poster: fetchedMovie.poster,
            trailer: fetchedMovie.trailer,
        })
        setLoading(false)
      }
      loadMovie()

    }, [])
    schema = {
      title: Joi.string().required().label("Title"),
      poster: Joi.string().uri().label("Poster"),
      trailer: Joi.string().uri().label("Trailer"),
    }
    const validate = () => {
      const result = Joi.validate(data, schema, {abortEarly: false})
      if (!result.error) return null
      const validationErrors = {}
      for (let item of result.error.details)
        validationErrors[item.path[0]] = item.message
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
      const moviePayload = {
        id: movie.id,
        title: data.title,
        description: movie.description,
        poster: data.poster,
        trailer: data.trailer,
        duration_minutes: Number(movie.duration_minutes),
        language: movie.language,
        release_date: movie.release_date,
        genre_id: movie.genre_id
      }
      console.log(moviePayload)
      await updateMovie(moviePayload)
      navigate("/movies")
      }catch (ex) {
        if (ex.response && ex.response.status === 400){
          toast.error(ex.message)
        }
        else {
            console.log(ex)
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
  return (
    <div className="mb-3">
        <h1>Movies Form</h1>
        <form onSubmit={handleSubmit}>
            <Input name="title" label="Title" value={data.title} type="text" errors={errors} onChange={handleChange} />
            <Input name="poster" label="Poster" value={data.poster} type="text" errors={errors} onChange={handleChange} />
            <Input name="trailer" label="Trailer" value={data.trailer} type="text" errors={errors} onChange={handleChange} />
        <button className="btn btn-primary">Save</button>
        </form> 
    </div>
  )
}
