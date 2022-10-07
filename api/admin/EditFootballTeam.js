const { FieldPath } = require("@google-cloud/firestore");
const { FormDataHandler } = require ("../..");
const CloudFileEditor = require("../../handlers/CloudFileEditor");


class EditFootballTeam extends FormDataHandler {
    constructor(props) {
        super(props);
    }

    createUpdateObject() {
        this.fields['logoName'] = this.logoMetadata.name;
        this.fields['logoLink'] = this.logoMetadata.mediaLink;
        this.fields['logoId'] = this.logoMetadata.id;
    }

    async run(response) {
        try {
            await this.retrieveData();

            if (this.uploadedFilePath) { // there is a new file
                const editor = new CloudFileEditor(this.uploadedFilePath, this.fields.logoName);
                this.logoMetadata = await editor.run();
                this.createUpdateObject()
            }

            const updateResult = await this.getCollection('football-teams')
                .where(FieldPath.documentId(), '==', this.fields.docId)
                .get().then(querySnapshot => {
                    const ref = querySnapshot.docs[0].ref;
                    delete this.fields.docId;
                    return ref.update(this.fields)
                })

            if (updateResult.writeTime) {
                console.log('Changes made successfully')
                this.respond(response, 'success');
            }
        } catch (error) {
            console.log('Error while editing football team: ', error);
            this.respond(response, 'error');
        }
    }
}

module.exports = EditFootballTeam;