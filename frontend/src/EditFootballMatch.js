import { EditSharp, FilterList } from "@mui/icons-material";
import { Alert, Avatar, Box, Button, Card, CardContent, CardMedia, Grid, IconButton, LinearProgress, List, ListItem, ListItemAvatar, MenuItem, Modal, TextField, Typography } from "@mui/material";
import { Container } from "@mui/system";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import React from "react";
import GROUPS from "./groups";

export default class EditFootballMatch extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            filteredMatches: [],
            matches: []
        }
    }

    render() {
        const filteredMatches = this.state.filteredMatches;
        const matches = this.state.matches;

        return (
            <Grid container justifyContent='center' spacing={2}>

                <Grid item xs={12} sm={8} sx={{ mt: '1%' }}>
                    <Filter />
                </Grid>

                <Grid item xs={12} sm={8}>
                    <FootballMatches
                        currentMatches={filteredMatches.length ? filteredMatches : matches}
                        setMatches={matchData => this.setState({ matches: matchData })}
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
            showFilterModal: false
        }

        this.searchMatchThroughInput = this.searchMatchThroughInput.bind(this);
    }

    searchMatchThroughInput(e) {

    }

    render() {
        return (
            <Card>
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
                            placeholder="Enter team name to get it's matches..." 
                            size="small"
                            margin="normal"
                            onChange={this.searchMatchThroughInput}
                            fullWidth
                            />
                    </Grid>

                </Grid>
            </Card>
        )
    }
}

function FootballMatches(props) {
    const [matchId, setMatchId] = React.useState(null);
    const [modalIsOpen, setModalIsOpen] = React.useState(false);
    const teams = JSON.parse(sessionStorage.getItem('football-teams'));

    React.useEffect(() => {
        const matches = sessionStorage.getItem('football-matches');
        
        if (matches) {
            props.setMatches(JSON.parse(matches));
        } else {
            fetch('/api/admin/GetFootballMatches')
                .then(response => response.json())
                .then(data => {
                    sessionStorage.setItem('football-matches', JSON.stringify(data));
                    props.setMatches(data);
                })
        }
    }, [])

    function openEditModal(match) {
        setMatchId(match.docId);
        setModalIsOpen(true);
    }

    function closeEditModal() {
        setModalIsOpen(false);
    }

    function getTeamFromId(teamId) {
        return teams.filter(team => team.docId == teamId)[0];
    }

    return (
        <Card>
            <Typography variant='h5' align="center">Football Matches</Typography>

            <List>
                {
                    props.currentMatches.map(match => (
                        <ListItem
                            key={match.docId}
                            divider={true}
                            secondaryAction={
                                <IconButton onClick={() => openEditModal(match)}>
                                    <EditSharp color='primary' />
                                </IconButton>
                            }
                        >
                            {
                                matchId == match.docId &&
                                <EditModal 
                                    isOpen={modalIsOpen} 
                                    close={closeEditModal} 
                                    match={match}
                                    getTeamFromId={getTeamFromId}
                                />
                            }

                            <Grid container>
                                <Grid container item xs={12} sx={{ mt: 3}}>

                                    <Grid item xs={5} sm={3}>
                                        <Typography variant='body2'>{new Date(match.dateTime).toDateString()}</Typography>
                                    </Grid>

                                    <Grid item xs={5} sm={3}>
                                        <Typography variant="body2">Match Day {match.matchDay}</Typography>
                                    </Grid>
                                </Grid>

                                <Grid container item xs={12} spacing={1} justifyContent='center' sx={{ mt: 2 }}>

                                    <Grid item xs={4} >
                                        <ListItemAvatar sx={{ pl: '7%' }}>
                                            <Avatar src={getTeamFromId(match.teamA).logoLink} alt='team logo'/>
                                        </ListItemAvatar>
                                        <Typography variant="body1">{getTeamFromId(match.teamA).teamName}</Typography>
                                    </Grid>

                                    <Grid item xs={2}>
                                        <Typography variant="body2">
                                            {new Date(match.dateTime).toLocaleTimeString()}
                                        </Typography>
                                    </Grid>

                                    <Grid item xs={4} sx={{ ml: '4%'}}>
                                        <ListItemAvatar sx={{ pl: '7%' }}>
                                            <Avatar src={getTeamFromId(match.teamB).logoLink} alt='team logo' />
                                        </ListItemAvatar>
                                        <Typography variant="body1">{getTeamFromId(match.teamB).teamName}</Typography>
                                    </Grid>
                                </Grid>
                            </Grid>

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
            statusCode: null,
            competitions: JSON.parse(sessionStorage.getItem('football-competitions')),
            matchDay: this.props.match.matchDay,
            stage: this.props.match.stage ? this.props.match.stage : null,
            group: null,
            dateTime: new Date(this.props.match.dateTime),
            gmt: 3
        }

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleSubmit(e) {
        e.preventDefault();
        this.setState({ showLinearProgress: true });
        const formdata = this.createFormData();
        this.uploadData(formdata);
    }

    uploadData(formdata) {
        fetch('/api/admin/EditFootballMatch', {
            method: 'POST',
            body: formdata,
            headers: { 'content-encoding': 'multipart/form-data'}
        })
        .then(response => this.setState({
            showLinearProgress: false,
            statusCode: response.status,
        }))
    }

    createFormData() {
        const formdata = new FormData();
        const match = this.props.match;
        const matchDateInISO = this.getMatchDateInISO()
        const competition = this.state.competitions
            .filter(competition => competition.docId == match.competitionId)[0];

        formdata.append('docId', match.docId);

        if (competition.category == 'tournament'){
            if (match.stage != this.state.stage) {
                formdata.append('stage', this.state.stage);
            }

            if (match.group != this.state.group) {
                formdata.append('group', this.state.group)
            }
        }

        if (competition.category == 'league' || 
            (competition.category == 'tournament' && this.state.stage == 'Group')) {
                if (match.matchDay != this.state.matchDay) {
                    formdata.append('matchDay', this.state.matchDay);
                }
        }

        if (matchDateInISO != match.dateTime) {
            formdata.append('dateTime', matchDateInISO);
        }

        return formdata
    }

    getMatchDateInISO() {
        // create utc time
        const dateTime = this.state.dateTime;
        const SECONDS_IN_HOUR = 3600;
        const MILLISECONDS_IN_HOUR = SECONDS_IN_HOUR * 1000;

        const year = dateTime['$y'];
        const month = dateTime['$M'] < 9 ? `0${dateTime['$M'] + 1}` : dateTime['$M'] + 1;
        const day = dateTime['$D'] < 10 ? `0${dateTime['$D']}` : dateTime['$D'];
        const hour = dateTime['$H'] < 10 ? `0${dateTime['$H']}` : dateTime['$H'];
        const minute = dateTime['$m'] < 10 ? `0${dateTime['$m']}` : dateTime['$m'];

        const dateRef = new Date(`${year}-${month}-${day}T${hour}:${minute}Z`);
        const matchDateInMilliseconds = dateRef.getTime();
        const matchDateInISO = new Date(matchDateInMilliseconds - (this.state.gmt * MILLISECONDS_IN_HOUR))
            .toISOString();

        return matchDateInISO;
    }


    handleChange(e) {
        this.setState({ [e.target.name]: e.target.value })
    }

    createGMTSpectrum() {
        const times = [];
        for (let i = -12; i < 13; i++) {
            times.push(i);
        }
        return times
    }

    render() {
        const match = this.props.match;
        const competition = this.state.competitions
            .filter(competition => competition.docId == match.competitionId)[0];
        const teamA = this.props.getTeamFromId(match.teamA);
        const teamB = this.props.getTeamFromId(match.teamB);

        return (
            <Modal
                open={this.props.isOpen}
                onClose={this.props.close}
                sx={{ display: 'flex', justifyContent: 'center' }}
            >
                <Card
                    sx={{ 
                        width: '80vw',
                        height: '75vh',
                        mt: 5,
                        padding: 5,
                        overflowY: 'scroll'
                    }}
                >
                    <Grid container>

                        <Grid item xs={12}>
                            <Typography variant="h5" align="center">
                                {`Edit ${teamA.teamName} vs ${teamB.teamName}`}
                            </Typography>
                        </Grid>

                        <Grid item xs={12}>
                            <Alert severity="info">
                                If you would like to edit the competition or team, please delete this Match
                                and upload a new entry.
                            </Alert>
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
                                    <Alert severity="success">Your changes were saved successfully!</Alert>
                                }

                                {
                                    this.state.statusCode == 500 && 
                                    <Alert severity="error">
                                        An error occurred while editing the match. Please try again.
                                    </Alert>
                                }

                                <Card
                                    sx={{
                                        display: 'flex',
                                        px: '10%',
                                        alignItems: 'flex-end'
                                    }}
                                >
                                    <CardMedia 
                                        component='img'
                                        image={competition.logoLink}
                                        alt={competition.name}
                                        height='70px'
                                        sx={{ objectFit: 'contain', width: '70px' }}
                                    />

                                    <CardContent>
                                        <Typography variant="body1">{competition.name}</Typography>
                                    </CardContent>

                                </Card>

                                <Card
                                    sx={{
                                        display: 'flex',
                                        px: '10%',
                                        alignItems: 'flex-end',
                                        mt: '3%'
                                    }}
                                >
                                    <CardMedia 
                                        component='img'
                                        image={teamA.logoLink}
                                        alt={teamA.teamName}
                                        height='70px'
                                        sx={{ objectFit: 'contain', width: '70px' }}
                                    />

                                    <CardContent>
                                        <Typography variant="body1">{teamA.teamName}</Typography>
                                    </CardContent>

                                </Card>

                                <Card
                                    sx={{
                                        display: 'flex',
                                        px: '10%',
                                        alignItems: 'flex-end',
                                        mt: '3%'
                                    }}
                                >
                                    <CardMedia
                                        component='img'
                                        image={teamB.logoLink}
                                        alt={teamB.teamName}
                                        height='70px'
                                        sx={{ objectFit: 'contain', width: '70px' }}
                                    />

                                    <CardContent>
                                        <Typography variant="body1">{teamB.teamName}</Typography>
                                    </CardContent>
                                </Card>

                                {
                                    competition.category == 'tournament' &&
                                    <TextField
                                        label='Stage'
                                        variant="filled"
                                        onChange={this.handleChange}
                                        name='stage'
                                        defaultValue={match.stage}
                                        margin='normal'
                                        select
                                        required
                                        fullWidth
                                    >
                                        {['Group', 'Round of 16', 'Quarter Finals', 'Semi Finals', 'Finals']
                                            .map((stage, index) => (
                                                <MenuItem key={index} value={stage}>
                                                    {stage}
                                                </MenuItem>
                                            )
                                        )}
                                    </TextField>
                                }

                                {
                                    this.state.stage == 'Group' &&
                                    <TextField
                                        label='Group'
                                        variant="filled"
                                        onChange={this.handleChange}
                                        name='group'
                                        defaultValue={match.group}
                                        margin='normal'
                                        select
                                        required
                                        fullWidth
                                    >
                                        {
                                            GROUPS.map((group, index) => (
                                                <MenuItem key={index} value={group}>
                                                    {group}
                                                </MenuItem>
                                            ))
                                        }
                                    </TextField>
                                }

                                {
                                    (competition.category == 'league' || 
                                    (competition.category == 'tournament' && this.state.stage == 'Group')) &&
                                    <TextField 
                                        label='Match Day'
                                        variant="filled"
                                        onChange={this.handleChange}
                                        name='matchDay'
                                        defaultValue={match.matchDay}
                                        margin='normal'
                                        type='number'
                                        required
                                        fullWidth
                                    />
                                }

                                <Box component='div'>
                                    <Grid container>

                                        <Grid item xs={12} sm={6} sx={{ mt: '10px' }}>
                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                <DateTimePicker 
                                                    renderInput={(props) => <TextField {...props} />}
                                                    label='Date & Time'
                                                    name='dateTime'
                                                    value={this.state.dateTime}
                                                    inputFormat='DD/MM/YYYY hh:mm a'
                                                    ampm={false}
                                                    onChange={(newValue) => this.setState({ dateTime: newValue })}
                                                    required
                                                />
                                            </LocalizationProvider>
                                        </Grid>

                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                label='GMT'
                                                variant="filled"
                                                onChange={this.handleChange}
                                                name='gmt'
                                                value={this.state.gmt}
                                                sx={{ mt: '10px'}}
                                                select
                                                required
                                                fullWidth  
                                            >
                                                {
                                                    this.createGMTSpectrum().map(value => (
                                                        <MenuItem key={value} value={value}>
                                                            GMT {value > 0 ? `+ ${value}` : `- ${Math.abs(value)}`}
                                                        </MenuItem>
                                                    ))
                                                }
                                            </TextField>
                                        </Grid>

                                    </Grid>
                                </Box>

                                <Button variant="contained" 
                                    type="submit"
                                    disabled={this.state.showLinearProgress}
                                    sx={{ m: 2 }} 
                                >
                                    Submit
                                </Button>


                            </Box>
                        </Grid>

                    </Grid>
                </Card>
            </Modal>
        )
    }
}