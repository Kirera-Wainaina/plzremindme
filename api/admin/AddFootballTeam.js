const { FormDataHandler } = require("../../index");

class AddFootballTeam extends FormDataHandler {
    constructor(props) {
        super(props)
    }

    async run(response) {
        console.log('called')
        await this.retrieveData();
        this.respond(response, 'success')
    }
}

module.exports = AddFootballTeam;