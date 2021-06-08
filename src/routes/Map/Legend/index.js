import React, { useState } from "react";
import {
	Collapse,
	Divider,
	List,
	ListItem,
	ListItemIcon,
	ListItemText
} from "@material-ui/core";

import {
	Brightness1 as BrightnessIcon,
	ExpandLess as ExpandLessIcon,
	ExpandMore as ExpandMoreIcon
} from "@material-ui/icons";

import "./index.mod.scss";

const Legend = ({ getColor }) => {
	const [open, setOpen] = useState(false);

	const handleClick = () => {
		setOpen(!open);
	};

	return (
		<List className="map-legend" component="div">
			<ListItem button onClick={handleClick}>
				<ListItemText primary={<b>Map Color Legend</b>} />
				{open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
			</ListItem>
			<Collapse in={open} timeout="auto" unmountOnExit>
				<List component="div" disablePadding>
					<ListItem>
						<ListItemIcon><BrightnessIcon style={{ color: getColor(1.01) }} /></ListItemIcon>
						<ListItemText primary="Extremely high rate, over 1%" />
					</ListItem>
					<ListItem>
						<ListItemIcon><BrightnessIcon style={{ color: getColor(0.31) }} /></ListItemIcon>
						<ListItemText primary="High rate, over 0.3%" />
					</ListItem>
					<ListItem>
						<ListItemIcon><BrightnessIcon style={{ color: getColor(0.11) }} /></ListItemIcon>
						<ListItemText primary="Average rate, about 0.2%" />
					</ListItem>
					<ListItem>
						<ListItemIcon><BrightnessIcon style={{ color: getColor(0.09) }} /></ListItemIcon>
						<ListItemText primary="Low rate, below 0.1%" />
					</ListItem>
					<br/><Divider />
					<ListItem>
						<ListItemText secondary="The percentage index used are calculated by comparing the number of active cases versus the region&apos;s estimated population" />
					</ListItem>
				</List>
			</Collapse>
		</List>
	);
};

export default Legend;
