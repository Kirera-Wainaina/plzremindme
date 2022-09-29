import { EditSharp, FilterList, Search } from "@mui/icons-material";
import { Card, IconButton, Grid, TextField, List, ListItemAvatar, 
    Avatar, ListItem, ListItemText, Typography, Modal,
    Box, MenuItem } from "@mui/material";
import React from "react";

import COUNTRIES from "./countries";

export default class EditFootballTeam extends React.Component {
    render() {
        return (
            <Grid container justifyContent='center' spacing={2}>

                <Grid item xs={12} sm={8} sx={{ mt: '1%'}}>
                    <Card>
                        <Grid container direction='row'>
                            <Grid item xs={2} sm={1}>
                                <IconButton size='large'><FilterList color="primary"/></IconButton>
                            </Grid>
                            <Grid item xs={8} sm={10}>
                                <TextField variant="filled" placeholder="Enter team name..." sx={{ width: '100%'}}/>
                            </Grid>
                            <Grid item xs={2} sm={1}>
                                <IconButton size='large'><Search variant='filled' color="primary"/></IconButton>
                            </Grid>
                        </Grid>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={8}>
                    <FootballTeams />
                </Grid>

            </Grid>
        )
    }
}

function FootballTeams() {
    const [teams, setTeams] = React.useState([]);
    const [teamId, setTeamId] = React.useState(null);
    const [modalIsOpen, setModalIsOpen] = React.useState(false);

    React.useEffect(() => {
        fetch('/api/admin/GetFootballTeams')
            .then(response => response.json())
            .then(data => setTeams(data))
    }, [])

    function openEditModal(team) {
        setTeamId(team.docId);
        setModalIsOpen(true);
    }

    function closeEditModal() {
        setModalIsOpen(false);
    }

    return (
        <Card sx={{ 
            width: '100%',
        }}>
            <Typography variant='h5' align="center">Teams</Typography>
            <List>
                {teams.map(team => (
                    <ListItem 
                        key={team.docId}
                        divider={true}
                        secondaryAction={
                            <IconButton onClick={() => openEditModal(team)}>
                                <EditSharp color="primary"/>
                            </IconButton>
                        }
                    >
                        {
                            teamId == team.docId && 
                            <EditComponent isOpen={modalIsOpen} close={closeEditModal} team={team}/>
                        }
                        <ListItemAvatar>
                            <Avatar src={team.logoLink} alt={team.logoName}/>
                        </ListItemAvatar>
                        <ListItemText primary={team.teamName} />
                    </ListItem>
                    
                ))}
            </List>
        </Card>
    )
}

class EditComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            teamName: '',
            teamType: null,
            clubCountry: null
        }

        this.handleClose = this.handleClose.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.displayClubCountry = this.displayClubCountry.bind(this);
    }

    handleClose() {
        this.props.close();
    }

    handleChange(e) {
        this.setState({ [e.target.name]: e.target.value })
    }

    handleSubmit() {

    }

    displayClubCountry() {
        if (this.state.teamType == 'club') {    // is club
            return true
        } else if (this.state.teamType == 'country') {
            return false
        } else {    // use props if there is no teamType in state
            // initial
            if (this.props.team.teamType == 'club') return true;
            return false
        }
    }

    render() {
        return (
            <Modal
                open={this.props.isOpen}
                onClose={this.handleClose}
            >
                <Card sx={{ 
                    width: '80%',
                    ml: '10%',
                    mt: 5,
                    padding: 5
                }}>
                    <Grid container>

                        <Grid item xs={12} sm={12}>
                            <Typography variant='h5' align="center">Edit {this.props.team.teamName}</Typography>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Box component='form' 
                                onSubmit={this.handleSubmit}
                                sx={{
                                    display: 'form',
                                    flexDirection: 'column',
                                    border: '1px solid black',
                                    px: 5
                            }}>
                                <TextField 
                                    label='Team Name'
                                    variant="outlined"
                                    margin="normal"
                                    name="teamName"
                                    defaultValue={this.props.team.teamName}
                                    onChange={this.handleChange}
                                    fullWidth={true}
                                    required
                                />
                                <TextField
                                    label='Team Type'
                                    variant='outlined'
                                    defaultValue={this.props.team.teamType}
                                    onChange={this.handleChange}
                                    margin="normal"
                                    name="teamType"
                                    fullWidth={true}
                                    select
                                    required
                                >
                                    {['Country', 'Club'].map((type, index) => (
                                        <MenuItem key={index} value={type.toLowerCase()}>
                                            {type}
                                        </MenuItem>
                                    ))}
                                </TextField>
                                {
                                    
                                    this.displayClubCountry() &&
                                     <TextField 
                                        label='Club country'
                                        variant='outlined'
                                        margin="normal"
                                        defaultValue={this.props.team.clubCountry}
                                        name="clubCountry"
                                        onChange={this.handleChange}
                                        fullWidth
                                        required
                                        select
                                    >
                                        {COUNTRIES.map((country, index) => (
                                            <MenuItem key={index} value={country}>
                                                {country}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                }
                            </Box>
                        </Grid>
                    </Grid>
                </Card>
            </Modal>
        )
    }
}