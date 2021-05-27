import React from "react";
import "./index.mod.scss";

const RegionStatistic = (props) => {
	const {
		label,
		stat,
		subStat = null,
		desireGrowth = false
	} = props;

	return (
		<span className="stat-container">
			<div className="stat-label">{label}</div>
			<div className="stat">{Number(stat).toLocaleString("en-US")}</div>
			{subStat
				? <div className={`stat-sub ${desireGrowth
					? Number(subStat) >= 0 ? "green" : "red"
					: Number(subStat) < 0 ? "green" : "red"}`
				}>
					{Number(subStat) >= 0 ? "+" : ""}{Number(subStat).toLocaleString("en-US")}
				</div>
				: <div className="stat-sub">&nbsp;</div>}
		</span>
	);
};

export default RegionStatistic;
