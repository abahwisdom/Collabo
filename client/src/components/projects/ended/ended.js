import React, {useState} from 'react';
import {Container, InputGroup, FormControl, Jumbotron} from 'react-bootstrap'
import DisplayEnded from './displayEnded'

const Ended=(props)=>{

    const [search, setSearch]= useState('');

    return(
        <>
        <Container className="mt-4 pt-3">
        {/* <Button className="side-text" size='sm' onClick={handleShowNew}>Create New Project</Button> */}
        <h4 className='playfair' >Ended Projects</h4>
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
    
      <div className='flex-card' >
      {props.projects.length>0 ?
      props.projects.map((project=>{
      return(
      <React.Fragment>
        <DisplayEnded project={project} search={search}/>
      </React.Fragment>
      )})) : <Jumbotron fluid className='mt-4'>
      <Container>
      <h1>You Have No Ended Projects</h1>
      </Container>
      </Jumbotron>
      }
      </div>

        
        </>
    )
}







export default Ended
