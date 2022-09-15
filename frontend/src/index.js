import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App.js';
import Dashboard from './Dashboard.js';

const router = createBrowserRouter([
    {
        path: '/',
        element: <App />
    },
    {
        path: 'admin',
        element: <Dashboard />
    }
]);
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <RouterProvider router={router} />
);