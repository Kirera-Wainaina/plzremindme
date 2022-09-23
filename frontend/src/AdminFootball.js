import { Card, Tab, Tabs } from "@mui/material";
import React from "react";

export default function AdminFootball() {
    const [value, setValue] = React.useState(0);

    function handleChange(event, newValue) {
        setValue(newValue);
    }

    return (
        <div className="category-component">
            <Tabs 
                // variant='fullWidth' 
                onChange={handleChange}
                value={value}
                orientation='vertical'
                className='category-tabs'
            >
                <Tab label='View Clubs/Countries' value={0}/>
                <Tab label='Add Clubs/Countries' value={1}/>
                <Tab label='Upload Matches' value={2}/>
                <Tab label='Edit Matches' value={3}/>
            </Tabs>
            <Card id='category-card' sx={{ mt: 5 }}>
                <p>She blew the team for some red bottoms</p>
                <TabPanel value={value} index={0}>View Clubs/Countries</TabPanel>
                <TabPanel value={value} index={1}>Add Clubs/Countries</TabPanel>
                <TabPanel value={value} index={2}>Upload Matches</TabPanel>
                <TabPanel value={value} index={3}>Edit Matches</TabPanel>

            </Card>

        </div>
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