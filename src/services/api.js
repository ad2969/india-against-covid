import { db } from './firebase'

export const fetchRegions = async () => {
    try {
        const regionsRef = db.ref("/regions")
        const snapshot = await regionsRef.get()
        if (snapshot.exists()) {
            const data = snapshot.val()
            return data
        } else {
            console.log("No state data available")
            return {}
        }
    } catch {
        throw new Error("Error with firebase database")
    }
}

export const fetchCharities = async () => {
    try {
        const charitiesListRef = db.ref("/charities")
        const snapshot = await charitiesListRef.get()
        if (snapshot.exists()) {
            const data = snapshot.val()
            return data
        } else {
            console.log("No charity data available")
            return {}
        }
    } catch {
        throw new Error("Error with firebase database")
    }
}

const fetchCharityInfo = async (charityID) => {
    try {
        // get info on the given charity
        const charitiesRef = db.ref(`/charities/${charityID}`)
        const snapshot = await charitiesRef.get()
        if (snapshot.exists()) {
            const data = snapshot.val()
            return data
        } else {
            console.log("Charity not found")
            return {}
        }
    } catch {
        throw new Error("Error with firebase database")
    }
}

export const fetchRegionCharities = async (regionID) => {
    try {
        // get the list of charities in the region
        const regionsCharitiesRef = db.ref(`/regions_charities/${regionID}`)
        const snapshot = await regionsCharitiesRef.get()
        if (snapshot.exists()) {
            const data = snapshot.val()
            // obtain data on each listed charity
            const charityKeys = Object.keys(data)
            const charitiesInRegion = await Promise.all(charityKeys.map((key) => fetchCharityInfo(key)))
            return charitiesInRegion
        } else {
            console.log("No charity data available for the given region")
            return []
        }
    } catch {
        throw new Error("Error with firebase database")
    }
}