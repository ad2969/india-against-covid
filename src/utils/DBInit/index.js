const fs = require("fs");

const INCLUDE_POPULATION = true;

const REGIONS_JSON_RAW = fs.readFileSync("regions.json");
const REGIONS_JSON = JSON.parse(REGIONS_JSON_RAW);
const CHARITIES_TO_ADD_JSON_RAW = fs.readFileSync("charities.json");
const CHARITIES_TO_ADD_JSON = JSON.parse(CHARITIES_TO_ADD_JSON_RAW);
// source: https://www.findeasy.in/top-indian-states-by-population/
const REGIONS_WITH_POPULATION_JSON_RAW = fs.readFileSync("regions-population.json");
const REGIONS_WITH_POPULATION_JSON = JSON.parse(REGIONS_WITH_POPULATION_JSON_RAW);

const RANDOM_UID = "-Ma7omfOm1LECg57MSXF";

function generateUid (num) {
	return RANDOM_UID.substring(0, RANDOM_UID.length - String(num).length) + String(num);
}

const data = {
	regions: INCLUDE_POPULATION ? REGIONS_WITH_POPULATION_JSON : REGIONS_JSON,
	charities: {},
	regions_charities: Object.keys(REGIONS_JSON).reduce(
		(acc, curr) => ({ ...acc, [curr]: {} }), {})
};

CHARITIES_TO_ADD_JSON.forEach((charity, index) => {
	const key = charity.key || generateUid(index);
	charity.states.forEach((region) => {
		if (!data.regions_charities[region]) throw new Error("Trying to use a state that does not exist");
		data.regions_charities[region][key] = charity.name;
	});

	const charityData = { key, ...charity };
	delete charityData.states;
	data.charities[key] = charityData;
});

const writeData = JSON.stringify(data, null, "\t");
fs.writeFileSync("output.json", writeData);
