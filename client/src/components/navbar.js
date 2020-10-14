import React, {useState} from 'react';
import {Button, Modal, Form, Navbar, Nav, Container, InputGroup, FormControl} from 'react-bootstrap'
import { useForm } from "react-hook-form";
import { Link } from 'react-router-dom';
import DisplayProjects from './display/home-projects';
import { connect } from 'react-redux';
import { logout } from '../redux/actions/authActions';


const Navigation=({ logout, ...props})=>{

  // const setC

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [showEnd, setShowEnd] = useState(false);

  const handleCloseEnd = () => setShowEnd(false);
  const handleShowEnd = () => setShowEnd(true);

  const { register, handleSubmit, errors, formState } = useForm({
    mode: "onBlur",
  });

  const [stillSubmitting, setSubmitting]= useState(false)

  function onSubmit(data) {
    setSubmitting(true);
    console.log(data)
    fetch('http://slowwly.robertomurray.co.uk/delay/3000/url/https://jsonplaceholder.typicode.com/todos/1')
    .then(response => response.json())
    .then(json => console.log(json))
    .then(()=>setSubmitting(false))
    console.log(data)
    
  }

  const [search, setSearch]= useState('')

    return(
      <>
      <Navbar collapseOnSelect expand="lg" variant="dark" fixed="top"> 
        <Navbar.Brand>Collabo</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link href='#2' as={Link} to='/home' >My Projects</Nav.Link>
            <Nav.Link href='#4' as={Link} to='/home/member-projects' >Others' Projects</Nav.Link>
            {/* <Nav.Link href='#' onClick={handleShowEnd}>Closed Projects</Nav.Link> */}
            {/* <Nav.Link href='#notifications' >Notifications</Nav.Link> */}
          </Nav>
          <Nav>
            {/* <Nav.Link onClick={handleShow} href='#3' >Edit Profile</Nav.Link> */}
            <Nav.Link href='#1' onClick={logout}>
              Sign Out
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      <Modal show={show} onHide={handleClose} centered size='lg'>
        <Modal.Header closeButton>
          <Modal.Title>Edit Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form onSubmit={handleSubmit(onSubmit)} >
                <Form.Group controlId="name">
                    <Form.Label>Name</Form.Label>
                    <Form.Control 
                        name="Name"
                        type="text"
                        required
                        ref={register({
                            required: true,
                            minLength: 3,
                            maxLength: 20,
                          })}
                    />
                </Form.Group>
               
                <Form.Group controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        name='email'
                        type="email"
                        required
                        ref={register({
                            required: true
                          })}

                    
                    />
                </Form.Group>
              
                <Button variant="primary" className='mr-4' type="submit" disabled={formState.isSubmitting||stillSubmitting} >
                 Submit
                </Button>
                <Button variant="danger">
                 Cancel
                </Button>
            </Form>
            
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>

        </Modal.Footer>
      </Modal>

      <Modal show={showEnd} onHide={handleCloseEnd} centered size='lg'>
        <Modal.Header closeButton>
          <Modal.Title>CLOSED PROJECTS</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Container>
          {/* <h3>CLOSED PROJECTS</h3> */}
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
        {props.closedProjects.map((project=>{
      return(
      <React.Fragment>
        <DisplayProjects project={project} handleShow={handleShow} search={search}/>
      </React.Fragment>
      )}))}
        </Container>  
        
            
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseEnd}>
            Close
          </Button>

        </Modal.Footer>
      </Modal>
      </>
    )
}


export default connect(null, { logout })(Navigation);