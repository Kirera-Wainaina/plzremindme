import { EditSharp, FilterList } from "@mui/icons-material";
import { Alert, Avatar, Box, Card, CardContent, CardMedia, Grid, IconButton, LinearProgress, List, ListItem, ListItemAvatar, Modal, TextField, Typography } from "@mui/material";
import { Container } from "@mui/system";
import React from "react";

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
            competitions: JSON.parse(sessionStorage.getItem('football-competitions'))
        }

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit() {

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
                        padding: 5
                    }}
                >
                    <Grid container>

                        <Grid item xs={12}>
                            <Typography variant="h5" align="center">
                                {`Edit ${teamA.teamName} vs ${teamB.teamName}`}
                            </Typography>
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
                            </Box>
                        </Grid>

                    </Grid>
                </Card>
            </Modal>
        )
    }
}