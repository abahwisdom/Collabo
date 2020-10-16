import React, {useContext} from 'react';
import {Container} from 'react-bootstrap'
import {useHistory} from 'react-router-dom';
import Axios from 'axios';
import MyButton from '../../auth/components/button';
import setRefetchContext from '../../context/setRefetch';
import Tasks from '../../tasks/other/otherTasks'


const OtherProject=(props)=>{

const refetch= useContext(setRefetchContext);
let history= useHistory();

function deleteMember(){
    Axios.delete(`/api/projects/${props.currentProject._id}/member/${props.user._id}`)
    .then((res)=>{ 
    // console.log(res);
    // props.setOther('');
    refetch();
    history.push('/home/member-projects')
   })
}
    
    return(
        <>
        <Container>
          <MyButton className="side-text" size='sm' handleClick={deleteMember} variant='danger' label='Leave Project'></MyButton>
          <h3 className='playfair'>{props.currentProject.title} </h3>
          <h6>Admin: {props.currentProject.creator_name}</h6>
          <h6 style={{'font-size':'smaller'}}>{props.currentProject.date}</h6>
          <p>{props.currentProject.description}</p>
        </Container>

        <Tasks currentProject={props.currentProject} user={props.user} setOther={props.setOther} />
 
        </>
    )
}



export default OtherProject