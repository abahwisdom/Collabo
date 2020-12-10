import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { connect } from 'react-redux';

import {Switch, Route, useHistory} from 'react-router-dom';

import Navigation from './components/navbar';
import Home from './components/projects/open/home';
import Project from './components/projects/open/project';
import setCurrentContext from './components/context/setCurrent';
import { Container, Spinner } from 'react-bootstrap';
import Other from './components/projects/other/other';
import OtherProject from './components/projects/other/otherProject';

import { clearErrors } from './redux/actions/errorActions';
import setRefetchContext from './components/context/setRefetch';
import Ended from './components/projects/ended/ended';


function Protected({UID, isAuthenticated, clearErrors}) {

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
  const [refetch, setRefetch]=useState(0);
    useEffect(()=>{
      if (isAuthenticated===false){
        return history.push('/');
      }
      try {
        if (UID){
          axios.get(`/api/users/${UID.id||UID._id}`)
        .then((user)=>{
          setUser(user.data)
        })
  
        axios.get(`/api/projects/${UID.id||UID._id}`)
        .then((projects)=>{
            setProjects(projects.data)
        })

        axios.get(`/api/projects/${UID.id||UID._id}/other`)
        .then((projects)=>{
          setOtherProjects(projects.data)
        })
        
        axios.get(`/api/projects/${UID.id||UID._id}/closed`)
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
      

    },[UID, isAuthenticated, refetch])
    

    
    function handleRefetch(){
      setRefetch(refetch===0 ? 1: 0)
    }

    const [loading, setLoading]= useState(true);

    if (loading) {return(
      <Spinner animation="grow" variant="primary" className="align-middle spinner-app mt-auto" role="status"/>
    )}

    clearErrors();

  return (
    
    <>
      <setCurrentContext.Provider value={setCurrentProject}>
      <setRefetchContext.Provider value={handleRefetch}>
      <Navigation user={user}/>
      <Switch>
        <Route exact path='/home'>
          <Home
            projects={projects}
            user={user}
            setCurrent={setCurrentProject}
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

        <Route path='/home/ended-projects'>
          <Ended projects={closedProjects} user={user} />
        </Route>
       
      </Switch>
      <div className='footer'>Collabo (c)2020</div>
      </setRefetchContext.Provider>
      </setCurrentContext.Provider>
    </>
    
  );
}


const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  UID: state.auth.user
});

export default connect(mapStateToProps, {clearErrors})(Protected);


