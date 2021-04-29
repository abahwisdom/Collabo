import React, {useState, useContext} from 'react';
import {Container, InputGroup, FormControl, Button, Modal, Form, Jumbotron, Spinner} from 'react-bootstrap'
import { useForm } from "react-hook-form";
import DisplayTasks from './project-tasks';
import DisplayModal from './project-modal';
import Axios from 'axios';
import setCurrentContext from '../../context/setCurrent';


const Tasks=(props)=>{

    const [show, setShow] = useState(false);
  
      const handleClose = () => setShow(false);
      const handleShow = (task) => {
        setModalTask(task);
        setShow(true);
      }
  
  
      const [showNew, setShowNew] = useState(false);
      const handleCloseNew = () => setShowNew(false);
      const handleShowNew = () => setShowNew(true);
  
      const [stillSubmitting, setSubmitting]= useState(false);
  
      const { register, handleSubmit, errors, formState } = useForm({
          mode: "onBlur",
        });
  
  
      const setCurrent= useContext(setCurrentContext);
  
        function onSubmitNew(data) {
          setSubmitting(true);
            // console.log(data);
            Axios.post(`/api/projects/${props.currentProject._id}/new`,{
              title: data.title,
              project_id: props.currentProject._id,
              lead: JSON.parse(data.lead),
              description: data.description,
              done: false
          }).then(()=>{
            Axios.get(`/api/projects/${props.currentProject._id}/specific`)
            .then((project)=>{setCurrent(project.data)})
            .then(()=>setSubmitting(false))
            .then(()=>handleCloseNew())
            // .catch(err=> console.log(err))
          })
          // .catch(err=> console.log(err))
        }
  
      const [modalTask, setModalTask]=useState([]);
  
      
  
      try {
        props.currentProject.members.map(member=>{
          return(
            <option name="lead" value={JSON.stringify(member)} >
              Name: {member.member_name} &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;Email: {member.member_email}
            </option>
          )
        })
        
      } catch (error) {
        window.location.href='/'
        
      }
  
      const [search, setSearch]= useState('');

      const [taskType, setTaskType]= useState('all');
  
    return(
      <>
       <Container>
          <InputGroup className="mb-3">
            <InputGroup.Prepend>
              <InputGroup.Text id="inputGroup-sizing-default">Search</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl
              aria-label="Default"
              aria-describedby="inputGroup-sizing-default"
              onChange={(e)=>setSearch(e.target.value)}
            />
          </InputGroup>
        </Container>
  
        <Container >
        <Button className="side-text" size='sm' onClick={handleShowNew}>Add New Task</Button>
        <h3 >Tasks </h3>
        
          <Form.Group controlId="lead" >
            <Form.Control as="select" name="type" onChange={(e)=>setTaskType(e.target.value)}>
              <option value='all'>All</option>
              <option value='active'>Active</option>
              <option value='done'>Done</option>
            </Form.Control>
          </Form.Group>
        
        <div className='flex-card' >
       {props.currentProject.tasks.length<1?<Jumbotron fluid className='mt-4'>
            <Container>
              <h1>No Tasks Created</h1>
            </Container>
          </Jumbotron>
            :props.currentProject.tasks.slice(0).reverse().map((task=>{
              return(
              <React.Fragment>
                <DisplayTasks task={task} taskType={taskType} handleShow={handleShow} currentProject={props.currentProject} search={search}/>
              </React.Fragment>
              )})) }
              </div>
  
        </Container>
  
        <Modal show={show} onHide={handleClose} centered size='lg'>
          <Modal.Header closeButton>
            <Modal.Title>Edit "{modalTask.title}"</Modal.Title>
          </Modal.Header>
          <Modal.Body>
              <DisplayModal task={modalTask} currentProject={props.currentProject} handleClose={handleClose} />
              
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
  
          </Modal.Footer>
        </Modal>
  
        <Modal show={showNew} onHide={handleCloseNew} centered size='lg' className='new'>
          <Modal.Header closeButton>
            <Modal.Title>Add New Task</Modal.Title>
          </Modal.Header>
          <Modal.Body>
              <Form onSubmit={handleSubmit(onSubmitNew)} >
                  <Form.Group controlId="name">
                      <Form.Label>Task Name</Form.Label>
                      <Form.Control 
                          name="title"
                          type="text"
                          // required
                          ref={register({
                              required: {value: true, message: '*Your Task must have a title'},
                              minLength: {value: 3, message: '*Title must be at least 3 letters'},
                              maxLength: 25,
                            })}
                      />
                      {errors.title && (
                    <div className="error text-danger">{errors.title.message}</div>
                  )}
                  </Form.Group>
                  <Form.Group controlId="lead" >
                      <Form.Label>Task Lead</Form.Label>
                      <Form.Control as="select"
                      name="lead"
                      // required
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
                          // required
                          ref={register({
                              required: {value: true, message: '*Your task must have a description'}
                            })}
                      
                      />
                      {errors.description && (
                        <div className="error text-danger">{errors.description.message}</div>
                      )}
                  </Form.Group>
                  <Button variant="primary" className='mr-4' type="submit" disabled={formState.isSubmitting||stillSubmitting} >
                  {stillSubmitting && <Spinner animation="border" className="align-middle spinner-button" role="status"/>}
                   Submit
                  </Button>
                  <Button variant="danger" >
                   Cancel
                  </Button>
              </Form>
              
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseNew}>
              Close
            </Button>
  
          </Modal.Footer>
        </Modal>
      </>
    )
  }


export default Tasks