import React from "react";
import { useHistory } from "react-router-dom";
import { ReactComponent as Logo } from "../../assets/logo.svg";
import {
	LocationCity as LocationCityIcon,
	Drafts as DraftsIcon,
	Phone as PhoneIcon
} from "@material-ui/icons";
import "./index.mod.scss";

import { scrollToTop } from "../../utils";

const Footer = () => {
	const history = useHistory();

	return (
		<div className="Footer">
			<Logo className="footer-logo" />
			<div className="footer-links">
				<div className="footer-text-link button button--scale"
					onClick={() => { history.push("/about"); scrollToTop(); }}>about us</div>
				<div className="footer-text-link button button--scale"
					onClick={() => { history.push("/contact"); scrollToTop(); }}>contact us</div>
				<div className="footer-text-link button button--scale"
					onClick={() => { history.push("/developers"); scrollToTop(); }}>developers</div>
			</div>
			<div className="footer-contacts">
				<div className="footer-text-link button button--scale" onClick={() => { window.open("https://www.google.com/maps/place/Vancouver,+BC", "_blank"); }}>
					<LocationCityIcon /><span>Vancouver, BC</span></div>
				<div className="footer-text-link button button--scale" onClick={() => { window.open("mailto:yes@example.com"); }}>
					<DraftsIcon /><span>yes@example.com</span></div>
				<div className="footer-text-link button button--scale" onClick={() => { window.open("tel:+900300400"); }}>
					<PhoneIcon /><span>+1 604 600 0101</span></div>
			</div>
		</div>
	);
};

export default Footer;
