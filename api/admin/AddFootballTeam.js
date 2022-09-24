const { FormDataHandler } = require("../../index");

class AddFootballTeam extends FormDataHandler {
    constructor(props) {
        super(props)
    }

    async run() {
        this.fields = await this.retrieveData();
        console.log(this.fields);
        this.respond('success')
    }
}

module.exports = AddFootballTeam;