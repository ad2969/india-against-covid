import React from "react";
import Header from "../../components/Header/common";

const About = () => {
	return (
		<div>
			<Header SCROLL_THRESHOLD={400} logoRedirect={true} />
			<div style={{ background: "black", height: "400px", width: "100%" }}></div>
			<div style={{ background: "white", height: "100vh", width: "100%" }}>ABOUT</div>
			<div style={{ background: "black", height: "400px", width: "100%" }}></div>
		</div>
	);
};

export default About;
