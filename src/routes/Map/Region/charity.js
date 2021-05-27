import React from "react";
import {
	Avatar,
	Card,
	CardHeader,
	IconButton,
	Tooltip
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { CallMade as CallMadeIcon } from "@material-ui/icons";
import "./index.mod.scss";

const HtmlTooltip = withStyles((theme) => ({
	tooltip: {
		backgroundColor: "#f5f5f9",
		color: "rgba(0, 0, 0, 0.87)",
		width: 300,
		maxWidth: "100%",
		fontSize: theme.typography.pxToRem(12),
		border: "1px solid #dadde9",
	},
}))(Tooltip);

const limitDescription = (description) => {
	if (description.length > 100) {
		return <HtmlTooltip
			title={<div className="charity-description--tooltip">{description}</div>}
			PopperProps={{ disablePortal: true }}
			placement="left"
		>
			<div className="charity-description">{description}</div>
		</HtmlTooltip>;
	} else return <div className="charity-description">{description}</div>;
};

const CharityCard = (props) => {
	const {
		title,
		description,
		link,
		image = "/broken-link"
	} = props;

	return (
		<Card className="charity-card">
			<CardHeader
				avatar={<Avatar variant="square" className="charity-card-image" alt={title} src={image}/>}
				action={
					<IconButton aria-label="settings" href={link} target="_blank" >
						<CallMadeIcon/>
					</IconButton>
				}
				title={<h4 className="charity-title">{title}</h4>}
				subheader={limitDescription(description)}
			/>
		</Card>
	);
};

export default CharityCard;
