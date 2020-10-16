import React, {useState, useContext, useEffect} from 'react';
import { Card, Button} from 'react-bootstrap'
import Axios from 'axios';
import setCurrentContext from '../../context/setCurrent';
import MyButton from '../../auth/components/button';


const DisplayTasks=(props)=>{

  const setCurrent= useContext(setCurrentContext);
  const [submitting, setSubmitting]= useState(false);

  function onDone(data) {
    setSubmitting(true);
    Axios.put(`/api/projects/${props.currentProject._id}/${props.task.task_id}/done`)
    .then((res)=>{
        // console.log(res);
        Axios.get(`/api/projects/${props.currentProject._id}/specific`)
        .then((project)=>{setCurrent(project.data);setSubmitting(false);})
        // .then(()=>props.handleClose())
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

    useEffect(()=>{
      switch(props.taskType){
        case 'done': !props.task.done ? setDisplay('none'): setDisplay('block') ; break;
        case 'active': props.task.done ? setDisplay('none'): setDisplay('block') ; break;
        default: setDisplay('block')
      }
    },[props.taskType, props.task.done])
    

    return(
        <>
        <Card className="mb-2" style={{'display':`${display}`}} >
        <Card.Body>
          <Card.Title><h4>{props.task.title} </h4></Card.Title>
          <Card.Subtitle>{props.task.date} </Card.Subtitle>
          {props.task.lead.member_name &&<Card.Subtitle className="mb-2">Lead: {props.task.lead.member_name} </Card.Subtitle>}
          <Card.Text>
            <h6>{props.task.description}</h6>
          </Card.Text>
          <div>
          <Card.Text className=" text-muted side-text line-h-t"><h6 className='line-h text-danger'>{props.task.done?'Done':'Active'} </h6></Card.Text>
          <MyButton className='mr-2' variant={props.task.done?'secondary':'primary'} size="sm" handleClick={onDone} label={props.task.done?'Undo':'Mark as Done'} stillSubmitting={submitting} ></MyButton>
          {!props.task.done && <Button variant='secondary' size='sm' onClick={()=>props.handleShow(props.task)}>Edit</Button>}
          </div>
        </Card.Body>
      </Card>
        </>
    )
}

export default DisplayTasks