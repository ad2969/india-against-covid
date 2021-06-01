import React from "react";
import { useHistory } from "react-router-dom";
import Header from "../../components/Header/common";
import { Button } from "@material-ui/core";

import "./index.mod.scss";

const Landing = () => {
	const history = useHistory();

	return (
		<div className="Page landing">
			<Header SCROLL_THRESHOLD={400} logoRedirect={false} />
			<div className="landing-background">
				<div className="landing-background-container">
					<h1 className="landing-title t--unselectable">
					Thank you for <span className="text-accent">joining India</span> in<br/>
					the fight against <span className="text-accent">COVID-19</span>
					</h1>
					<div className="landing-buttons">
						<Button variant="contained" className="to-about" onClick={() => history.push("/about")}>about the project</Button>
						<Button variant="contained" className="to-home" onClick={() => history.push("/home")}>browse charities</Button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Landing;
