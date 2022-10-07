import { EditSharp } from "@mui/icons-material";
import { Avatar, Card, CardMedia, Grid, IconButton, List, ListItem, ListItemAvatar, ListItemText, Modal, Typography } from "@mui/material";
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
            showLinearProgress: false
        }
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
                            <Typography variant='h5' align="center">Edit {this.props.category.name}</Typography>
                        </Grid>

                        <Grid item xs={12} sm={12}>
                            {this.state.showLinearProgress && <LinearProgress />}
                        </Grid>

                    </Grid>
                </Card>
            </Modal>
        )
    }
}