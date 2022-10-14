import { Alert, Card, CardMedia, Grid, LinearProgress, ListItemIcon, 
    ListItemText, MenuItem, TextField, Typography } from "@mui/material"
import { Box } from "@mui/system"
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
            sameTeam: false
        }

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleSubmit(e) {
        e.preventDefault();
        if (this.handleSameTeams) return ;
    }

    handleChange(e) {
        let data, teams;

        if (e.target.name == 'competitionId') {
            data = this.setCompetitionData(e.target.value);
            teams = this.setEligibleTeams(data);
            this.setState({
                [e.target.name]: e.target.value, 
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

    componentDidMount() {
        let competitions = JSON.parse(sessionStorage.getItem('competitions'));
        this.setState({ competitions: competitions })
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

                        </Box>
                    </Card>
                </Grid>
            </Grid>
        )
    }
}