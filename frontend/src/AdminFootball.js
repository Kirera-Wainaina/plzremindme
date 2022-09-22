import { Card, Tab, Tabs } from "@mui/material";
import React from "react";

export default function AdminFootball() {
    const [value, setValue] = React.useState(0);

    function handleChange(event, newValue) {
        setValue(newValue);
    }

    return (
        <div className="category-component">
            <Card id='category-card' sx={{ mt: 5 }}>
                <Tabs 
                    variant='fullWidth' 
                    onChange={handleChange}
                    value={value}
                >
                    <Tab label='Upload Matches' value={0}/>
                    <Tab label='Edit Matches' value={1}/>
                </Tabs>
                <p>She blew the team for some red bottoms</p>
                <TabPanel value={value} index={0}>Upload Matches</TabPanel>
                <TabPanel value={value} index={1}>Edit Matches</TabPanel>

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