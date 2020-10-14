import React, {useState, useEffect, useContext} from 'react';
import {Button} from 'react-bootstrap'

import Axios from 'axios';
import setCurrentContext from '../context/setCurrent';


const DisplayMembers=(props)=>{

    const setCurrent= useContext(setCurrentContext);

    function deleteMember(){
        Axios.delete(`/api/projects/${props.currentProject._id}/member/${props.member.member_id}`)
        .then((res)=>{ 
         console.log(res);
         Axios.get(`/api/projects/${props.currentProject._id}/specific`)
         .then((project)=>{setCurrent(project.data)})
       })
    }
    
    const [display, setDisplay]= useState('table-row');
        
    useEffect(()=>{
        if (props.search===''){setDisplay('table-row')}
        else if (props.member.member_name.toLowerCase().includes(props.search.toLowerCase())===false&&
        props.member.member_email.includes(props.search.toLowerCase())===false){
          setDisplay('none')
        }else{setDisplay('table-row')}
    },[props.search, props.member.member_name])

    return(
        <>
            <tr style={{'display':`${display}`}}>
              {/* <td>{props.index + 1} </td> */}
              <td>{props.member.member_name}</td>
              <td>{props.member.member_email} </td>
              <td>
              <Button variant='outline-danger' size="sm" className='mx-auto' onClick={deleteMember} >Delete</Button>
              </td>
            </tr>
        </>
    )
}

export default DisplayMembers