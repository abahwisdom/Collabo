import React, {useState, useEffect, useContext} from 'react';
import {Button} from 'react-bootstrap'

import Axios from 'axios';
import setCurrentContext from '../context/setCurrent';


const DisplayMembersModal=(props)=>{

    const setCurrent= useContext(setCurrentContext);

    const [actions, setActions]= useState(<Button variant='primary' size="sm" onClick={addMember} >Add To Project</Button>)
  
    function addMember(){
      Axios.post(`/api/projects/${props.currentProject._id}/new-member`, 
        {
          member_name: props.member.name,
          member_email: props.member.email,
          member_id: props.member._id
        }
       ).then(()=>{
         Axios.get(`/api/projects/${props.currentProject._id}/specific`)
         .then((project)=>{setCurrent(project.data)})
       })
    }

    const [display, setDisplay]= useState('table-row');
        
    useEffect(()=>{
        if (props.search===''){setDisplay('table-row')}
        else if (props.member.name.toLowerCase().includes(props.search.toLowerCase())===false&&
        props.member.email.toLowerCase().includes(props.search.toLowerCase())===false){
          setDisplay('none')
        }else{setDisplay('table-row')}
    },[props.search, props.member.name])
    
    
    useEffect(()=>{

      const found= props.currentProject.members.find(member=>
        member.member_id===props.member._id
      );
      if (found){
        setActions(<div><em>Already a member</em></div>)
      }
    },[props.currentProject, props.member._id])

    // useEffect(()=>{
    //   if (props.member.name.indexOf(props.searchInput)!==-1){
    //     setDisplay('table-row')
    //   }
    // },[props.searchInput])
  
    return(
      <>
      <tr style={{'display':`${display}`}}>
    
        <td>{props.member.name}</td>
        <td>{props.member.email} </td>
        <td>
          {actions}
        </td>
      </tr>
      </>
    )
  }

  export default DisplayMembersModal