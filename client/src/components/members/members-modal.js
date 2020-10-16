import React, {useState, useEffect, useContext} from 'react';

import Axios from 'axios';
import setCurrentContext from '../context/setCurrent';
import MyButton from '../auth/components/button';


const DisplayMembersModal=(props)=>{

    const setCurrent= useContext(setCurrentContext);
    const [submitting, setSubmitting]= useState(false);

    function addMember(){
      setSubmitting(true);
      Axios.post(`/api/projects/${props.currentProject._id}/new-member`, 
        {
          member_name: props.member.name,
          member_email: props.member.email,
          member_id: props.member._id
        }
       ).then(()=>{
         Axios.get(`/api/projects/${props.currentProject._id}/specific`)
         .then((project)=>{setCurrent(project.data); setSubmitting(false)})
       })
    }

    const [display, setDisplay]= useState('table-row');
        
    useEffect(()=>{
        if (props.search===''){setDisplay('table-row')}
        else if (props.member.name.toLowerCase().includes(props.search.toLowerCase())===false&&
        props.member.email.toLowerCase().includes(props.search.toLowerCase())===false){
          setDisplay('none')
        }else{setDisplay('table-row')}
    },[props.search, props.member.name, props.member.email])
    
    
    // useEffect(()=>{

      
    // },[props.currentProject, props.member._id])
  
    const found= props.currentProject.members.find(member=>
      member.member_id===props.member._id
    );

    return(
      <>
      <tr style={{'display':`${display}`}}>
    
        <td>{props.member.name}</td>
        <td>{props.member.email} </td>
        <td>
        { found ? <div><em>Member</em></div>:
          <MyButton variant='primary' size="sm" handleClick={addMember} label='Add' stillSubmitting={submitting} >Add To Project</MyButton>
        }
          </td>
      </tr>
      </>
    )
  }

  export default DisplayMembersModal