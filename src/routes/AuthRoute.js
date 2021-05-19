import React from "react";
import { Route } from "react-router-dom";
import Forbidden from "./Forbidden";

// Route Wrapper that checks first if the user has been authenticated
const AuthRoute = ({ component, isAuthenticated, isLoaded, ...rest }) =>
	isLoaded
		? (
			<Route {...rest} component={isAuthenticated ? component : Forbidden} />
		)
		: <></>;

export default AuthRoute;
