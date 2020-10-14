import React, {useState, useEffect} from 'react';
import {Container, InputGroup, FormControl, Button, Modal, Form, Spinner, Card, Accordion, Jumbotron} from 'react-bootstrap'

import axios from 'axios';

import { Link } from 'react-router-dom';


const Other=(props)=>{

    const [search, setSearch]= useState('');

    return(
        <>
        <Container>
        {/* <Button className="side-text" size='sm' onClick={handleShowNew}>Create New Project</Button> */}
        <h4>Others' Projects</h4>
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
        <DisplayOtherProjects project={project} setCurrent={props.setCurrent} search={search}/>
      </React.Fragment>
      )})) : <Jumbotron fluid className='mt-4'>
      <Container>
      <h1>You are not part of any other project</h1>
      </Container>
      </Jumbotron>
      }

        
        </>
    )
}





const DisplayOtherProjects=(props)=>{

    const [display, setDisplay]= useState('block');
    
    useEffect(()=>{
        if (props.search==''){setDisplay('block')}
        else if (props.project.title.toLowerCase().includes(props.search.toLowerCase())===false&&
        props.project.description.toLowerCase().includes(props.search.toLowerCase())===false){
          setDisplay('none')
        }else{setDisplay('block')}
    },[props.search, props.project.title])

    return(
        <>
        <Container style={{'display':`${display}`}} >
        <Card className="mt-2">
        <Card.Header className=' text-white'><h5>{props.project.title}</h5>
        <div style={{'font-size':'small','font-family': 'Titillium Web'}}>Admin: {props.project.creator_name} </div>
        </Card.Header>
          <Card.Body>
          {/* <Card.Subtitle className="mb-2">Admin: {props.project.creator_name} </Card.Subtitle> */}
          <Card.Subtitle className="mb-2">{props.project.date} </Card.Subtitle>
            {/* <Card.Title>{props.project.title.toUpperCase()}</Card.Title>
      <Card.Subtitle className="mb-2 text-muted">Created by: {props.project.creator_name}</Card.Subtitle> */}
            <Card.Text>
              <h6>{props.project.description}</h6>
            </Card.Text>
            <div>
            <Button variant="primary" as={Link} to='/home/member-project' className='mr-2' size='sm' onClick={()=>{props.setCurrent(props.project)}} >Open</Button>
            {/* <Button variant='secondary' size='sm' onClick={()=>props.handleShow(props.project)}>Edit</Button> */}
            </div>
          </Card.Body>
        </Card>
        </Container> 
        </>
    )
}

export default Other
