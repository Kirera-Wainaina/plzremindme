import { EditSharp } from "@mui/icons-material";
import { Button, Card, CardContent, CardMedia, Grid, IconButton, List, ListItem, 
    ListItemText, MenuItem, Modal, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import COUNTRIES from "./countries";

export default class EditLeaguesAndTournaments extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            categories: []
        }
    }

    render() {
        return (
            <Grid container justifyContent='center' spacing={2}>

                <Grid item xs={12} sm={8} sx={{ mt: '1%'}}>
                    <Filter 
                    />
                </Grid>

                <Grid item xs={12} sm={8}>
                    <LeaguesAndTournaments
                        categories={this.state.categories}
                        setCategories={categories => this.setState({ categories })}
                    />
                </Grid>

            </Grid>
        )
    }
}

class Filter extends React.Component {
    render() {

    }
}

function LeaguesAndTournaments(props) {
    const [categoryId, setCategoryId] = React.useState(null);
    const [modalIsOpen, setModalIsOpen] = React.useState(false);

    React.useEffect(() => {
        fetch('/api/admin/GetLeaguesAndTournaments')
            .then(response => response.json())
            .then(data => props.setCategories(data))
    }, [])

    function openEditModal(category) {
        setCategoryId(category.docId);
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
                    props.categories.map(category => (
                        <ListItem
                            key={category.docId}
                            divider
                            secondaryAction={
                                <IconButton onClick={() => openEditModal(category)}>
                                    <EditSharp color="primary"/>
                                </IconButton>
                            }
                        >
    
                            { 
                                categoryId == category.docId &&
                                <EditComponent isOpen={modalIsOpen} close={closeEditModal} competition={category}/>

                            }
    
                            <Card sx={{ mr: '10px', padding: '5px'}}>
                                <CardMedia 
                                    component='img'
                                    image={category.logoLink}
                                    alt={category.name}
                                    height='70px'
                                    sx={{ width: '70px', objectFit: 'contain' }}
                                />
                            </Card>

                            <ListItemText primary={category.name} />
                        </ListItem>
                    ))
                }
            </List>

        </Card>
    )
}

class EditComponent extends React.Component {
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

    handleSubmit(e) {
        e.preventDefault();
        this.setState({ showLinearProgress: true, disableSubmit: true });
        const formdata = this.createFormdata();
        this.uploadData(formdata);
    }

    handleChange(e) {
        this.setState({ [e.target.name]: e.target.value })
    }

    createFormdata() {

    }

    uploadData(formdata) {

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
        console.log(this.props.competition)
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
                                    name={`${this.state.category}-logo`}
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