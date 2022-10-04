import { Grid, Box, Card, Typography, LinearProgress, Alert, TextField, MenuItem } from "@mui/material";
import React from "react";
import COUNTRIES from "./countries";

export default class AddLeaguesAndTournaments extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showLinearProgress: false,
            statusCode: null,
            category: 'league',
            level: 'international',
            country: 'England'
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

                            {
                                (this.state.category == 'league' || this.state.level == 'national') &&
                                <TextField
                                    label='Country'
                                    variant="filled"
                                    onChange={this.handleChange}
                                    name='country'
                                    value={this.state.country}
                                    margin='normal'
                                    select
                                    required
                                    fullWidth
                                >
                                    {COUNTRIES.map((country, index) => (
                                        <MenuItem key={index} value={country.toLowerCase()}>
                                            {country}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            }

                            {
                                this.state.category == 'tournament' &&
                                <TextField
                                    label='Level'
                                    variant="filled"
                                    onChange={this.handleChange}
                                    name='level'
                                    value={this.state.level}
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

                        </Box>
                    </Card>
                </Grid>
            </Grid>
        )
    }
}