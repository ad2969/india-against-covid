import React, { useState } from 'react'
import {
    Button,
    Checkbox,
    Chip,
    IconButton,
    Paper,
    Toolbar,
    Tooltip,
    Typography,

    Dialog,
    DialogActions,
    DialogTitle,

    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from '@material-ui/core'
import {
    Delete as DeleteIcon,
    Refresh as RefreshIcon
} from '@material-ui/icons'
import "./index.css"

import { deleteCharities, deleteRegionFromCharity } from '../../../services/api'

// sorting
// regions
// filtering by region

// "add" functionality
// "delete" functionality

const CharityTable = (props) => {
    const {
        charities,
        regions,
        onRefresh
    } = props

    const charitiesList = Object.values(charities)

    const [selected, setSelected] = useState([])
    const [confirmDeleteSelectedDialog, setConfirmDeleteSelectedDialog] = useState(false)

    const [confirmDeleteRegionDialog, setConfirmDeleteRegionDialog] = useState(false)
    const [confirmDeleteRegionCharityKey, setConfirmDeleteRegionCharityKey] = useState(null)
    const [confirmDeleteRegionRegionKey, setConfirmDeleteRegionRegionKey] = useState(null)
    
    const handleClickSelectAll = (e) => {
        if (e.target.checked) {
          const newSelecteds = charitiesList.map((n) => n.key);
          setSelected(newSelecteds);
          return;
        }
        setSelected([]);
    };

    const handleClickRow = (key) => {
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
    }

    // DELETE CHARITIES 
    const handleDeleteCharities = () => {
        setConfirmDeleteSelectedDialog(true)
    }
    const handleDeleteCharitiesConfirm = async () => {
        await deleteCharities(selected)
        setConfirmDeleteSelectedDialog(false)
        await onRefresh()
        setSelected([])
        
    }
    const handleDeleteCharitiesCancel = () => {
        setConfirmDeleteSelectedDialog(false)
    }

    // DELETE REGION
    const handleDeleteRegion = (charityKey, regionKey) => {
        setConfirmDeleteRegionDialog(true)
        setConfirmDeleteRegionCharityKey(charityKey)
        setConfirmDeleteRegionRegionKey(regionKey)
    }
    const handleDeleteRegionConfirm = async () => {
        await deleteRegionFromCharity(confirmDeleteRegionCharityKey, confirmDeleteRegionRegionKey)
        setConfirmDeleteRegionDialog(false)
        await onRefresh()
    }
    const handleDeleteRegionCancel = () => {
        setConfirmDeleteRegionDialog(false)
    }

    return (
        <Paper className="charity-table-container">
            <Toolbar className={selected.length > 0 ? 'toolbar-highlight' : 'toolbar'}>
                {selected.length > 0 ? (
                    <Typography color="inherit" variant="subtitle1" component="div">{selected.length} selected</Typography>
                ) : (
                    <React.Fragment>
                        <Typography variant="h6" id="tableTitle" component="div">List of Charities</Typography>
                        <RefreshIcon className="toolbar-button" onClick={onRefresh} />
                    </React.Fragment>
                )}

                {selected.length > 0 && <Tooltip title="Delete">
                    <IconButton className="toolbar-button" aria-label="delete" onClick={handleDeleteCharities} ><DeleteIcon /></IconButton>
                </Tooltip>
                }
            </Toolbar>
            <TableContainer>
                <Table className="charity-table" aria-label="simple table">
                <TableHead>
                <TableRow>
                    <TableCell padding="checkbox"><Checkbox
                        indeterminate={selected.length > 0 && selected.length < charities.length}
                        checked={charities.length > 0 && selected.length === charities.length}
                        onChange={handleClickSelectAll}
                        inputProps={{ 'aria-label': 'select all charities' }}
                    /></TableCell>
                    <TableCell><b>Name</b></TableCell>
                    <TableCell align="right"><b>Description</b></TableCell>
                    <TableCell align="right"><b>Regions</b></TableCell>
                    <TableCell align="right"><b>Image</b></TableCell>
                    <TableCell align="right"><b>URL</b></TableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                    {charitiesList.map((charity) => {
                        const isItemSelected = selected.indexOf(charity.key) !== -1;
                        return (
                            <TableRow hover
                                key={charity.key}
                                role="checkbox"
                                aria-checked={isItemSelected}
                                tabIndex={-1}
                                selected={isItemSelected}
                            >
                                <TableCell padding="checkbox">
                                    <Checkbox checked={isItemSelected}
                                        inputProps={{ 'aria-labelledby': charity.key }}
                                        onClick={() => handleClickRow(charity.key)}
                                    />
                                </TableCell>
                                <TableCell component="th" scope="row">{charity.name}</TableCell>
                                <TableCell align="right">{charity.description}</TableCell>
                                <TableCell align="right">
                                    {charity.regions.map((region) => <Tooltip title={region.name} key={region.key}>
                                        <Chip label={region.key} onDelete={() => handleDeleteRegion(charity.key, region.key)} color="primary" />
                                    </Tooltip>)}
                                </TableCell>
                                <TableCell align="right">{charity.image_url}</TableCell>
                                <TableCell align="right"><a href={charity.redirect_url}>{charity.redirect_url}</a></TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
                </Table>
            </TableContainer>

            {/* Delete Charities */}
            <Dialog
                disableBackdropClick
                disableEscapeKeyDown
                maxWidth="xs"
                aria-labelledby="confirmation-dialog-title"
                open={confirmDeleteSelectedDialog}
            >
                <DialogTitle id="confirmation-dialog-title">Confirm Deleting the Selected Charities?</DialogTitle>
                <DialogActions>
                    <Button autoFocus onClick={handleDeleteCharitiesCancel} color="primary">Cancel</Button>
                    <Button onClick={handleDeleteCharitiesConfirm} color="primary">Ok</Button>
                </DialogActions>
            </Dialog>

            {/* Delete Region From Charity */}
            <Dialog
                disableBackdropClick
                disableEscapeKeyDown
                maxWidth="xs"
                aria-labelledby="confirmation-dialog-title"
                open={confirmDeleteRegionDialog}
            >
                <DialogTitle id="confirmation-dialog-title">
                    Confirm Deleting Region "{regions[confirmDeleteRegionRegionKey]?.name}" from "{charities[confirmDeleteRegionCharityKey]?.name}?"
                </DialogTitle>
                <DialogActions>
                    <Button autoFocus onClick={handleDeleteRegionCancel} color="primary">Cancel</Button>
                    <Button onClick={handleDeleteRegionConfirm} color="primary">Ok</Button>
                </DialogActions>
            </Dialog>
        </Paper>
    )
}

export default CharityTable
