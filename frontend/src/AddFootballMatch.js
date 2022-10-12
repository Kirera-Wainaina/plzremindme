import { Alert, Avatar, Card, CardMedia, Grid, LinearProgress, ListItem, ListItemIcon, ListItemText, MenuItem, TextField, Typography } from "@mui/material"
import { Box } from "@mui/system"
import React from "react"
import GROUPS from "./groups";

export default class AddFootballMatch extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showLinearProgress: false,
            statusCode: null,
            competition: '',
            competitions: [],
            competitionData: {},
            stage: '',
            group: 'Group A',
            matchDay: ''
        }

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleSubmit(e) {
        e.preventDefault();
    }

    handleChange(e) {
        this.setState({ [e.target.name]: e.target.value, statusCode: null })

        if (e.target.name == 'competition') {
            this.setCompetitionData(e.target.value);
        } 
    }

    setCompetitionData(competitionId) {
        const data = this.state.competitions
            .filter(competition => competition.docId == competitionId)[0];
        this.setState({ competitionData: data });
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
                                name='competition'
                                value={this.state.competition}
                                margin='normal'
                                select
                                required
                                fullWidth
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
                        </Box>
                    </Card>
                </Grid>
            </Grid>
        )
    }
}