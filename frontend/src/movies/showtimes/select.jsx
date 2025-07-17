import { Alert } from 'bootstrap'
import React from 'react'

export default function SelectMovie({ selector,name, label, value, items, errors, onChange}) {
  return (
    <div className="mb-3" > 
    <label htmlFor={name} className="form-label">{label}</label>
    <select className="form-select form-select-lg mb-3" aria-label=".form-select-lg example" name={name} value={value} onChange={onChange}>
    <option value="">{label}</option>
    {items.map(item => <option key={item[selector]} value={item[selector].toLowerCase()}>{item[selector]}</option>)}
    </select>
    {errors[name] ? <div className="alert alert-danger" role="alert">{errors[name]}</div>: null}
    </div>
  )
}