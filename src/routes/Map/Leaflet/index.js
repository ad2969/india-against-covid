import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "./index.mod.scss";

const MAPBOX_USER = "onlinkers";
const MAPBOX_STYLE_ID = "ckowxflz50ozk17qvv8vq24q8";
const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN;

const LeafletMap = () => {
	return (
		<MapContainer
			className="LeafletMap"
			center={[20.5, 80]}
			zoom={6}
			scrollWheelZoom={true}
		>
			<TileLayer
				url={`https://api.mapbox.com/styles/v1/${MAPBOX_USER}/${MAPBOX_STYLE_ID}/tiles/256/{z}/{x}/{y}?access_token=${MAPBOX_TOKEN}`}
				attribution="Map data &copy; <a href=&quot;https://www.openstreetmap.org/&quot;>OpenStreetMap</a> contributors, <a href=&quot;https://creativecommons.org/licenses/by-sa/2.0/&quot;>CC-BY-SA</a>, Imagery &copy; <a href=&quot;https://www.mapbox.com/&quot;>Mapbox</a>"
			/>
			<Marker position={[51.505, -0.09]}>
				<Popup>
                    A pretty CSS3 popup. <br /> Easily customizable.
				</Popup>
			</Marker>
		</MapContainer>
	);
};

export default LeafletMap;
