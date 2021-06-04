import React from "react";
import { CircularProgress } from "@material-ui/core";
import "./index.mod.scss";

const Loading = () => {
	return (
		<div className="Loading">
			<CircularProgress />
		</div>
	);
};

export default Loading;
