import React, {useState, useEffect, useContext} from 'react';
import {Container, InputGroup, FormControl, Button, Modal, Form, Jumbotron, Table, Spinner, Card} from 'react-bootstrap'
import { useForm } from "react-hook-form";
import {Switch, Route, Link} from 'react-router-dom';
// import DisplayTasks from './display/project-tasks';
import DisplayModal from './modals/project-modal';
import Axios from 'axios';
import setCurrentContext from './context/setCurrent';
import DisplayMembers from './display/project-members';
import DisplayMembersModal from './modals/members-modal';
import MyButton from './auth/components/button';


const OtherProject=(props)=>{

//   function closeProject(){
//     Axios.put(`api/projects/${props.currentProject._id}/close`)
//     .then((res)=>console.log(res))
//     // .then(()=> window.location.href='/')
//   }
function deleteMember(){
    Axios.delete(`/api/projects/${props.currentProject._id}/member/${props.user._id}`)
    .then((res)=>{ 
     console.log(res);
     props.setOther('');
    window.location.href='/home/member-projects'
   })
}
    

    return(
        <>
        <Container>
        <div className='side-text'>
          {/* <Link className='mr-2' to='/home/project'>Tasks</Link> */}
          {/* <Link to='/home/project/members'>Members</Link> */}
          {/* <Link variant='danger'>Close Project</Link> */}
        </div>
        <MyButton className="side-text" size='sm' handleClick={deleteMember} variant='danger' label='Leave Project'></MyButton>
        <h3 className='playfair'>{props.currentProject.title} </h3>
        <h6>Admin: {props.currentProject.creator_name}</h6>
        <h6 style={{'font-size':'smaller'}}>{props.currentProject.date}</h6>
        <p>{props.currentProject.description}</p>
        {/* <Button variant='outline-danger' size='sm'className='mb-4' onClick={closeProject}>End Project</Button> */}
        
        

        </Container>
        
          
            <Tasks currentProject={props.currentProject} user={props.user} setOther={props.setOther} />
          
          {/* <Route path='/home/project/members'>
            <Members currentProject={props.currentProject} user={props.user}/>
          </Route> */}
        
       
        </>
    )
}

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

      </Container>

    </>
  )
}







export default OtherProject

const DisplayTasks=({setOther, ...props})=>{

    // const setCurrent= useContext(setCurrentContext);
    // const [currentDone, setDone]= useState(props.task.done);
  
    function onDone(data) {
      Axios.put(`/api/projects/${props.currentProject._id}/${props.task.task_id}/done`)
      .then((res)=>{
          console.log(res);
          Axios.get(`/api/projects/${props.currentProject._id}/specific`)
          .then((project)=>{setOther(project.data)})
        //   .then(()=>props.handleClose())
        // .then(()=>{setDone(!currentDone)})
          .catch(err=> console.log(err))
        }).catch(err=> console.log(err))
      console.log(data);
  };
  
      const [display, setDisplay]= useState('block');
          
      useEffect(()=>{
          if (props.search===''){setDisplay('block')}
          else if (props.task.title.toLowerCase().includes(props.search.toLowerCase())===false&&
          props.task.description.toLowerCase().includes(props.search.toLowerCase())===false){
            setDisplay('none')
          }else{setDisplay('block')}
      },[props.search, props.task.title])
      
  
      return(
          <>
          <Card className="mb-2" style={{'display':`${display}`}} >
          <Card.Body>
          {props.user._id==props.task.lead.member_id && <Card.Title><h6 className='text-danger'>You are the lead for this task</h6></Card.Title>}
            <Card.Title><h4>{props.task.title} </h4></Card.Title>
            <Card.Subtitle>{props.task.date} </Card.Subtitle>
            {/* <Card.Subtitle className="mb-2 text-muted">Lead</Card.Subtitle> */}
            {props.task.lead.member_name &&<Card.Subtitle className="mb-2">Lead: {props.user._id==props.task.lead.member_id ? 'You' : props.task.lead.member_name} </Card.Subtitle>}
            {/* <Card.Subtitle className="mb-2 text-muted">Email: {props.task.lead.member_email} </Card.Subtitle> */}
            <Card.Text>
              <h6>{props.task.description}</h6>
            </Card.Text>
            <div>
            <Card.Text className=" text-muted side-text line-h-t"><h6 className='line-h text-danger'>{props.task.done?'Done':'Active'} </h6></Card.Text>
            {props.user._id==props.task.lead.member_id &&
            <Button variant={props.task.done?'secondary':'primary'} size='sm' className='mr-4' onClick={onDone} >{props.task.done?'Undo':'Mark as Done'}</Button>}
            {/* {!props.task.done && <Button variant='secondary' size='sm' onClick={()=>props.handleShow(props.task)}>Edit</Button>} */}
            </div>
          </Card.Body>
        </Card>
          </>
      )
  }
  
