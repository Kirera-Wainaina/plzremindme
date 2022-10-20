const { FormDataHandler } = require("../..");

class EditFootballMatch extends FormDataHandler {
    constructor(props) {
        super(props);
    }

    async run(response) {
        try {
            await this.retrieveData();

            console.log(this.fields)
        } catch (error) {
            console.log('An error occurred while editing match: ', error);
            this.respond(response, 'error');
        }
    }
}

module.exports = EditFootballMatch;