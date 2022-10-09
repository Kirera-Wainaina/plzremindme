import { Grid, Tab, Tabs } from "@mui/material";
import React from "react";
import AddFootballTeam from "./AddFootballTeam";
import EditFootballTeam from "./EditFootballTeam";
import AddFootballCompetition from "./AddFootballCompetition";
import EditFootballCompetition from "./EditFootballCompetition";
import AddFootballMatch from "./AddFootballMatch";

export default function AdminFootball() {
    const [value, setValue] = React.useState(0);

    function handleChange(event, newValue) {
        setValue(newValue);
    }

    return (
        <Grid container>
            <Grid item xs={12} sm={2}>
                <Tabs 
                    onChange={handleChange}
                    value={value}
                    orientation='vertical'
                >
                    <Tab label='Add Teams' value={0}/>
                    <Tab label='Edit Teams' value={1}/>
                    <Tab label='Add Competitions' value={2}/>
                    <Tab label='Edit Competitions' value={3}/>
                    <Tab label='Add Matches' value={4}/>
                    <Tab label='Edit Matches' value={5}/>
                </Tabs>

            </Grid>
            <Grid item xs={12} sm={10}>
                <TabPanel value={value} index={0}>
                    <AddFootballTeam />
                </TabPanel>
                <TabPanel value={value} index={1}>
                    <EditFootballTeam />
                </TabPanel>
                <TabPanel value={value} index={2}>
                    <AddFootballCompetition />
                </TabPanel>
                <TabPanel value={value} index={3}>
                    <EditFootballCompetition />
                </TabPanel>

                <TabPanel value={value} index={4} >
                    <AddFootballMatch />
                </TabPanel>
                <TabPanel value={value} index={5} >Edit Matches</TabPanel>

            </Grid>
            
            {/* <p>She blew the team for some red bottoms</p> */}

        </Grid>
    )
}

function TabPanel(props) {
    return (
        <div role='tabpanel' 
            hidden={props.value != props.index}>
            {props.children}
        </div>
    )
}