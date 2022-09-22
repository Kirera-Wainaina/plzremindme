import React from "react";
import { Card, List, ListItemButton, ListItemText, ListSubheader } from "@mui/material";

export default class AdminPanel extends React.Component {
    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(e) {
        this.props.component(e.target.dataset.id)
    }

    render() {
        const buttons = this.props.sports.map(sport => {
                return <ListItemButton onClick={this.handleClick} key={sport} data-id={sport}>
                        <ListItemText primary={sport}/>
                    </ListItemButton>
            })

        return (
            <Card>
                <List className='admin-list' sx={{
                    position: 'fixed',
                    height: '100vh',
                    border: '1px solid lightgrey',
                }}>
                    <ListSubheader>Categories</ListSubheader>
                    {buttons}
                </List>
            </Card>
        )
    }
}