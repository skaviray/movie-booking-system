import React from 'react'

export default function Profile({user}) {
    console.log(user)
  return (
    <h1> Welcome {user.username}</h1>
  )
}
