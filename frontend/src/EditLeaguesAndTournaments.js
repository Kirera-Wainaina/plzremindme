import { EditSharp } from "@mui/icons-material";
import { Card, Grid, IconButton, List, ListItem, ListItemText, Typography } from "@mui/material";
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
    const [contentId, setContentId] = React.useState(null);
    const [modalIsOpen, setModalIsOpen] = React.useState(false);

    React.useEffect(() => {
        fetch('/api/admin/GetLeaguesAndTournaments')
            .then(response => response.json())
            .then(data => props.setCategories(data))
    }, [])

    function openEditModal() {

    }

    function closeEditModal() {

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
                                <IconButton onClick={() => openEditModal(team)}>
                                    <EditSharp color="primary"/>
                                </IconButton>
                            }
                        >
                            <ListItemText primary={category.name} />
                        </ListItem>
                    ))
                }
            </List>

        </Card>
    )
}