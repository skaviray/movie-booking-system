import { Alert } from 'bootstrap'
import React from 'react'

export default function Input({ name, label, value, type, errors, onChange, placeholder}) {
  return (
    <div className="mb-3" > 
        <label htmlFor={name} className="form-label">{label}</label>
        <input 
        autoFocus 
        value={value}
        onChange={onChange}
        type={type}
        name={name}
        className="form-control" 
        id={name} 
        aria-describedby="emailHelp"
        placeholder={placeholder || name} />
    {errors[name] ? <div className="alert alert-danger" role="alert">{errors[name]}</div>: null}
    </div>
  )
}
