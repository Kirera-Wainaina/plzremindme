const { FormDataHandler } = require("../..");

class AddFootballMatch extends FormDataHandler {
    constructor(props) {
        super(props);
    }

    async run(response) {
        try {
            await this.retrieveData();
            this.fields['matchDay'] = parseInt(this.fields['matchDay']);
            
            await this.getCollection('football-matches').add(this.fields);
            console.log('Match has been added successfully');
            this.respond(response, 'success');
        } catch(error) {
            console.log('An error occurred while adding football match: ', error);
            this.respond(response, 'error');
        }
    }
}

module.exports = AddFootballMatch;