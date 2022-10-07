import { EditSharp } from "@mui/icons-material";
import { Card, CardMedia, Grid, IconButton, List, ListItem, 
    ListItemText, MenuItem, Modal, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";

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
                                <EditComponent isOpen={modalIsOpen} close={closeEditModal} category={category}/>

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
            category: ''
        }

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
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

    render() {
        console.log(this.props.category)
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
                            <Typography variant='h5' align="center">Edit {this.props.category.name}</Typography>
                        </Grid>

                        <Grid item xs={12} sm={12}>
                            {this.state.showLinearProgress && <LinearProgress />}
                        </Grid>

                        <Grid item xs={12} sm={6}>

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
                                    defaultValue={this.props.category.category}
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
                                    defaultValue={this.props.category.name}
                                    onChange={this.handleChange}
                                    required
                                    fullWidth
                                />

                            </Box>

                        </Grid>

                    </Grid>
                </Card>
            </Modal>
        )
    }
}