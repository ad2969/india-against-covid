import React from "react";
import Header from "../../components/Header/common";

const Landing = () => {
	return (
		<div className="Page">
			<Header SCROLL_THRESHOLD={400} logoRedirect={false} />
			<div style={{ background: "black", height: "400px", width: "100%" }}></div>
		</div>
	);
};

export default Landing;
