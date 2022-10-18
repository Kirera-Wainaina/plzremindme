const { FormDataHandler } = require("../..");

class AddFootballMatch extends FormDataHandler {
    constructor(props) {
        super(props);
    }

    async run(response) {
        try {
            await this.retrieveData();
            console.log(this.fields);
        } catch(error) {
            console.log('An error occurred while adding football match: ', error);
            this.respond(response, 'error');
        }
    }
}

module.exports = AddFootballMatch;