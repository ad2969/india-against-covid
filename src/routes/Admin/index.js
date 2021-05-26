import React, { useState, useEffect } from "react";
import CharityTable from "./Table";
import "./index.css";

import { fetchRegions, fetchCharities, fetchAllRegionsCharities } from "../../services/api";

const AdminHome = () => {
	const [regions, setRegions] = useState({});
	const [charities, setCharities] = useState({});

	const [error, setError] = useState(false);
	const [dataLoaded, setDataLoaded] = useState(false);

	const fetchAllData = async () => {
		try {
			console.debug("** API GET: FIREBASE ALL DATA");
			const [regionsResponse, charitiesResponse, regionsCharitiesResponse] = await Promise.all([
				fetchRegions(), fetchCharities(), fetchAllRegionsCharities()
			]);
			setRegions(regionsResponse);
			// re-organize data to get regional data for each charity
			// for every charity, find a list of regions
			for (const charityKey in charitiesResponse) {
				const regions = [];
				// filter regions that contain the specified charity
				for (const regionKey in regionsCharitiesResponse) {
					// if charity is in region, save the region
					if (regionsCharitiesResponse[regionKey][charityKey]) {
						regions.push({ key: regionKey, name: regionsResponse[regionKey].name });
					}
				}
				charitiesResponse[charityKey].regions = regions;
			}
			setCharities(charitiesResponse);
			setDataLoaded(true);
		} catch (err) {
			setError(true);
			console.error(err);
		}
	};

	useEffect(() => {
		fetchAllData();
	}, []);

	return (
		<div className="AdminHome Page">
			{dataLoaded && !error && <CharityTable charities={charities} regions={regions} onRefresh={fetchAllData} />}
		</div>
	);
};

export default AdminHome;
