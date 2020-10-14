import React, {useState, useEffect} from 'react';
import {Container, Card, Button} from 'react-bootstrap'
// import { useForm } from "react-hook-form";
import { Link } from 'react-router-dom';

const DisplayProjects=(props)=>{

    const [display, setDisplay]= useState('block');
    
    useEffect(()=>{
        if (props.search==''){setDisplay('block')}
        else if (props.project.title.toLowerCase().includes(props.search.toLowerCase())===false&&
        props.project.description.toLowerCase().includes(props.search.toLowerCase())===false){
          setDisplay('none')
        }else{setDisplay('block')}
    },[props.search, props.project.title, props.project.description])

    return(
        <>
        <Container style={{'display':`${display}`}} >
        <Card className="mt-2">
        <Card.Header className=' text-white'><h5>{props.project.title}</h5></Card.Header>
          <Card.Body>
            {/* <Card.Title>{props.project.title.toUpperCase()}</Card.Title>
      <Card.Subtitle className="mb-2 text-muted">Created by: {props.project.creator_name}</Card.Subtitle> */}
            <Card.Text>
            <h6 style={{'font-size':'smaller'}}>{props.project.date}</h6>
              <h6>{props.project.description}</h6>
            </Card.Text>
            <div>
            <Button variant="primary" as={Link} to='/home/project' className='mr-2' size='sm' onClick={()=>{props.setCurrent(props.project)}} >Open</Button>
            <Button variant='secondary' size='sm' onClick={()=>props.handleShow(props.project)}>Edit</Button>
            </div>
          </Card.Body>
        </Card>
        </Container> 
        </>
    )
}

export default DisplayProjects