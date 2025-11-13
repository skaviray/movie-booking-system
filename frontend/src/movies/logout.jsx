import React from 'react'
import { useEffect } from 'react'
import auth from '../services/auth'

export default function Logout() {
    useEffect(() => {
        auth.logout()
        window.location = "/movies"
    }, [])
  return null
}
