import React from "react";
import Button from '@mui/material/Button'
import { Card, List, ListItemButton, ListSubheader } from "@mui/material";

export default class AdminSidebar extends React.Component {
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
                    {sport}
                    </ListItemButton>
            })

        return (
            <Card>
                <List>
                    <ListSubheader>Categories</ListSubheader>
                    {buttons}
                </List>
            </Card>
        )
    }
}