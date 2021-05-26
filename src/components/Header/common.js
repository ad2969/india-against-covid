import React, { useLayoutEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { AppBar, Menu, MenuItem } from "@material-ui/core";
import { Menu as MenuIcon } from "@material-ui/icons";
import { ReactComponent as Logo } from "../../assets/logo.svg";
import "./common.mod.scss";

import { scrollToTop } from "../../utils";

const Header = ({ SCROLL_THRESHOLD = 400, logoRedirect = true }) => {
	const history = useHistory();

	const [dropdownAnchor, setDropdownAnchor] = useState(null);
	const [passedScrollThreshold, setPassedScrollThreshold] = useState(false);

	useLayoutEffect(() => {
		const updateScroll = () => {
			if (window.scrollY >= SCROLL_THRESHOLD) setPassedScrollThreshold(true);
			else setPassedScrollThreshold(false);
		};
		window.addEventListener("scroll", updateScroll);
		return () => window.removeEventListener("scroll", updateScroll);
	}, [SCROLL_THRESHOLD]);

	const handleCloseDropdown = () => {
		setDropdownAnchor(null);
	};
	const handleClickDropdown = (e) => {
		const target = dropdownAnchor ? null : e.currentTarget;
		setDropdownAnchor(target);
	};

	const handleLogoClick = () => {
		if (logoRedirect) history.push("/home");
		else scrollToTop();
	};

	return (
		<React.Fragment>
			<AppBar position="static" className="common-header">
				<div className="header-logo">
					<Logo className="button button--scale" onClick={handleLogoClick} />
				</div>
				<div className="header-dropdown">
					<div
						className="header-dropdown-button"
						aria-controls="dropdown"
						aria-haspopup="true"
						onClick={handleClickDropdown}
					>
						<MenuIcon className="button header-button"/>
					</div>
					<Menu
						id="dropdown"
						className="header-dropdown"
						anchorEl={dropdownAnchor}
						keepMounted
						open={Boolean(dropdownAnchor)}
						onClose={handleCloseDropdown}
					>
						<MenuItem onClick={() => { history.push("/about"); }}>About</MenuItem>
						<MenuItem onClick={() => { history.push("/contact"); }}>Contact</MenuItem>
					</Menu>
				</div>
			</AppBar>
			<AppBar position="static" className={`common-header-dark ${passedScrollThreshold && "active"}`}>
				<div className="header-logo">
					<Logo className="button button--scale" onClick={() => { history.push("/home"); }} />
				</div>
				<div className="header-dropdown">
					<div
						className="header-dropdown-button"
						aria-controls="dropdown"
						aria-haspopup="true"
						onClick={handleClickDropdown}
					>
						<MenuIcon className="button header-button"/>
					</div>
					<Menu
						id="dropdown"
						className="header-dropdown-dark"
						anchorEl={dropdownAnchor}
						keepMounted
						open={Boolean(dropdownAnchor)}
						onClose={handleCloseDropdown}
					>
						<MenuItem onClick={() => { history.push("/home"); }}>Map</MenuItem>
						<MenuItem onClick={() => { history.push("/about"); }}>About</MenuItem>
						<MenuItem onClick={() => { history.push("/contact"); }}>Contact</MenuItem>
					</Menu>
				</div>
			</AppBar>
		</React.Fragment>
	);
};

export default Header;
