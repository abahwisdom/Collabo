import React, {useState, useContext} from 'react';
import {Button, Form, Spinner} from 'react-bootstrap'
import { useForm } from "react-hook-form";
import axios from 'axios';
import setRefetchContext from '../../context/setRefetch';

const DisplayModal=(props)=>{

    const { register, handleSubmit, errors, formState } = useForm({
        mode: "onBlur",
      });

    const [stillSubmitting, setSubmitting]= useState(false);

    const refetch= useContext(setRefetchContext);
  
      function onSubmit(data) {
        setSubmitting(true);
        // console.log(data);
        axios.put(`/api/projects/${props.project._id}/edit`, {
            title: data.title,
            description: data.description,
        })
        .then(()=>setSubmitting(false))
        .then(()=>{refetch(); props.handleClose()})
        // .catch(err=> console.log(err))
        };
  

    return(
        <>
        <Form onSubmit={handleSubmit(onSubmit)} >
                  <Form.Group controlId="name">
                      <Form.Label>{props.project.title}</Form.Label>
                      <Form.Control 
                          name="title"
                          type="text"
                        //   required
                          defaultValue={props.project.title}
                          ref={register({
                              required: {value:true, message:'Project must have a title'},
                              minLength: {value:3, message:'Title must be at least 3 letters'},
                              maxLength: {value:20, message:'Project cannot be more than 20 letters'},
                            })}
                      />
                      {errors.title && (<div className="error text-danger">{errors.title.message}</div>)}
                  </Form.Group>
                
                  <Form.Group controlId="description">
                      <Form.Label>Description</Form.Label>
                      <Form.Control as="textarea" rows="3" 
                          name='description'
                          type="text"
                        //   required
                          defaultValue={props.project.description}
                          ref={register({
                              required: {value:true, message:'Project must have a description'}
                            })}

                      
                      />
                      {errors.description && (<div className="error text-danger">{errors.description.message}</div>)}
                  </Form.Group>
                
                  <Button variant="primary" className='mr-4' type="submit" disabled={formState.isSubmitting||stillSubmitting} >
                  {stillSubmitting && <Spinner animation="border" className="align-middle spinner-button" role="status"/>}
                  Submit
                  </Button>
                  {/* <Button variant="danger" >
                  Delete Project
                  </Button> */}
              </Form>
        </>
    )
}

export default DisplayModal