import React, { useState} from "react";
import { Button, Modal, Form } from "react-bootstrap";
import Joi from "joi-browser";
import auth from '../../services/auth'
import { useNavigate, useLocation } from 'react-router'

function LoginPopup({setAppData, modalLabel,buttonLabel, show, setShow,componentSchema,components, handleSubmit}) {
    const navigate = useNavigate()
    // const [profiles, setProfiles] = useState([]);
    const [formData, setFormData] = useState({});
    
    const [errors, setErrors] = useState({});
    const schema = componentSchema;
    const handleClose = () => {
        setShow(false);
        setFormData({});
        setErrors({});
    };
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (setAppData) {
          setAppData({ ...formData, [e.target.name]: e.target.value })
        } 
    };
    const validateAndHandleSubmit = async e => {
        e.preventDefault()
        const result = Joi.validate(formData, schema, { abortEarly: false });
        if (result.error) {
        const errorObj = {};
        result.error.details.forEach((detail) => {
            errorObj[detail.path[0]] = detail.message;
        });
        setErrors(errorObj);
        return;
        }
        // setProfiles([...profiles, formData]);
        handleSubmit(e, formData, setErrors)
        handleClose()
    }
    console.log(formData)
  return (
    <>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>{modalLabel}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={validateAndHandleSubmit}>
            {components.map(component => { 
              return (component.form_type == "control" ?<Form.Group className="mb-3"  key={component.key}>
                <Form.Label>{component.label}</Form.Label>
                <Form.Control 
                type={component.type}
                name={component.key}
                value={formData[component['key']]}
                onChange={handleChange}
                placeholder={component.placeholder}
                isInvalid={!!errors[component['key']]} 
                required />
                <Form.Control.Feedback type="invalid">
                  {errors[component['key']]}
                </Form.Control.Feedback>
              </Form.Group> :
              <Form.Group className="mb-3">
              <Form.Label>{component.label}</Form.Label>
              <Form.Select
                name={component.key}
                value={formData[component['key']]}
                onChange={handleChange}
                isInvalid={!!errors[component['key']]} 
                required
              >
                <option value="">{component.label}</option>
                {component.select_list && component.select_list.map(item => {return(<option value={item}>{item}</option>)} )}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {errors[component['key']]}
              </Form.Control.Feedback>
            </Form.Group>
              )     
            })
            
            }
            <Button variant="primary" type="submit">
              {buttonLabel}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default LoginPopup;
