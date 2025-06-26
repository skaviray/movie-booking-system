import React from 'react'
import { useNavigate, useParams } from 'react-router'

export default function MoviesDetails() {
    const navigate = useNavigate()
    const {id} = useParams()
    const handleSave = () => {
      navigate("/movies")
    }
  return (
    <div>
      <h1>Movie Form {id}</h1>
        <button type="button" className="btn btn-success" onClick={handleSave}>save</button>
    </div>
  )
}
