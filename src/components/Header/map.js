import React, { useLayoutEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { AppBar, Menu, MenuItem } from "@material-ui/core";
import {
	ArrowRight as ArrowRightIcon,
	Close as CloseIcon,
	Menu as MenuIcon
} from "@material-ui/icons";
import { ReactComponent as Logo } from "../../assets/logo.svg";
import "./map.mod.scss";

const HEADER_BREAKPOINT = 576;

const MapHeader = ({ reloadPage }) => {
	const history = useHistory();

	const [deviceWidth, setDeviceWidth] = useState(window.innerWidth);
	const [narrowDropdownAnchor, setNarrowDropdownAnchor] = useState(null);
	const [wideDropdownOpen, setWideDropdownOpen] = useState(false);

	useLayoutEffect(() => {
		const updateSize = () => { setDeviceWidth(window.innerWidth); };
		window.addEventListener("resize", updateSize);
		return () => window.removeEventListener("resize", updateSize);
	}, []);

	const handleCloseNarrowDropdown = () => {
		setNarrowDropdownAnchor(null);
	};
	const handleClickNarrowDropdown = (e) => {
		const target = narrowDropdownAnchor ? null : e.currentTarget;
		setNarrowDropdownAnchor(target);
	};

	const handleOpenWideDropdown = () => {
		setWideDropdownOpen(true);
	};
	const handleCloseWideDropdown = () => {
		setWideDropdownOpen(false);
	};

	return (
		<AppBar position="static" className="map-header">
			<div className="header-logo">
				<Logo className="button button--scale" onClick={reloadPage} />
			</div>
			{deviceWidth >= HEADER_BREAKPOINT // check if wide/narrow
				? <div className={`header-wide-dropdown ${wideDropdownOpen && "wide-active"}`}>
					<div onClick={() => { history.push("/about"); }} className="header-button button button--scale">About</div>
					<div onClick={() => { history.push("/contact"); }} className="header-button button button--scale">Contact</div>
					{wideDropdownOpen
						? <CloseIcon className="header-close-button button button--scale" onClick={handleCloseWideDropdown}/>
						: <ArrowRightIcon className="header-expand-button button button--scale" onClick={handleOpenWideDropdown}/>}
				</div>
				: <div className="header-narrow-dropdown">
					<div
						className="header-narrow-dropdown-button"
						aria-controls="narrow-dropdown"
						aria-haspopup="true"
						onClick={handleClickNarrowDropdown}
					>
						<MenuIcon className="button header-button"/>
					</div>
					<Menu
						id="narrow-dropdown"
						className="header-narrow-dropdown"
						anchorEl={narrowDropdownAnchor}
						keepMounted
						open={Boolean(narrowDropdownAnchor)}
						onClose={handleCloseNarrowDropdown}
					>
						<MenuItem onClick={() => { history.push("/home"); }}>Map</MenuItem>
						<MenuItem onClick={() => { history.push("/about"); }}>About</MenuItem>
						<MenuItem onClick={() => { history.push("/contact"); }}>Contact</MenuItem>
					</Menu>
				</div>}
		</AppBar>
	);
};

export default MapHeader;
