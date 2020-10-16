import React, {useState, useEffect} from 'react';
import {Container, InputGroup, FormControl, Button, Modal, Jumbotron, Table} from 'react-bootstrap'
import Axios from 'axios';
import DisplayMembers from './project-members';
import DisplayMembersModal from './members-modal';


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
      // .catch((err)=>console.log(err))
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

    const TableStyle={
      'overflow-wrap': 'anywhere',
      'font-size': 'smaller'
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
          
  
  
  
          <Table striped bordered hover responsive='sm' style={TableStyle}>
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

export default Members