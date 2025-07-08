import Joi  from 'joi-browser'

const validate = (data, schema) => {
    const result = Joi.validate(data, schema, {abortEarly: false})
    if (!result.error) return null
    const validationErrors = {}
    for (let item of result.error.details)
    validationErrors[item.path[0]] = item.message
    console.log(validationErrors)
    return validationErrors;
}
 
export default validate;