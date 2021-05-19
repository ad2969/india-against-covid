import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import MapHeader from "../../components/Header/map";

import { fetchRegions, fetchRegionCharities } from "../../services/api";

const Map = () => {
	const history = useHistory();

	const [regions, setRegions] = useState({});
	const [charities, setCharities] = useState({});
	const [selectedRegion, setSelectedRegion] = useState(null);

	const [error, setError] = useState(false);
	const [dataLoaded, setDataLoaded] = useState(false);

	const fetchAllData = async (regionKey = null) => {
		try {
			const regionsResponse = await fetchRegions();
			setRegions(regionsResponse);

			if (regionKey) {
				console.log(`searching for region "${regionKey}"`);
				const regionInfo = regionsResponse[regionKey];
				setSelectedRegion(regionInfo);
				console.log(`- "${regionInfo.name}" found!`);

				if (regionInfo) {
					const charitiesInRegion = await fetchRegionCharities(regionKey, true);
					setCharities(charitiesInRegion);
				}
			} else {
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

	useEffect(() => {
		// get search query, if any
		const urlParams = new URLSearchParams(history.location.search);
		const regionQuery = urlParams.get("region");

		// fetch all required data
		fetchAllData(regionQuery);
	}, [history]);

	return (
		<div>
			<MapHeader reloadPage={refreshPage} />
			<div>Map will be displayed here</div>
			<br/>
			{selectedRegion
				? <React.Fragment>
					<h3>Searching for region &quot;{selectedRegion.name}&quot;</h3>
					<div>Charity Data for Given Region: {JSON.stringify(charities)}</div>
				</React.Fragment>
				: <div>Region Data: {JSON.stringify(regions)}</div>}
			<br/>

			<div>Data loaded? {dataLoaded ? "yes" : "no"}</div>
			<div>Error found? {error ? "yes" : "no"}</div>
		</div>
	);
};

export default Map;
