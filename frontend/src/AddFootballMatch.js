import { Alert, Button, Card, CardMedia, Grid, LinearProgress, ListItemIcon, 
    ListItemText, MenuItem, TextField, Typography } from "@mui/material"
import { Box } from "@mui/system"
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import React from "react"
import GROUPS from "./groups";

export default class AddFootballMatch extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showLinearProgress: false,
            statusCode: null,
            competitionId: '',
            competitions: [],
            competitionData: {},
            stage: '',
            group: 'Group A',
            matchDay: '',
            teams: [],
            teamA: '',
            teamB: '',
            sameTeam: false,
            dateTime: '',
            gmt: 3
        }

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleSubmit(e) {
        e.preventDefault();
        this.setState({ showLinearProgress: true })
        if (this.handleSameTeams()) return ;
        const formdata = this.createFormData();
        this.uploadData(formdata)
    }

    uploadData(formdata) {
        fetch('/api/admin/AddFootballMatch', {
            method: 'POST',
            body: formdata,
            headers: { 'content-encoding': 'multipart/form-data'}
        })
        .then(response => {
            this.setState({
                statusCode: response.status,
                showLinearProgress: false,
                competitionId: '',
                dateTime: ''
            })
            sessionStorage.removeItem('football-matches')
        })
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

    createFormData() {
        const competitionCategory = this.state.competitionData.category;
        const formdata = new FormData();
        formdata.append('teamA', this.state.teamA);
        formdata.append('teamB', this.state.teamB);
        formdata.append('competitionId', this.state.competitionId);
        formdata.append('dateTime', this.getMatchDateInISO());

        if (competitionCategory == 'league' || 
            (competitionCategory == 'tournament' && this.state.stage == 'Group')) {
                formdata.append('matchDay', this.state.matchDay);
        }

        if (competitionCategory == 'tournament') {
            formdata.append('stage', this.state.stage);
        }
        return formdata
    }

    handleChange(e) {
        let data, teams;
        const value = e.target.value;
        const name = e.target.name;

        if (name == 'competitionId') {
            data = this.setCompetitionData(value);
            teams = this.setEligibleTeams(data);
            this.setState({
                [name]: value, 
                statusCode: null,
                competitionData: data ? data : {},
                teams: teams.length ? teams: []
            })
        } else {
            this.setState({ [e.target.name]: e.target.value, statusCode: null })
        }

    }

    setCompetitionData(competitionId) {
        const data = this.state.competitions
            .filter(competition => competition.docId == competitionId)[0];
        return data
    }

    setEligibleTeams(competitionData) {
        let teams = JSON.parse(sessionStorage.getItem('football-teams'));

        if (competitionData.teamType == 'country') { // only international tournaments fall here
            teams = teams.filter(team => team.teamType == 'country')
        } else {
            teams = teams.filter(team => team.teamType == 'club');
        }

        if (competitionData.country) { // national tournament or league
            teams = teams.filter(team => team.clubCountry == competitionData.country);
        }

        return teams
    }

    handleSameTeams() {
        if (this.state.teamA == this.state.teamB) {
            this.setState({ sameTeam: true});
            return true
        }
        return false
    }

    createGMTSpectrum() {
        const times = [];
        for (let i = -12; i < 13; i++) {
            times.push(i);
        }
        return times
    }

    componentDidMount() {
        let competitions = JSON.parse(sessionStorage.getItem('football-competitions'));
        if (competitions) this.setState({ competitions: competitions })
    }

    render() {
        return (
            <Grid container justifyContent='center'>
                <Grid item xs={12} sm={8}>
                    <Card sx={{ mt: 5, padding: 5 }}>
                        <Box
                            component='form'
                            onSubmit={this.handleSubmit}
                        >

                            { this.state.showLinearProgress && <LinearProgress />}

                            {
                                this.state.statusCode == 200 &&
                                <Alert severity="success">The Match upload was successful!</Alert>
                            }

                            {
                                this.state.statusCode == 500 &&
                                <Alert severity="error">
                                    An Error occurred while trying to add the match. Please try again later!
                                </Alert>
                            }

                            <Typography variant='h6' align="center">
                                Add Matches
                            </Typography>

                            <TextField
                                label='Competition'
                                variant="filled"
                                onChange={this.handleChange}
                                name='competitionId'
                                value={this.state.competitionId}
                                margin='normal'
                                select
                                required
                                fullWidth
                                sx={{ display: 'flex', flexDirection: 'row'}}
                            >
                                {
                                    this.state.competitions.map(competition => (
                                        <MenuItem key={competition.docId} value={competition.docId}>
                                            <ListItemIcon>
                                                <Card sx={{ mr: '10px', padding: '5px' }}>
                                                    <CardMedia
                                                        component='img'
                                                        image={competition.logoLink}
                                                        alt={competition.name}
                                                        height='50px'
                                                        sx={{ width: '50px', objectFit: 'contain' }}
                                                    />
                                                </Card>
                                            </ListItemIcon>
                                            <ListItemText>{competition.name}</ListItemText>
                                        </MenuItem>
                                    ))
                                }
                            </TextField>
                            

                            {
                                this.state.competitionData.category == 'tournament' &&
                                <TextField
                                    label='Stage'
                                    variant="filled"
                                    onChange={this.handleChange}
                                    name='stage'
                                    value={this.state.stage}
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
                                    value={this.state.group}
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

                            {   // display match day if its a league or group stage tournament
                                (this.state.competitionData.category == 'league' || 
                                (this.state.competitionData.category == 'tournament' && this.state.stage == 'Group')) &&
                                <TextField 
                                    label='Match Day'
                                    variant="filled"
                                    onChange={this.handleChange}
                                    name='matchDay'
                                    value={this.state.matchDay}
                                    margin='normal'
                                    type='number'
                                    required
                                    fullWidth
                                />
                            }

                            {
                                this.state.sameTeam &&
                                <Alert severity="info">Team A and Team B have to be different teams</Alert>
                            }

                            <TextField
                              label='Team A'
                              variant="filled"
                              onChange={this.handleChange}
                              name='teamA'
                              value={this.state.teamA}
                              margin='normal'
                              select
                              required
                              fullWidth  
                            >
                                {
                                    this.state.teams.map(team => (
                                        <MenuItem key={team.docId} value={team.docId}>
                                            <ListItemIcon>
                                                <Card sx={{ mr: '10px', padding: '5px' }}>
                                                    <CardMedia
                                                        component='img'
                                                        image={team.logoLink}
                                                        alt={team.teamName}
                                                        height='50px'
                                                        sx={{ width: '50px', objectFit: 'contain' }}
                                                    />
                                                </Card>
                                            </ListItemIcon>
                                            <ListItemText>{team.teamName}</ListItemText>
                                        </MenuItem>
                                    ))
                                }
                            </TextField>

                            <TextField
                              label='Team B'
                              variant="filled"
                              onChange={this.handleChange}
                              name='teamB'
                              value={this.state.teamB}
                              margin='normal'
                              select
                              required
                              fullWidth  
                            >
                                {
                                    this.state.teams.map(team => (
                                        <MenuItem key={team.docId} value={team.docId}>
                                            <ListItemIcon>
                                                <Card sx={{ mr: '10px', padding: '5px' }}>
                                                    <CardMedia
                                                        component='img'
                                                        image={team.logoLink}
                                                        alt={team.teamName}
                                                        height='50px'
                                                        sx={{ width: '50px', objectFit: 'contain' }}
                                                    />
                                                </Card>
                                            </ListItemIcon>
                                            <ListItemText>{team.teamName}</ListItemText>
                                        </MenuItem>
                                    ))
                                }
                            </TextField>

                            <Box component='div'>
                                <Grid container>
                                    <Grid item xs={12} sm={6} sx={{ mt: '10px' }}>
                                        <LocalizationProvider dateAdapter={AdapterDayjs} >
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

                            <Button
                                variant="contained"
                                type='submit'
                                sx={{ mt: 3 }}
                                disabled={this.state.showLinearProgress}
                                fullWidth
                            >
                                Submit
                            </Button>
                        
                        </Box>
                    </Card>
                </Grid>
            </Grid>
        )
    }
}