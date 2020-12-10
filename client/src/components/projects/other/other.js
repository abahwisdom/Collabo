import React, {useState} from 'react';
import {Container, InputGroup, FormControl, Jumbotron} from 'react-bootstrap'
import DisplayOtherProjects from './displayOther'

const Other=(props)=>{

    const [search, setSearch]= useState('');

    return(
        <>
        <Container>
        {/* <Button className="side-text" size='sm' onClick={handleShowNew}>Create New Project</Button> */}
        <h4 className='playfair' >Others' Projects</h4>
        <InputGroup className="mb-3">
          <InputGroup.Prepend>
            <InputGroup.Text id="inputGroup-sizing-default">Search</InputGroup.Text>
          </InputGroup.Prepend>
          <FormControl
            aria-label="Default"
            aria-describedby="inputGroup-sizing-default"
            onChange={(e)=>setSearch(e.target.value)}
          />
        </InputGroup>
      </Container>
    
      
      {props.projects.length>0 ?
      props.projects.map((project=>{
      return(
      <React.Fragment>
        <DisplayOtherProjects project={project} setCurrent={props.setCurrent} search={search}/>
      </React.Fragment>
      )})) : <Jumbotron fluid className='mt-4'>
      <Container>
      <h1>You are not part of any other project</h1>
      </Container>
      </Jumbotron>
      }

        
        </>
    )
}







export default Other
