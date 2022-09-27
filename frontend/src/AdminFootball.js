import { Grid, Tab, Tabs } from "@mui/material";
import React from "react";
import AddFootballTeam from "./AddFootballTeam";
import EditFootballTeam from "./EditFootballTeam";
import './AdminFootball.css';

export default function AdminFootball() {
    const [value, setValue] = React.useState(0);

    function handleChange(event, newValue) {
        setValue(newValue);
    }

    return (
        <Grid container>
            <Grid item xs={12} sm={2}>
                <Tabs 
                    // variant='fullWidth' 
                    onChange={handleChange}
                    value={value}
                    orientation='vertical'
                >
                    <Tab label='Edit Teams' value={0}/>
                    <Tab label='Add Teams' value={1}/>
                    <Tab label='Upload Matches' value={2}/>
                    <Tab label='Edit Matches' value={3}/>
                </Tabs>

            </Grid>
            <Grid item xs={12} sm={10}>
                <TabPanel value={value} index={0} id='edit-team'>
                    <EditFootballTeam />
                </TabPanel>
                <TabPanel value={value} index={1} id='upload-form'>
                    <AddFootballTeam />
                </TabPanel>
                <TabPanel value={value} index={2} >Upload Matches</TabPanel>
                <TabPanel value={value} index={3} >Edit Matches</TabPanel>

            </Grid>
            
            {/* <p>She blew the team for some red bottoms</p> */}

        </Grid>
    )
}

function TabPanel(props) {
    return (
        <div role='tabpanel' 
            id={props.id}
            hidden={props.value != props.index}>
            {props.children}
        </div>
    )
}