import { FilterList, Search } from "@mui/icons-material";
import { Card, IconButton, Grid, TextField } from "@mui/material";
import React from "react";

export default class EditFootballTeam extends React.Component {
    render() {
        return (
            <Grid container direction='column' spacing={2}>

                <Grid item xs={12}>
                    <Card sx={{
                        width: '100%',
                        height: '10%',
                        mt: '3%',
                        paddingBottom: '5px'
                    }}>
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

                <Grid item xs={12}>
                    <Card sx={{ 
                        width: '100%',
                        height: '50%'
                    }}>
                        <p>Team List</p>
                    </Card>
                </Grid>

            </Grid>
        )
    }
}