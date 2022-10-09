const { FormDataHandler } = require("../..");
const CloudUploader = require("../../handlers/CloudUploader");

class AddFootballCompetition extends FormDataHandler {
    constructor(props) {
        super(props);
    }

    createTeamObject() {
        this.fields['logoName'] = this.logoMetadata.name;
        this.fields['logoLink'] = this.logoMetadata.mediaLink;
        this.fields['logoId'] = this.logoMetadata.id;
    }

    async run(response) {
        try {
            await this.retrieveData();

            const cloudUploader = new CloudUploader(this.uploadedFilePath);
            this.logoMetadata = await cloudUploader.run();

            this.createTeamObject();

            await this.getCollection('leagues-tournaments').add(this.fields);
            console.log('Tournament/League has been uploaded');
            this.respond(response, 'success');
        } catch (error) {
            console.error('Error occurred while uploading tournament/league:', error);
            this.respond(response, 'error');
        }
    }
}

module.exports = AddFootballCompetition;