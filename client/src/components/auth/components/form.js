import React from 'react';
import {Link} from 'react-router-dom';
import { useForm } from 'react-hook-form';
import isEmail from 'validator/lib/isEmail';
import MyButton from './button';
import { Form } from 'react-bootstrap';

const MyForm=(props)=>{

    const { register, handleSubmit, errors, formState } = useForm({
        mode: "onTouched",
    });

    const errorStyle={
        color: '#495057',
        'backgroundColor': '#fff',
        'borderColor': '#dc3545',
        outline: 0,
        'boxShadow': '0 0 0 0.2rem rgb(223 53 120 / 37%)',
    
    }

    return(
        <>

            <Form onSubmit={handleSubmit(props.handleSubmit)} >
                {props.name && 
                <Form.Group controlId="name">
                    <Form.Label>Name</Form.Label>
                    <Form.Control 
                        name="name"
                        type="text"
                        // required
                        ref={register({
                            required: {value: true, message: '*Please enter your name'},
                            minLength: {value: 3, message: '*Name must be at least 3 letters'},
                            maxLength: {value: 25, message: '*Name cannot be more than 25 letters'},
                          })}
                        style= {errors.name? errorStyle:null }
                    />
                    {errors.name && (
                  <div className="error text-danger">{errors.name.message}</div>
                )}
                </Form.Group>}
                
                {props.email &&
                <Form.Group controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        name='email'
                        type="email"
                        // required
                        ref={register({
                            required: {value: true, message: '*Please enter a valid email'},
                            validate: (input) => isEmail(input)
                          })}
                        style= {errors.email? errorStyle:null }
                    
                    />
                    {errors.email && (
                      <div className="error text-danger">*Please enter a valid email</div>
                    )}
                </Form.Group>}

                {props.password &&
                <Form.Group controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        name='password'
                        type="password"
                        // required
                        ref={register({
                            required: {value: true, message: '*Password is required'},
                            minLength: {value: 6, message: '*Password must be at least 6 letters'},
                          })}
                        style= {errors.name? errorStyle:null }
                    
                    />
                    {errors.password && (
                      <div className="error text-danger">{errors.password.message}</div>
                    )}
                </Form.Group>}

                <MyButton
                label={props.handleClickLabel} 
                // handleClick={props.handleClick} 
                stillSubmitting={props.stillSubmitting}
                disabled={formState.isSubmitting||props.stillSubmitting}
                type='submit'
                className='or'
                />

                {props.handleClickLabel!=='Sign In'&& <>
                <div >Already have an account?</div>
                <Link to='/'>Sign In</Link>
                {/* <hr className="hr-text" data-content="OR"/> */}
                </>
                }
                {props.handleClickLabel!=='Sign Up'&& 
                <>
                <div>Dont have an account?</div>
                <Link to='/sign-up'>Sign Up</Link>
                <hr class="hr-text" data-content=""/>
                </>
                }
                {/* {props.handleClickLabel!=='Reset Password'&& 
                <>
                <div >Forgotten Password?</div>
                <Link to='/reset-password'>Reset Password</Link>
                </>} */}
            </Form>

        </>
    )
}

export default MyForm