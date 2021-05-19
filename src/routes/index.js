import React, { useEffect, useState } from "react";
import { Route, BrowserRouter, Switch } from "react-router-dom";
import AuthRoute from "./AuthRoute";
import AdminHeader from "../components/Header/admin";

// import pages
import NotFound from "./NotFound";
import Landing from "./Landing";
import Home from "./Home";
import AdminHome from "./Admin";
import AdminLogin from "./Admin/login";

import { auth } from "../services/firebase";

function Routes () {
	const [isAdmin, setIsAdmin] = useState(false);
	const [isAdminChecked, setIsAdminChecked] = useState(false);

	useEffect(() => {
		auth.onAuthStateChanged((user) => {
			console.log("User state changed!", String(Boolean(user)));
			if (!isAdminChecked) setIsAdminChecked(true);
			setIsAdmin(!!user);
		});
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	return (
		<BrowserRouter>
			{isAdmin && <AdminHeader />}
			<Switch>
				{/* AUTHENTICATED ROUTES */}
				<AuthRoute exact path="/admin/home" component={AdminHome} isAuthenticated={isAdmin} isLoaded={isAdminChecked} />

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
