import React, { useState, useEffect } from 'react';
import MyForm from '../components/form';
import { Container, Alert } from 'react-bootstrap';

import { connect } from 'react-redux';
import { register } from '../../../redux/actions/authActions';
import { clearErrors } from '../../../redux/actions/errorActions';
import { useHistory } from 'react-router-dom';


const SignUp=({
    isAuthenticated,
    error,
    register,
    clearErrors
  })=>{

    const history= useHistory();
    const [stillSubmitting, setSubmitting]= useState(false);
    const [msg, setMsg] = useState(null);

    function handleSubmit({name, email, password}){
        setSubmitting(true);
        // console.log({name, email, password});
         // Create user object
            const user = {
                name,
                email,
                password
            };

            async function log (){
              await register(user);;
            }

            // Attempt to login
            log().then((res)=>{
              setSubmitting(false);
            })
        
    }

    useEffect(() => {
        // Check for register error
        if (error.id === 'REGISTER_FAIL') {
          setMsg(error.msg.msg);
          setSubmitting(false)
        } else {
          setMsg(null);
        }
    
        // If authenticated
          if (isAuthenticated) {
            history.push('/home')
          }
    
      }, [error, isAuthenticated]);
      
    return(
        <>
        <Container className='mb-2'>
        <h2 className='m-auto text-center playfair nav-title'>Collabo</h2>
        </Container>
        <Container className='auth-container'>
            {msg ? <Alert className='text-center' variant="danger">{msg}</Alert> : null}
            {/* <h2 className='m-auto text-center playfair'>Sign Up</h2> */}
            <MyForm 
                handleClickLabel='Sign Up' 
                handleSubmit={handleSubmit}
                name
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
  
export default connect(mapStateToProps, { register, clearErrors })(SignUp);

