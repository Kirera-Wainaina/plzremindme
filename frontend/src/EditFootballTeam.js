import { FilterList, Search } from "@mui/icons-material";
import { Card, IconButton, Grid, TextField } from "@mui/material";
import React from "react";

export default class EditFootballTeam extends React.Component {
    render() {
        return (
            <Grid container direction='column' spacing={2}>

                <Grid item>
                    <Card sx={{
                        width: '100%',
                        height: '10%',
                        mt: '3%',
                        paddingBottom: '5px'
                    }}>
                        <IconButton size='large'><FilterList color="primary"/></IconButton>
                        <TextField variant="filled" placeholder="Enter team name..." sx={{width: '87%'}}/>
                        <IconButton size='large'><Search variant='filled' color="primary"/></IconButton>
                    </Card>
                </Grid>

                <Grid item>
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