import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'

export default function RequireAuth({ user, children }) {
  const location = useLocation()

  if (!user) {
    // Redirect to login and preserve intended location
    console.log(location)
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}
