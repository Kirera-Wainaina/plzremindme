import React from 'react';
import ReactDOM from 'react-dom/client';
// import { BrowserRouter } from 'react-router-dom';
import Dashboard from './Dashboard.js';

// const BrowserRouter = window.ReactRouterDom.BrowserRouter;

const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
    // <BrowserRouter>
        {/* <Dashboard /> */}
    {/* </BrowserRouter> */}
// );

root.render(<Dashboard />)