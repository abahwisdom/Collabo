import React from 'react';
import {Button, Spinner} from 'react-bootstrap';

const MyButton=(props)=>{
    return(
       <>
    
    <Button
    className={props.className}
    variant={props.variant}
    type={props.type}
    onClick={props.handleClick}
    disabled={props.disabled}
    size={props.size}
    >
        {props.stillSubmitting && <Spinner animation="border" className="align-middle spinner-button" role="status"/>}
        {props.label}
    </Button>

    </> 
    )
    
}

MyButton.defaultProps={
    variant: 'primary',
    label: 'No Label',
    stillSubmitting: false,
    // handleClick:(e)=>{e.preventDefault()},
    disabled: false,
    type: 'button',
    size: ''
}

export default MyButton