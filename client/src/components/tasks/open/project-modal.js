import React, {useContext, useState } from 'react';
import { Button,Form, Spinner} from 'react-bootstrap'
import { useForm} from "react-hook-form";
import Axios from 'axios';
import setCurrentContext from '../../context/setCurrent';

const DisplayModal=(props)=>{

    

    const { register, handleSubmit, errors, formState } = useForm({
        mode: "onBlur",
      });

    const [stillSubmitting, setSubmitting]= useState(false);
  
      function onSubmit(data) {
        setSubmitting(true);
        Axios.put(`/api/projects/${props.currentProject._id}/${props.task.task_id}/edit`,{
            title: data.title,
            lead: JSON.parse(data.lead),
            description: data.description
        })
        .then((res)=>{
            // console.log(res);
            Axios.get(`/api/projects/${props.currentProject._id}/specific`)
            .then((project)=>{setCurrent(project.data)})
            .then(()=>setSubmitting(false))
            .then(()=>props.handleClose())
            // .catch(err=> console.log(err))
          })
          // .catch(err=> console.log(err))
        // console.log(data);
      };

    const setCurrent= useContext(setCurrentContext);

    function deleteTask(){
        Axios.delete(`/api/projects/${props.currentProject._id}/task/${props.task.task_id}`)
        .then((res)=>{
            // console.log(res);
            Axios.get(`/api/projects/${props.currentProject._id}/specific`)
            .then((project)=>{setCurrent(project.data)})
            .then(()=>props.handleClose())
            // .catch(err=> console.log(err))
          })
          // .catch(err=> console.log(err))
    }
  

    return(
        <>
        <Form onSubmit={handleSubmit(onSubmit)} >
                  <Form.Group controlId="name">
                      <Form.Label>Title</Form.Label>
                      <Form.Control 
                          name="title"
                          type="text"
                          defaultValue={props.task.title}
                          ref={register({
                            required: {value: true, message: '*Your Task must have a title'},
                            minLength: {value: 3, message: '*Title must be at least 3 letters'},
                            maxLength: 25,
                            })}
                      />
                      {errors.title && (<div className="error text-danger">{errors.title.message}</div>)}
                  </Form.Group>

                  <Form.Group controlId="lead" >
                    <Form.Label>Lead select</Form.Label>
                    <Form.Control as="select"
                    name="lead"
                    ref={register({required: false})}
                    >
                        <option name="lead" value={[0]} >Please Select a Lead</option>
                    {
                        props.currentProject.members.map(member=>{
                          return(
                            <option name="lead" value={JSON.stringify(member)} >
                            {member.member_name} &nbsp;&nbsp;&nbsp;
                            </option>
                          )
                        })
                      }
                    </Form.Control>
                </Form.Group>
                
                  <Form.Group controlId="description">
                      <Form.Label>Description</Form.Label>
                      <Form.Control as="textarea" rows="3" 
                          name='description'
                          type="text"
                          required
                          defaultValue={props.task.description}
                          ref={register({
                              required: {value: true, message: '*Your task must have a description'}
                            })}

                      
                      />
                      {errors.description && (<div className="error text-danger">{errors.description.message}</div>)}
                  </Form.Group>
                
                  <Button variant="primary" className='mr-4' type="submit" disabled={formState.isSubmitting||stillSubmitting} >
                    {stillSubmitting && <Spinner animation="border" className="align-middle spinner-button" role="status"/>}
                  Submit
                  </Button>
                  <Button variant="danger" onClick={deleteTask} >
                    Delete Task
                    </Button>
              </Form>
        </>
    )
}

export default DisplayModal