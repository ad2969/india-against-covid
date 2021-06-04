import React from "react";
import { Button, Tooltip } from "@material-ui/core";
import { Close as CloseIcon } from "@material-ui/icons";
import RegionStatistic from "./statistic";
import CharityCard from "./charity";
import Loading from "../../../components/Loading";
import "./index.mod.scss";

import { isEmpty } from "../../../utils";

const Region = (props) => {
	const {
		error,
		loaded,
		refresh,
		lastUpdated,
		selectedRegionInfo,
		selectedRegionCharities = []
	} = props;

	if (error) {
		return (
			<div className="region-error">
				<h1>SORRY! AN ERROR <br />HAS OCCURED.</h1>
				<Button variant="contained" onClick={refresh} >GO BACK</Button>
			</div>
		);
	} else {
		return (
			<div className="region">
				<h1>{selectedRegionInfo.name} <CloseIcon className="close-button button button--scale" onClick={refresh}/></h1>
				<Tooltip title="Based on UIDAI (Unique Identification Authority of India) prediction for 2021" arrow>
					<div>Population Estimate: {selectedRegionInfo.population_2021 / 1000000} (millions)</div>
				</Tooltip>
				<hr />
				<h3>COVID Statistics</h3>
				<div className="region-statistics">
					<RegionStatistic label="Active Cases" stat={selectedRegionInfo.activeCases} />
					<RegionStatistic label="Recovered" stat={selectedRegionInfo.recovered}
						subStat={selectedRegionInfo.newRecovered} desireGrowth />
					<RegionStatistic label="Deceased" stat={selectedRegionInfo.deceased}
						subStat={selectedRegionInfo.newDeceased} />
					<RegionStatistic label="Total Infected" stat={selectedRegionInfo.totalInfected}
						subStat={selectedRegionInfo.newInfected} />
				</div>
				<div className="region-statistics-update">Last updated {new Date(lastUpdated).toDateString()}</div>
				<h3>Local Charities</h3>
				{!loaded && <Loading icon />}
				{loaded && (isEmpty(selectedRegionCharities)
					? <div>No Charities Found</div>
					: <div className="region-charities">
						{selectedRegionCharities.map((charity) => <CharityCard
							key={charity.key + charity.name}
							title={charity.name}
							description={charity.description}
							link={charity.redirect_url}
							image={charity.image_url}
						/>) }
					</div>)
				}
			</div>
		);
	}
};

export default Region;
