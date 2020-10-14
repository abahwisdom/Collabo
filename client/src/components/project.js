import React, {useState, useEffect, useContext} from 'react';
import {Container, InputGroup, FormControl, Button, Modal, Form, Jumbotron, Table, Spinner} from 'react-bootstrap'
import { useForm } from "react-hook-form";
import {Switch, Route, Link} from 'react-router-dom';
import DisplayTasks from './display/project-tasks';
import DisplayModal from './modals/project-modal';
import Axios from 'axios';
import setCurrentContext from './context/setCurrent';
import DisplayMembers from './display/project-members';
import DisplayMembersModal from './modals/members-modal';


const Project=(props)=>{

  function closeProject(){
    Axios.put(`api/projects/${props.currentProject._id}/close`)
    .then((res)=>console.log(res))
    // .then(()=> window.location.href='/')
  }

    

    return(
        <>
        <Container>
        <div className='side-text'>
          <Link className='mr-2' to='/home/project'>Tasks</Link>
          <Link to='/home/project/members'>Members</Link>
          {/* <Link variant='danger'>Close Project</Link> */}
        </div>
        <h3 className='playfair'>{props.currentProject.title} </h3>
        <p>{props.currentProject.description}</p>
        <Button variant='outline-danger' size='sm'className='mb-4' onClick={closeProject}>End Project</Button>
        
        

        </Container>
        <Switch>
          <Route exact path='/home/project'>
            <Tasks currentProject={props.currentProject} />
          </Route>
          <Route path='/home/project/members'>
            <Members currentProject={props.currentProject} user={props.user}/>
          </Route>
        </Switch>
       
        </>
    )
}

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
          console.log(data);
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
          .catch(err=> console.log(err))
        }).catch(err=> console.log(err))
      }

    const [modalTask, setModalTask]=useState([]);
    // const [Tasks, setTasks]=useState(
    // //   JSON.parse(localStorage.getItem("currentProject")).tasks.map((task=>{
    // //   return(
    // //   <React.Fragment>
    // //     <DisplayTasks task={task} handleShow={handleShow}/>
    // //   </React.Fragment>
    // //   )})) 
    // // ||
    //   <Container className='text-center mt-4' ><Spinner animation="border" variant="primary" className="align-middle" role="status"/></Container>
      
    //   );
    
    

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
      <h3>Tasks </h3>
      
     {props.currentProject.tasks.length<1?<Jumbotron fluid className='mt-4'>
          <Container>
            <h1>No Tasks Created</h1>
          </Container>
        </Jumbotron>
          :props.currentProject.tasks.slice(0).reverse().map((task=>{
            return(
            <React.Fragment>
              <DisplayTasks task={task} handleShow={handleShow} currentProject={props.currentProject} search={search}/>
            </React.Fragment>
            )})) }

      </Container>

      <Modal show={show} onHide={handleClose} centered size='lg'>
        <Modal.Header closeButton>
          <Modal.Title>Edit "{modalTask.title}"</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <DisplayModal task={modalTask} currentProject={props.currentProject} handleClose={handleClose}/>
            
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


const Members=(props)=>{

  const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [allUsers, setUsers]=useState([]);

    const [search, setSearch]= useState("");
    const [searchModal, setSearchModal]= useState("");

  

  useEffect(()=>{
    Axios.get('/api/users')
    .then((users)=>{
      setUsers(users.data)
    })
    .catch((err)=>console.log(err))
  },[])

  try {
    props.currentProject.members.map(member=>{
      return(
        <option name="lead" value={JSON.stringify(member)} >
          Name: {member.member_name} &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;Email: {member.member_email}
        </option>
      )
    })
    
  } catch (error) {
    window.location.href='/home'
    
  }

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
    <Container>
    <Button className="side-text" size='sm' onClick={handleShow}>Add Member</Button>
     {props.currentProject.members.length>0 && 
     <h3> {props.currentProject.members.length} {props.currentProject.members.length>1?'Members':'Member'} </h3>} 
      
      {props.currentProject.members.length>0?<Table striped bordered hover responsive='sm' >
      <thead>
        <tr>
          {/* <th>#</th> */}
          <th>Name</th>
          <th>Email</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
      {
        props.currentProject.members.map((member, index)=>{
          return(
            <DisplayMembers member={member} index={index} currentProject={props.currentProject} search={search} />
          )
        })
      }
      </tbody>
    </Table>:
    <Jumbotron fluid className='mt-4'>
      <Container>
        <h1>No Members Added Yet</h1>
      </Container>
    </Jumbotron>
    }

    

    </Container>

    <Modal show={show} onHide={handleClose} centered size='lg'>
        <Modal.Header closeButton>
          <Modal.Title>Add New Member to Project</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        
          <InputGroup className="mb-3">
            <InputGroup.Prepend>
              <InputGroup.Text id="inputGroup-sizing-default">Search</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl
              aria-label="Default"
              aria-describedby="inputGroup-sizing-default"
              onChange={(e)=>setSearchModal(e.target.value)}
            />
          </InputGroup>
        



        <Table striped bordered hover responsive='sm'>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
          {
            allUsers.map((member, index)=>{
              if (member._id!==props.user._id)
                     return(
                        <>
                          <DisplayMembersModal member={member} currentProject={props.currentProject} 
                          search={searchModal} 
                          />
                        </>
                     )
                  
            })
          }
          </tbody>
        </Table>

            
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




export default Project