import { FilterList } from "@mui/icons-material";
import { Card, Grid, IconButton } from "@mui/material";
import React from "react";

export default class EditFootballMatch extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Grid container justifyContent='center' spacing={2}>

                <Grid item xs={12} sm={6} sx={{ mt: '1%' }}>
                    <Filter />
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
    }

    render() {
        return (
            <Card>
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
                </Grid>
            </Card>
        )
    }
}