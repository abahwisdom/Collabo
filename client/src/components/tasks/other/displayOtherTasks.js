import React, {useState, useEffect} from 'react';
import {Button, Card} from 'react-bootstrap'

import Axios from 'axios';


const DisplayTasks=({setOther, ...props})=>{
  
    function onDone(data) {
      Axios.put(`/api/projects/${props.currentProject._id}/${props.task.task_id}/done`)
      .then((res)=>{
          // console.log(res);
          Axios.get(`/api/projects/${props.currentProject._id}/specific`)
          .then((project)=>{setOther(project.data)})
          // .catch(err=> console.log(err))
        })
        // .catch(err=> console.log(err))
      // console.log(data);
  };
  
      const [display, setDisplay]= useState('block');
          
      useEffect(()=>{
          if (props.search===''){setDisplay('block')}
          else if (props.task.title.toLowerCase().includes(props.search.toLowerCase())===false&&
          props.task.description.toLowerCase().includes(props.search.toLowerCase())===false){
            setDisplay('none')
          }else{setDisplay('block')}
      },[props.search, props.task.title, props.task.description])
      
  
      return(
          <>
          <Card style={{'display':`${display}`}} >
            <Card.Body>
              {props.user._id===props.task.lead.member_id && <Card.Title><h6 className='text-danger'>You are the lead for this task</h6></Card.Title>}
              <Card.Title><h4>{props.task.title} </h4></Card.Title>
              <Card.Subtitle className='date-card'>{props.task.date} </Card.Subtitle>
              {props.task.lead.member_name &&<Card.Subtitle className="mb-2 date-card">Lead: {props.user._id===props.task.lead.member_id ? 'You' : props.task.lead.member_name} </Card.Subtitle>}
              <Card.Text>
                <h6>{props.task.description}</h6>
              </Card.Text>
              <div>
                <Card.Text className=" text-muted side-text line-h-t">
                  <h6 className='line-h text-danger'>{props.task.done?'Done':'Active'} </h6>
                </Card.Text>
                {props.user._id===props.task.lead.member_id &&
                <Button variant={props.task.done?'secondary':'primary'} size='sm' className='mr-4' onClick={onDone} >{props.task.done?'Undo':'Mark as Done'}</Button>}
              </div>
            </Card.Body>
          </Card>
          </>
      )
  }
  

  export default DisplayTasks
