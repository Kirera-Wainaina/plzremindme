const { FormDataHandler } = require("../../index");
const CloudUploader = require('../../handlers/CloudUploader')

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
        try {
            await this.retrieveData();

            const cloudUploader =  new CloudUploader(this.uploadedFilePath);
            this.logoMetadata = await cloudUploader.run();

            this.createTeamObject();

            await this.getCollection('football-teams').add(this.fields);

            console.log('team has been uploaded')
            this.respond(response, 'success');
        } catch(error) {
            console.log('An error occurred while trying to add football team: ', error);
            this.respond(response, 'error')
        }
    }
}

module.exports = AddFootballTeam;