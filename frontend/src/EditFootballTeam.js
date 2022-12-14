import { EditSharp, FilterList} from "@mui/icons-material";
import { Card, CardMedia, IconButton, Grid, TextField, List, ListItemAvatar, 
    Avatar, ListItem, ListItemText, Typography, Modal,
    Box, MenuItem, CardContent, Button, LinearProgress, Alert, 
    ToggleButtonGroup, 
    ToggleButton} from "@mui/material";
import React from "react";

import COUNTRIES from "./countries";

export default class EditFootballTeam extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            teams: [],
            filteredTeams: []
        }
    }

    render() {
        return (
            <Grid container justifyContent='center' spacing={2}>

                <Grid item xs={12} sm={8} sx={{ mt: '1%'}}>
                    <Filter 
                        teams={this.state.teams}
                        filteredTeams={this.state.filteredTeams}
                        setFilteredTeams={teams => this.setState({ filteredTeams: teams })}
                    />
                </Grid>

                <Grid item xs={12} sm={8}>
                    <FootballTeams 
                        teams={this.state.teams}
                        currentTeams={this.state.filteredTeams.length ? this.state.filteredTeams : this.state.teams}
                        setTeams={(data) => this.setState({ teams: data })}
                    />
                </Grid>

            </Grid>
        )
    }
}

class Filter extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showFilterModal: false,
            teamType: null,
            clubCountry: null
        }
        this.runFilter = this.runFilter.bind(this);
        this.handleFilters = this.handleFilters.bind(this);
        this.searchTeamThroughInput = this.searchTeamThroughInput.bind(this);
    }

    runFilter() {
        let filtered = [];
        if (this.state.teamType) {
            filtered = this.props.teams.filter(team => team.teamType == this.state.teamType);
        } 
        
        if (this.state.clubCountry) {
            if (filtered.length) {
                filtered = filtered.filter(team => team.clubCountry == this.state.clubCountry);
            } else {
                filtered = this.props.teams.filter(team => team.clubCountry == this.state.clubCountry)
            }
        }
        this.props.setFilteredTeams(filtered);
    }

    handleFilters(field, value) {
        this.setState({ [field]: value });
        if (field == 'teamType' && value == 'country') {
            this.setState({ clubCountry: null })
        }
    }

    searchTeamThroughInput(e) {
        const teams = this.props.filteredTeams.length ? this.props.filteredTeams : this.props.teams;
        const searchTerm = e.target.value.toLowerCase();

        if (!searchTerm) {
            this.props.setFilteredTeams([]);
            return ;
        }

        const filtered = teams.filter(team => team.teamName.toLowerCase().includes(searchTerm))
        this.props.setFilteredTeams(filtered);
    }

    render() {
        return (
            <Card>
                <FilterModal isOpen={this.state.showFilterModal}
                    close={() => this.setState({ showFilterModal: false })}
                    handleFilters={(field, value) => this.handleFilters(field, value)}
                    teamType={this.state.teamType}
                    clubCountry={this.state.clubCountry}
                    runFilter={this.runFilter}
                />
                <Grid container direction='row'>
                    <Grid item xs={2} sm={1}>
                        <IconButton size='large' 
                            sx={{
                                mt: '25%',
                                ml: '20%'
                            }}
                            onClick={() => this.setState({ showFilterModal: true })}
                        >
                            <FilterList color="primary"/>
                        </IconButton>
                    </Grid>
                    <Grid item xs={8} sm={10}>
                        <TextField variant="filled" 
                            placeholder="Enter team name..." 
                            size="small"
                            margin="normal"
                            onChange={this.searchTeamThroughInput}
                            fullWidth
                            />
                    </Grid>
                </Grid>
            </Card>

        )
    }
}

function FilterModal(props) {
    return (
        <Modal 
            open={props.isOpen}
            onClose={props.close}
        >
            <Card sx={{
                width: '80%',
                ml: '10%',
                mt: '3%'
            }}>
                <Grid container>
                    <Grid item xs={12}>
                        <Typography variant='h6' align='center' sx={{ mt: 5}}>Filter Teams By:</Typography>
                    </Grid>
                    <Grid item xs={12} sx={{ mx: 5 }}>
                        <Typography variant='subtitle1'>Type: </Typography>
                        <ToggleButtonGroup
                            value={props.teamType}
                            exclusive
                            onChange={(event, value) => props.handleFilters('teamType', value)}
                            color='primary'
                            sx={{ m: 3}}
                        >
                            <ToggleButton value='country'>Country</ToggleButton>
                            <ToggleButton value='club'>Club</ToggleButton>
                        </ToggleButtonGroup>
                    </Grid>

                    {
                        props.teamType == 'club' &&
                        <Grid item xs={12} sx={{ mx: 5 }}>
                            <Typography variant='subtitle1'>Club Country: </Typography>
                            <ToggleButtonGroup
                                value={props.clubCountry}
                                exclusive
                                onChange={(event, value) => props.handleFilters('clubCountry', value)}
                                color='primary'
                                sx={{ 
                                    m: 3,
                                    display: 'flex',
                                    flexWrap: 'wrap'
                                }}
                            >
                               {COUNTRIES.map(country => (
                                    <ToggleButton value={country} key={country}>{country}</ToggleButton>
                                ))} 
                            </ToggleButtonGroup>
                        </Grid>
                    }
                    <Grid item xs={12} sx={{ m: 3 }}>
                        <Button variant='contained' 
                            onClick={() => {
                                props.runFilter();
                                props.close()
                            }}
                        >
                            Run Filter
                        </Button>
                    </Grid>
                </Grid>
            </Card>
        </Modal>
    )
}

function FootballTeams(props) {
    const [teamId, setTeamId] = React.useState(null);
    const [modalIsOpen, setModalIsOpen] = React.useState(false);

    React.useEffect(() => {
        let teams = sessionStorage.getItem('football-teams');
        if (teams) {
            props.setTeams(JSON.parse(teams));
        } else {
            fetch('/api/admin/GetFootballTeams')
                .then(response => response.json())
                .then(data => {
                    sessionStorage.setItem('football-teams', JSON.stringify(data))
                    props.setTeams(data)
                })
        }
    }, [sessionStorage.getItem('football-teams')])

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
                {
                props.currentTeams.map(team => (
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
                            <EditModal isOpen={modalIsOpen} close={closeEditModal} team={team}/>
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

class EditModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            teamName: '',
            teamType: null,
            clubCountry: null,
            teamLogo: null,
            teamLogoURL: null,
            showLinearProgress: false,
            statusCode: null,
            disableSubmit: false
        }

        this.handleClose = this.handleClose.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleFileUpload = this.handleFileUpload.bind(this);
        this.displayClubCountry = this.displayClubCountry.bind(this);
        this.openFileUpload = this.openFileUpload.bind(this);
    }

    handleClose() {
        this.props.close();
    }

    handleChange(e) {
        this.setState({ [e.target.name]: e.target.value })
    }

    handleSubmit(e) {
        e.preventDefault();
        this.setState({ showLinearProgress: true, disableSubmit: true });
        const formdata = this.createFormdata();
        this.uploadData(formdata);
    }

    createFormdata() {
        const formdata = new FormData();
        formdata.append('teamName', this.state.teamName ? this.state.teamName : this.props.team.teamName);
        formdata.append('teamType', this.state.teamType ? this.state.teamType : this.props.team.teamType);
        formdata.append('logoName', this.props.team.logoName);
        formdata.append('docId', this.props.team.docId);
        if (formdata.get('teamType') == 'club') {
            formdata.append('clubCountry', 
                this.state.clubCountry ? this.state.clubCountry : this.props.team.clubCountry );
        }
        if (this.state.teamLogo) formdata.append(`${formdata.get('teamName')}-logo`, this.state.teamLogo);
        return formdata;
    }

    uploadData(formdata) {
        sessionStorage.removeItem('football-teams');
        fetch('/api/admin/EditFootballTeam', {
            method: 'POST',
            body: formdata,
            headers: { 'content-encoding': 'multipart/form-data'}
        }).then(response => this.setState({
            showLinearProgress: false,
            statusCode: response.status,
            disableSubmit: false
        }))
        
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

    openFileUpload(e) {
        const parent = e.target.parentElement;
        parent.querySelector('.invisible-file-upload').click();
    }

    handleFileUpload(e) {
        this.setState({ 
            teamLogo: e.target.files[0], 
            teamLogoURL: URL.createObjectURL(e.target.files[0])
        })
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

                        <Grid item xs={12} sm={12}>
                            {this.state.showLinearProgress && <LinearProgress />}
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Box component='form' 
                                onSubmit={this.handleSubmit}
                                sx={{
                                    display: 'form',
                                    flexDirection: 'column',
                                    px: 5
                            }}>
                                {
                                    this.state.statusCode == 200 && 
                                    <Alert severity="success">The upload was successful!</Alert>
                                }

                                {
                                    this.state.statusCode == 500 &&
                                    <Alert severity="error">
                                        An error occurred while editing team. Please try again
                                    </Alert>
                                }

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
                                <Button variant="outlined" 
                                    fullWidth
                                    onClick={this.openFileUpload} 
                                    sx={{ my: 2 }}
                                >
                                    Upload New Team Logo
                                </Button>
                                <input onChange={this.handleFileUpload} 
                                    type='file' 
                                    name={`${this.state.teamName}-logo`}
                                    className="invisible-file-upload"/>

                                {this.state.teamLogo && <DisplayImage src={this.state.teamLogoURL}/>}

                                <Button variant="contained" 
                                    type="submit"
                                    disabled={this.state.disableSubmit}
                                    sx={{ m: 2 }} 
                                >
                                    submit
                                </Button>

                            </Box>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Card>
                                <CardContent>
                                    <Typography variant='body1' align="center" color='text.secondary'>
                                        Current Logo
                                    </Typography>
                                </CardContent>
                                <CardMedia
                                    component='img'
                                    height='180'
                                    image={this.props.team.logoLink}
                                    sx={{
                                        objectFit: 'contain'
                                    }}
                                />
                                </Card>

                        </Grid>
                    </Grid>
                </Card>
            </Modal>
        )
    }
}

function DisplayImage(props) {
    return (
        <Card>
            <CardMedia
                component='img'
                height='180'
                image={props.src}
                sx={{
                    objectFit: 'contain'
                }}
            />
        </Card>
    )
}
