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
	vvred: "#800026",
	vred: "#BD0026",
	red: "#E31A1C",
	orgred: "#FC4E2A",
	org: "#FD8D3C",
	orgyel: "#FEB24C",
	yel: "#FED976",
	default: "#FFEDA0",
	line: "#fff",
	lineHighlight: "#666"
};

const DEFAULT_STYLES = {
	color: COLOR_PALETTE.line,
	fillOpacity: 0.3,
	weight: 2
};
const LOCK_STYLES = {
	color: COLOR_PALETTE.lineHighlight,
	fillOpacity: 0.7,
	weight: 5
};
const HIGHLIGHT_STYLES = {
	color: COLOR_PALETTE.lineHighlight,
	fillOpacity: 0.7,
	weight: 2
};

const DEFAULT_CENTER = [20.5, 80];
const DEFAULT_BOUNDS = [[40, 60], [5, 105]];

const LeafletMap = (props) => {
	const {
		loaded,
		setLoaded,
		data,
		selectedRegionKey,
		handleSelectMapRegion,
		sidebarOpen
	} = props;

	const mapRef = useRef();
	const geoJsonRef = useRef();
	const [selectedLayer, setSelectedLayer] = useState(null);
	const [isMapFlying, setIsMapFlying] = useState(false);

	const getRegionColor = (index) => {
		if (index > 10) return COLOR_PALETTE.vvred;
		else if (index > 5) return COLOR_PALETTE.vred;
		else if (index > 1) return COLOR_PALETTE.red;
		else if (index > 0.5) return COLOR_PALETTE.orgred;
		else if (index > 0) return COLOR_PALETTE.org;
		else if (index > -5) return COLOR_PALETTE.orgyel;
		else if (index > -10) return COLOR_PALETTE.yel;
		else return COLOR_PALETTE.default;
	};

	const zoomToRegion = (bounds) => {
		mapRef.current.flyToBounds(bounds, { duration: 0.75 });
		setIsMapFlying(true);
	};

	const handleMapMoveEnd = () => {
		setIsMapFlying(false);
	};

	const handleMouseoverRegion = (e) => {
		// do nothing if the map is flying
		if (isMapFlying) return;
		// do nothing if hovering over the selected layer
		const layer = e.sourceTarget;
		if (selectedLayer && layer.feature.properties.code === selectedLayer.feature.properties.code) return;

		// set the layer styles
		layer.setStyle(HIGHLIGHT_STYLES);
		layer.bringToFront();
	};

	const handleMouseoutRegion = (e) => {
		// do nothing if the map is flying
		if (isMapFlying) return;
		// do nothing if hovering over the selected layer
		const layer = e.sourceTarget;
		if (selectedLayer && layer.feature.properties.code === selectedLayer.feature.properties.code) return;

		// reset the layer styles
		layer.setStyle(DEFAULT_STYLES);
		layer.bringToBack();
	};

	const handleClickRegion = (e) => {
		// do nothing if the map is flying
		if (isMapFlying) return;
		// change the url query accordingly
		const layer = e.sourceTarget;
		if (selectedLayer && layer.feature.properties.code === selectedLayer.feature.properties.code) handleSelectMapRegion(null);
		else handleSelectMapRegion(layer.feature.properties.code);
	};

	useEffect(() => {
		if (!loaded || !geoJsonRef.current || !mapRef.current) return;

		mapRef.current.on("moveend", handleMapMoveEnd);
		// reset previous layer styles, if any
		if (selectedLayer) selectedLayer.setStyle(DEFAULT_STYLES);
		if (selectedRegionKey) {
			// find the corresponding geojson layer
			const layer = geoJsonRef.current.getLayer(selectedRegionKey);
			// get info about the layer
			const bounds = layer.getBounds();
			// apply new styles and zoom
			layer.setStyle(LOCK_STYLES);
			layer.bringToFront();
			zoomToRegion(bounds);
			// save the new layer
			setSelectedLayer(layer);
		} else {
			// zoom to default view
			zoomToRegion(DEFAULT_BOUNDS, false);
			// empty layer saves
			setSelectedLayer(null);
		}
	}, [loaded, selectedRegionKey]); // eslint-disable-line react-hooks/exhaustive-deps

	return (
		<div className={`leaflet-map-container ${sidebarOpen && "sidebar-open"}`}>
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
				{loaded && <GeoJSON
					ref={geoJsonRef}
					data={data}
					attribution="&copy; credits due..."
					eventHandlers={{
						mouseover: handleMouseoverRegion,
						mouseout: handleMouseoutRegion,
						// moveend: handleMapMoveEnd, * THIS DOESN'T WORK SOMEHOW. CHECK "USEEFFECT"
						click: handleClickRegion
					}}
					onEachFeature={(feature, layer) => {
						// set the layer id based on the region id
						layer._leaflet_id = feature.properties.code;
						// set layer styles for every layer
						// get the fill color based on the severity index
						const color = getRegionColor(feature.properties.severityIndex);
						layer.setStyle({ ...DEFAULT_STYLES, fillColor: color });
					}}
				/>}
			</MapContainer>

		</div>
	);
};

export default LeafletMap;
