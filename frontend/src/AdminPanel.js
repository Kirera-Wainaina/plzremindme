import React from "react";
import { List, ListItemButton, ListItemText, ListSubheader } from "@mui/material";

export default class AdminPanel extends React.Component {
    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(e) {
        this.props.component(e.target.textContent)
    }

    render() {
        const buttons = this.props.sports.map(sport => {
                return <ListItemButton onClick={this.handleClick} key={sport}>
                        <ListItemText primary={sport}/>
                    </ListItemButton>
            })

        return (
            <List id='admin-panel' className='admin-list' sx={{
                position: 'fixed',
                height: '100vh',
                border: '1px solid lightgrey',
            }}>
                <ListSubheader>Admin Panel</ListSubheader>
                {buttons}
            </List>
        )
    }
}