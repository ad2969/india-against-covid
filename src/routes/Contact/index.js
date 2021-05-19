import React from "react";
import Header from "../../components/Header/common";
import Footer from "../../components/Footer";

const Contact = () => {
	return (
		<div>
			<Header SCROLL_THRESHOLD={400} logoRedirect={true} />
			<div style={{ background: "black", height: "400px", width: "100%" }}></div>
			<div style={{ background: "white", height: "100vh", width: "100%" }}>CONTACT</div>
			<div style={{ background: "lightgrey", height: "400px", width: "100%" }}></div>
			<Footer />
		</div>
	);
};

export default Contact;
