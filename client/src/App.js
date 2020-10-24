import React, { useEffect, Suspense } from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import store from './redux/store';
import { loadUser } from './redux/actions/authActions.js';

// import Protected from './Protected';
// import SignIn from './components/auth/pages/sign-in';
import SignUp from './components/auth/pages/sign-up';
// import ResetPassword from './components/auth/pages/reset-password'

const Protected= React.lazy(() => import('./Protected'));
const SignIn= React.lazy(() => import('./components/auth/pages/sign-in'));
// const SignUp= React.lazy(() => import('./components/auth/pages/sign-up'));
const ResetPassword= React.lazy(() => import('./components/auth/pages/reset-password'));




const App=(props)=>{

    useEffect(() => {
        store.dispatch(loadUser());
      }, []);
    return(
        
        <>
            <Router>
                <Suspense fallback= {null}>
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
                </Suspense>
        
            </Router>
        </>
        
        
    )
}



export default App