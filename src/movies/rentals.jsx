import React from 'react'
import { useNavigate, useParams } from 'react-router'

export default function Rentals() {
    const navigate = useNavigate()
    const {id} = useParams()
  return (
    <div>
        <h1>Rentals</h1>
    </div>
  )
}
