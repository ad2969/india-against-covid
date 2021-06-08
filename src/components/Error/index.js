import React from "react";
import { Warning as WarningIcon } from "@material-ui/icons";
import "./index.mod.scss";

const Error = ({ message }) => {
	return (
		<div className="Error">
			<WarningIcon fontSize="large" />
			<h3>{(message && message.toUpperCase()) || "SORRY! AN ERROR HAS OCCURED."}</h3>
		</div>
	);
};

export default Error;
