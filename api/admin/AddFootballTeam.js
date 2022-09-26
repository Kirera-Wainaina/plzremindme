const { FormDataHandler } = require("../../index");

class AddFootballTeam extends FormDataHandler {
    constructor(props) {
        super(props)
    }

    async run(response) {
        console.log('called')
        await this.retrieveData();
        console.log(this.fields)
        this.respond(response, 'success')
    }
}

module.exports = AddFootballTeam;