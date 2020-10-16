import React, { useContext, useState } from 'react';
import {Container} from 'react-bootstrap'
import {Switch, Route, Link, useHistory} from 'react-router-dom';
import Tasks from '../../tasks/open/tasks';
import Axios from 'axios';
import Members from '../../members/members';
import setRefetchContext from '../../context/setRefetch';
import MyButton from '../../auth/components/button';



const Project=(props)=>{
  const refetch= useContext(setRefetchContext);
  const history=useHistory();
  const [submitting, setSubmitting]= useState(false);

  function closeProject(){
    setSubmitting(true);
    Axios.put(`/api/projects/${props.currentProject._id}/close`)
    .then(()=>{
      refetch(); history.push('/home');setSubmitting(false);
    })

  }

    return(
        <>
        <Container>
        <div className='side-text'>
          <Link className='mr-2' to='/home/project'>Tasks</Link>
          <Link to='/home/project/members'>Members</Link>
          {/* <Link variant='danger'>Close Project</Link> */}
        </div>
        <h3 className='playfair'>{props.currentProject.title} </h3>
        <p>{props.currentProject.description}</p>
        <MyButton stillSubmitting={submitting} variant='outline-danger' size='sm'className='mb-4' handleClick={closeProject} label='End Project'/>
        
        

        </Container>
        <Switch>
          <Route exact path='/home/project'>
            <Tasks currentProject={props.currentProject} />
          </Route>
          <Route path='/home/project/members'>
            <Members currentProject={props.currentProject} user={props.user}/>
          </Route>
        </Switch>
       
        </>
    )
}


export default Project