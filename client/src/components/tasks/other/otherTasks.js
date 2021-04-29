import React, {useState} from 'react';
import {Container, InputGroup, FormControl, Jumbotron} from 'react-bootstrap'
import DisplayTasks from './displayOtherTasks'

const Tasks=(props)=>{
    
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
        <h3>Tasks </h3>
        <div className='flex-card' >
        {props.currentProject.tasks.length<1?<Jumbotron fluid className='mt-4'>
          <Container>
            <h1>No Tasks Created</h1>
          </Container>
        </Jumbotron>
          :props.currentProject.tasks.slice(0).reverse().map((task=>{
            return(
            <React.Fragment>
              <DisplayTasks task={task} currentProject={props.currentProject} search={search} user={props.user} setOther={props.setOther}/>
            </React.Fragment>
            )})) }
          </div>
      </Container>

    </>
  )
}


export default Tasks