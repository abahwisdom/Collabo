import React, {useState, useContext, useEffect} from 'react';
import { Card, Button} from 'react-bootstrap'
// import { useForm } from "react-hook-form";
// import {Switch, Route, Link} from 'react-router-dom';
import Axios from 'axios';
import setCurrentContext from '../context/setCurrent';


const DisplayTasks=(props)=>{

  const setCurrent= useContext(setCurrentContext);

  function onDone(data) {
    Axios.put(`/api/projects/${props.currentProject._id}/${props.task.task_id}/done`)
    .then((res)=>{
        console.log(res);
        Axios.get(`/api/projects/${props.currentProject._id}/specific`)
        .then((project)=>{setCurrent(project.data)})
        // .then(()=>props.handleClose())
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
          <Card.Title><h4>{props.task.title} </h4></Card.Title>
          <Card.Subtitle>{props.task.date} </Card.Subtitle>
          {/* <Card.Subtitle className="mb-2 text-muted">Lead</Card.Subtitle> */}
          {props.task.lead.member_name &&<Card.Subtitle className="mb-2">Lead: {props.task.lead.member_name} </Card.Subtitle>}
          {/* <Card.Subtitle className="mb-2 text-muted">Email: {props.task.lead.member_email} </Card.Subtitle> */}
          <Card.Text>
            <h6>{props.task.description}</h6>
          </Card.Text>
          <div>
          <Card.Text className=" text-muted side-text line-h-t"><h6 className='line-h text-danger'>{props.task.done?'Done':'Active'} </h6></Card.Text>
          <Button variant={props.task.done?'secondary':'primary'} size='sm' className='mr-4' onClick={onDone} >{props.task.done?'Undo':'Mark as Done'}</Button>
          {!props.task.done && <Button variant='secondary' size='sm' onClick={()=>props.handleShow(props.task)}>Edit</Button>}
          </div>
        </Card.Body>
      </Card>
        </>
    )
}

export default DisplayTasks