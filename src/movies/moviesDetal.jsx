import React from 'react'
import { Navigate, useNavigate, useParams } from 'react-router'
import { getMovies } from '../services/fakeMovieService'

export default function MoviesDetails() {
    const navigate = useNavigate()
    const {id} = useParams()
    const handleSave = () => {
      navigate("/movies")
    }
    console.log(id)
    console.log(getMovies())
    const movie = getMovies().find(m => m._id === id)
    console.log(movie)
    if (!movie) {
    return <Navigate to="/not-found" />
  }
  return (
    <div>
      <h1>Movie Form {id}</h1>
        <button type="button" className="btn btn-success" onClick={handleSave}>save</button>
    </div>
  )
}
