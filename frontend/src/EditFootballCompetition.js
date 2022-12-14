import { EditSharp, FilterList } from "@mui/icons-material";
import { Button, Card, CardContent, CardMedia, Grid, IconButton, List, ListItem, 
    ListItemText, MenuItem, Modal, TextField, Typography, LinearProgress, Alert, ToggleButtonGroup, ToggleButton } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import COUNTRIES from "./countries";

export default class EditFootballCompetition extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            competitions: [],
            filteredCompetitions: []
        }
    }

    render() {
        return (
            <Grid container justifyContent='center' spacing={2}>

                <Grid item xs={12} sm={8} sx={{ mt: '1%'}}>
                    <Filter
                        competitions={this.state.competitions}
                        filteredCompetitions={this.state.filteredCompetitions}
                        setFilteredCompetitions={competitions => this.setState({ filteredCompetitions: competitions })}
                    />
                </Grid>

                <Grid item xs={12} sm={8}>
                    <LeaguesAndTournaments
                        currentCompetitions={this.state.filteredCompetitions.length 
                            ? this.state.filteredCompetitions : this.state.competitions}
                        competitions={this.state.competitions}
                        setCompetitions={competitions => this.setState({ competitions })}
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
            category: null,
            country: null,
            level: null,
            teamType: null
        }

        this.searchThroughInput = this.searchThroughInput.bind(this);
        this.handleFilters = this.handleFilters.bind(this);
        this.runFilter = this.runFilter.bind(this);
    }

    searchThroughInput(e) {
        const competitions = this.props.filteredCompetitions.length ? 
            this.props.filteredCompetitions : this.props.competitions;
        const searchTerm = e.target.value.toLowerCase();

        if (!searchTerm) {
            this.props.setFilteredCompetitions([]);
            return ;
        }
        
        const filtered = competitions.filter(competition => competition.name.toLowerCase().includes(searchTerm));
        this.props.setFilteredCompetitions(filtered);
    }

    runFilter() {
        let filtered = [...this.props.competitions];
        
        if (this.state.category) {
            filtered = filtered.filter(competition => competition.category == this.state.category);
        }

        if (this.state.country) { // league or national tournament

            if (this.state.category == 'league' || 
            (this.state.level == 'national' && this.state.category == 'tournament')) {
        
                const filterFunction = (competition) => competition.country == this.state.country;
                filtered = filtered.filter(filterFunction)
            }
        }

        if (this.state.level && this.state.category == 'tournament') {
        
            const filterFunction = (competition) => competition.level == this.state.level;
            filtered = filtered.filter(filterFunction);
        }

        if (this.state.teamType && 
            (this.state.category == 'tournament' && this.state.level == 'international')) {
            
            const filterFunction = (competition) => competition.teamType == this.state.teamType;
            filtered = filtered.filter(filterFunction)
        }

        this.props.setFilteredCompetitions(filtered)
    }

    handleFilters(field, value) {
        this.setState({ [field]: value });
    }

    render() {
        return (
            <Card>

                <FilterModal 
                    isOpen={this.state.showFilterModal}
                    close={() => this.setState({ showFilterModal: false })}
                    handleFilters={(field, value) => this.handleFilters(field, value)}
                    category={this.state.category}
                    country={this.state.country}
                    level={this.state.level}
                    teamType={this.state.teamType}
                    runFilter={this.runFilter}
                />

                <Grid container direction='row'>

                    <Grid item xs={2} sm={1}>
                        <IconButton
                            size="large"
                            sx={{
                                mt: '25%',
                                ml: '20%'
                            }}
                            onClick={() => this.setState({ showFilterModal: true })}
                        >
                            <FilterList color="primary" />
                        </IconButton>
                    </Grid>

                    <Grid item xs={8} sm={10}>
                        <TextField 
                            variant="filled"
                            placeholder="Enter league/tournament name..." 
                            size="small"
                            margin="normal"
                            onChange={this.searchThroughInput}
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
            <Card
                sx={{
                    width: '80%',
                    ml: '10%',
                    mt: '3%'
                }}
            >
                <Grid container>

                    <Grid item xs={12}>
                        <Typography variant='h6' align='center' sx={{ mt: 5}}>
                            Filter Leagues and Tournaments By:
                        </Typography>
                    </Grid>

                    <Grid item xs={12} sx={{ mx: 5 }}>
                        <Typography variant='subtitle1'>Category: </Typography>
                        <ToggleButtonGroup
                            value={props.category}
                            exclusive
                            onChange={(event, value) => props.handleFilters('category', value)}
                            color='primary'
                            sx={{ m: 3 }}
                        >
                            <ToggleButton value='league'>League</ToggleButton>
                            <ToggleButton value='tournament'>Tournament</ToggleButton>
                        </ToggleButtonGroup>
                    </Grid>

                    {
                        props.category == 'tournament' &&
                        <Grid item xs={12} sx={{ mx: 5 }}>
                            <Typography variant='subtitle1'>Level: </Typography>
                            <ToggleButtonGroup
                                value={props.level}
                                exclusive
                                onChange={(event, value) => props.handleFilters('level', value)}
                                color='primary'
                                sx={{ m: 3 }}
                            >
                                <ToggleButton value='national'>National</ToggleButton>
                                <ToggleButton value='international'>International</ToggleButton>
                            </ToggleButtonGroup>
                        </Grid>
                    }
                    
                    {
                        (props.category == 'league' || // league
                        (props.level == 'national' && props.category == 'tournament')) && // national tournament
                        <Grid item xs={12} sx={{ mx: 5 }}>
                            <Typography variant='subtitle1'>Country: </Typography>
                            <ToggleButtonGroup
                                value={props.country}
                                exclusive
                                onChange={(event, value) => props.handleFilters('country', value)}
                                color='primary'
                                sx={{ 
                                    m: 3,
                                    display: 'flex',
                                    flexWrap: 'wrap'
                                }}
                            >
                                {
                                    COUNTRIES.map(country => (
                                        <ToggleButton value={country} key={country}>{country}</ToggleButton>
                                    ))
                                }
                            </ToggleButtonGroup>
                        </Grid>
                    }

                    {
                        (props.category == 'tournament' && props.level == 'international') &&
                        <Grid item xs={12} sx={{ mx: 5 }}>
                            <Typography variant='subtitle1'>Team Type(played by): </Typography>
                            <ToggleButtonGroup
                                value={props.teamType}
                                exclusive
                                onChange={(event, value) => props.handleFilters('teamType', value)}
                                color='primary'
                                sx={{ m: 3 }}
                            >
                                <ToggleButton value='club'>Clubs</ToggleButton>
                                <ToggleButton value='country'>Countries</ToggleButton>
                            </ToggleButtonGroup>
                        </Grid>
                    }

                    <Grid item xs={12} sx={{ m: 3 }}>
                        <Button 
                            variant='contained' 
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

function LeaguesAndTournaments(props) {
    const [competitionId, setCompetitionId] = React.useState(null);
    const [modalIsOpen, setModalIsOpen] = React.useState(false);

    React.useEffect(() => {
        let competitions = sessionStorage.getItem('football-competitions');
        if (competitions) {
            props.setCompetitions(JSON.parse(competitions));
        } else {
            fetch('/api/admin/GetFootballCompetitions')
                .then(response => response.json())
                .then(data => {
                    sessionStorage.setItem('football-competitions', JSON.stringify(data));
                    props.setCompetitions(data);
                })
        }
    }, [sessionStorage.getItem('football-competitions')])

    function openEditModal(competition) {
        setCompetitionId(competition.docId);
        setModalIsOpen(true);
    }

    function closeEditModal() {
        setModalIsOpen(false)
    }

    return (
        <Card>

            <Typography variant='h5' align="center">Leagues And Tournaments</Typography>

            <List>
                {
                    props.currentCompetitions.map(competition => (
                        <ListItem
                            key={competition.docId}
                            divider
                            secondaryAction={
                                <IconButton onClick={() => openEditModal(competition)}>
                                    <EditSharp color="primary"/>
                                </IconButton>
                            }
                        >
    
                            { 
                                competitionId == competition.docId &&
                                <EditModal isOpen={modalIsOpen} close={closeEditModal} competition={competition}/>

                            }
    
                            <Card sx={{ mr: '10px', padding: '5px'}}>
                                <CardMedia 
                                    component='img'
                                    image={competition.logoLink}
                                    alt={competition.name}
                                    height='70px'
                                    sx={{ width: '70px', objectFit: 'contain' }}
                                />
                            </Card>

                            <ListItemText primary={competition.name} />
                        </ListItem>
                    ))
                }
            </List>

        </Card>
    )
}

class EditModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showLinearProgress: false,
            disableSubmit: false,
            statusCode: null,
            category: '',
            name: '',
            country: null,
            level: null,
            teamType: null,
            logo: null,
            logoURL: null
        }

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.displayLeagueExtras = this.displayLeagueExtras.bind(this);
        this.checkNationalTournament = this.checkNationalTournament.bind(this);
        this.checkInternationalTournament = this.checkInternationalTournament.bind(this);
        this.openFileUpload = this.openFileUpload.bind(this);
        this.handleFileUpload = this.handleFileUpload.bind(this);
    }

    handleChange(e) {
        this.setState({ [e.target.name]: e.target.value })
    }

    handleSubmit(e) {
        e.preventDefault();
        this.setState({ showLinearProgress: true, disableSubmit: true });
        const formdata = this.createFormdata();
        // const formdata = new FormData(e.target);
        this.uploadData(formdata);
    }

    createFormdata() {
        const formdata = new FormData();
        formdata.append('name', this.state.name ? this.state.name : this.props.competition.name);
        formdata.append('category', this.state.category ? this.state.category : this.props.competition.category);
        formdata.append('docId', this.props.competition.docId);
        formdata.append('logoName', this.props.competition.logoName);
        formdata.append('sport', 'football');
        if (this.displayLeagueExtras() || this.checkNationalTournament()) {
            formdata.append('country', this.state.country ? this.state.country : this.props.competition.country);
        }
        if (!this.displayLeagueExtras()) {
            formdata.append('level', this.state.level ? this.state.level : this.props.competition.level);
        }
        if (this.checkInternationalTournament()) {
            formdata.append('teamType', this.state.teamType ? this.state.teamType : this.props.competition.teamType);
        }
        if (this.state.logo) formdata.append(`${formdata.get('name')}-logo`, this.state.logo);
        return formdata;
    }

    uploadData(formdata) {
        sessionStorage.removeItem('football-competitions');
        fetch('/api/admin/EditFootballCompetition', {
            method: 'POST',
            body: formdata,
            headers: { 'content-encoding': 'multipart/form-data'}
        }).then(response => this.setState({
            showLinearProgress: false,
            statusCode: response.status,
            disableSubmit: false
        }))
    }

    displayLeagueExtras() {
        if (this.state.category == 'league') {
             return true
        } else if (this.state.category == 'tournament') {
             return false;
        } else {
            if (this.props.competition.category == 'league') return true;
            return false
        }
    }

    checkNationalTournament() {
        if (!this.displayLeagueExtras()) { // not league therefore tournament
            if (this.props.competition.level == 'national') return true;
            if (this.state.level == 'national') return true;
            return false
        }

        return false
    }

    checkInternationalTournament() {
        if (!this.displayLeagueExtras()) { // not league therefore tournament
            if (this.props.competition.level == 'international') return true;
            if (this.state.level == 'international') return true;
            return false
        }

        return false
    }

    openFileUpload(e) {
        const parent = e.target.parentElement;
        parent.querySelector('.invisible-file-upload').click();
    }

    handleFileUpload(e) {
        this.setState({ 
            logo: e.target.files[0], 
            logoURL: URL.createObjectURL(e.target.files[0])
        })
    }

    render() {
        return (
            <Modal
                open={this.props.isOpen}
                onClose={this.props.close}
            >
                <Card
                    sx={{ 
                        width: '80%',
                        ml: '10%',
                        mt: 5,
                        padding: 5
                    }}
                >
                    <Grid container>

                        <Grid item xs={12} sm={12}>
                            <Typography variant='h5' align="center">Edit {this.props.competition.name}</Typography>
                        </Grid>

                        <Grid item xs={12} sm={12}>
                            {this.state.showLinearProgress && <LinearProgress />}
                        </Grid>

                        <Grid item xs={12} sm={6} sx={{ px: 5 }}>

                            <Box
                                component='form'
                                onSubmit={this.handleSubmit}
                            >
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
                                    label='Category'
                                    variant='outlined'
                                    defaultValue={this.props.competition.category}
                                    onChange={this.handleChange}
                                    margin="normal"
                                    name="category"
                                    fullWidth={true}
                                    select
                                    required
                                >
                                    {['League', 'Tournament'].map((type, index) => (
                                        <MenuItem key={index} value={type.toLowerCase()}>
                                            {type}
                                        </MenuItem>
                                    ))}
                                </TextField>

                                <TextField
                                    label='Name'
                                    variant='outlined'
                                    name='name'
                                    margin="normal"
                                    defaultValue={this.props.competition.name}
                                    onChange={this.handleChange}
                                    required
                                    fullWidth
                                />

                                {
                                    (this.displayLeagueExtras() || this.checkNationalTournament()) &&
                                    <TextField
                                    label='Country'
                                    variant="outlined"
                                    onChange={this.handleChange}
                                    name='country'
                                    defaultValue={this.props.competition.country}
                                    margin='normal'
                                    select
                                    required
                                    fullWidth
                                    >
                                        {COUNTRIES.map((country, index) => (
                                            <MenuItem key={index} value={country}>
                                                {country}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                }

                                {
                                    !this.displayLeagueExtras() &&
                                    <TextField
                                        label='Level'
                                        variant="outlined"
                                        onChange={this.handleChange}
                                        name='level'
                                        defaultValue={this.props.competition.level}
                                        margin='normal'
                                        select
                                        required
                                        fullWidth
                                    >
                                        {['National', 'International'].map((level, index) => (
                                            <MenuItem key={index} value={level.toLowerCase()}>
                                                {level}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                }

                                {
                                    this.checkInternationalTournament() &&
                                    <TextField
                                        label='Played By(Team Type)'
                                        variant="outlined"
                                        onChange={this.handleChange}
                                        name='teamType'
                                        defaultValue={this.props.competition.teamType}
                                        margin='normal'
                                        select
                                        required
                                        fullWidth
                                    >
                                        {['Country', 'Club'].map((type, index) => (
                                            <MenuItem key={index} value={type.toLowerCase()}>
                                                {type}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                }

                                <Button variant="outlined" 
                                    fullWidth
                                    onClick={this.openFileUpload} 
                                    sx={{ my: 2 }}
                                >
                                    Upload New {this.state.category || this.props.competition.category} Logo
                                </Button>
                                <input onChange={this.handleFileUpload} 
                                    type='file' 
                                    name={`${this.state.name || this.props.competition.name}-logo`}
                                    className="invisible-file-upload"/>

                                {
                                    this.state.logo &&
                                    <Card>
                                        <CardMedia
                                            component='img'
                                            height='180'
                                            image={this.state.logoURL}
                                            sx={{
                                                objectFit: 'contain'
                                            }}
                                        />
                                    </Card>
                                }

                                <Button variant="contained" 
                                    type="submit"
                                    disabled={this.state.disableSubmit}
                                    sx={{ m: 2 }} 
                                >
                                    Submit
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
                                    image={this.props.competition.logoLink}
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