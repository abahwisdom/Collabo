import React, { useEffect } from 'react';
import Protected from './Protected';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import SignIn from './components/auth/pages/sign-in';
import SignUp from './components/auth/pages/sign-up';
import ResetPassword from './components/auth/pages/reset-password';

import store from './redux/store';
import { loadUser } from './redux/actions/authActions.js';


const App=(props)=>{

    useEffect(() => {
        store.dispatch(loadUser());
      }, []);
    return(
        
        <>
            <Router>
                <Switch>
                    <Route path='/home'>
                        <Protected/>
                    </Route>
                    
                    <Route exact path='/'>
                        <SignIn/>
                    </Route>

                    <Route path='/sign-up'>
                        <SignUp/>
                    </Route>
                    
                    <Route path='/reset-password'>
                        <ResetPassword/>
                    </Route>
                </Switch>
        
            </Router>
        </>
        
        
    )
}



export default App