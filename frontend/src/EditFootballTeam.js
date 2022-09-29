import { EditSharp, FilterList, Search } from "@mui/icons-material";
import { Card, IconButton, Grid, TextField, List, ListItemAvatar, Avatar, ListItem, ListItemText, Typography } from "@mui/material";
import React from "react";

export default class EditFootballTeam extends React.Component {
    render() {
        return (
            <Grid container justifyContent='center' spacing={2}>

                <Grid item xs={12} sm={8} sx={{ mt: '1%'}}>
                    <Card>
                        <Grid container direction='row'>
                            <Grid item xs={2} sm={1}>
                                <IconButton size='large'><FilterList color="primary"/></IconButton>
                            </Grid>
                            <Grid item xs={8} sm={10}>
                                <TextField variant="filled" placeholder="Enter team name..." sx={{ width: '100%'}}/>
                            </Grid>
                            <Grid item xs={2} sm={1}>
                                <IconButton size='large'><Search variant='filled' color="primary"/></IconButton>
                            </Grid>
                        </Grid>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={8}>
                    <FootballTeams />
                </Grid>

            </Grid>
        )
    }
}

function FootballTeams() {
    const [teams, setTeams] = React.useState([]);

    React.useEffect(() => {
        fetch('/api/admin/GetFootballTeams')
            .then(response => response.json())
            .then(data => setTeams(data))
    }, [])

    return (
        <Card sx={{ 
            width: '100%',
        }}>
            <Typography variant='h5' align="center">Teams</Typography>
            <List>
                {teams.map(team => (
                    <ListItem 
                        key={team.docId}
                        divider={true}
                        secondaryAction={
                            <IconButton>
                                <EditSharp color="primary"/>
                            </IconButton>
                        }
                    >
                        <ListItemAvatar>
                            <Avatar src={team.logoLink} alt={team.logoName}/>
                        </ListItemAvatar>
                        <ListItemText primary={team.teamName} />
                    </ListItem>
                    
                ))}
            </List>
        </Card>
    )
}