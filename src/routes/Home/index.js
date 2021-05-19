import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import { fetchRegions, fetchRegionCharities } from "../../services/api";

function Home () {
	const location = useLocation();

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

	useEffect(() => {
		// get search query, if any
		const urlParams = new URLSearchParams(location.search);
		const regionQuery = urlParams.get("region");

		// fetch all required data
		fetchAllData(regionQuery);
	}, [location.search]);

	return (
		<div>
			<div>home! Map will be displayed here</div>
			<div>Region Data: {JSON.stringify(regions)}</div>

			<br/>
			{selectedRegion
				? <React.Fragment>
					<h3>Searching for region {selectedRegion.name}</h3>
					<div>Charity Data for Given Region: {JSON.stringify(charities)}</div>
				</React.Fragment>
				: null}
			<br/>

			<div>Data loaded? {dataLoaded ? "yes" : "no"}</div>
			<div>Error found? {error ? "yes" : "no"}</div>
		</div>
	);
}

export default Home;
