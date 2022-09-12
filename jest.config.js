//import React from 'react';
// The above line only works in a browser set up

const React = require('react');
// React has to be global so that I don't have to import it
// in the modules; doing so causes errors in the browser

module.exports = {
    globals: {
        React: React
    }
};