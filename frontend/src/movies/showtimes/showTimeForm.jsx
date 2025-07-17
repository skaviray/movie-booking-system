import React, { useEffect, useState } from 'react'
import Joi, { schema }  from 'joi-browser'
import Input from '../common/input'
import { useNavigate } from 'react-router'
import { toast } from 'react-toastify'
import Select from '../common/select'
import {  fetchScreens } from '../../services/screensService'
import { fetchMovies } from '../../services/movieService';
import {addShowTime} from '../../services/showTimesService';
import DatePicker from 'react-datepicker';
import SelectMovie from './select'
import getTodayTime from '../../utils/currentTime'
import { fetchTheatres } from '../../services/theatreService';
export default function  ShowTimeForm() {
    const [data, setData] = useState({
        "movie": null,
        "theatre": null,
        "screen": null,
        "price": null
    })
    const [startTime, setStartTime] = useState(new Date());
    const [movies, setMovies] = useState([])
    const [screens, setScreens] = useState([])
    const [theatres, setTheatres] = useState([])
    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()
    schema = {
      movie: Joi.string().required().label("Movie"),
      screen: Joi.string().required().label("Screen"),
      theatre: Joi.string().required().label("Theatre"),
      price: Joi.number().integer().required().label("Price")
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
      const loadData = async () => {
        const fetchedMovies = await fetchMovies()
        const fetchedScreens = await fetchScreens()
        const fetchedTheatres = await fetchTheatres()
        setMovies(fetchedMovies)
        setScreens(fetchedScreens)
        setTheatres(fetchedTheatres)
        setLoading(false)
      }
      loadData()
    },[])

    const validateInputs = ({name, value})=> {
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
        const movie = movies.find(m => m.title.toLowerCase() === data.movie)
        const screen = screens.find(s => s.name.toLowerCase() === data.screen)
      const show = {
        "movie_id": movie.id,
        "screen_id": screen.id,
        "price": Number(data.price),
        "start_time": startTime
      }
      console.log(show)
      await addShowTime(show)
      navigate("/showtimes")
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
        <h1>ShowTime Form</h1>
        <form onSubmit={handleSubmit}>
            <SelectMovie selector="title" name="movie"  label="Movie" value={data.movie} items={movies} errors={errors} onChange={handleChange} />
            <Select name="theatre"  label="Theatre" value={data.theatre} items={theatres} errors={errors} onChange={handleChange} />
            <Select name="screen"  label="Screen" value={data.screen} items={
              data.theatre ? 
              screens.filter(screen => {
                const theatre = theatres.find(t => t.name.toLowerCase() === data.theatre )
                return theatre && screen.theater_id === theatre.id
              }) : []
            } errors={errors} onChange={handleChange} />
            <Input name="price" label="Price" value={data.price} type="text" errors={errors} onChange={handleChange} />
            <label className="form-label">ReleaseDate:</label>
              <DatePicker
                showTimeSelect
                minTime={getTodayTime(12, 30)} 
                maxTime={getTodayTime(19, 30)} 
                selected={startTime}
                onChange={(date) => setStartTime(date)}
              />
            <button className="btn btn-primary" disabled={validate()}>Save</button>
        </form> 
    </div>
  )
}
