const { FormDataHandler } = require("../../index");

class AddFootballTeam extends FormDataHandler {
    constructor(props) {
        super(props)
    }

    createTeamObject() {
        this.fields['logoName'] = this.logoMetadata.name;
        this.fields['logoLink'] = this.logoMetadata.mediaLink;
        this.fields['logoId'] = this.logoMetadata.id;
    }

    async run(response) {
        console.log('called')
        await this.retrieveData()
            .then(() => this.createTeamObject());
        console.log(this.fields)
        this.respond(response, 'success')
    }
}

module.exports = AddFootballTeam;