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
        await this.retrieveData()
            .then(() => this.createTeamObject());
        await this.getCollection('football-teams').add(this.fields);
        console.log('team has been uploaded')
        this.respond(response, 'success')
    }
}

module.exports = AddFootballTeam;