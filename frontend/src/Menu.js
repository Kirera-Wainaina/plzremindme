import React from "react";
import { AppBar, IconButton, Toolbar, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

function Menu() {
    return (
        <AppBar sx={{ height: '8%' }} component='nav'>
            <Toolbar>
                <IconButton sx={{ color: "white"}}>
                    <MenuIcon fontSize="large"/>
                </IconButton>
                <Typography variant='h5' sx={{ ml: 3 }}>Plzremindme</Typography>
            </Toolbar>
        </AppBar>
    )
}

export default Menu;