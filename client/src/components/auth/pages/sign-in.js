import React, { useState, useEffect } from 'react';
import MyForm from '../components/form';
import { Container, Alert, Spinner } from 'react-bootstrap';

import { connect } from 'react-redux';
import { login } from '../../../redux/actions/authActions';
import { clearErrors } from '../../../redux/actions/errorActions';
import { useHistory } from 'react-router-dom';


const SignIn=({
    isAuthenticated,
    error,
    login,
    clearErrors
  })=>{

    const history= useHistory();
    const [stillSubmitting, setSubmitting]= useState(false);
    const [msg, setMsg] = useState(null);

    function handleSubmit({email, password}){
        setSubmitting(true);
        console.log({email, password});
         // Create user object
            const user = {
                email,
                password
            };
        
            // Attempt to login
            login(user);
    }

    useEffect(() => {
        // Check for register error
        if (error.id === 'LOGIN_FAIL') {
          setMsg(error.msg.msg);
          setSubmitting(false);
          setLoading(false)
        } else {
          setMsg(null);
        }

        if(error.status===401||error.msg.msg){
          setLoading(false)
        }

        
    
        // If authenticated
          if (isAuthenticated) {
            clearErrors();
            // history.push('/home')
            window.location.href='/home'
          }
    
        //   if (!isAuthenticated){
        //     setLoading(false)
        // };
      }, [error, isAuthenticated]);

    const [loading, setLoading]= useState(true);

    if (loading) {return(
      <Container className='text-center' ><Spinner animation="border" variant="primary" className="align-middle spinner-app" role="status"/></Container>
    )}

    return(
        <>
        <Container className='mb-2'>
        <h2 className='m-auto text-center playfair'>Collabo</h2>
        </Container>
        <Container className='auth-container'>
        {msg ? <Alert className='text-center' variant="danger">{msg}</Alert> : null}
            {/* <h4 className='m-auto text-center playfair'>Sign In</h4> */}

            <MyForm 
                handleClickLabel='Sign In' 
                handleSubmit={handleSubmit}
                email
                password
                stillSubmitting={stillSubmitting}

            />
        </Container>

        </>
    )
}


const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated,
    error: state.error
});
  
export default connect(mapStateToProps, { login, clearErrors })(SignIn);


