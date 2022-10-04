import { Grid, Box, Card, Typography, LinearProgress, Alert, TextField, MenuItem } from "@mui/material";
import React from "react";

export default class AddLeaguesAndTournaments extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showLinearProgress: false,
            statusCode: null,
            category: 'league'
        }

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);

    }

    handleSubmit(e) {
        e.preventDefault();
    }

    handleChange(e) {
        this.setState({ [e.target.name]: e.target.value, statusCode: null })
    }

    render() {
        return (
            <Grid container justifyContent='center'>
                <Grid item xs={12} sm={6}>
                    <Card sx={{ mt: 5, padding: 5 }}>
                        <Box component='form'
                            onSubmit={this.handleSubmit}
                        >

                            {this.state.showLinearProgress && <LinearProgress />}

                            {
                                this.state.statusCode == 200 &&
                                <Alert severity="success">The upload was successful</Alert>
                            }

                            <Typography variant="h6" align="center">
                                Add Leagues & Tournaments
                            </Typography>

                            <TextField
                                label='Category'
                                variant="filled"
                                onChange={this.handleChange}
                                name='category'
                                value={this.state.category}
                                margin='normal'
                                select
                                required
                                fullWidth
                            >
                                {['League', 'Tournament'].map((category, index) => (
                                    <MenuItem key={index} value={category.toLowerCase()}>
                                        {category}
                                    </MenuItem>
                                ))}
                            </TextField>

                            <TextField
                                label='Name'
                                variant='filled'
                                name='name'
                                margin="normal"
                                required
                                fullWidth
                            />

                        </Box>
                    </Card>
                </Grid>
            </Grid>
        )
    }
}