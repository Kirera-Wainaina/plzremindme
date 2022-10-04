const { FormDataHandler } = require("../..");
const CloudUploader = require("../../handlers/CloudUploader");

class AddLeaguesAndTournaments extends FormDataHandler {
    constructor(props) {
        super(props);
    }

    createTeamObject() {
        this.fields['logoName'] = this.logoMetadata.name;
        this.fields['logoLink'] = this.logoMetadata.mediaLink;
        this.fields['logoId'] = this.logoMetadata.id;
    }

    async run(response) {
        await this.retrieveData();

        const cloudUploader = new CloudUploader(this.uploadedFilePath);
        this.logoMetadata = await cloudUploader.run();

        this.createTeamObject();
        console.log(this.fields);
        
    }
}

module.exports = AddLeaguesAndTournaments;