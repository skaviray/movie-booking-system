import React, { useEffect, useState } from 'react'
import {  Navigate, useNavigate, useParams } from 'react-router'
// import { getMovies } from '../services/fakeMovieService'
import { fetchMovies, fetchMovieWithId, updateMovie } from '../services/movieService'

export default function MoviesDetails() {
    const navigate = useNavigate()
    const {id} = useParams()
    const [movie, setMovie] = useState({})
    const [loading, setLoading] = useState(true)
    const handleSave = async (movie) => {
      try {
      movie.title = "UPDATED"
      movie = await updateMovie(movie)
      navigate("/movies")
      } catch(ex) {
        if (ex.response && ex.response.status === 404) {
          alert("resource not found..")
        }
      }
    }
    useEffect(() => {
        const loadMovies = async () =>  {
          const data = await fetchMovieWithId(id)
          console.log(data)  
          setMovie(data)
          setLoading(false)
    }
    loadMovies()
  },[])
  if (loading) return <div>Loading...</div>
    console.log(id)
    console.log(movie)
    if (!movie) {
    return <Navigate to="/not-found" />
  }
  return (
    <div>
      <h1>Movie Form {id}</h1>
        <button type="button" className="btn btn-success" onClick={() => handleSave(movie)}>save</button>
    </div>
  )
}
