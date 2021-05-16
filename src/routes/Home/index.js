import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'

import { fetchRegions, fetchRegionCharities } from '../../services/api'

function Home() {

    const location = useLocation()

    const [regions, setRegions] = useState({})
    const [charities, setCharities] = useState({})

    const [firebaseError, setFirebaseError] = useState(false)
    const [dataLoaded, setDataLoaded] = useState(false)

    const fetchAllData = async (region = null) => {
        try {
            const regions_response = await fetchRegions()
            setRegions(regions_response)
            console.log({ regions_response })

            if(region) {
                console.log('searching for region ', region)
                const charitiesInRegion = await fetchRegionCharities(region)
                setCharities(charitiesInRegion)
            }

            setDataLoaded(true)
        } catch(err) {
            setFirebaseError(true)
            console.error(err)
        }
    }

    useEffect(() => {
        // get search query, if any
        const urlParams = new URLSearchParams(location.search)
        const regionQuery = urlParams.get('region')
        fetchAllData(regionQuery)
    }, [])

    return (
        <div>
            home!
            Map will be displayed here
        </div>
    )
}

export default Home
