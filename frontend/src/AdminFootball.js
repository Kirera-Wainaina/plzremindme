import { Accordion, AccordionDetails, AccordionSummary, Divider, Grid, 
    Tab, Tabs, Typography, useMediaQuery, useTheme } from "@mui/material";
import React from "react";
import AddFootballTeam from "./AddFootballTeam";
import EditFootballTeam from "./EditFootballTeam";
import AddFootballCompetition from "./AddFootballCompetition";
import EditFootballCompetition from "./EditFootballCompetition";
import AddFootballMatch from "./AddFootballMatch";
import EditFootballMatch from "./EditFootballMatch";
import { ExpandMore } from "@mui/icons-material";

export default function AdminFootball() {
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.up('sm'))
    const [value, setValue] = React.useState(0);
    const [expanded, setExpanded] = React.useState(false)

    function handleChange(event, newValue) {
        setValue(newValue);
        setExpanded(false);
    }

    return (
        <Grid container>

            <Grid item xs={12} sm={2}>
                <Accordion 
                    defaultExpanded={matches}
                    expanded={matches ? matches : expanded}
                    onClick={() => setExpanded(!expanded)}
                >
                    <AccordionSummary
                        expandIcon={<ExpandMore />}
                    >
                        <Typography variant='body1'>Football Menu</Typography>
                    </AccordionSummary>
                    <AccordionDetails
                        sx={{
                            position: {
                                xs: "fixed",
                                sm: 'static'
                            },
                            width: {
                                xs: '100vw',
                                sm: 'inherit'
                            },
                            zIndex: 2,
                            backgroundColor: 'white'
                        }}
                    >
                        <Tabs 
                            onChange={handleChange}
                            value={value}
                            orientation='vertical'
                            sx={{
                                height: {
                                    sm: '100vh'
                                }
                            }}
                        >
                            <Tab label='Add Teams' value={0} 
                                sx={{ 
                                    display: 'flex', 
                                    alignItems: 'flex-start',
                                    ml: '5%'
                                }}
                            />
                            <Divider />
                            <Tab label='Edit Teams' value={1}
                                sx={{ 
                                    display: 'flex', 
                                    alignItems: 'flex-start',
                                    ml: '5%'
                                }}
                            />
                            <Divider />
                            <Tab label='Add Competitions' value={2}
                                sx={{ 
                                    display: 'flex', 
                                    alignItems: 'flex-start',
                                    ml: '5%'
                                }}
                            />
                            <Divider />
                            <Tab label='Edit Competitions' value={3}
                                sx={{ 
                                    display: 'flex', 
                                    alignItems: 'flex-start',
                                    ml: '5%'
                                }}
                            />
                            <Divider />
                            <Tab label='Add Matches' value={4}
                                sx={{ 
                                    display: 'flex', 
                                    alignItems: 'flex-start',
                                    ml: '5%'
                                }}
                            />
                            <Divider />
                            <Tab label='Edit Matches' value={5}
                                sx={{ 
                                    display: 'flex', 
                                    alignItems: 'flex-start',
                                    ml: '5%'
                                }}
                            />
                            <Divider />
                        </Tabs>
                    </AccordionDetails>
                </Accordion>
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
                <TabPanel value={value} index={5} >
                    <EditFootballMatch />
                </TabPanel>

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