import React from "react";
import Header from "../../components/Header/common";
import Footer from "../../components/Footer";
import { Button } from "@material-ui/core";
import "./index.mod.scss";

const Contact = () => {
	return (
		<div className="Page Contact">
			<Header SCROLL_THRESHOLD={400} logoRedirect={true} shrink />
			<div className="contact-background">
				<div className="contact-head-container">
					<h1 className="contact-title">Send us your feedback!</h1>
					<div className="contact-description">Any feedback about the platform, additional features, or any general inquiries are welcome!</div>
				</div>
			</div>

			<div className="contact-body">
				<iframe src="https://docs.google.com/forms/d/e/1FAIpQLSfrh6FstBQ9kL9YytJcsYiQcERkUKhMuO1Uh2aNbQKxcW0ghg/viewform?embedded=true"
					width="640" height="1000" frameBorder="0" marginHeight="0" marginWidth="0" className="contact-form">Loading…</iframe>
			</div>
			<div className="contact-request">
				<div>If you are a charity, and wish to be featured on our site, </div>
				<Button
					variant="contained"
					className="contact-request-button"
					href="https://docs.google.com/forms/d/e/1FAIpQLSeVZoLZQI5WD2L1plHtiyXwNR8JXRSs_GYfMq4ZAlAfVoLxNA/viewform?usp=sf_link"
				>send a request</Button>
			</div>
			<Footer />
		</div>
	);
};

export default Contact;
