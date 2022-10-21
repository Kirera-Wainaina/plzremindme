import { EditSharp, FilterList } from "@mui/icons-material";
import { Alert, Avatar, Box, Button, Card, CardContent, CardMedia, Grid, 
    IconButton, LinearProgress, List, ListItem, ListItemAvatar, 
    ListItemText, ListItemIcon,
    MenuItem, Modal, TextField, Typography } from "@mui/material";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import Delete from '@mui/icons-material/Delete';
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
                    <Filter 
                        filteredMatches={filteredMatches}
                        matches={matches}
                    />
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
                <FilterModal 
                    isOpen={this.state.showFilterModal}
                    close={() => this.setState({ showFilterModal: false })}
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

function FilterModal(props) {
    const competitions = JSON.parse(sessionStorage.getItem('football-competitions'));
    const [competitionId, setCompetitionId] = React.useState('');
    const [competitionData, setCompetitionData] = React.useState({});
    const [tournamentStage, setTournamentStage] = React.useState('');

    function handleCompetitionChange(e) {
        setCompetitionId(e.target.value);
        const data = competitions.filter(competition => competition.docId == e.target.value)[0];
        setCompetitionData(data);
    }

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
                        <Typography variant='h6' align='center' sx={{ mt: 5 }}>
                            Filter Matches By:
                        </Typography>
                    </Grid>

                    <Grid item xs={12} sx={{ mx: 5 }}>
                        <TextField
                            label='Competition'
                            variant='outlined'
                            value={competitionId}
                            onChange={e => handleCompetitionChange(e)}
                            name='competitionId'
                            fullWidth
                            select
                        >
                            {competitions.map(competition => (
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
                            ))}
                        </TextField>
                    </Grid>

                    {
                        competitionData.category == 'tournament' && // filter by stage
                        <Grid item xs={12} sx={{ mx: 5 }}>
                            <TextField
                                label='Stage'
                                variant="filled"
                                onChange={(e) => setTournamentStage(e.target.value)}
                                name='stage'
                                value={tournamentStage}
                                margin='normal'
                                select
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
                        </Grid>
                    }

                </Grid>
            </Card>

        </Modal>
    )
}

function FootballMatches(props) {
    const teams = JSON.parse(sessionStorage.getItem('football-teams'));
    const competitions = JSON.parse(sessionStorage.getItem('football-competitions'));

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
    }, [sessionStorage.getItem('football-matches')]) // the fetch request is sent out if an update has been made


    return (
        <Card>
            <Typography variant='h5' align="center">Football Matches</Typography>

            <List>
                {
                    props.currentMatches.map(match => (
                        <MatchItem 
                            match={match}
                            key={match.docId}
                            teams={teams}
                            competitions={competitions}
                        />
                    ))
                }
            </List>
        </Card>
    )
}

function MatchItem(props) {
    const match = props.match;
    const [matchId, setMatchId] = React.useState(null);
    const [modalIsOpen, setModalIsOpen] = React.useState(false);
    const teamA = props.teams.filter(team => team.docId == match.teamA)[0];
    const teamB = props.teams.filter(team => team.docId == match.teamB)[0];
    const competition = props.competitions
        .filter(competition => competition.docId == match.competitionId)[0];

    function openEditModal(id) {
        setMatchId(id);
        setModalIsOpen(true);
    }

    function closeEditModal() {
        setModalIsOpen(false);
    }

    return (
        <ListItem
            divider={true}
            secondaryAction={
                <IconButton onClick={() => openEditModal(match.docId)}>
                    <EditSharp color='primary' />
                </IconButton>
            }
        >
            {
                matchId == match.docId &&
                <EditModal 
                    isOpen={modalIsOpen} 
                    close={closeEditModal} 
                    match={props.match}
                    teamA={teamA}
                    teamB={teamB}
                    competition={competition}
                />
            }

            <Grid container>
                <Grid container item xs={12} sx={{ mt: 3}}>
                    
                    <Grid item container xs={12} sm={6}
                        sx={{
                            mb: {
                                xs: '5%',
                                sm: 0
                            }
                        }}
                    >
                        <Grid item xs={4} >
                            <Card
                                sx={{
                                    width: '100%' 
                                }}
                                elevation={0}
                            >
                                <CardMedia 
                                    component='img'
                                    src={competition.logoLink}
                                    alt={competition.name}
                                    height='30px'
                                    sx={{ objectFit: 'contain'}}
                                />
                            </Card>
                        </Grid>
                        
                        <Grid item xs={8} 
                            sx={{ 
                                pl: {
                                    xs: '10%',
                                    sm: '5%'
                                }
                            }}
                        >
                            <Typography variant="body1">{competition.name}</Typography>
                        </Grid>

                    </Grid>

                    <Grid item xs={5} sm={3}
                        sx={{
                            pl: {
                                xs: '20%',
                                sm: 0
                            }
                        }}
                    >
                        <Typography variant='body2'>{new Date(match.dateTime).toDateString()}</Typography>
                    </Grid>

                    <Grid item xs={5} sm={3}>
                        <Typography variant="body2">Match Day {match.matchDay}</Typography>
                    </Grid>

                </Grid>

                <Grid container item xs={12} spacing={1} justifyContent='center' sx={{ mt: 2 }}>

                    <Grid item xs={4} >
                        <ListItemAvatar sx={{ pl: '7%' }}>
                            <Avatar src={teamA.logoLink} alt='team logo'/>
                        </ListItemAvatar>
                        <Typography variant="body1">{teamA.teamName}</Typography>
                    </Grid>

                    <Grid item xs={2}>
                        <Typography variant="body2">
                            {new Date(match.dateTime).toLocaleTimeString()}
                        </Typography>
                    </Grid>

                    <Grid item xs={4} sx={{ ml: '4%'}}>
                        <ListItemAvatar sx={{ pl: '7%' }}>
                            <Avatar src={teamB.logoLink} alt='team logo' />
                        </ListItemAvatar>
                        <Typography variant="body1">{teamB.teamName}</Typography>
                    </Grid>
                </Grid>
            </Grid>

        </ListItem>

    )
}

class EditModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showLinearProgress: false,
            statusCode: null,
            matchDay: this.props.match.matchDay,
            stage: this.props.match.stage ? this.props.match.stage : null,
            group: null,
            dateTime: new Date(this.props.match.dateTime),
            gmt: 3
        }

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.deleteMatch = this.deleteMatch.bind(this);
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
        .then(response => {
            this.setState({
                showLinearProgress: false,
                statusCode: response.status,
            })
            sessionStorage.removeItem('football-matches')
        })
    }

    createFormData() {
        const formdata = new FormData();
        const match = this.props.match;
        const matchDateInISO = this.getMatchDateInISO()
        
        const competition = this.props.competition;
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
        let dateRef;

        if (dateTime['$y']) {
            const year = dateTime['$y'];
            const month = dateTime['$M'] < 9 ? `0${dateTime['$M'] + 1}` : dateTime['$M'] + 1;
            const day = dateTime['$D'] < 10 ? `0${dateTime['$D']}` : dateTime['$D'];
            const hour = dateTime['$H'] < 10 ? `0${dateTime['$H']}` : dateTime['$H'];
            const minute = dateTime['$m'] < 10 ? `0${dateTime['$m']}` : dateTime['$m'];

            dateRef = new Date(`${year}-${month}-${day}T${hour}:${minute}Z`);
        } else {
            return this.props.match.dateTime    // if time hasn't been edited
        }

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

    deleteMatch() {
        this.setState({ showLinearProgress: true })
        const body = {'docId': this.props.match.docId};
        fetch('/api/admin/DeleteFootballMatch', {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {'content-encoding': 'application/json'}
        })
        .then(response => {
            this.setState({
                showLinearProgress: false,
                statusCode: response.status
            });
            sessionStorage.removeItem('football-matches');
            this.props.close();
        })
    }

    render() {
        const match = this.props.match;
        const competition = this.props.competition;    
        const teamA = this.props.teamA;
        const teamB = this.props.teamB;

        return (
            <Modal
                open={this.props.isOpen}
                onClose={this.props.close}
                sx={{ display: 'flex', justifyContent: 'center' }}
            >
                <Card
                    sx={{ 
                        width: '80vw',
                        height: {
                            xs: '60vh',
                            sm: '80vh'
                        },
                        mt: 5,
                        mx: 3,
                        padding: 2,
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

                        <Grid item xs={12} sm={6} sx={{ px: 1 }}>
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

                                <Button 
                                    variant='contained'
                                    type='button'
                                    disabled={this.state.showLinearProgress}
                                    onClick={this.deleteMatch}
                                    sx={{ backgroundColor: 'gray' }}
                                >
                                    <Delete /> Delete
                                </Button>


                            </Box>
                        </Grid>

                    </Grid>
                </Card>
            </Modal>
        )
    }
}