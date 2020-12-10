import React, { useState } from 'react';
import MyForm from '../components/form';
import { Container } from 'react-bootstrap';


const ResetPassword=(props)=>{

    const [stillSubmitting, setSubmitting]= useState(false);

    function handleSubmit(data){
        setSubmitting(true);
        // console.log(data);
        setSubmitting(false);
    }

    return(
        <>
        <Container className='auth-container'>
            <h2 className='m-auto text-center nav-title'>Reset Password</h2>

            <MyForm 
                handleClickLabel='Reset Password' 
                handleSubmit={handleSubmit}
                email
                stillSubmitting={stillSubmitting}

            />
        </Container>

        </>
    )
}

export default ResetPassword