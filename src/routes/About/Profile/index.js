import React from "react";
import {
	Button,
	Card,
	CardActions,
	CardContent,
	CardMedia,
	Typography
} from "@material-ui/core";
import {
	GitHub as GitHubIcon,
	LinkedIn as LinkedInIcon
} from "@material-ui/icons";
import "./index.mod.scss";

const Profile = (props) => {
	const {
		name,
		title,
		image,
		linkedin,
		github
	} = props;

	return (
		<Card className="profile">
			<CardMedia
				className="profile-image"
				image={image}
				title={name}
			/>
			<CardContent>
				<Typography gutterBottom variant="h5" component="h2" align="center">
					{name}
				</Typography>
				<Typography variant="body2" color="textSecondary" component="p" align="center">
					{title}
				</Typography>
				<CardActions className="profile-actions">
					<Button variant="contained" size="small" href={linkedin}><LinkedInIcon /></Button>
					<Button variant="contained" size="small" href={github}><GitHubIcon /></Button>
				</CardActions>
			</CardContent>
		</Card>
	);
};

export default Profile;
