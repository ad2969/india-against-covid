import React from "react"
import { Route } from "react-router-dom"
import Forbidden from "./Forbidden"

import { isAuthenticated } from '../services/auth'

// Route Wrapper that checks first if the user has been authenticated
const AuthRoute = ({ component, redirect, ...rest }) => {

  const loggedIn = isAuthenticated()
  console.log({loggedIn})
 
  return (
    <Route {...rest} component={loggedIn ? component : Forbidden} />
  );
};
  
export default AuthRoute;