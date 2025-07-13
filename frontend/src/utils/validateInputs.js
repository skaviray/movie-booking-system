
import Joi  from 'joi-browser'

const validateInputs = ({name, value}, schema) => {
    const obj = {[name]: value}
    const objSchema = {[name]: schema[name]}
    const {error} = Joi.validate(obj, objSchema )
    return error ? error.details[0].message : null
}
 
export default validateInputs;