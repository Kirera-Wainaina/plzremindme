import React from "react";
import { AppBar, IconButton, Toolbar, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

function Menu(props) {
    return (
        <AppBar position='relative'>
            <Toolbar>
                <IconButton sx={{ color: "white"}} onClick={props.handleMenuClick}>
                    <MenuIcon fontSize="medium"/>
                </IconButton>
                <Typography variant='h5' sx={{ ml: 2 }}>Plzremindme</Typography>
            </Toolbar>
        </AppBar>
    )
}

export default Menu;