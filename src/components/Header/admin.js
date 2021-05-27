import React from "react";
import { useHistory } from "react-router-dom";
import {
	AppBar,
	Button,
	Toolbar
} from "@material-ui/core";
import "./admin.mod.scss";

import { logout } from "../../services/auth";

const AdminHeader = () => {
	const history = useHistory();

	const handleLogout = async () => {
		try {
			await logout();
		} catch (err) {
			console.log("Error during logout:", err);
		}
	};

	const redirectAdminHome = () => {
		if (history.location.pathname.includes("admin/home")) return null;
		else history.push("/admin/home");
	};

	return (
		<AppBar position="relative" className="admin-header">
			<Toolbar className="admin-header-toolbar">
				<div className="header-title">
					<Button onClick={redirectAdminHome} className="header-text">Welcome, Admin</Button>
					<Button onClick={() => { history.push("/"); }} className="header-button"><b>Landing Page</b></Button>
					<Button onClick={() => { history.push("/home"); }} className="header-button"><b>Charity Map</b></Button>
					<Button onClick={() => { history.push("/about"); }} className="header-button"><b>About Page</b></Button>
					<Button onClick={() => { history.push("/contact"); }} className="header-button"><b>Contact Page</b></Button>
					<Button onClick={() => { history.push("/developers"); }} className="header-button"><b>Developers</b></Button>
				</div>
				<Button color="inherit" onClick={handleLogout} className="header-logout"><b>Logout</b></Button>
			</Toolbar>
		</AppBar>
	);
};

export default AdminHeader;
