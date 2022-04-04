import React, { useEffect, useState } from "react";
import { Route, BrowserRouter, Switch } from "react-router-dom";
import AuthRoute from "./AuthRoute";
import AdminHeader from "../components/Header/admin";

// import pages
import NotFound from "./NotFound";
import Landing from "./Landing";
import Map from "./Map";
import About from "./About";
import Contact from "./Contact";
import Developers from "./Developers";
import AdminHome from "./Admin";
import AdminLogin from "./Admin/login";

import { FIREBASE_ERROR, auth } from "../services/firebase";

function Routes () {
	const [isAdmin, setIsAdmin] = useState(false);
	const [isAdminChecked, setIsAdminChecked] = useState(false);

	useEffect(() => {
		if (FIREBASE_ERROR) return;

		auth.onAuthStateChanged((user) => {
			console.debug("User state changed!", String(Boolean(user)));
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
				<Route exact path="/home" component={Map} isAdmin />
				<Route exact path="/about" component={About} />
				<Route exact path="/contact" component={Contact} />
				<Route exact path="/developers" component={Developers} />
				<Route exact path="/" component={Landing} />
				<Route path="*" component={NotFound} />
			</Switch>
		</BrowserRouter>
	);
}

export default Routes;
