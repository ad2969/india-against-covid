import React, { useState } from 'react'
import {
    Button,
    Checkbox,
    Chip,
    IconButton,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    TextField,
    Toolbar,
    Tooltip,
    Typography,

    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,

    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from '@material-ui/core'
import {
    Add as AddIcon,
    Delete as DeleteIcon,
    Refresh as RefreshIcon
} from '@material-ui/icons'
import "./index.css"

import {
    addCharity,
    addRegionsToCharity,
    deleteCharities,
    deleteRegionFromCharity
} from '../../../services/api'

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

    const charitiesList = Object.entries(charities)
    const regionsList = Object.entries(regions)

    const [addCharityDialog, setAddCharityDialog] = useState(false)
    const [addCharityName, setAddCharityName] = useState('')
    const [addCharityDescription, setAddCharityDescription] = useState('')
    const [addCharityRegions, setAddCharityRegions] = useState([])
    const [addCharityImageUrl, setAddCharityImageUrl] = useState('')
    const [addCharityRedirectUrl, setAddCharityRedirectUrl] = useState('')

    const [selected, setSelected] = useState([])
    const [confirmDeleteSelectedDialog, setConfirmDeleteSelectedDialog] = useState(false)

    const [confirmDeleteRegionDialog, setConfirmDeleteRegionDialog] = useState(false)
    const [confirmDeleteRegionCharityKey, setConfirmDeleteRegionCharityKey] = useState(null)
    const [confirmDeleteRegionRegionKey, setConfirmDeleteRegionRegionKey] = useState(null)
    
    const handleClickSelectAll = (e) => {
        if (e.target.checked) {
          const newSelecteds = charitiesList.map((n) => n[0]);
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
        console.log('Selected rows:', { newSelected })
    }

    // ADD CHARITY
    const handleAddCharity = () => {
        setAddCharityDialog(true)
    }
    const handleAddCharityConfirm = async () => {
        // add charity data
        const response = await addCharity({
            name: addCharityName,
            description: addCharityDescription,
            regions: addCharityRegions,
            image_url: addCharityImageUrl,
            redirect_url: addCharityRedirectUrl
        })
        await addRegionsToCharity(response.key, addCharityName, addCharityRegions)
        // refresh the page
        setAddCharityDialog(false)
        await onRefresh()
        setAddCharityName('')
        setAddCharityDescription('')
        setAddCharityRegions([])
        setAddCharityImageUrl('')
        setAddCharityRedirectUrl('')
    }
    const handleAddCharityCancel = () => {
        setAddCharityDialog(false)
        setAddCharityName('')
        setAddCharityDescription('')
        setAddCharityRegions([])
        setAddCharityImageUrl('')
        setAddCharityRedirectUrl('')
    }
    const handleAddCharityRegions = (e) => {
        const inputRegions = e.target.value
        setAddCharityRegions(inputRegions)
    }

    // DELETE CHARITIES 
    const handleDeleteCharities = () => {
        setConfirmDeleteSelectedDialog(true)
    }
    const handleDeleteCharitiesConfirm = async () => {
        // delete charity information
        await deleteCharities(selected)
        await Promise.all(selected.map((charityKey) => (
            Promise.all(charities[charityKey].regions.map((region) => deleteRegionFromCharity(charityKey, region.key)))
        )))
        // refresh the page
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
        // delete charity information
        await deleteRegionFromCharity(confirmDeleteRegionCharityKey, confirmDeleteRegionRegionKey)
        // refresh the page
        setConfirmDeleteRegionDialog(false)
        setConfirmDeleteRegionCharityKey(null)
        setConfirmDeleteRegionRegionKey(null)
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
                        <AddIcon className="toolbar-button" onClick={handleAddCharity} />
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
                        indeterminate={selected.length > 0 && selected.length < charitiesList.length}
                        checked={charitiesList.length > 0 && selected.length === charitiesList.length}
                        onChange={handleClickSelectAll}
                        inputProps={{ 'aria-label': 'select all charities' }}
                    /></TableCell>
                    <TableCell><b>Name</b></TableCell>
                    <TableCell align="right"><b>Description</b></TableCell>
                    <TableCell align="right"><b>Regions</b></TableCell>
                    <TableCell align="right"><b>Image</b></TableCell>
                    <TableCell align="right"><b>Website</b></TableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                    {charitiesList.map((charity) => {
                        const [charityKey, charityInfo] = charity
                        const isItemSelected = selected.indexOf(charityKey) !== -1;
                        return (
                            <TableRow hover
                                key={charityKey}
                                role="checkbox"
                                aria-checked={isItemSelected}
                                tabIndex={-1}
                                selected={isItemSelected}
                            >
                                <TableCell padding="checkbox">
                                    <Checkbox checked={isItemSelected}
                                        inputProps={{ 'aria-labelledby': charityKey }}
                                        onClick={() => handleClickRow(charityKey)}
                                    />
                                </TableCell>
                                <TableCell component="th" scope="row">{charityInfo.name}</TableCell>
                                <TableCell align="right">{charityInfo.description}</TableCell>
                                <TableCell align="right">
                                    {charityInfo.regions.map((region) => <Tooltip title={region.name} key={region.key}>
                                        <Chip label={region.key} onDelete={() => handleDeleteRegion(charityKey, region.key)} color="primary" />
                                    </Tooltip>)}
                                </TableCell>
                                <TableCell align="right">{charityInfo.image_url}</TableCell>
                                <TableCell align="right"><a href={charityInfo.redirect_url}>{charityInfo.redirect_url}</a></TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
                </Table>
            </TableContainer>

            {/* Add Charity */}
            <Dialog open={addCharityDialog} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Add Charity</DialogTitle>
                <DialogContent>
                    <TextField autoFocus margin="dense" id="name" label="Name" fullWidth required
                        value={addCharityName} onChange={(e) => setAddCharityName(e.target.value)} />
                    <TextField margin="dense" id="description" label="Description" fullWidth required
                        value={addCharityDescription} onChange={(e) => setAddCharityDescription(e.target.value)} />
                    <InputLabel style={{ marginTop: '1em' }}>Regions</InputLabel>
                    <Select margin="dense" id="regions" label="Regions" multiple fullWidth required
                        value={addCharityRegions} onChange={handleAddCharityRegions} >
                        {regionsList.map((region) => <MenuItem value={region[0]} key={region[0]}>{region[1].name}</MenuItem>)}
                    </Select>
                    <TextField margin="dense" id="image_url" label="Image" fullWidth
                        value={addCharityImageUrl} onChange={(e) => setAddCharityImageUrl(e.target.value)} />
                    <TextField margin="dense" id="redirect_url" label="Website" fullWidth required
                        value={addCharityRedirectUrl} onChange={(e) => setAddCharityRedirectUrl(e.target.value)} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleAddCharityCancel} color="primary">Cancel</Button>
                    <Button onClick={handleAddCharityConfirm} color="primary">Add</Button>
                </DialogActions>
            </Dialog>

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
                    <Button onClick={handleDeleteCharitiesConfirm} variant="contained" color="primary">Ok</Button>
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
                    Confirm Deleting Region "{regions[confirmDeleteRegionRegionKey] && regions[confirmDeleteRegionRegionKey].name}"
                    from "{charities[confirmDeleteRegionCharityKey] && charities[confirmDeleteRegionCharityKey].name}"?
                </DialogTitle>
                <DialogActions>
                    <Button autoFocus onClick={handleDeleteRegionCancel} color="primary">Cancel</Button>
                    <Button onClick={handleDeleteRegionConfirm} variant="contained" color="primary">Ok</Button>
                </DialogActions>
            </Dialog>
        </Paper>
    )
}

export default CharityTable
