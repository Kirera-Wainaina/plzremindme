import React from "react";
import { Link } from "react-router-dom";

import Menu from './Menu.js';

export default function App() {
    return (
        <React.Fragment>
            <Menu />
            <Link to='admin'>Admin</Link>
            <p>Hello</p>
        </React.Fragment>
    )
}