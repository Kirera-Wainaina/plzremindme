import { EditSharp, FilterList } from "@mui/icons-material";
import { Avatar, Card, Grid, IconButton, List, ListItem, ListItemAvatar, Modal, TextField, Typography } from "@mui/material";
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

    function getTeamA(match) {
        return teams.filter(team => team.docId == match.teamA)[0];
    }

    function getTeamB(match) {
        return teams.filter(team => team.docId == match.teamB)[0];
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
                                <EditModal isOpen={modalIsOpen} close={closeEditModal} match={match}/>
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
                                            <Avatar src={getTeamA(match).logoLink} alt='team logo'/>
                                        </ListItemAvatar>
                                        <Typography variant="body1">{getTeamA(match).teamName}</Typography>
                                    </Grid>

                                    <Grid item xs={2}>
                                        <Typography variant="body2">
                                            {new Date(match.dateTime).toLocaleTimeString()}
                                        </Typography>
                                    </Grid>

                                    <Grid item xs={4} sx={{ ml: '4%'}}>
                                        <ListItemAvatar sx={{ pl: '7%' }}>
                                            <Avatar src={getTeamB(match).logoLink} alt='team logo' />
                                        </ListItemAvatar>
                                        <Typography variant="body1">{getTeamB(match).teamName}</Typography>
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

                        <Grid item xs={12}>
                            <Typography variant="h5" align="center">Edit Match</Typography>
                        </Grid>

                    </Grid>
                </Card>
            </Modal>
        )
    }
}