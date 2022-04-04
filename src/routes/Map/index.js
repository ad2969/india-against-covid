import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import MapHeader from "../../components/Header/map";
import LeafletMap from "./Leaflet";
import Region from "./Region";
import Loading from "../../components/Loading";
import Error from "../../components/Error";
import "./index.mod.scss";

import { isEmpty } from "../../utils";
import { fetchRegions, fetchRegionCharities, fetchCovidDatabase } from "../../services/api";
import IndiaGeoJson from "../../assets/india.simplified.json";
// Original data obtained from: https://github.com/markmarkoh/datamaps
// Simplified using: https://mapshaper.org/
import LAST_DB_ENTRY_AVAILABLE from "../../assets/region.data.json";
// Region data hosted on firebase
import LAST_COVID_DATA_ENTRY_AVAILABLE from "../../assets/covid.data.json";
// API may be deprecated: https://github.com/zpelechova/covid-in/blob/master/README.md

const Map = ({ isAdmin = false }) => {
	const history = useHistory();

	const [regions, setRegions] = useState({});
	const [regionDataCharities, setRegionDataCharities] = useState(null);
	const [selectedRegionKey, setSelectedRegionKey] = useState(null);

	const [dbError, setDBError] = useState(false);
	const [apiError, setAPIError] = useState(false);
	const [regionError, setRegionError] = useState(false);
	const [basicDataLoaded, setBasicDataLoaded] = useState(false);
	const [regionDataLoaded, setRegionDataLoaded] = useState(false);
	const [mapLoaded, setMapLoaded] = useState(false);

	const getRegions = async () => {
		let regionsResponse = {};
		let covidDataResponse = {};

		try {
			console.debug("** API GET: FIREBASE REGION DATA");
			regionsResponse = await fetchRegions();
		} catch (err) {
			setDBError(err.message || true);
			setRegionError(true);
			console.error(err);
		}

		// backup (for showcase purposes)
		if (dbError) {
			regionsResponse = LAST_DB_ENTRY_AVAILABLE;
			setRegionError(false);
		}

		try {
			console.debug("** API GET: COVID DATA");
			covidDataResponse = await fetchCovidDatabase();
		} catch (err) {
			setAPIError(err.message || true);
			console.error(err);
		}

		// backup (for showcase purposes)
		if (apiError || covidDataResponse?.regionData?.length === 0) {
			covidDataResponse = LAST_COVID_DATA_ENTRY_AVAILABLE;
		}

		try {
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
				const severityIndex = data.activeCases / regionsResponse[key].population_2021 * 100;

				// **********************
				// TEMP: AVERAGE SEVERITY COUNTING
				if (isAdmin) console.log("SEVERITY", regionsResponse[key].name, severityIndex);
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
		} catch (err) {
			console.error(err);
		}

		setRegions(regionsResponse);
		setBasicDataLoaded(covidDataResponse.lastUpdatedAtApify);
	};

	const getRegionDataCharities = async (regionKey = null) => {
		try {
			console.debug("** API GET: FIREBASE CHARITY DATA FOR REGION", regionKey);
			const charitiesInRegion = await fetchRegionCharities(regionKey, true);
			setRegionDataCharities(charitiesInRegion);
		} catch (err) {
			console.error(err);
		} finally {
			setRegionDataLoaded(true);
		}
	};

	const refreshPage = async () => {
		// refresh region data
		await getRegions();
		// set the query to none
		history.replace({ region: "" });
	};

	const handleSelectMapRegion = (regionKey = null) => {
		if (regionKey) history.push({ search: `?region=${regionKey}` });
		else history.push({ search: null });
	};

	// ONLY ON FIRST LOAD AND PAGE QUERY CHANGES
	useEffect(() => {
		// do nothing if error exists
		if (dbError) return;

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
		if (dbError || !basicDataLoaded) return;
		// set to loaded if no region selected
		setRegionDataLoaded(false);
		if (!selectedRegionKey) return;
		// fetch all required data
		getRegionDataCharities(selectedRegionKey);
	}, [selectedRegionKey]); // eslint-disable-line react-hooks/exhaustive-deps

	return (
		<div className="Page MapPage">
			<MapHeader reloadPage={refreshPage} />
			<div className="map-container">
				{dbError && <Error errors={[dbError, apiError]} />}
				{!basicDataLoaded && !dbError
					? <Loading />
					: <LeafletMap
						dbError={dbError}
						loaded={mapLoaded}
						setLoaded={setMapLoaded}
						data={IndiaGeoJson}
						selectedRegionKey={selectedRegionKey}
						handleSelectMapRegion={handleSelectMapRegion}
						sidebarOpen={Boolean(selectedRegionKey && regionDataCharities)}
					/>}
				<div className={`map-sidebar ${selectedRegionKey && "active"}`}>
					{selectedRegionKey
						? <Region
							error={regionError}
							loaded={regionDataLoaded}
							refresh={() => { handleSelectMapRegion(); }}
							lastUpdated={basicDataLoaded}
							selectedRegionInfo={regions[selectedRegionKey]}
							selectedRegionCharities={regionDataCharities}
						/>
						: <Loading />}
				</div>
			</div>
		</div>
	);
};

export default Map;
