import React, {useState, useEffect} from 'react';
import {Container, Button, Card} from 'react-bootstrap'
import { Link } from 'react-router-dom';

const DisplayOtherProjects=(props)=>{

    const [display, setDisplay]= useState('block');
    
    useEffect(()=>{
        if (props.search===''){setDisplay('block')}
        else if (props.project.title.toLowerCase().includes(props.search.toLowerCase())===false&&
        props.project.description.toLowerCase().includes(props.search.toLowerCase())===false){
          setDisplay('none')
        }else{setDisplay('block')}
    },[props.search, props.project.title, props.project.description])

    return(
        <>
          <Card className="mt-2" style={{'display':`${display}`}}>
            <Card.Header className='project-title'><h5>{props.project.title}</h5>
              <div className='card-subtitle' style={{'font-family': 'Titillium Web'}}>Admin: {props.project.creator_name} </div>
              <Card.Subtitle className="mb-2 date-card">{props.project.date} </Card.Subtitle>
            </Card.Header>
            <Card.Body>
              {/* <Card.Subtitle className="mb-2 date-card">{props.project.date} </Card.Subtitle> */}
              <Card.Text>
                <h6>{props.project.description}</h6>
              </Card.Text>
              <div>
              <Button variant="primary" as={Link} to='/home/member-project' className='mr-2' size='sm' onClick={()=>{props.setCurrent(props.project)}} >Open</Button>
              </div>
            </Card.Body>
          </Card>
        </>
    )
}

export default DisplayOtherProjects