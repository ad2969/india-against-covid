import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { CircularProgress } from "@material-ui/core";
import MapHeader from "../../components/Header/map";
import LeafletMap from "./Leaflet";
import Region from "./Region";
import "./index.mod.scss";

import { isEmpty } from "../../utils";
import { fetchRegions, fetchRegionCharities, fetchCovidDatabase } from "../../services/api";
import IndiaGeoJson from "../../assets/india.simplified.json";
// Original data obtained from: https://github.com/markmarkoh/datamaps
// Simplified using: https://mapshaper.org/

const Map = () => {
	const history = useHistory();

	const [regions, setRegions] = useState({});
	const [regionDataCharities, setRegionDataCharities] = useState(null);
	const [selectedRegionKey, setSelectedRegionKey] = useState(null);

	const [error, setError] = useState(false);
	const [basicDataLoaded, setBasicDataLoaded] = useState(false);
	const [regionDataLoaded, setRegionDataLoaded] = useState(false);
	const [mapLoaded, setMapLoaded] = useState(false);

	const getRegions = async () => {
		try {
			console.debug("** API GET: FIREBASE REGION DATA");
			const regionsResponse = await fetchRegions();
			console.debug("** API GET: COVID DATA");
			const covidDataResponse = await fetchCovidDatabase();

			// **********************
			// TEMP: AVERAGE SEVERITY COUNTING
			let average = 0;
			let averageNeg = 0;
			let averagePos = 0;
			// **********************

			for (const key in regionsResponse) {
				// combine covid data into region data
				const data = Object.values(covidDataResponse.regionData).find((region) => region.region === regionsResponse[key].name);
				// indicate if data cannot be found (something wrong that needs to be updated!)
				if (isEmpty(data)) {
					console.error(`COVID data not found for region '${regionsResponse[key].name}'`);
					continue;
				}
				regionsResponse[key] = { ...regionsResponse[key], ...data };

				// calculate and add severity index to geojson data
				const severityIndex = data.newInfected / data.totalInfected * 100;

				// **********************
				// TEMP: AVERAGE SEVERITY COUNTING
				average += severityIndex;
				if (severityIndex < 0) averageNeg += severityIndex;
				else averagePos += severityIndex;
				// **********************

				// combine severity index calculations (covid data) to geojson
				const feature = IndiaGeoJson.features.find((feature) => feature.properties.code === key);
				// indicate if data cannot be found (something wrong that needs to be updated!)
				if (isEmpty(feature)) {
					console.error(`No GeoJSON data found for region '${regionsResponse[key].name}'`);
					continue;
				}
				// this will directly edit the json object getting passed
				feature.properties.severityIndex = severityIndex;
			}

			// **********************
			// TEMP: AVERAGE SEVERITY COUNTING
			console.log("AVERAGES", average, averageNeg, averagePos, Object.keys(regionsResponse).length);
			// **********************

			setRegions(regionsResponse);
			setBasicDataLoaded(covidDataResponse.lastUpdatedAtApify);
		} catch (err) {
			setError(true);
			console.error(err);
		}
	};

	const getRegionDataCharities = async (regionKey = null) => {
		try {
			console.debug("** API GET: FIREBASE CHARITY DATA FOR REGION", regionKey);
			const charitiesInRegion = await fetchRegionCharities(regionKey, true);
			setRegionDataCharities(charitiesInRegion);
			setRegionDataLoaded(true);
		} catch (err) {
			setError(true);
			console.error(err);
		}
	};

	const refreshPage = async () => {
		try {
			// refresh region data
			await getRegions();
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

	// ONLY ON FIRST LOAD AND PAGE QUERY CHANGES
	useEffect(() => {
		// do nothing if error exists
		if (error) return;

		// get search query, if any
		const urlParams = new URLSearchParams(history.location.search);
		const regionQuery = urlParams.get("region");

		// if basic data has not been loaded, load that first
		if (isEmpty(regions)) getRegions();
		// if a query was given, load that data
		else if (regionQuery && regions[regionQuery]) setSelectedRegionKey(regionQuery);
		// if no query was given, but one was already selected, remove that query
		else if (selectedRegionKey && !regionQuery) setSelectedRegionKey(null);
	}, [history, history.location.search, basicDataLoaded]); // eslint-disable-line react-hooks/exhaustive-deps

	// ON SELECT REGIONS
	useEffect(() => {
		// do nothing if error exists, or if basic data hasn't been loaded
		if (error || !basicDataLoaded) return;
		// set to loaded if no region selected
		if (!selectedRegionKey) {
			setRegionDataLoaded(true);
			return;
		}
		// fetch all required data
		getRegionDataCharities(selectedRegionKey);
	}, [selectedRegionKey]); // eslint-disable-line react-hooks/exhaustive-deps

	return (
		<div className="Page MapPage">
			<MapHeader reloadPage={refreshPage} />
			<div className="map-container">
				{!!basicDataLoaded && <LeafletMap
					loaded={mapLoaded}
					setLoaded={setMapLoaded}
					data={IndiaGeoJson}
					selectedRegionKey={selectedRegionKey}
					handleSelectMapRegion={handleSelectMapRegion}
					sidebarOpen={Boolean(selectedRegionKey && regionDataCharities)}
				/>}
				<div className={`map-sidebar ${selectedRegionKey && "active"}`}>
					{regionDataLoaded && selectedRegionKey
						? <Region
							error={error}
							refresh={() => { handleSelectMapRegion(); }}
							lastUpdated={basicDataLoaded}
							selectedRegionInfo={regions[selectedRegionKey]}
							selectedRegionCharities={regionDataCharities}
						/>
						: <CircularProgress />}
				</div>
			</div>
		</div>
	);
};

export default Map;
