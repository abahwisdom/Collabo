import React, {useState} from 'react';
import {Container, InputGroup, FormControl, Button, Modal, Form, Spinner, Card, Accordion, Jumbotron} from 'react-bootstrap'
import { useForm } from "react-hook-form";
import DisplayProjects from './display/home-projects';
import DisplayModal from './modals/home-modal';
import axios from 'axios';


const Home=(props)=>{


  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);

  const handleShow = (project) => {
    setModalProject(project);
    setShow(true);
  }

  const [showNew, setShowNew] = useState(false);
    const handleCloseNew = () => setShowNew(false);
    const handleShowNew = () => setShowNew(true);

    const { register, handleSubmit, errors, formState } = useForm({
      mode: "onBlur",
    });

    const [stillSubmitting, setSubmitting]= useState(false);

    function onSubmitNew(data) {
      setSubmitting(true)
        console.log(data);
        axios.post('/api/projects',
        {
          title: data.title,
          description: data.description,
          creator_UID: props.user._id,
          creator_name: props.user.name
        })
        .then(()=>setSubmitting(false))
        .then(()=>{window.location.href='/home'})
        .catch(err=> console.log(err))
      }

    const [modalProject, setModalProject]=useState([]);

    const [search, setSearch]= useState('');

    return(
        <>
        <Container>
        <Button className="side-text" size='sm' onClick={handleShowNew}>Create New Project</Button>
        <h4>My Projects</h4>
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

      {props.projects.length>0 ?
      props.projects.map((project=>{
      return(
      <React.Fragment>
        <DisplayProjects project={project} handleShow={handleShow} setCurrent={props.setCurrent} search={search}/>
      </React.Fragment>
      )})) : <Jumbotron fluid className='mt-4'>
      <Container>
      <h1>You Do Not Have Any Open Projects</h1>
      </Container>
      </Jumbotron>
    }
      

      <Modal show={showNew} onHide={handleCloseNew} centered size='lg'className='new'>
        <Modal.Header closeButton>
          <Modal.Title>Create New Project</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form onSubmit={handleSubmit(onSubmitNew)} >
                <Form.Group controlId="name">
                    <Form.Label>Project Title</Form.Label>
                    <Form.Control 
                        name="title"
                        type="text"
                        ref={register({
                            required: {value:true, message:'Project must have a title'},
                            minLength: {value:3, message:'Title must be at least 3 letters'},
                            maxLength: {value:25, message:'Title cannot be more than 25 letters'},
                          })}
                    />
                    {errors.title && (<div className="error text-danger">{errors.title.message}</div>)}
                </Form.Group>
               
                <Form.Group controlId="description">
                    <Form.Label>Description</Form.Label>
                    <Form.Control as="textarea" rows="3" 
                        name='description'
                        type="text"
                        required
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

      <Modal show={show} onHide={handleClose} centered size='lg'>
          <Modal.Header closeButton>
            <Modal.Title>{modalProject.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
              <DisplayModal project={modalProject}/>
              
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>

          </Modal.Footer>
        </Modal>

        
        </>
    )
}

export default Home

