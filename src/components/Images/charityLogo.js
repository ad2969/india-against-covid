import React from "react";
import { Avatar } from "@material-ui/core";

const CharityLogo = ({ size = "med", url, info }) => {
	let styleSize = { height: "3em", width: "3em" };
	if (size === "lg") styleSize = { height: "4em", width: "4em" };
	else if (size === "sm") styleSize = { height: "2em", width: "2em" };

	return (
		<Avatar
			variant="rounded"
			src={url || info.image_url}
			alt={info.name ? info.name + "-image" : info}
			style={styleSize}
		/>
	);
};

export default CharityLogo;
