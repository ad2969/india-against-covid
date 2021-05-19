import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import {
	Button,
	IconButton,
	Snackbar,
	TextField
} from "@material-ui/core";
import { Close as CloseIcon } from "@material-ui/icons";
import "./login.css";

import { loginAsAdmin } from "../../services/auth";
import { isEmail } from "../../utils";

function AdminLogin () {
	const history = useHistory();

	const [formTouched, setFormTouched] = useState("");
	const [email, setEmail] = useState("");
	const [emailValidated, setEmailValidated] = useState(true);
	const [password, setPassword] = useState("");

	const [error, setError] = useState(false);

	const handleEmailChange = (e) => {
		e.preventDefault();
		setEmail(e.target.value);
		// validate email
		const validated = isEmail(e.target.value);
		setEmailValidated(validated);
		if (!formTouched) setFormTouched(true);
	};
	const handlePasswordChange = (e) => {
		e.preventDefault();
		setPassword(e.target.value);
	};

	const handleLogin = async (e) => {
		try {
			e.preventDefault();
			await loginAsAdmin(email, password);
			history.push("/admin/home");
		} catch (err) {
			console.log("ERR", err);
			setError(err);
		}
	};

	const enableButton = formTouched && emailValidated;
	return (
		<div>
			<div className="admin-form-container">
				<form noValidate autoComplete="off" className="admin-form" onSubmit={handleLogin}>
					<TextField label="Email" defaultValue="" required
						onChange={handleEmailChange} error={!emailValidated} helperText={emailValidated ? null : "Not an e-mail address"} />
					<TextField type="password" label="Password" defaultValue="" required
						onChange={handlePasswordChange} />
					<Button variant="contained" color="primary" type="submit" disabled={!enableButton}>Login</Button>
				</form>
			</div>
			<Snackbar anchorOrigin={{ vertical: "bottom", horizontal: "right" }} open={error} autoHideDuration={6000}
				message="User not found!" onClose={() => setError(false)}
				action={ <IconButton size="small" aria-label="close" color="inherit" onClick={() => setError(false)}>
					<CloseIcon fontSize="small" /></IconButton>}
			/>
		</div>
	);
}

export default AdminLogin;
