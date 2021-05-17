import React, { useState, useEffect } from 'react'
import { useHistory } from "react-router-dom"
import {
    AppBar,
    Button,
    Toolbar,
    Typography
} from '@material-ui/core'
import CharityTable from './Table'
import './index.css'

import { fetchRegions, fetchCharities, fetchAllRegionsCharities } from '../../services/api'
import { logout } from '../../services/auth'

const AdminHome = () => {
    const history = useHistory()

    const [regions, setRegions] = useState({})
    const [charities, setCharities] = useState({})

    const [error, setError] = useState(false)
    const [dataLoaded, setDataLoaded] = useState(false)

    const handleLogout = async () => {
        try {
            await logout()
            history.push('/admin')
        } catch(err) {
            console.log('ERR', err)
            setError(err)
        }
    }

    const fetchAllData = async () => {
        try {
            const [regions_response, charities_response, regions_charities_response] = await Promise.all([
                fetchRegions(), fetchCharities(), fetchAllRegionsCharities()
            ])
            setRegions(regions_response)
            // re-organize data to get regional data for each charity
            // for every charity, find a list of regions
            for (const charity_key in charities_response) {
                const regions = []
                // filter regions that contain the specified charity
                for (const region_key in regions_charities_response) {
                    // if charity is in region, save the region
                    if(regions_charities_response[region_key][charity_key]) {
                        regions.push({ key: region_key, name: regions_response[region_key].name })
                    }
                }
                charities_response[charity_key].regions = regions
            }
            console.log({ charities_response })
            setCharities(charities_response)
            setDataLoaded(true)
        } catch(err) {
            setError(true)
            console.error(err)
        }
    }

    useEffect(() => {
        fetchAllData()
    }, [])

    return (
        <div className="AdminHome">
            <AppBar position="static" className="appbar">
                <Toolbar>
                    <Typography variant="h6" className="appbar-title">Admin Home</Typography>
                    <Button color="inherit" onClick={handleLogout}><b>Logout</b></Button>
                </Toolbar>
            </AppBar>
            {dataLoaded && !error && <CharityTable charities={charities} regions={regions} onRefresh={fetchAllData} />}
        </div>
    )
}

export default AdminHome
