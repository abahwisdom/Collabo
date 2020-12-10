import React, {useState, useContext} from 'react';
import {Button, Modal, Form, Navbar, Nav, Spinner} from 'react-bootstrap'
import { useForm } from "react-hook-form";
import isEmail from 'validator/lib/isEmail';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { logout } from '../redux/actions/authActions';
import Axios from 'axios';
import setRefetchContext from './context/setRefetch';


const Navigation=({ logout, ...props})=>{

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const { register, handleSubmit, errors, formState } = useForm({
    mode: "onBlur",
  });

  const [stillSubmitting, setSubmitting]= useState(false)
  const refetch= useContext(setRefetchContext);

  function onSubmit(data) {
    setSubmitting(true);
    // console.log(data);
    const {name, email}= data;
    Axios.put(`/api/users/${props.user._id}`, {
      name,
      email
    })
    .then((res)=>{
      // console.log(res);
      refetch();
      setSubmitting(false); 
      handleClose()
    })
    
  }

    return(
      <>
      <Navbar collapseOnSelect expand="lg" variant="dark" fixed="top"> 
        <Navbar.Brand className='nav-title-nav' style={{color: '#faf9d7'}}>Collabo</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link href='#2' as={Link} to='/home' >My Projects</Nav.Link>
            <Nav.Link href='#4' as={Link} to='/home/member-projects' >Others' Projects</Nav.Link>
            <Nav.Link href='#'  as={Link} to='/home/ended-projects' >Ended Projects</Nav.Link>
            {/* <Nav.Link href='#notifications' >Notifications</Nav.Link> */}
          </Nav>
          <Nav>
            <Nav.Link onClick={handleShow} href='#edit-profile' >Edit Profile</Nav.Link>
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
                        name="name"
                        type="text"
                        // required
                        defaultValue={props.user.name}
                        ref={register({
                            required: {value:true, message:'*Name is required'},
                            minLength: {value:3, message:'*Name must be at least 3 letters'},
                            maxLength: {value:25, message:'*Name cannot be more than 25 letters'}
                          })}
                />
                 {errors.name && (<div className="error text-danger">{errors.name.message}</div>)}
              </Form.Group>
               
              <Form.Group controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control
                        name='email'
                        // type="email"
                        defaultValue={props.user.email}
                        required
                        ref={register({
                          required: {value: true, message: '*Please enter a valid email'},
                          validate: (input) => isEmail(input)
                        })}

                    
                />
                 {errors.email && (<div className="error text-danger">*Please Enter A Valid Email</div>)}
              </Form.Group>
              
              <Button variant="primary" className='mr-4' type="submit" disabled={formState.isSubmitting||stillSubmitting} >
              {stillSubmitting && <Spinner animation="border" className="align-middle spinner-button" role="status"/>}
                 Submit
              </Button>
              <Button variant="danger" onClick={handleClose}>
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

      
      </>
    )
}


export default connect(null, { logout })(Navigation);