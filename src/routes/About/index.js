import React from "react";
import Header from "../../components/Header/common";
import Footer from "../../components/Footer";
import Profile from "./Profile";
import "./index.mod.scss";

import TeamCA from "../../assets/team-ca.png";

const LinedHeading = ({ children, background = "#fff" }) => {
	return <React.Fragment>
		<h2 className="line-heading"
			style={{
				borderBottom: "1px solid #000",
				textAlign: "left",
				lineHeight: "0.1em"
			}}>
			<span style={{ background, paddingRight: "0.5em" }}>{children}</span>
		</h2>
		<br/>
	</React.Fragment>;
};

const About = () => {
	return (
		<div className="Page About">
			<Header SCROLL_THRESHOLD={400} logoRedirect={true} shrink />
			<div className="about-background">
				<div className="about-head-container">
					<div className="about-slogan t--unselectable">JOIN THE FIGHT.</div>
					<div className="about-purpose">
						<h1>Our Purpose</h1>
						<div>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque non tristique lacus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse a ornare metus. Vivamus ac risus at eros rutrum tempor. Donec ultricies eros vel sit... </div>
					</div>
				</div>
			</div>

			<div className="about-body">
				<br />

				<div className="about-purpose-mobile">
					<h1>Our Purpose</h1>
					<div>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque non tristique lacus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse a ornare metus. Vivamus ac risus at eros rutrum tempor. Donec ultricies eros vel sit... </div>
				</div>

				<br /><br />

				<LinedHeading>The Team</LinedHeading>

				<div className="about-team">
					<Profile
						name="Siddharth Gurla"
						title="Engineering Student"
						image="https://i.picsum.photos/id/590/200/300.jpg?hmac=rMKCd22eXuQjtVujiifOrJzm-dBuhO8blicB93xN4y4"
						linkedin="https://ca.linkedin.com/in/gurla"
						github="https://github.com/SidGurla15"
					/>

					<Profile
						name="Clarence Adrian"
						title="Junior Fullstack Developer, Electrical Engineering Student"
						image={TeamCA}
						linkedin="https://www.linkedin.com/in/clarence-adrian/"
						github="https://github.com/ad2969"
					/>
				</div>

				<br /><br />

			</div>
			<Footer />
		</div>
	);
};

export default About;
