import React from "react";
import { CircularProgress } from "@material-ui/core";
import "./index.mod.scss";

const Loading = ({ icon = false }) => {
	return (
		<div className={!icon ? "Loading" : ""}>
			<CircularProgress />
		</div>
	);
};

export default Loading;
