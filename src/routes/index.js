import React from "react";
import {
	Route,
	BrowserRouter,
	Switch
} from "react-router-dom";
import AuthRoute from "./AuthRoute";

// import pages
import NotFound from "./NotFound";
import Landing from "./Landing";
import Home from "./Home";
import AdminHome from "./Admin";
import AdminLogin from "./Admin/login";

function Routes () {
	return (
		<BrowserRouter>
			<Switch>
				{/* AUTHENTICATED ROUTES */}
				<AuthRoute exact path="/admin/home" component={AdminHome} />

				{/* PUBLIC ROUTES */}
				<Route exact path="/admin" component={AdminLogin} redirect />
				<Route exact path="/home" component={Home} />
				<Route exact path="/" component={Landing} />
				<Route path="*" component={NotFound} />
			</Switch>
		</BrowserRouter>
	);
}

export default Routes;
