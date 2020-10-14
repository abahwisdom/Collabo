import React, {useEffect, useState, useLayoutEffect} from 'react';
import axios from 'axios';
import { register } from './redux/actions/authActions';
import { connect } from 'react-redux';

import {Switch, Route, useHistory} from 'react-router-dom';

import Navigation from './components/navbar';
import Home from './components/home';
import Project from './components/project';
import setCurrentContext from './components/context/setCurrent';
import { Container, Spinner } from 'react-bootstrap';
import Other from './components/other';
import OtherProject from './components/otherProject';



function Protected({UID, isAuthenticated}) {

  const history= useHistory();

  const [user, setUser]= useState({});
  const [projects, setProjects]= useState([0]);
  const [closedProjects, setClosedProjects]= useState([]);
  const [otherProjects, setOtherProjects]= useState([]);
  const [currentOther, setOther]=useState(JSON.parse(localStorage.getItem("currentOther"))?JSON.parse(localStorage.getItem("currentOther")):[]);

  function setCurrentOther(project){
    setOther(project);
    localStorage.setItem("currentOther", JSON.stringify(project));
  }


  const [currentProject, setCurrent]= useState(JSON.parse(localStorage.getItem("currentProject"))?JSON.parse(localStorage.getItem("currentProject")):[]);
  function setCurrentProject(project){
    setCurrent(project);
    localStorage.setItem("currentProject", JSON.stringify(project));
  }
  // setUID(tempId);
    useEffect(()=>{
      if (isAuthenticated===false){
        return window.location.href='/'
      }
      try {
        if (UID._id){
          axios.get(`/api/users/${UID._id}`)
        .then((user)=>{
          setUser(user.data)
        })
  
        axios.get(`/api/projects/${UID._id}`)
        .then((projects)=>{
            setProjects(projects.data)
        })
        // .then(()=>{
        //   setLoading(false)
        // })
        // axios.get(`/api/projects`)
        // .then((projects)=>{
        //   const list=[];
        //   if (!projects) return;
        //     projects.data.map(project=>{
        //     const found= project.members.find((member)=>{return member.member_id==UID._id});
        //     if (found) list.push(project);
        //     console.log(list);
        // });
        //   setOtherProjects(list)
        // })

        axios.get(`/api/projects/${UID._id}/other`)
        .then((projects)=>{
          setOtherProjects(projects.data)
        })
        
        axios.get(`/api/projects/${UID._id}/closed`)
        .then((closedProjects)=>{
          setClosedProjects(closedProjects.data)
        })
        .then(()=>{
          setLoading(false)
        })
        }
        
      } catch (error) {
        console.log(error)
      }
      

    },[UID, isAuthenticated])
    
  

    const [loading, setLoading]= useState(true);

    if (loading) {return(
      <Container className='text-center' ><Spinner animation="border" variant="primary" className="align-middle spinner-app" role="status"/></Container>
    )}

  return (
    
    <>
      <Navigation closedProjects={closedProjects} />
      <setCurrentContext.Provider value={setCurrentProject}>
      <Switch>
        <Route exact path='/home'>
          <Home
            projects={projects}
            user={user}
            setCurrent={setCurrentProject}
            // props.user.id={props.user.id
          />
        </Route>
        <Route path='/home/project'>
          <Project currentProject={currentProject} user={user}/>
        </Route>

        <Route path='/home/member-projects'>
          <Other
            projects={otherProjects}
            user={user}
            setCurrent={setCurrentOther}
            // props.user.id={props.user.i
          />
        </Route>

        <Route path='/home/member-project'>
          <OtherProject currentProject={currentOther} user={user} setOther={setOther}/>
        </Route>
       
      </Switch>
      </setCurrentContext.Provider>
    </>
    
  );
}


const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  UID: state.auth.user
});

export default connect(mapStateToProps, { register})(Protected);


