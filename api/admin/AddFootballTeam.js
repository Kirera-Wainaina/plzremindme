const Busboy = require('busboy');
const fs = require('fs');
const path = require('path')

const { FormDataHandler, FormDataHandler_ } = require("../../index");

class AddFootballTeam extends FormDataHandler_ {
    constructor(props) {
        super(props)
    }

    async run(response) {
        console.log('called')
        await this.retrieveData();
        //return 'success'
        response.writeHead(200);
        response.end()
    }
}

module.exports = AddFootballTeam;