import React, { useState, useEffect } from 'react'
import { useHistory } from "react-router-dom"
import {
    AppBar,
    Button,
    Checkbox,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Toolbar,
    Tooltip,
    Typography
} from '@material-ui/core'
import { Delete as DeleteIcon } from '@material-ui/icons'
import './index.css'

import { fetchCharities } from '../../services/api'
import { logout } from '../../services/auth'

const AdminHome = () => {
    const history = useHistory()

    const [charities, setCharities] = useState([])
    const [selected, setSelected] = useState([])

    const [error, setError] = useState(false)
    const [dataLoaded, setDataLoaded] = useState(false)

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
          const newSelecteds = charities.map((n) => n.key);
          setSelected(newSelecteds);
          return;
        }
        setSelected([]);
    };

    const handleClick = (key) => {
        const selectedIndex = selected.indexOf(key);
        let newSelected = [];
    
        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, key);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }
    
        setSelected(newSelected);
        console.log({ newSelected })
    };

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
            const charities_response = await fetchCharities()
            console.log({charities_response})
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
            <Toolbar className={selected.length > 0 ? 'toolbar-highlight' : 'toolbar'}>
                {selected.length > 0 ? (
                    <Typography color="inherit" variant="subtitle1" component="div">{selected.length} selected</Typography>
                ) : (
                    <Typography variant="h6" id="tableTitle" component="div">Charities</Typography>
                )}

                {selected.length > 0 && <Tooltip title="Delete">
                    <IconButton aria-label="delete"><DeleteIcon /></IconButton>
                </Tooltip>
                }
                </Toolbar>
            <TableContainer className="charity-table-container">
                <Table className="charity-table" aria-label="simple table">
                <TableHead>
                <TableRow>
                    <TableCell padding="checkbox"><Checkbox
                        indeterminate={selected.length > 0 && selected.length < charities.length}
                        checked={charities.length > 0 && selected.length === charities.length}
                        onChange={handleSelectAllClick}
                        inputProps={{ 'aria-label': 'select all charities' }}
                    /></TableCell>
                    <TableCell><b>Name</b></TableCell>
                    <TableCell align="right"><b>Description</b></TableCell>
                    <TableCell align="right"><b>Image</b></TableCell>
                    <TableCell align="right"><b>URL</b></TableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                    {charities.map((charity) => {
                        const isItemSelected = selected.indexOf(charity.key) !== -1;
                        return (
                            <TableRow hover
                                key={charity.key}
                                role="checkbox"
                                aria-checked={isItemSelected}
                                tabIndex={-1}
                                selected={isItemSelected}
                                onClick={() => handleClick(charity.key)}
                            >
                                <TableCell padding="checkbox">
                                    <Checkbox checked={isItemSelected} inputProps={{ 'aria-labelledby': charity.key }} />
                                </TableCell>
                                <TableCell component="th" scope="row">{charity.name}</TableCell>
                                <TableCell align="right">{charity.description}</TableCell>
                                <TableCell align="right">{charity.image_url}</TableCell>
                                <TableCell align="right">{charity.redirect_url}</TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
}

export default AdminHome
