import React, { useEffect, useState, useRef } from "react";
import {
	GeoJSON,
	MapContainer,
	TileLayer
} from "react-leaflet";
import "./index.mod.scss";

const MAPBOX_USER = "onlinkers";
const MAPBOX_STYLE_ID = "ckowxflz50ozk17qvv8vq24q8";
const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN;

// https://leafletjs.com/examples/choropleth/
// https://leafletjs.com/examples/geojson/

const COLOR_PALETTE = {
	1000: "#800026",
	500: "#BD0026",
	200: "#E31A1C",
	100: "#FC4E2A",
	50: "#FD8D3C",
	20: "#FEB24C",
	10: "#FED976",
	default: "#FFEDA0",
	line: "#fff",
	lineHighlight: "#666"
};

const LOCK_STYLES = {
	color: COLOR_PALETTE.lineHighlight,
	fillOpacity: 0.7,
	weight: 5
};
const HIGHLIGHT_STYLES = {
	color: COLOR_PALETTE.lineHighlight,
	fillOpacity: 0.7
};

const DEFAULT_CENTER = [20.5, 80];
const DEFAULT_BOUNDS = [[40, 65], [5, 100]];

const LeafletMap = (props) => {
	const {
		setLoaded,
		data,
		selectedRegionKey,
		handleSelectMapRegion
	} = props;

	const mapRef = useRef();
	const geoJsonRef = useRef();
	const [selectedLayer, setSelectedLayer] = useState(null);

	useEffect(() => {
		console.log({ selectedRegionKey });
	}, []);

	const zoomToRegion = (bounds) => {
		mapRef.current.flyToBounds(bounds);
	};

	const handleMouseoverRegion = (e) => {
		const layer = e.sourceTarget;
		if (selectedLayer && layer.feature.properties.code === selectedLayer.feature.properties.code) return;

		// set the layer styles
		layer.setStyle(HIGHLIGHT_STYLES);
		layer.bringToFront();
	};

	const handleMouseoutRegion = (e) => {
		const layer = e.sourceTarget;
		if (selectedLayer && layer.feature.properties.code === selectedLayer.feature.properties.code) return;

		// reset the layer styles
		geoJsonRef.current.resetStyle(layer);
		layer.bringToBack();
	};

	const handleClickRegion = (e) => {
		const bounds = e.sourceTarget.getBounds();
		const layer = e.sourceTarget;

		// reset other layer styles, if any
		if (selectedLayer) geoJsonRef.current.resetStyle(selectedLayer);

		if (selectedLayer && layer.feature.properties.code === selectedLayer.feature.properties.code) {
			setSelectedLayer(null);
			geoJsonRef.current.resetStyle(layer);
			zoomToRegion(DEFAULT_BOUNDS);
			handleSelectMapRegion(null);
			return;
		}

		// highlight this layer
		setSelectedLayer(layer);
		layer.setStyle(LOCK_STYLES);

		// zoom to region
		zoomToRegion(bounds);
		handleSelectMapRegion(layer.feature.properties.code);
	};

	return (
		<MapContainer
			className="LeafletMap"
			center={DEFAULT_CENTER}
			maxBounds={DEFAULT_BOUNDS}
			minZoom={5}
			zoom={6}
			preferCanvas={true}
			scrollWheelZoom={true}
			whenCreated={(mapInstance) => {
				mapRef.current = mapInstance;
				setLoaded(true);
			}}
		>
			<TileLayer
				url={`https://api.mapbox.com/styles/v1/${MAPBOX_USER}/${MAPBOX_STYLE_ID}/tiles/256/{z}/{x}/{y}?access_token=${MAPBOX_TOKEN}`}
				attribution="Map data &copy; <a href=&quot;https://www.openstreetmap.org/&quot;>OpenStreetMap</a> contributors, <a href=&quot;https://creativecommons.org/licenses/by-sa/2.0/&quot;>CC-BY-SA</a>, Imagery &copy; <a href=&quot;https://www.mapbox.com/&quot;>Mapbox</a>"
			/>
			<GeoJSON
				ref={geoJsonRef}
				data={data}
				attribution="&copy; credits due..."
				eventHandlers={{
					mouseover: handleMouseoverRegion,
					mouseout: handleMouseoutRegion,
					click: handleClickRegion
				}}
				style={{
					fillColor: COLOR_PALETTE.default,
					color: COLOR_PALETTE.line
				}}
			/>
		</MapContainer>
	);
};

export default LeafletMap;
