import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App.js';
import Dashboard from './Dashboard.js';
import AdminLogin from './AdminLogin.js';
import AdminSignup from './AdminSignup.js';
import AdminHome from './AdminHome.js';

const router = createBrowserRouter([
    {
        path: '/',
        element: <App />
    },
    {
        path: 'admin',
        element: <Dashboard />,
        children: [
            {
                path: 'login',
                element: <AdminLogin />
            },
            {
                path: 'signup',
                element: <AdminSignup />
            },
            {
                path: 'home',
                element: <AdminHome />
            }
        ]
    }
]);
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <RouterProvider router={router} />
);