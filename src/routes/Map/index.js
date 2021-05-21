import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import MapHeader from "../../components/Header/map";
import LeafletMap from "./Leaflet";
import "./index.mod.scss";

import { fetchRegions, fetchRegionCharities } from "../../services/api";
import IndiaGeoJson from "../../assets/india.simplified.json";
// Original data obtained from: https://github.com/markmarkoh/datamaps
// Simplified using: https://mapshaper.org/

const Map = () => {
	const history = useHistory();

	const [regions, setRegions] = useState({});
	const [regionDataCharities, setRegionDataCharities] = useState(null);
	const [selectedRegionKey, setSelectedRegionKey] = useState(null);

	const [error, setError] = useState(false);
	const [dataLoaded, setDataLoaded] = useState(false);
	const [mapLoaded, setMapLoaded] = useState(false);

	const fetchAllData = async (regionKey = null) => {
		try {
			const regionsResponse = await fetchRegions();
			setRegions(regionsResponse);

			if (regionKey) {
				console.log(`searching for region "${regionKey}"`);
				const regionInfo = regionsResponse[regionKey];
				setSelectedRegionKey(regionKey);
				console.log(`- "${regionInfo.name}" found!`);

				if (regionInfo) {
					const charitiesInRegion = await fetchRegionCharities(regionKey, true);
					setRegionDataCharities(charitiesInRegion);
				}
			} else {
				setSelectedRegionKey(null);
				console.log("no region selected");
			}

			setDataLoaded(true);
		} catch (err) {
			setError(true);
			console.error(err);
		}
	};

	const refreshPage = async () => {
		try {
			// refresh region data
			const regionsResponse = await fetchRegions();
			setRegions(regionsResponse);
			// set the query to none
			history.replace({ region: "" });
		} catch (err) {
			setError(true);
			console.error(err);
		}
	};

	const handleSelectMapRegion = (regionKey = null) => {
		if (regionKey) history.push({ search: `?region=${regionKey}` });
		else history.push({ search: null });
	};

	useEffect(() => {
		// get search query, if any
		const urlParams = new URLSearchParams(history.location.search);
		const regionQuery = urlParams.get("region");

		// fetch all required data
		fetchAllData(regionQuery);
	}, [history, history.location.search]);

	return (
		<div className="Page MapPage">
			<MapHeader reloadPage={refreshPage} />
			<div className="map-container">
				{dataLoaded && <LeafletMap
					loaded={mapLoaded}
					setLoaded={setMapLoaded}
					data={IndiaGeoJson}
					selectedRegionKey={selectedRegionKey}
					handleSelectMapRegion={handleSelectMapRegion}
					sidebarOpen={Boolean(selectedRegionKey && regionDataCharities)}
				/>}
				<div className={`map-sidebar ${selectedRegionKey && regionDataCharities && "active"}`}>
					{selectedRegionKey && regions[selectedRegionKey]
						? <React.Fragment>
							<h3>Searching for region &quot;{regions[selectedRegionKey].name}&quot;</h3>
							<div>Charity Data for Given Region: {JSON.stringify(regionDataCharities)}</div>
						</React.Fragment>
						: <div>Region Data: {JSON.stringify(regions)}</div>}
					<br/>

					<div>Data loaded? {dataLoaded ? "yes" : "no"}</div>
					<div>Error found? {error ? "yes" : "no"}</div>
				</div>
			</div>
		</div>
	);
};

export default Map;
