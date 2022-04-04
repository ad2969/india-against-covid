import { FIREBASE_ERROR, db, storage } from "./firebase";

const INDIA_CASES_API = "https://api.apify.com/v2/key-value-stores/toDWvRj1JpTXiM8FF/records/LATEST";

export const fetchRegions = async () => {
	try {
		if (FIREBASE_ERROR) throw Error("Error with initializing firebase");

		const regionsRef = db.ref("/regions");
		const snapshot = await regionsRef.get();
		if (snapshot.exists()) {
			const data = snapshot.val();
			return data;
		} else {
			console.log("   No state data available");
			return {};
		}
	} catch (err) {
		console.error(err);
		throw new Error("Error with firebase database");
	}
};

export const fetchCharities = async () => {
	try {
		if (FIREBASE_ERROR) throw Error("Error with initializing firebase");

		const charitiesListRef = db.ref("/charities");
		const snapshot = await charitiesListRef.get();
		if (snapshot.exists()) {
			const data = snapshot.val();
			return data;
		} else {
			console.log("   No charity data available");
			return {};
		}
	} catch (err) {
		console.error(err);
		throw new Error("Error with firebase database");
	}
};

const fetchCharityInfo = async (charityKey) => {
	try {
		if (FIREBASE_ERROR) throw Error("Error with initializing firebase");

		// get info on the given charity
		const charitiesRef = db.ref(`/charities/${charityKey}`);
		const snapshot = await charitiesRef.get();
		if (snapshot.exists()) {
			const data = snapshot.val();
			return data;
		} else {
			console.log("   Charity not found");
			return {};
		}
	} catch (err) {
		console.error(err);
		throw new Error("Error with firebase database");
	}
};

export const fetchAllRegionsCharities = async () => {
	try {
		if (FIREBASE_ERROR) throw Error("Error with initializing firebase");

		// get the list of charities in the region
		const regionsCharitiesRef = db.ref("/regions_charities");
		const snapshot = await regionsCharitiesRef.get();
		if (snapshot.exists()) {
			const data = snapshot.val();
			return data;
		} else {
			console.log("   No charity and region data");
			return [];
		}
	} catch (err) {
		console.error(err);
		throw new Error("Error with firebase database");
	}
};

export const fetchRegionCharities = async (regionKey, info = false) => {
	try {
		if (FIREBASE_ERROR) throw Error("Error with initializing firebase");

		// get the list of charities in the region
		const regionsCharitiesRef = db.ref(`/regions_charities/${regionKey}`);
		const snapshot = await regionsCharitiesRef.get();
		if (snapshot.exists()) {
			const data = snapshot.val();
			if (info) {
				// obtain data on each listed charity
				const charityKeys = Object.keys(data);
				const charitiesInRegion = await Promise.all(charityKeys.map((key) => fetchCharityInfo(key)));
				return charitiesInRegion;
			} else return data;
		} else {
			console.log("   No charity data available for the given region");
			return [];
		}
	} catch (err) {
		console.error(err);
		throw new Error("Error with firebase database");
	}
};

// Modifications
export const addCharity = async (params) => {
	try {
		if (FIREBASE_ERROR) throw Error("Error with initializing firebase");

		const charitiesRef = db.ref("/charities");
		const response = await charitiesRef.push(params);
		return response;
	} catch (err) {
		console.error(err);
		throw new Error("Error with firebase database");
	}
};

export const addRegionsToCharity = async (charityKey, charityName, regionKeys) => {
	try {
		if (FIREBASE_ERROR) throw Error("Error with initializing firebase");

		await Promise.all(regionKeys.map((regionKey) => {
			const regionCharityRef = db.ref(`/regions_charities/${regionKey}/${charityKey}`);
			return regionCharityRef.set(charityName);
		}));
	} catch (err) {
		console.error(err);
		throw new Error("Error with firebase database");
	}
};

export const deleteCharities = async (charityKeys) => {
	try {
		if (FIREBASE_ERROR) throw Error("Error with initializing firebase");

		await Promise.all(charityKeys.map((key) => {
			const charityRef = db.ref(`/charities/${key}`);
			return charityRef.remove();
		}));
	} catch (err) {
		console.error(err);
		throw new Error("Error with firebase database");
	}
};

export const deleteRegionFromCharity = async (charityKey, regionKey) => {
	try {
		if (FIREBASE_ERROR) throw Error("Error with initializing firebase");

		const regionCharityRef = db.ref(`/regions_charities/${regionKey}/${charityKey}`);
		await regionCharityRef.remove();
	} catch (err) {
		console.error(err);
		throw new Error("Error with firebase database");
	}
};

export const editCharity = async (charityKey, params) => {
	try {
		if (FIREBASE_ERROR) throw Error("Error with initializing firebase");

		const charityRef = db.ref(`/charities/${charityKey}`);
		const response = await charityRef.update(params);
		return response;
	} catch (err) {
		console.error(err);
		throw new Error("Error with firebase database");
	}
};

export const uploadCharityLogo = async (imgName, file) => {
	try {
		if (FIREBASE_ERROR) throw Error("Error with initializing firebase");

		const imagesRef = storage.ref(`images/${Date.now()}-${imgName}`);
		const response = await imagesRef.put(file);
		const imageUrl = await response.ref.getDownloadURL();
		return imageUrl;
	} catch (err) {
		console.error(err);
		throw new Error("Error with firebase database");
	}
};

// EXTERNAL API
export const fetchCovidDatabase = async () => {
	try {
		const response = await fetch(INDIA_CASES_API);
		const body = await response.json();
		return body;
	} catch (err) {
		console.error("error fetching from COVID database");
		throw err;
	}
};
