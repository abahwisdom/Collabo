import React, {useState, useEffect, useContext} from 'react';
import {Container, Card} from 'react-bootstrap'
import MyButton from '../../auth/components/button';
import Axios from 'axios';
import setRefetchContext from '../../context/setRefetch';
import { useHistory } from 'react-router-dom';
import setCurrentContext from '../../context/setCurrent';

const DisplayEnded=(props)=>{

    const [display, setDisplay]= useState('block');
    const [submitting, setSubmitting]= useState(false);
    const [submitting2, setSubmitting2]= useState(false);
    const refetch= useContext(setRefetchContext);
    const setCurrent= useContext(setCurrentContext);
    const history= useHistory();
    
    function reopen(){
      setSubmitting(true);
      Axios.put(`/api/projects/${props.project._id}/open`)
      .then(()=>{
        refetch();
        setCurrent(props.project);
        setSubmitting(false);
        history.push('/home/project')
      })
    }
    function deleteProject(){
      setSubmitting2(true);
      Axios.delete(`/api/projects/${props.project._id}`)
      .then(()=>{
        refetch();
        setSubmitting2(false);
      })
    }


    useEffect(()=>{
        if (props.search===''){setDisplay('block')}
        else if (props.project.title.toLowerCase().includes(props.search.toLowerCase())===false&&
        props.project.description.toLowerCase().includes(props.search.toLowerCase())===false){
          setDisplay('none')
        }else{setDisplay('block')}
    },[props.search, props.project.title, props.project.description])

    return(
        <>
        
          <Card className="mt-2" style={{'display':`${display}`}}  >
            <Card.Header className='project-title'><h5>{props.project.title}</h5>
            <Card.Subtitle className="mb-2 date-card">{props.project.date} </Card.Subtitle>
            </Card.Header>
            <Card.Body>
              {/* <Card.Subtitle className="mb-2 date-card">{props.project.date} </Card.Subtitle> */}
              <Card.Text>
                <h6>{props.project.description}</h6>
              </Card.Text>
              <div>
              <MyButton size= 'sm' label='Reopen Project' handleClick={reopen} stillSubmitting={submitting} className='mr-2' />
              <MyButton size= 'sm' variant='danger' label='Delete Project' handleClick={deleteProject} stillSubmitting={submitting2} className='mr-2' />
              </div>
            </Card.Body>
          </Card>
        
        </>
    )
}

export default DisplayEnded