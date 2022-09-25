const { FormDataHandler, FormDataHandler_ } = require("../../index");

class AddFootballTeam extends FormDataHandler_ {
    constructor(props) {
        super(props)
    }

    async run() {
        this.fields = await this.retrieveData();
        console.log(this.fields);
        return 'success'
    }
}

module.exports = AddFootballTeam;